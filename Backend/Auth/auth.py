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
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))

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

        access_expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        refresh_expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

        logger.debug(f"Access token will expire at: {access_expire}")
        logger.debug(f"Refresh token will expire at: {refresh_expire}")

        access_payload = {
            "sub": str(user.id),
            "name": user.name,
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

def get_current_user(
    request: Request,
    db: Session = Depends(services.get_db)
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




# from passlib.context import CryptContext
# from jose import jwt, ExpiredSignatureError, JWTError 
# from fastapi import Depends, Request
# from fastapi.security import OAuth2PasswordBearer
# from fastapi import HTTPException, status, Cookie
# from datetime import datetime, timedelta, timezone
# from sqlalchemy.orm import Session
# import os
# from dotenv import load_dotenv
# from . import models, schemas, services


# load_dotenv()

# pwd_context = CryptContext(schemes = ["bcrypt"], deprecated = "auto")
# SECRET_KEY = os.getenv("SECRET_KEY")
# ALGORITHM = os.getenv("ALGORITHM")
# ACCESS_TOKEN_EXPIRE_MINUTES = int (os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
# REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))

# #_____________________temporary_________________________________
# import logging

# # Set up logging at the top of your auth.py file
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Add this near the top of auth.py after your imports
# # logger.info("=== AUTH MODULE CONFIGURATION ===")
# # logger.info(f"SECRET_KEY configured: {'Yes' if SECRET_KEY else 'No'}")
# # logger.info(f"SECRET_KEY length: {len(SECRET_KEY) if SECRET_KEY else 0}")
# # logger.info(f"ALGORITHM: {ALGORITHM}")
# # logger.info(f"ACCESS_TOKEN_EXPIRE_MINUTES: {ACCESS_TOKEN_EXPIRE_MINUTES}")
# # logger.info(f"REFRESH_TOKEN_EXPIRE_DAYS: {REFRESH_TOKEN_EXPIRE_DAYS}")
# # logger.info("=== END AUTH CONFIG ===")

# #_____________________temporary_________________________________




# def hash_password(password:str):
#     return pwd_context.hash(password)

# def verify_password(plain_password, hashed):
#     return pwd_context.verify(plain_password, hashed)

# # async def create_tokens(user :models.User):
# #     user_obj = schemas.UserOut.model_validate(user)
# #     # access token
# #     access_expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
# #     access_payload = {
# #         "sub": str(user.id),
# #         "exp": access_expire
# #     }
# #     access_token = jwt.encode(access_payload, SECRET_KEY, algorithm=ALGORITHM)
# #     # refresh token
# #     refresh_expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
# #     refresh_payload = {
# #         "sub": str(user.id),
# #         "exp": refresh_expire,
# #         "type": "refresh"
# #     }
# #     refresh_token = jwt.encode(refresh_payload, SECRET_KEY, algorithm=ALGORITHM) 
# #     return {
# #         "access_token": access_token,
# #         "refresh_token": refresh_token,
# #         "token_type": "bearer"
# #     }

# async def authenticate_user(email: str, password: str, db: Session):
#     user = await services.get_user_by_email(email, db)
#     if not user:
#         return False
#     if not verify_password(password, user.hashed_password):
#         return False
#     return user

# # def get_current_user(
# #     request: Request,
# #     db: Session = Depends(services.get_db)
# # ):
# #     # Try to get token from cookie
# #     token = request.cookies.get("access_token")
# #     # If not in cookie, try Authorization header
# #     if not token:
# #         auth_header = request.headers.get("Authorization")
# #         if auth_header and auth_header.startswith("Bearer "):
# #             token = auth_header.split(" ", 1)[1]
# #     if not token:
# #         raise HTTPException(
# #             status_code=status.HTTP_401_UNAUTHORIZED,
# #             detail="Not authenticated"
# #         )
# #     try:
# #         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
# #         user_id = payload.get("sub")
# #         if not user_id:
# #             raise HTTPException(status_code=401, detail="Invalid token payload")
# #         user = db.query(models.User).filter(models.User.id == int(user_id)).first()
# #         if not user:
# #             raise HTTPException(status_code=401, detail="User not found")
# #     except ExpiredSignatureError:
# #         raise HTTPException(status_code=401, detail="Token expired")
# #     except JWTError:
# #         raise HTTPException(status_code=401, detail="Invalid token")
# #     return schemas.UserOut.model_validate(user)

# #____________________temporary_________________________________



# def get_current_user(
#     request: Request,
#     db: Session = Depends(services.get_db)
# ):
#     logger.info("=== GET_CURRENT_USER CALLED ===")
    
#     # Log all cookies received
#     logger.info(f"All cookies received: {dict(request.cookies)}")
    
#     # Try to get token from cookie
#     token = request.cookies.get("access_token")
#     logger.info(f"Token from cookie: {'Found' if token else 'Not found'}")
#     if token:
#         logger.info(f"Token value (first 20 chars): {token[:20]}...")
    
#     # If not in cookie, try Authorization header
#     if not token:
#         logger.info("No token in cookie, checking Authorization header")
#         auth_header = request.headers.get("Authorization")
#         logger.info(f"Authorization header: {'Found' if auth_header else 'Not found'}")
#         if auth_header and auth_header.startswith("Bearer "):
#             token = auth_header.split(" ", 1)[1]
#             logger.info("Token extracted from Authorization header")
#         else:
#             logger.info("No valid Authorization header")
    
#     if not token:
#         logger.error("No token found in cookie or header")
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Not authenticated"
#         )
    
#     logger.info("Token found, attempting to decode")
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         logger.info(f"JWT payload decoded successfully: {payload}")
        
#         user_id = payload.get("sub")
#         logger.info(f"User ID from payload: {user_id}")
        
#         if not user_id:
#             logger.error("No 'sub' field in JWT payload")
#             raise HTTPException(status_code=401, detail="Invalid token payload")
        
#         logger.info(f"Querying database for user ID: {user_id}")
#         user = db.query(models.User).filter(models.User.id == int(user_id)).first()
        
#         if not user:
#             logger.error(f"User not found in database for ID: {user_id}")
#             raise HTTPException(status_code=401, detail="User not found")
        
#         logger.info(f"User found: {user.email if hasattr(user, 'email') else 'No email attr'}")
#         logger.info("=== GET_CURRENT_USER SUCCESS ===")
        
#     except ExpiredSignatureError as e:
#         logger.error(f"Token expired: {e}")
#         raise HTTPException(status_code=401, detail="Token expired")
#     except JWTError as e:
#         logger.error(f"JWT decode error: {e}")
#         raise HTTPException(status_code=401, detail="Invalid token")
#     except ValueError as e:
#         logger.error(f"Error converting user_id to int: {e}")
#         raise HTTPException(status_code=401, detail="Invalid user ID format")
#     except Exception as e:
#         logger.error(f"Unexpected error in get_current_user: {e}")
#         raise HTTPException(status_code=401, detail="Authentication error")
    
#     return schemas.UserOut.model_validate(user) 





# async def create_tokens(user: models.User):
#     logger.info("=== CREATE_TOKENS CALLED ===")
#     logger.info(f"Creating tokens for user: ID={user.id}, Email={getattr(user, 'email', 'N/A')}")
    
#     try:
#         # Validate user object
#         user_obj = schemas.UserOut.model_validate(user)
#         logger.info(f"User object validated successfully: {user_obj}")
        
#         # Access token
#         logger.info("Creating access token...")
#         access_expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#         logger.info(f"Access token expiry time: {access_expire}")
#         logger.info(f"ACCESS_TOKEN_EXPIRE_MINUTES: {ACCESS_TOKEN_EXPIRE_MINUTES}")
        
#         access_payload = {
#             "sub": str(user.id),
#             "exp": access_expire
#         }
#         logger.info(f"Access token payload: {access_payload}")
#         logger.info(f"Using SECRET_KEY (first 10 chars): {SECRET_KEY[:10]}...")
#         logger.info(f"Using ALGORITHM: {ALGORITHM}")
        
#         access_token = jwt.encode(access_payload, SECRET_KEY, algorithm=ALGORITHM)
#         logger.info(f"Access token created successfully (length: {len(access_token)})")
#         logger.info(f"Access token (first 50 chars): {access_token[:50]}...")
        
#         # Verify the access token we just created
#         try:
#             verify_payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
#             logger.info(f"Access token verification successful: {verify_payload}")
#         except Exception as e:
#             logger.error(f"Access token verification failed: {e}")
        
#         # Refresh token
#         logger.info("Creating refresh token...")
#         refresh_expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
#         logger.info(f"Refresh token expiry time: {refresh_expire}")
#         logger.info(f"REFRESH_TOKEN_EXPIRE_DAYS: {REFRESH_TOKEN_EXPIRE_DAYS}")
        
#         refresh_payload = {
#             "sub": str(user.id),
#             "exp": refresh_expire,
#             "type": "refresh"
#         }
#         logger.info(f"Refresh token payload: {refresh_payload}")
        
#         refresh_token = jwt.encode(refresh_payload, SECRET_KEY, algorithm=ALGORITHM)
#         logger.info(f"Refresh token created successfully (length: {len(refresh_token)})")
#         logger.info(f"Refresh token (first 50 chars): {refresh_token[:50]}...")
        
#         # Verify the refresh token we just created
#         try:
#             verify_refresh_payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
#             logger.info(f"Refresh token verification successful: {verify_refresh_payload}")
#         except Exception as e:
#             logger.error(f"Refresh token verification failed: {e}")
        
#         tokens = {
#             "access_token": access_token,
#             "refresh_token": refresh_token,
#             "token_type": "bearer"
#         }
        
#         logger.info("=== CREATE_TOKENS SUCCESS ===")
#         return tokens
        
#     except Exception as e:
#         logger.error(f"Error in create_tokens: {e}")
#         logger.error(f"Error type: {type(e)}")
#         import traceback
#         logger.error(f"Traceback: {traceback.format_exc()}")
#         raise