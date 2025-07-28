import os
import logging
from logging.config import dictConfig
from fastapi import FastAPI, HTTPException, Depends, Body, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from Auth.database import get_db, engine
from Auth import models, schemas
from Auth.auth import get_current_user, create_access_token, verify_password
from Auth.google_auth import get_google_auth_url, get_google_user_info
from Generator.summary_generator import generate_stock_summary
from Pdf_report_maker.report_generator import generate_and_upload_pdf_report
from dotenv import load_dotenv

load_dotenv()

# --- Start of New Logging Configuration ---

# This dictionary-based configuration is the standard for production apps.
# It ensures logs from all modules are captured and sent to the console,
# which is what Azure Log Stream reads.
LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "default",
            "stream": "ext://sys.stdout",  # Explicitly send to standard output for Azure
        },
    },
    "root": {
        "level": "INFO",
        "handlers": ["console"],
    },
}

# Apply the configuration
dictConfig(LOGGING_CONFIG)

# Create a logger for this file
logger = logging.getLogger(__name__)

# --- End of New Logging Configuration ---


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Your CORS middleware remains unchanged
origins = [
    "http://localhost:5173",
    "https://investimate.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Your existing functions and routes remain unchanged
@app.post("/auth/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = models.User(email=user.email, hashed_password=user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/auth/login")
def login_user(form_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.email).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/google/login")
def google_login():
    return {"url": get_google_auth_url()}

@app.get("/auth/google/callback")
def google_callback(code: str, db: Session = Depends(get_db)):
    user_info = get_google_user_info(code)
    email = user_info.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Could not retrieve email from Google")
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        user = models.User(email=email, full_name=user_info.get("name"), profile_picture=user_info.get("picture"))
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "user_info": {"email": user.email, "full_name": user.full_name, "profile_picture": user.profile_picture}}

@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.post("/generate-summary")
async def generate_summary(
    background_tasks: BackgroundTasks,
    stock_symbol: str = Body(..., embed=True),
    current_user: models.User = Depends(get_current_user)
):
    user_id = current_user.id
    logger.info(f"Received request to generate summary for {stock_symbol} from user {user_id}")
    background_tasks.add_task(generate_stock_summary, stock_symbol, user_id)
    return {"message": "Summary generation started in the background."}

@app.post("/generate-report")
async def generate_report(
    background_tasks: BackgroundTasks,
    stock_symbol: str = Body(..., embed=True),
    current_user: models.User = Depends(get_current_user)
):
    user_id = current_user.id
    logger.info(f"Received request to generate report for {stock_symbol} from user {user_id}")
    background_tasks.add_task(generate_and_upload_pdf_report, stock_symbol, user_id)
    return {"message": "Report generation started in the background."}











# import os
# import sys
# import io
# import logging
# import uuid
# from datetime import datetime, timezone
# from urllib.parse import unquote

# from fastapi import FastAPI, HTTPException, Depends, Body, BackgroundTasks
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import StreamingResponse
# from sqlalchemy.orm import Session
# from pydantic import BaseModel
# from dotenv import load_dotenv

# from starlette.middleware.sessions import SessionMiddleware

# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# from Auth.database import engine, Base, get_db
# from Auth import schemas, models
# from Auth.supabase_utils import upload_pdf_to_supabase, get_signed_url, supabase, SUPABASE_BUCKET
# from Auth.auth import router as auth_router, get_current_user
# from Generator.summary_generator import generate_stock_summary
# from Generator.report_generator import generate_stock_report

# load_dotenv()

# # --- Logging Configuration ---
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
# logger = logging.getLogger(__name__)

# # --- FastAPI App Initialization ---
# app = FastAPI(title="Investimate AI Backend", version="1.0.0")

# # --- Middleware Configuration ---
# app.add_middleware(
#     SessionMiddleware,
#     secret_key=os.getenv("SECRET_KEY", "a_very_secret_key_for_session_if_not_set")
# )

# # --- CORS (Cross-Origin Resource Sharing) Middleware ---
# origins = {"http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"}
# cors_origins_env = os.getenv("CORS_ORIGINS")
# if cors_origins_env:
#     additional_origins = {origin.strip() for origin in cors_origins_env.split(",")}
#     origins.update(additional_origins)
# logger.info(f"CORS enabled for: {list(origins)}")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=list(origins),
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # --- Database Initialization ---
# try:
#     Base.metadata.create_all(bind=engine)
#     logger.info("Database tables created successfully.")
# except Exception as e:
#     logger.error(f"Database setup failed: {e}")

# # --- API Routers ---
# app.include_router(auth_router)

# # --- Pydantic Models ---
# class StockRequest(BaseModel):
#     stock_name: str
#     filename: str | None = None

# # --- In-memory storage for background job results ---
# job_results = {}

# # --- Helper Functions ---
# def normalize_storage_path(path: str) -> str:
#     if not path: return ""
#     return path.replace('\\', '/').lstrip('./').lstrip('/')

# # --- Background Task Functions ---
# def run_summary_generation(job_id: str, stock_name: str):
#     """Runs the summary generation in the background."""
#     logger.info(f"--- [Job {job_id}] Starting background summary generation for {stock_name} ---")
#     try:
#         summary_data = generate_stock_summary(stock_name)
#         job_results[job_id] = {"status": "completed", "data": summary_data}
#         logger.info(f"--- [Job {job_id}] Finished background summary generation ---")
#     except Exception as e:
#         logger.error(f"--- [Job {job_id}] Background summary generation failed: {e} ---", exc_info=True)
#         job_results[job_id] = {"status": "failed", "error": str(e)}

