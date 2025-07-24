import os
import logging
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Request, HTTPException, status
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt, ExpiredSignatureError, JWTError
from authlib.integrations.starlette_client import OAuth
from dotenv import load_dotenv

from . import models, schemas, services
from .database import get_db

load_dotenv()

router = APIRouter(prefix="/auth", tags=["Authentication"])
logger = logging.getLogger(__name__)

# --- Security & JWT Configuration ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "a_very_secret_key_that_should_be_in_env")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# --- OAuth Configuration ---
oauth = OAuth()
google_client_id = os.getenv('GOOGLE_CLIENT_ID')
google_client_secret = os.getenv('GOOGLE_CLIENT_SECRET')
if google_client_id and google_client_secret:
    oauth.register(
        name='google',
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_id=google_client_id,
        client_secret=google_client_secret,
        client_kwargs={'scope': 'openid email profile'}
    )

# --- Core Authentication Functions ---

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(email: str, password: str, db: Session):
    user = services.get_user_by_email(email, db)
    if not user or not user.hashed_password or not verify_password(password, user.hashed_password):
        return None
    return user

async def create_access_and_refresh_tokens(user: models.User):
    access_expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    access_payload = {"sub": str(user.id), "email": user.email, "exp": access_expire}
    refresh_payload = {"sub": str(user.id), "exp": refresh_expire}
    access_token = jwt.encode(access_payload, SECRET_KEY, algorithm=ALGORITHM)
    refresh_token = jwt.encode(refresh_payload, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except (JWTError, ExpiredSignatureError):
        raise credentials_exception
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

# --- API Endpoints ---

@router.post("/signup", response_model=schemas.Token)
async def signup_user(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = services.get_user_by_email(email=user_data.email, db=db)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    hashed_pass = hash_password(user_data.password)
    new_user = services.create_user(db=db, user=user_data, hashed_password=hashed_pass)
    
    return await create_access_and_refresh_tokens(new_user)

@router.post("/login", response_model=schemas.Token)
async def login_for_access_token(
    # ✅ FIX: Changed from form data to a Pydantic model to accept a JSON body.
    # This resolves the underlying cause of the CORS error.
    user_credentials: schemas.UserLogin, 
    db: Session = Depends(get_db)
):
    user = authenticate_user(
        email=user_credentials.email, 
        password=user_credentials.password, 
        db=db
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    # This now returns a simple JSON response, which the frontend can handle.
    return await create_access_and_refresh_tokens(user)

@router.get("/me", response_model=schemas.UserOut)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# --- Google OAuth Endpoints ---

@router.get('/google/login', include_in_schema=False)
async def google_login(request: Request):
    if not google_client_id:
        raise HTTPException(status_code=500, detail="Google OAuth is not configured on the server.")
    redirect_uri = os.getenv('GOOGLE_REDIRECT_URI', str(request.url_for('google_callback')))
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get('/google/callback', include_in_schema=False)
async def google_callback(request: Request, db: Session = Depends(get_db)):
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')
        if not user_info:
            raise HTTPException(status_code=400, detail="Could not fetch user info from Google")

        email = user_info.get('email')
        user = services.get_user_by_email(email, db)

        if not user:
            new_user_data = schemas.UserCreate(
                email=email,
                full_name=user_info.get('name'),
                profile_pic=user_info.get('picture'),
                password="" 
            )
            user = services.create_user(db=db, user=new_user_data, hashed_password=None, is_oauth=True)

        jwt_tokens = await create_access_and_refresh_tokens(user)
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        
        # ✅ FIX: Redirect to a specific frontend route with tokens in the URL.
        # This is a reliable way to handle cross-domain authentication.
        # Your frontend will need to read these from the URL.
        redirect_url = (
            f"{frontend_url}/auth/callback"
            f"?access_token={jwt_tokens['access_token']}"
            f"&refresh_token={jwt_tokens['refresh_token']}"
        )
        
        return RedirectResponse(url=redirect_url)
        
    except Exception as e:
        logger.error(f"Error in Google callback: {e}", exc_info=True)
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        return RedirectResponse(url=f"{frontend_url}/login?error=true")





# from passlib.context import CryptContext
# from jose import jwt, ExpiredSignatureError, JWTError 
# from fastapi import Depends, Request
# from fastapi.security import OAuth2PasswordBearer
# from fastapi import HTTPException, status
# from datetime import datetime, timedelta, timezone
# from sqlalchemy.orm import Session
# import os
# import logging
# from dotenv import load_dotenv
# from . import models, schemas, services

# load_dotenv()

# # Configure logging
# logger = logging.getLogger(__name__)
# logger.setLevel(logging.DEBUG)
# handler = logging.StreamHandler()
# formatter = logging.Formatter('[%(asctime)s] [%(levelname)s] %(message)s')
# handler.setFormatter(formatter)
# logger.addHandler(handler)

# # Authentication configuration
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# SECRET_KEY = os.getenv("SECRET_KEY")
# ALGORITHM = os.getenv("ALGORITHM")
# ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
# REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))

# def hash_password(password: str):
#     logger.debug("Hashing password...")
#     return pwd_context.hash(password)

# def verify_password(plain_password, hashed):
#     logger.debug("Verifying password...")
#     return pwd_context.verify(plain_password, hashed)

# async def authenticate_user(email: str, password: str, db: Session):
#     logger.debug(f"Authenticating user with email: {email}")
#     try:
#         user = await services.get_user_by_email(email, db)
#         if not user:
#             logger.warning(f"User not found with email: {email}")
#             return False
#         if not verify_password(password, user.hashed_password):
#             logger.warning(f"Invalid password for user: {email}")
#             return False
#         logger.debug(f"User authenticated successfully: {email}")
#         return user
#     except Exception as e:
#         logger.error(f"Error during user authentication: {e}", exc_info=True)
#         return False

# async def create_tokens(user: models.User):
#     logger.debug(f"Creating tokens for user ID: {user.id}")
#     try:
#         user_obj = schemas.UserOut.model_validate(user)

#         access_expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#         refresh_expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

#         logger.debug(f"Access token will expire at: {access_expire}")
#         logger.debug(f"Refresh token will expire at: {refresh_expire}")

#         access_payload = {
#             "sub": str(user.id),
#             "name": user.display_name,  # Use display name property
#             "profile_pic": user.profile_pic,
#             "email": user.email,
#             "exp": access_expire
#         }

#         refresh_payload = {
#             "sub": str(user.id),
#             "exp": refresh_expire,
#             "type": "refresh"
#         }

#         access_token = jwt.encode(access_payload, SECRET_KEY, algorithm=ALGORITHM)
#         refresh_token = jwt.encode(refresh_payload, SECRET_KEY, algorithm=ALGORITHM)

#         logger.debug("Tokens created successfully.")

#         return {
#             "access_token": access_token,
#             "refresh_token": refresh_token,
#             "token_type": "bearer"
#         }
#     except Exception as e:
#         logger.error(f"Error creating tokens: {e}", exc_info=True)
#         raise

# def get_current_user_dependency():
#     """FastAPI dependency wrapper for get_current_user"""
#     from . import services
#     def dependency(request: Request, db: Session = Depends(services.get_db)):
#         return get_current_user(request, db)
#     return dependency

# def get_current_user(
#     request: Request,
#     db: Session  # Remove the dependency here to avoid circular import
# ):
#     logger.debug("Extracting token from request...")
#     token = None

#     # Try cookie first
#     token = request.cookies.get("access_token")
#     if token:
#         logger.debug("Access token found in cookie.")
#     else:
#         logger.debug("Access token not found in cookie, checking Authorization header.")
#         auth_header = request.headers.get("Authorization")
#         if auth_header and auth_header.startswith("Bearer "):
#             token = auth_header.split(" ", 1)[1]
#             logger.debug("Access token found in Authorization header.")

#     if not token:
#         logger.warning("No token found in request.")
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Not authenticated"
#         )

#     try:
#         logger.debug("Decoding JWT...")
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         user_id = payload.get("sub")

#         logger.debug(f"Decoded user ID from token: {user_id}")

#         if not user_id:
#             logger.warning("User ID not found in token payload.")
#             raise HTTPException(status_code=401, detail="Invalid token payload")

#         logger.debug("Querying database for user...")
#         user = db.query(models.User).filter(models.User.id == int(user_id)).first()

#         if not user:
#             logger.warning("User not found in database.")
#             raise HTTPException(status_code=401, detail="User not found")

#         logger.debug(f"User found: {user.email}")
#         return schemas.UserOut.model_validate(user)

#     except ExpiredSignatureError:
#         logger.warning("Access token expired.")
#         raise HTTPException(status_code=401, detail="Token expired")

#     except JWTError as e:
#         logger.error("Invalid JWT token.", exc_info=True)
#         raise HTTPException(status_code=401, detail="Invalid token")

#     except ValueError:
#         logger.error("User ID from token is not an integer.")
#         raise HTTPException(status_code=401, detail="Invalid user ID format")

#     except Exception as e:
#         logger.error(f"Unexpected authentication error: {e}", exc_info=True)
#         raise HTTPException(status_code=401, detail="Authentication error")


