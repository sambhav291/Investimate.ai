import os
import logging
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Request, HTTPException, status
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt, ExpiredSignatureError, JWTError
from authlib.integrations.starlette_client import OAuth
from dotenv import load_dotenv

from . import models, schemas, services
from .database import get_db

# --- Load Environment Variables ---
load_dotenv()

# --- Router and Logger Configuration ---
router = APIRouter(prefix="/auth", tags=["Authentication"])
logger = logging.getLogger(__name__)

# --- Security & JWT Configuration ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "a_very_secret_key_that_should_be_in_env")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://investimate-ai-eight.vercel.app")

# --- OAuth2 Bearer Scheme ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# --- OAuth (Google) Configuration ---
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
else:
    logger.warning("Google OAuth credentials (CLIENT_ID, CLIENT_SECRET) are not set. Google login will be disabled.")


# --- Core Authentication Functions (No changes here) ---

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(email: str, password: str, db: Session):
    user = services.get_user_by_email(email, db)
    if not user or not user.hashed_password or not verify_password(password, user.hashed_password):
        return None
    return user

def create_jwt_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def create_access_and_refresh_tokens(user: models.User):
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    
    access_token = create_jwt_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )
    refresh_token = create_jwt_token(
        data={"sub": str(user.id)},
        expires_delta=refresh_token_expires
    )
    
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
async def login_for_access_token(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
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
    return await create_access_and_refresh_tokens(user)

# ✅ **NEW ENDPOINT ADDED**
@router.post("/refresh", response_model=schemas.Token)
async def refresh_access_token(refresh_request: schemas.RefreshRequest, db: Session = Depends(get_db)):
    """
    Refreshes an access token using a valid refresh token.
    """
    try:
        payload = jwt.decode(
            refresh_request.refresh_token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
            
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
            
        return await create_access_and_refresh_tokens(user)

    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token has expired")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


@router.get("/me", response_model=schemas.UserOut)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# --- Google OAuth Endpoints (No changes here) ---

@router.get('/google/login', include_in_schema=False)
async def google_login(request: Request):
    """Redirects the user to Google's authentication page."""
    if not google_client_id:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Google OAuth is not configured on the server.")
    # Generate the base URL for the callback
    redirect_uri = request.url_for('google_callback')
    
    # The 'x-forwarded-proto' header is a standard header added by reverse proxies (like Azure's) to indicate the original protocol used by the client.
    if request.url.scheme == 'http' and 'x-forwarded-proto' in request.headers:
        if request.headers['x-forwarded-proto'] == 'https':
            redirect_uri = redirect_uri.replace("http://", "https://", 1)

    return await oauth.google.authorize_redirect(request, str(redirect_uri))

@router.get('/google/callback', name='google_callback', include_in_schema=False)
async def google_callback(request: Request, db: Session = Depends(get_db)):
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')
        if not user_info or not user_info.get('email'):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not fetch user info from Google")

        email = user_info['email']
        user = services.get_user_by_email(email, db)

        if not user:
            new_user_data = schemas.UserCreate(
                email=email,
                username=user_info.get('name', email),
                profile_pic=user_info.get('picture'),
                password="" 
            )
            user = services.create_user(db=db, user=new_user_data, hashed_password=None, is_oauth=True)

        jwt_tokens = await create_access_and_refresh_tokens(user)
        
        redirect_url = (
            f"{FRONTEND_URL}/auth/callback"
            f"?access_token={jwt_tokens['access_token']}"
            f"&refresh_token={jwt_tokens['refresh_token']}"
        )
        
        return RedirectResponse(url=redirect_url)
        
    except Exception as e:
        logger.error(f"Error in Google callback: {e}", exc_info=True)
        return RedirectResponse(url=f"{FRONTEND_URL}/login?error=oauth_failed")




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


