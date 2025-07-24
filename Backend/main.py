import os
import sys
import io
import logging
from datetime import datetime, timezone
from urllib.parse import unquote

from fastapi import FastAPI, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from dotenv import load_dotenv

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from Auth.database import engine, Base, get_db
from Auth import schemas, models
from Auth.supabase_utils import upload_pdf_to_supabase, get_signed_url, supabase, SUPABASE_BUCKET
# ✅ FIX: Import both the router and the dependency function directly
from Auth.auth import router as auth_router, get_current_user

load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(title="Investimate AI Backend", version="1.0.0")

# --- CORS Middleware ---
origins = {"http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"}
cors_origins_env = os.getenv("CORS_ORIGINS")
if cors_origins_env:
    additional_origins = {origin.strip() for origin in cors_origins_env.split(",")}
    origins.update(additional_origins)
logger.info(f"CORS enabled for: {list(origins)}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database Initialization ---
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully.")
except Exception as e:
    logger.error(f"Database setup failed: {e}")

app.include_router(auth_router)

# --- Pydantic Models ---
class StockRequest(BaseModel):
    stock_name: str
    filename: str | None = None

# --- Helper Functions ---
def normalize_storage_path(path: str) -> str:
    if not path: return ""
    return path.replace('\\', '/').lstrip('./').lstrip('/')

# --- Application Endpoints ---

@app.post("/generate-summary", tags=["Analysis"])
def generate_summary(req: StockRequest):
    from Generator.summary_generator import generate_stock_summary
    return generate_stock_summary(req.stock_name)

@app.post("/generate-report", tags=["Analysis"])
async def generate_report(req: StockRequest):
    from Generator.report_generator import generate_stock_report
    raw_storage_path, actual_filename = generate_stock_report(req.stock_name)
    if not raw_storage_path:
        raise HTTPException(status_code=500, detail="PDF file was not generated")
    
    storage_path = normalize_storage_path(raw_storage_path)
    upload_pdf_to_supabase(raw_storage_path)
    signed_url = get_signed_url(storage_path)
    if not signed_url:
        raise HTTPException(status_code=500, detail="Could not generate signed URL")
    
    return {"msg": "PDF report generated", "signed_url": signed_url, "storage_path": storage_path, "filename": actual_filename}

@app.get("/preview-pdf", tags=["Reports"])
async def preview_pdf(storage_path: str):
    decoded_path = unquote(storage_path)
    normalized_path = normalize_storage_path(decoded_path)
    res = supabase.storage.from_(SUPABASE_BUCKET).download(normalized_path)
    filename = os.path.basename(normalized_path)
    return StreamingResponse(io.BytesIO(res), media_type="application/pdf", headers={"Content-Disposition": f"inline; filename={filename}"})

@app.post("/save-report", tags=["Reports"])
async def save_report(
    req: StockRequest = Body(...), 
    db: Session = Depends(get_db),
    # ✅ FIX: Use the imported function directly
    user: schemas.UserOut = Depends(get_current_user)
):
    if not req.filename:
        raise HTTPException(status_code=400, detail="Filename is required")
    storage_path = f"reports/{req.filename}"
    existing = db.query(models.UserReport).filter_by(user_id=user.id, filename=req.filename).first()
    if existing:
        return {"msg": "Report already saved", "id": existing.id}
    report = models.UserReport(user_id=user.id, filename=req.filename, filepath=storage_path)
    db.add(report)
    db.commit()
    db.refresh(report)
    return {"msg": "Report saved to library", "id": report.id}

@app.get("/my-reports", tags=["Reports"])
async def list_my_reports(
    db: Session = Depends(get_db),
    # ✅ FIX: Use the imported function directly
    user: schemas.UserOut = Depends(get_current_user)
):
    reports = db.query(models.UserReport).filter(models.UserReport.user_id == user.id).all()
    return [{"id": r.id, "filename": r.filename, "created_at": r.created_at} for r in reports]

@app.delete("/delete-report/{report_id}", tags=["Reports"])
async def delete_report(
    report_id: int, 
    db: Session = Depends(get_db),
    # ✅ FIX: Use the imported function directly
    user: schemas.UserOut = Depends(get_current_user)
):
    report = db.query(models.UserReport).filter_by(id=report_id, user_id=user.id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    db.delete(report)
    db.commit()
    return {"msg": "Report deleted"}

@app.get("/", tags=["Health"])
async def root():
    return {"message": "Investimate AI Backend API is running"}

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}






# from fastapi import FastAPI, HTTPException, Depends, Body, Request, status, APIRouter
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import StreamingResponse, RedirectResponse, JSONResponse
# from authlib.integrations.starlette_client import OAuth
# from starlette.middleware.sessions import SessionMiddleware
# from starlette.config import Config
# from sqlalchemy.orm import Session
# from pydantic import BaseModel
# from jose import jwt, JWTError, ExpiredSignatureError

# from Auth import auth as auth_router # Import the corrected auth router

# from dotenv import load_dotenv
# import os
# import sys
# import io
# import time
# import traceback
# import logging
# from datetime import datetime, timedelta, timezone
# from urllib.parse import unquote

# # Enhanced logging setup for Azure deployment
# logging.basicConfig(
#     level=logging.INFO,
#     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
#     handlers=[logging.StreamHandler()]
# )
# logger = logging.getLogger("investimate-backend")
# logger.info("Starting Investimate Backend API - Azure Deployment")

# # Log Python and environment information
# logger.info(f"Python Version: {sys.version}")
# logger.info(f"Current Working Directory: {os.getcwd()}")
# logger.info(f"Directory Contents: {os.listdir('.')}")
# try:
#     import fastapi
#     logger.info(f"FastAPI Version: {fastapi.__version__}")
# except Exception as e:
#     logger.error(f"Error importing FastAPI: {str(e)}")

# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
# logger.info(f"Python Path: {sys.path}")
# # Lazy imports to reduce memory usage
# # from Generator.summary_generator import generate_stock_summary
# # from Generator.report_generator import generate_stock_report
# from Auth.database import engine, Base
# from Auth import schemas, auth, services, models
# from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
# from Auth.supabase_utils import upload_pdf_to_supabase, get_signed_url, supabase, SUPABASE_BUCKET

# # Load environment variables
# load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

# # Production configuration
# ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
# DEBUG = os.getenv("DEBUG", "true").lower() == "true"

# # Configure logging for production debugging
# if ENVIRONMENT == "production":
#     logging.basicConfig(level=logging.INFO)
# else:
#     logging.basicConfig(level=logging.WARNING)
# logger = logging.getLogger(__name__)

# # # CORS origins - update for production
# # CORS_ORIGINS = [
# #     "http://localhost:5173",
# #     "http://localhost:3000",
# #     "http://127.0.0.1:5173",
# #     "http://127.0.0.1:3000",
# #     "https://investimate-ai-eight.vercel.app",  # Add production frontend explicitly
# # ]


# # # Add production origins if specified in environment
# # if os.getenv("CORS_ORIGINS"):
# #     try:
# #         import json
# #         cors_origins_env = os.getenv("CORS_ORIGINS")
# #         logger.info(f"CORS_ORIGINS from environment: {cors_origins_env}")
        
# #         # Handle both JSON string and single string formats
# #         if cors_origins_env.startswith('[') and cors_origins_env.endswith(']'):
# #             # JSON array format
# #             prod_origins = json.loads(cors_origins_env)
# #         else:
# #             # Single string format
# #             prod_origins = [cors_origins_env]
            
# #         # Add to origins if not already present
# #         for origin in prod_origins:
# #             if origin not in CORS_ORIGINS:
# #                 CORS_ORIGINS.append(origin)
# #                 logger.info(f"Added CORS origin: {origin}")
# #     except Exception as e:
# #         logger.warning(f"Failed to parse CORS_ORIGINS from environment: {e}")
# #         # Fallback: single origin as string
# #         fallback_origin = os.getenv("CORS_ORIGINS")
# #         if fallback_origin and fallback_origin not in CORS_ORIGINS:
# #             CORS_ORIGINS.append(fallback_origin)
# #             logger.info(f"Added fallback CORS origin: {fallback_origin}")

# # Default origins for local development
# origins = {
#     "http://localhost:5173",
#     "http://localhost:3000",
#     "http://127.0.0.1:5173",
# }

# # Add production origins if specified in the environment
# cors_origins_env = os.getenv("CORS_ORIGINS")
# if cors_origins_env:
#     # Split the comma-separated string from Azure into a list of origins
#     additional_origins = {origin.strip() for origin in cors_origins_env.split(",")}
#     origins.update(additional_origins)
#     logger.info(f"CORS enabled for: {list(origins)}")



# # Environment variables
# GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
# GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
# SECRET_KEY = os.getenv("SECRET_KEY")
# ALGORITHM = os.getenv("ALGORITHM", "HS256")

# # Debug: Check if all required environment variables are loaded
# missing_vars = []
# if not GOOGLE_CLIENT_ID:
#     missing_vars.append("GOOGLE_CLIENT_ID")
# if not GOOGLE_CLIENT_SECRET:
#     missing_vars.append("GOOGLE_CLIENT_SECRET")
# if not SECRET_KEY:
#     missing_vars.append("SECRET_KEY")

# if missing_vars:
#     logger.error(f"Missing required environment variables: {', '.join(missing_vars)}")
#     for var in missing_vars:
#         logger.error(f"{var} = {os.getenv(var)}")
# else:
#     logger.info("All required OAuth and auth environment variables loaded successfully")

# # Database setup
# database_connected = False
# try:
#     logger.info(f"Attempting to connect to database...")
#     logger.info(f"Environment: {ENVIRONMENT}")
    
#     # Test database connection with retry logic
#     from sqlalchemy import text
    
#     max_retries = 2 if ENVIRONMENT == "production" else 1  # Reduce retries in production
    
#     for attempt in range(max_retries):
#         try:
#             with engine.connect() as conn:
#                 result = conn.execute(text("SELECT 1"))
#                 logger.info("Database connection test successful")
#                 database_connected = True
#                 break
#         except Exception as db_error:
#             logger.warning(f"Database connection attempt {attempt + 1} failed: {db_error}")
#             if attempt < max_retries - 1:
#                 time.sleep(1)  # Reduce wait time in production
#             else:
#                 logger.error("All database connection attempts failed")
#                 logger.warning("Continuing without database connection")
    
#     if database_connected:
#         Base.metadata.create_all(bind=engine)
#         logger.info("Database tables created successfully")
#     else:
#         logger.warning("Database tables not created - no connection")
        
# except Exception as e:
#     logger.error(f"Database setup failed: {e}")
#     logger.error(f"Database URL present: {bool(os.getenv('DATABASE_URL'))}")
#     logger.warning("Application will start without database connection")
    
#     # Only log URL details in development
#     if ENVIRONMENT != "production":
#         db_url = os.getenv("DATABASE_URL")
#         if db_url:
#             # Hide password for logging
#             safe_url = db_url.replace(":Investimate_291@", ":****@") if "Investimate_291" in db_url else db_url
#             logger.error(f"Database URL format: {safe_url}")
#         else:
#             logger.error("DATABASE_URL environment variable is not set!")

# # Always continue with app initialization
# logger.info("Starting FastAPI application...")

# # FastAPI app initialization
# app = FastAPI(
#     title="Investimate AI Backend",
#     description="Backend API for Investimate AI",
#     version="1.0.0"
# )

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=list(origins),
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Add startup event
# @app.on_event("startup")
# async def startup_event():
#     try:
#         logger.info("Testing basic application functionality...")
#         logger.info("✅ FastAPI app initialized successfully")
#         logger.info("✅ Middleware configured")
#         logger.info("✅ OAuth configured")
#         logger.info("=== STARTUP COMPLETE ===")
#     except Exception as e:
#         logger.error(f"❌ Startup error: {e}")
#         raise

# # Add shutdown event
# @app.on_event("shutdown")
# async def shutdown_event():
#     logger.info("Application shutdown")

# # Middleware setup
# app.add_middleware( 
#     SessionMiddleware,
#     secret_key=os.getenv("SECRET_KEY", "md384503mr4rm59*r89x#mim@m9"),
#     max_age=60*60*24*7,  # 7 days
#     same_site="lax",
#     https_only=ENVIRONMENT == "production"
# )

# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=CORS_ORIGINS,
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

# # OAuth configuration
# config = Config(environ={
#     "GOOGLE_CLIENT_ID": GOOGLE_CLIENT_ID,
#     "GOOGLE_CLIENT_SECRET": GOOGLE_CLIENT_SECRET,
# })

# oauth = OAuth(config)
# oauth.register(
#     name='google',
#     client_id=GOOGLE_CLIENT_ID,
#     client_secret=GOOGLE_CLIENT_SECRET,
#     server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
#     client_kwargs={'scope': 'openid email profile'}
# )

# # Helper function to normalize Supabase storage paths
# def normalize_storage_path(path: str) -> str:
#     """
#     Normalize a storage path for Supabase by removing leading ./ and ensuring
#     it's relative to the bucket root.
#     """
#     if not path:
#         return path
    
#     # Remove leading ./ or ./
#     if path.startswith('./'):
#         path = path[2:]
#     elif path.startswith('.\\'):
#         path = path[2:]
    
#     # Remove leading / if present
#     if path.startswith('/'):
#         path = path[1:]
    
#     # Ensure forward slashes for Supabase
#     path = path.replace('\\', '/')
    
#     logger.info(f"Normalized storage path: {path}")
#     return path

# # Pydantic models
# class StockRequest(BaseModel):
#     stock_name: str
#     filename: str | None = None


# class RefreshRequest(BaseModel):
#     refresh_token: str

# # Authentication endpoints
# # @app.get("/auth/google/login")
# # async def google_login(request: Request):
# #     try:
# #         # Check if OAuth credentials are available
# #         if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
# #             logger.error("Google OAuth credentials not configured")
# #             raise HTTPException(status_code=500, detail="OAuth configuration missing")
        
# #         # Use environment variable for redirect URI in production
# #         redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
        
# #         # If no redirect URI is set, try to construct it from the request
# #         if not redirect_uri:
# #             # Get the host from the request
# #             host = request.headers.get("host", "localhost:8000")
# #             # Azure App Service uses HTTPS by default
# #             scheme = "https" if ("azurewebsites.net" in host or "onrender.com" in host) else "http"
# #             redirect_uri = f"{scheme}://{host}/auth/google/callback"
        
# #         logger.info(f"Using redirect URI: {redirect_uri}")
# #         return await oauth.google.authorize_redirect(request, redirect_uri)
# #     except Exception as e:
# #         logger.error(f"OAuth login error: {str(e)}")
# #         raise HTTPException(status_code=500, detail=f"OAuth login failed: {str(e)}")

# # @app.get("/auth/google/callback")
# # async def google_callback(request: Request, db: Session = Depends(services.get_db)):
# #     try:
# #         logger.info("Starting Google OAuth callback")
# #         logger.info(f"Request query params: {request.query_params}")
        
# #         # Check for error in query parameters
# #         if "error" in request.query_params:
# #             error_msg = request.query_params.get("error", "unknown_error")
# #             logger.error(f"OAuth error in callback: {error_msg}")
# #             # Return user to frontend with error parameter
# #             frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
# #             return RedirectResponse(f"{frontend_url}?error=oauth_error&message={error_msg}")
        
# #         logger.info("Attempting to get access token from Google")
# #         token = await oauth.google.authorize_access_token(request)
# #         logger.info(f"Token received: {token is not None}")
        
# #         if not token:
# #             logger.error("No token received from Google")
# #             frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
# #             return RedirectResponse(f"{frontend_url}?error=no_token")
        
# #         user_info = token.get("userinfo")
# #         logger.info(f"User info from token: {user_info is not None}")
        
# #         if not user_info:
# #             logger.info("No userinfo in token, extracting from id_token")
# #             user_info = jwt.get_unverified_claims(token["id_token"])
# #             logger.info(f"User info from id_token: {user_info is not None}")
        
# #         if not user_info or not user_info.get('email'):
# #             logger.error("No user info or email found in token")
# #             frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
# #             return RedirectResponse(f"{frontend_url}?error=no_user_info")
        
# #         logger.info(f"Processing user with email: {user_info['email']}")
        
# #         # Try database operations with fallback
# #         try:
# #             user = await services.get_user_by_email(user_info['email'], db)
# #             if not user:
# #                 logger.info("Creating new user")
# #                 user = await services.create_user_google(user_info, db)
# #             else:
# #                 logger.info("User exists, checking profile picture")
# #                 if user.profile_pic != user_info.get('picture', ''):
# #                     user.profile_pic = user_info.get('picture', '')
# #                     db.commit()
# #                     db.refresh(user)
# #                 # Also update name if it changed
# #                 if user.name != user_info.get('name', ''):
# #                     user.name = user_info.get('name', user_info.get('email', ''))
# #                     db.commit()
# #                     db.refresh(user)
# #         except Exception as db_error:
# #             logger.error(f"Database error during user operations: {db_error}")
# #             # Create a temporary user object for token generation
# #             from Auth.models import User
# #             user = User(
# #                 email=user_info['email'],
# #                 username=user_info.get('name', user_info['email']),
# #                 profile_pic=user_info.get('picture', ''),
# #                 id=1  # Temporary ID
# #             )
# #             logger.warning("Using temporary user object due to database error")

# #         logger.info("Creating JWT tokens")
# #         jwt_token = await auth.create_tokens(user)
        
# #         # Use environment variable for frontend URL in production
# #         frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
# #         logger.info(f"Redirecting to frontend: {frontend_url}")
        
# #         response = RedirectResponse(frontend_url)
# #         response.set_cookie(
# #             key="access_token",
# #             value=jwt_token["access_token"],
# #             httponly=True,
# #             secure=True,  # Enable for HTTPS in production
# #             samesite="lax",
# #             max_age=60*60*24*7,
# #             path="/"
# #         )
# #         response.set_cookie(
# #             key="refresh_token",
# #             value=jwt_token["refresh_token"],
# #             httponly=True,
# #             secure=True,  # Enable for HTTPS in production
# #             samesite="lax",
# #             max_age=60*60*24*7,
# #             path="/"
# #         )
# #         logger.info("OAuth callback completed successfully")
# #         return response
    
# #     except Exception as e:
# #         logger.error(f"OAuth callback error: {str(e)}")
# #         logger.error(f"Error type: {type(e).__name__}")
# #         import traceback
# #         logger.error(f"Traceback: {traceback.format_exc()}")
        
# #         # Return user to frontend with error parameter
# #         frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
# #         return RedirectResponse(f"{frontend_url}?error=oauth_failed&message={str(e)[:100]}")

# # @app.post("/token/from-cookie")
# # async def token_from_cookie(request: Request, db: Session = Depends(services.get_db)):
# #     user = auth.get_current_user(request, db)
# #     if not user:
# #         raise HTTPException(status_code=401, detail="Not authenticated via cookie")

# #     tokens = await auth.create_tokens(user)

# #     return {
# #         "access_token": tokens["access_token"],
# #         "refresh_token": tokens["refresh_token"]
# #     }


# # @app.post("/signup", response_model=schemas.UserOut)
# # async def register(
# #     user: schemas.UserCreate, db: Session = Depends(services.get_db)
# # ):
# #     try:
# #         logger.info(f"Signup attempt for user: {user.email}")
# #         existing = await services.get_user_by_email(user.email, db)
# #         if existing:
# #             logger.warning(f"User already exists: {user.email}")
# #             raise HTTPException(status_code=400, detail="User already exists")
        
# #         logger.info(f"Creating new user: {user.email}")
# #         new_user = await services.create_user(user, db)
# #         logger.info(f"User created successfully: {user.email}")
        
# #         tokens = await auth.create_tokens(new_user)
# #         logger.info(f"Tokens created for user: {user.email}")
        
# #         return tokens
# #     except HTTPException:
# #         raise
# #     except Exception as e:
# #         logger.error(f"Signup error for user {user.email}: {e}")
# #         raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

# # @app.post("/login")
# # async def login(
# #     form_data: OAuth2PasswordRequestForm = Depends(),
# #     db: Session = Depends(services.get_db)
# # ):
# #     try:
# #         logger.info(f"Login attempt for user: {form_data.username}")
# #         db_user = await auth.authenticate_user(form_data.username, form_data.password, db)
# #         if not db_user:
# #             logger.warning(f"Authentication failed for user: {form_data.username}")
# #             raise HTTPException(status_code=401, detail="Invalid credentials")
        
# #         logger.info(f"User authenticated successfully: {form_data.username}")
# #         tokens = await auth.create_tokens(db_user)
        
# #         response = JSONResponse(content={
# #             "access_token": tokens["access_token"],
# #             "refresh_token": tokens["refresh_token"],
# #             "token_type": "bearer"
# #         })
        
# #         response.set_cookie(
# #             key="access_token",
# #             value=tokens["access_token"],
# #             httponly=True,
# #             secure=True,  # Enable for HTTPS in production
# #             samesite="lax",
# #             max_age=60*60*24*7,
# #             path="/",
# #         )
        
# #         response.set_cookie(
# #             key="refresh_token",
# #             value=tokens["refresh_token"],
# #             httponly=True,
# #             secure=True,  # Enable for HTTPS in production
# #             samesite="lax",
# #             max_age=60*60*24*7,
# #             path="/",
# #         )
        
# #         logger.info(f"Login successful for user: {form_data.username}")
# #         return response
        
# #     except HTTPException:
# #         raise
# #     except Exception as e:
# #         logger.error(f"Login error for user {form_data.username}: {e}")
# #         raise HTTPException(status_code=500, detail="Internal server error")




# # @app.post("/refresh")
# # async def refresh_token(
# #     request: Request,
# #     req: RefreshRequest = None,
# #     db: Session = Depends(services.get_db)
# # ):
# #     """
# #     Refresh access token using refresh token from request body or cookie
# #     """
# #     try:
# #         # Try to get refresh token from request body first, then from cookie
# #         refresh_token_value = None
        
# #         if req and req.refresh_token:
# #             print("this is the refresh token from request body", req.refresh_token)
# #             refresh_token_value = req.refresh_token
# #         else:
# #             # Try to get from cookie
# #             refresh_token_value = request.cookies.get("refresh_token")
        
# #         if not refresh_token_value:
# #             raise HTTPException(status_code=401, detail="No refresh token provided")
        
# #         # Verify refresh token
# #         payload = jwt.decode(
# #             refresh_token_value,
# #             os.getenv("SECRET_KEY"),
# #             algorithms=[os.getenv("ALGORITHM", "HS256")]
# #         )
        
# #         if payload.get("type") != "refresh":
# #             raise HTTPException(status_code=401, detail="Invalid refresh token")
        
# #         user_id = payload.get("sub")
# #         if not user_id:
# #             raise HTTPException(status_code=401, detail="Invalid token payload")
        
# #         user = db.query(models.User).filter(models.User.id == int(user_id)).first()
# #         if not user:
# #             raise HTTPException(status_code=401, detail="User not found")
        
# #         # Generate new tokens
# #         tokens = await auth.create_tokens(user)
        
# #         response = JSONResponse(content={
# #             "access_token": tokens["access_token"],
# #             "refresh_token": tokens["refresh_token"],
# #             "token_type": "bearer"
# #         })
        
# #         # Set cookies
# #         response.set_cookie(
# #             key="access_token",
# #             value=tokens["access_token"], 
# #             httponly=True,
# #             secure=True,  # Enable for HTTPS in production
# #             samesite="lax",
# #             max_age=60*60*24*7,
# #             path="/",
# #         )
        
# #         response.set_cookie(
# #             key="refresh_token",
# #             value=tokens["refresh_token"],
# #             httponly=True,
# #             secure=True,  # Enable for HTTPS in production
# #             samesite="lax",
# #             max_age=60*60*24*7,
# #             path="/",
# #         )
        
# #         return response
        
# #     except ExpiredSignatureError:
# #         raise HTTPException(status_code=401, detail="Token expired")
# #     except JWTError:
# #         raise HTTPException(status_code=401, detail="Invalid token")
# #     except HTTPException:
# #         raise
# #     except Exception as e:
# #         logger.error(f"Refresh token error: {e}")
# #         raise HTTPException(status_code=401, detail="Invalid refresh token")

# # @app.get("/signup/me")
# # async def get_user(user: schemas.UserLogin = Depends(auth.get_current_user_dependency())):
# #     return user



# # @app.post("/logout")
# # async def logout():
# #     """
# #     Logout user by clearing auth cookies
# #     """
# #     try:
# #         response = JSONResponse(content={"message": "Logged out successfully"})
        
# #         # Clear both access and refresh token cookies
# #         response.set_cookie(
# #             key="access_token",
# #             value="",
# #             httponly=True,
# #             secure=True,  # Enable for HTTPS in production
# #             samesite="lax",
# #             expires=datetime.now(timezone.utc),
# #             path="/"
# #         )
        
# #         response.set_cookie(
# #             key="refresh_token",
# #             value="",
# #             httponly=True,
# #             secure=True,  # Enable for HTTPS in production
# #             samesite="lax",
# #             expires=datetime.now(timezone.utc),
# #             path="/"
# #         )
        
# #         return response
        
# #     except Exception as e:
# #         logger.error(f"Logout error: {e}")
# #         raise HTTPException(status_code=500, detail="Internal server error")


# # --- API Routers ---
# # This tells your main app to use the routes from your other files.
# app.include_router(auth_router.router, prefix="/auth", tags=["Authentication"])
# app.include_router(services.router, prefix="", tags=["User Services"])

# # Stock analysis endpoints
# @app.post("/generate-summary")
# def generate_summary(req: StockRequest):
#     # Lazy import to reduce memory usage
#     from Generator.summary_generator import generate_stock_summary
#     return generate_stock_summary(req.stock_name)

# @app.post("/generate-report")
# async def generate_report(req: StockRequest):
#     try:
#         logger.info(f"Generating report for stock: {req.stock_name}")
        
#         # Lazy import to reduce memory usage
#         from Generator.report_generator import generate_stock_report
        
#         # Generate the report (this should return a local file path or the storage path)
#         raw_storage_path, actual_filename = generate_stock_report(req.stock_name)
#         if not raw_storage_path:
#             raise HTTPException(status_code=500, detail="PDF file was not generated successfully")
        
#         logger.info(f"Raw storage path from generator: {raw_storage_path}")
        
#         # Normalize the storage path for Supabase
#         storage_path = normalize_storage_path(raw_storage_path)
#         logger.info(f"Normalized storage path: {storage_path}")
        
#         # Generate signed URL
#         upload_pdf_to_supabase(raw_storage_path)
#         logger.info(f"Uploaded PDF to Supabase: {raw_storage_path}")
#         signed_url = get_signed_url(storage_path)
#         if not signed_url:  
#             logger.error(f"Failed to generate signed URL for path: {storage_path}")
#             raise HTTPException(status_code=500, detail="Could not generate signed URL for PDF")
        
#         logger.info(f"Generated signed URL: {signed_url}")
        
#         return {
#             "msg": "PDF report generated successfully",
#             "signed_url": signed_url,
#             "storage_path": storage_path,
#             "filename": actual_filename
#         }
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"Error in generate_report: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# # Report management endpoints

# @app.get("/preview-pdf")
# async def preview_pdf(
#     storage_path: str,
#     download: int = 0,
#     user: schemas.UserOut = Depends(auth.get_current_user_dependency())
# ):
#     try:
#         logger.info(f"Preview PDF requested for path: {storage_path}")
        
#         # URL decode the storage path in case it's encoded
#         decoded_path = unquote(storage_path)
#         logger.info(f"URL decoded path: {decoded_path}")
        
#         # Normalize the storage path
#         normalized_path = normalize_storage_path(decoded_path)
#         logger.info(f"Normalized path for preview: {normalized_path}")
        
#         # For testing, try to load from local file first
#         local_path = os.path.join(os.path.dirname(__file__), normalized_path)
#         logger.info(f"Trying local path: {local_path}")
        
#         if os.path.exists(local_path):
#             logger.info(f"Found local file: {local_path}")
#             disposition = "attachment" if download else "inline"
#             filename = os.path.basename(normalized_path)
            
#             with open(local_path, 'rb') as file:
#                 file_content = file.read()
            
#             return StreamingResponse(
#                 io.BytesIO(file_content),
#                 media_type="application/pdf",
#                 headers={
#                     "Content-Disposition": f"{disposition}; filename={filename}",
#                     "Content-Type": "application/pdf",
#                     "Cache-Control": "no-cache, no-store, must-revalidate",
#                     "Pragma": "no-cache",
#                     "Expires": "0"
#                 }
#             )
#         else:
#             logger.info(f"Local file not found, trying Supabase: {normalized_path}")
#             # Download from Supabase
#             res = supabase.storage.from_(SUPABASE_BUCKET).download(normalized_path)
#             logger.info(f"Successfully downloaded PDF from Supabase, size: {len(res)} bytes")
            
#             disposition = "attachment" if download else "inline"
#             filename = os.path.basename(normalized_path)
            
#             return StreamingResponse(
#                 io.BytesIO(res),
#                 media_type="application/pdf",
#                 headers={
#                     "Content-Disposition": f"{disposition}; filename={filename}",
#                     "Content-Type": "application/pdf",
#                     "Cache-Control": "no-cache, no-store, must-revalidate",
#                     "Pragma": "no-cache",
#                     "Expires": "0"
#                 }
#             )
#     except Exception as e:
#         logger.error(f"PDF preview error for path '{storage_path}': {str(e)}")
#         raise HTTPException(status_code=404, detail=f"PDF not found: {str(e)}")


# @app.post("/save-report")
# async def save_report(
#     req: StockRequest = Body(...),
#     db: Session = Depends(services.get_db),
#     user: schemas.UserOut = Depends(auth.get_current_user_dependency())
# ):
#     try:
#         filename = req.filename  # ✅ Access directly from parsed model
#         if not filename:
#             raise HTTPException(status_code=400, detail="Filename is required")

#         storage_path = f"reports/{filename}"
#         local_path = os.path.join("reports", filename)
#         print(f"Local path for saving report: {local_path}")
        
#         logger.info(f"Saving report with storage_path: {storage_path}, filename: {filename}")

#         existing = db.query(models.UserReport).filter_by(
#             user_id=user.id,
#             filename=filename
#         ).first()
#         if existing:
#             return {"msg": "Report already saved", "id": existing.id}
        
#         file_size = None
#         if os.path.exists(local_path):
#             file_size = os.path.getsize(local_path)

#         report = models.UserReport(
#             user_id=user.id,
#             filename=filename,
#             filepath=storage_path
#         )
#         db.add(report)
#         db.commit()
#         db.refresh(report)
        
#         logger.info(f"Report saved to database with ID: {report.id}")
#         return {"msg": "Report saved to library", "id": report.id}
#     except Exception as e:
#         logger.error(f"Error saving report: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Failed to save report: {str(e)}")
    
# @app.get("/get-report-url/{report_id}")
# async def get_report_url(
#     report_id: int,
#     db: Session = Depends(services.get_db),
#     user: schemas.UserOut = Depends(auth.get_current_user_dependency())
# ):
#     try:
#         report = db.query(models.UserReport).filter_by(id=report_id, user_id=user.id).first()
#         if not report:
#             raise HTTPException(status_code=404, detail="Report not found")
        
#         # Normalize the filepath before generating signed URL
#         normalized_path = normalize_storage_path(report.filepath)
#         logger.info(f"Getting signed URL for report ID {report_id}, normalized path: {normalized_path}")
        
#         signed_url = get_signed_url(normalized_path)
#         if not signed_url:
#             logger.error(f"Failed to generate signed URL for report ID {report_id}")
#             raise HTTPException(status_code=500, detail="Could not generate signed URL")
        
#         return {"signed_url": signed_url}
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"Error getting report URL for ID {report_id}: {str(e)}")
#         raise HTTPException(status_code=500, detail="Failed to get report URL")