# def run_report_generation(job_id: str, stock_name: str):
#     """Runs the PDF report generation in the background."""
#     logger.info(f"--- [Job {job_id}] Starting background report generation for {stock_name} ---")
#     try:
#         raw_storage_path, actual_filename = generate_stock_report(stock_name)
#         if not raw_storage_path:
#             raise Exception("PDF file was not generated by the report generator.")
        
#         storage_path = normalize_storage_path(raw_storage_path)
#         upload_pdf_to_supabase(raw_storage_path)
#         signed_url = get_signed_url(storage_path)
#         if not signed_url:
#             raise Exception("Could not generate signed URL for the report.")
        
#         result_data = {
#             "msg": "PDF report generated", 
#             "signed_url": signed_url, 
#             "storage_path": storage_path, 
#             "filename": actual_filename
#         }
#         job_results[job_id] = {"status": "completed", "data": result_data}
#         logger.info(f"--- [Job {job_id}] Finished background report generation ---")
#     except Exception as e:
#         logger.error(f"--- [Job {job_id}] Background report generation failed: {e} ---", exc_info=True)
#         job_results[job_id] = {"status": "failed", "error": str(e)}

# # --- Application Endpoints ---

# @app.post("/generate-summary", tags=["Analysis"])
# def generate_summary_async(req: StockRequest, background_tasks: BackgroundTasks):
#     """Starts the summary job and returns a job ID."""
#     job_id = str(uuid.uuid4())
#     job_results[job_id] = {"status": "processing"}
#     background_tasks.add_task(run_summary_generation, job_id, req.stock_name)
#     return {"message": "Summary generation started", "job_id": job_id}

# @app.get("/summary-status/{job_id}", tags=["Analysis"])
# def get_summary_status(job_id: str):
#     """Polls for the status of a summary generation job."""
#     result = job_results.get(job_id)
#     if not result:
#         raise HTTPException(status_code=404, detail="Job not found")
#     return result

# @app.post("/generate-report", tags=["Analysis"])
# async def generate_report_async(req: StockRequest, background_tasks: BackgroundTasks):
#     """Starts the report generation job and returns a job ID."""
#     job_id = str(uuid.uuid4())
#     job_results[job_id] = {"status": "processing"}
#     background_tasks.add_task(run_report_generation, job_id, req.stock_name)
#     return {"message": "Report generation started", "job_id": job_id}

# @app.get("/report-status/{job_id}", tags=["Analysis"])
# def get_report_status(job_id: str):
#     """Polls for the status of a report generation job."""
#     result = job_results.get(job_id)
#     if not result:
#         raise HTTPException(status_code=404, detail="Job not found")
#     return result

# @app.get("/preview-pdf", tags=["Reports"])
# async def preview_pdf(storage_path: str):
#     decoded_path = unquote(storage_path)
#     normalized_path = normalize_storage_path(decoded_path)
#     res = supabase.storage.from_(SUPABASE_BUCKET).download(normalized_path)
#     filename = os.path.basename(normalized_path)
#     return StreamingResponse(io.BytesIO(res), media_type="application/pdf", headers={"Content-Disposition": f"inline; filename={filename}"})

# @app.post("/save-report", tags=["Reports"])
# async def save_report(
#     req: StockRequest = Body(...), 
#     db: Session = Depends(get_db),
#     user: schemas.UserOut = Depends(get_current_user)
# ):
#     if not req.filename:
#         raise HTTPException(status_code=400, detail="Filename is required")
#     storage_path = f"reports/{req.filename}"
#     existing = db.query(models.UserReport).filter_by(user_id=user.id, filename=req.filename).first()
#     if existing:
#         return {"msg": "Report already saved", "id": existing.id}
#     report = models.UserReport(user_id=user.id, filename=req.filename, filepath=storage_path)
#     db.add(report)
#     db.commit()
#     db.refresh(report)
#     return {"msg": "Report saved to library", "id": report.id}

# @app.get("/my-reports", tags=["Reports"])
# async def list_my_reports(
#     db: Session = Depends(get_db),
#     user: schemas.UserOut = Depends(get_current_user)
# ):
#     reports = db.query(models.UserReport).filter(models.UserReport.user_id == user.id).all()
#     return [{"id": r.id, "filename": r.filename, "created_at": r.created_at} for r in reports]

# @app.delete("/delete-report/{report_id}", tags=["Reports"])
# async def delete_report(
#     report_id: int, 
#     db: Session = Depends(get_db),
#     user: schemas.UserOut = Depends(get_current_user)
# ):
#     report = db.query(models.UserReport).filter_by(id=report_id, user_id=user.id).first()
#     if not report:
#         raise HTTPException(status_code=404, detail="Report not found")
#     db.delete(report)
#     db.commit()
#     return {"msg": "Report deleted"}

# @app.get("/", tags=["Health"])
# async def root():
#     return {"message": "Investimate AI Backend API is running"}

# @app.get("/health", tags=["Health"])
# async def health_check():
#     return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}




