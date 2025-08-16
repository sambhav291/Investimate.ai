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

# --- Security & JWT Configuration ----
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

    redirect_uri = request.url_for('google_callback')
    if request.url.scheme == 'http' and 'x-forwarded-proto' in request.headers:
        if request.headers['x-forwarded-proto'] == 'https':
            redirect_uri = str(redirect_uri).replace("http://", "https://", 1)
    return await oauth.google.authorize_redirect(request, str(redirect_uri))

@router.get('/google/callback', name='google_callback', include_in_schema=False)
async def google_callback(request: Request, db: Session = Depends(get_db)):
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')
        if not user_info or not user_info.get('email'):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not fetch user info from Google")

        user_schema = schemas.UserCreate(
            email=user_info['email'],
            name=user_info.get('name'), 
            username=user_info.get('name'),
            profile_pic=user_info.get('picture'),
            password=""  # Password is not needed for OAuth
        )

        user = services.get_or_create_oauth_user(db=db, user_info=user_schema)
        
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



