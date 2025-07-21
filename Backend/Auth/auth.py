from passlib.context import CryptContext
from jose import jwt, ExpiredSignatureError, JWTError 
from fastapi import Depends, Request
from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException, status
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
import os
import logging
from dotenv import load_dotenv
from . import models, schemas, services

load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
formatter = logging.Formatter('[%(asctime)s] [%(levelname)s] %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

# Authentication configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
REDACTED-GOOGLE-CLIENT-SECRETTES = int(os.getenv("REDACTED-GOOGLE-CLIENT-SECRETTES"))
REDACTED-GOOGLE-CLIENT-SECRETS = int(os.getenv("REDACTED-GOOGLE-CLIENT-SECRETS", 7))

def hash_password(password: str):
    logger.debug("Hashing password...")
    return pwd_context.hash(password)

def verify_password(plain_password, hashed):
    logger.debug("Verifying password...")
    return pwd_context.verify(plain_password, hashed)

async def authenticate_user(email: str, password: str, db: Session):
    logger.debug(f"Authenticating user with email: {email}")
    try:
        user = await services.get_user_by_email(email, db)
        if not user:
            logger.warning(f"User not found with email: {email}")
            return False
        if not verify_password(password, user.hashed_password):
            logger.warning(f"Invalid password for user: {email}")
            return False
        logger.debug(f"User authenticated successfully: {email}")
        return user
    except Exception as e:
        logger.error(f"Error during user authentication: {e}", exc_info=True)
        return False

async def create_tokens(user: models.User):
    logger.debug(f"Creating tokens for user ID: {user.id}")
    try:
        user_obj = schemas.UserOut.model_validate(user)

        access_expire = datetime.now(timezone.utc) + timedelta(minutes=REDACTED-GOOGLE-CLIENT-SECRETTES)
        refresh_expire = datetime.now(timezone.utc) + timedelta(days=REDACTED-GOOGLE-CLIENT-SECRETS)

        logger.debug(f"Access token will expire at: {access_expire}")
        logger.debug(f"Refresh token will expire at: {refresh_expire}")

        access_payload = {
            "sub": str(user.id),
            "name": user.display_name,  # Use display name property
            "profile_pic": user.profile_pic,
            "email": user.email,
            "exp": access_expire
        }

        refresh_payload = {
            "sub": str(user.id),
            "exp": refresh_expire,
            "type": "refresh"
        }

        access_token = jwt.encode(access_payload, SECRET_KEY, algorithm=ALGORITHM)
        refresh_token = jwt.encode(refresh_payload, SECRET_KEY, algorithm=ALGORITHM)

        logger.debug("Tokens created successfully.")

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
    except Exception as e:
        logger.error(f"Error creating tokens: {e}", exc_info=True)
        raise

def REDACTED-GOOGLE-CLIENT-SECRETncy():
    """FastAPI dependency wrapper for get_current_user"""
    from . import services
    def dependency(request: Request, db: Session = Depends(services.get_db)):
        return get_current_user(request, db)
    return dependency

def get_current_user(
    request: Request,
    db: Session  # Remove the dependency here to avoid circular import
):
    logger.debug("Extracting token from request...")
    token = None

    # Try cookie first
    token = request.cookies.get("access_token")
    if token:
        logger.debug("Access token found in cookie.")
    else:
        logger.debug("Access token not found in cookie, checking Authorization header.")
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ", 1)[1]
            logger.debug("Access token found in Authorization header.")

    if not token:
        logger.warning("No token found in request.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    try:
        logger.debug("Decoding JWT...")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")

        logger.debug(f"Decoded user ID from token: {user_id}")

        if not user_id:
            logger.warning("User ID not found in token payload.")
            raise HTTPException(status_code=401, detail="Invalid token payload")

        logger.debug("Querying database for user...")
        user = db.query(models.User).filter(models.User.id == int(user_id)).first()

        if not user:
            logger.warning("User not found in database.")
            raise HTTPException(status_code=401, detail="User not found")

        logger.debug(f"User found: {user.email}")
        return schemas.UserOut.model_validate(user)

    except ExpiredSignatureError:
        logger.warning("Access token expired.")
        raise HTTPException(status_code=401, detail="Token expired")

    except JWTError as e:
        logger.error("Invalid JWT token.", exc_info=True)
        raise HTTPException(status_code=401, detail="Invalid token")

    except ValueError:
        logger.error("User ID from token is not an integer.")
        raise HTTPException(status_code=401, detail="Invalid user ID format")

    except Exception as e:
        logger.error(f"Unexpected authentication error: {e}", exc_info=True)
        raise HTTPException(status_code=401, detail="Authentication error")