# @app.get("/my-reports")
# async def list_my_reports(
#     db: Session = Depends(services.get_db),
#     user: schemas.UserOut = Depends(auth.get_current_user_dependency())
# ):
#     reports = db.query(models.UserReport).filter(models.UserReport.user_id == user.id).all()
#     return [
#         {
#             "id": r.id, 
#             "filename": r.filename, 
#             "created_at": r.created_at
#         }
#         for r in reports
#     ]

# @app.get("/my-reports/{report_id}")
# async def get_report_info(
#     report_id: int,
#     db: Session = Depends(services.get_db),
#     user: schemas.UserOut = Depends(auth.get_current_user_dependency())
# ):
#     report = db.query(models.UserReport).filter(
#         models.UserReport.id == report_id, models.UserReport.user_id == user.id
#     ).first()
#     if not report:
#         raise HTTPException(status_code=404, detail="Report not found")
    
#     # Normalize the filepath before returning
#     normalized_filepath = normalize_storage_path(report.filepath)
    
#     return {
#         "filepath": normalized_filepath,  
#         "filename": report.filename
#     }

# @app.delete("/delete-report/{report_id}")
# async def delete_report(
#     report_id: int,
#     db: Session = Depends(services.get_db),
#     user: schemas.UserOut = Depends(auth.get_current_user_dependency())
# ):
#     report = db.query(models.UserReport).filter(
#         models.UserReport.id == report_id, models.UserReport.user_id == user.id
#     ).first()
#     if not report:
#         raise HTTPException(status_code=404, detail="Report not found")
    
#     try:
#         # Optionally delete from Supabase storage as well
#         normalized_path = normalize_storage_path(report.filepath)
#         logger.info(f"Deleting report from storage: {normalized_path}")
        
#         # Uncomment the next line if you want to delete from Supabase storage too
#         # supabase.storage.from_(SUPABASE_BUCKET).remove([normalized_path])
        
#         db.delete(report)
#         db.commit()
#         return {"msg": "Report deleted"}
#     except Exception as e:
#         logger.error(f"Error deleting report ID {report_id}: {str(e)}")
#         # Still delete from database even if storage deletion fails
#         db.delete(report)
#         db.commit()
#         return {"msg": "Report deleted from database (storage deletion may have failed)"}

# # Health check and root endpoint
# @app.get("/")
# async def root():
#     return {
#         "message": "Investimate AI Backend API", 
#         "status": "running", 
#         "version": "1.0.0",
#         "environment": ENVIRONMENT,
#         "database_connected": database_connected
#     }

# @app.get("/health")
# async def health_check():
#     return {
#         "status": "healthy",
#         "environment": ENVIRONMENT,
#         "database_connected": database_connected,
#         "timestamp": datetime.now(timezone.utc).isoformat()
#     }
# # For local development
# if __name__ == '__main__':
#     import uvicorn
#     port = int(os.getenv('PORT', 8000))
#     uvicorn.run(app, host='0.0.0.0', port=port)
