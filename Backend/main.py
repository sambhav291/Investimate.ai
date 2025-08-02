import os
import sys
import io
import logging
import uuid
from datetime import datetime, timezone
from urllib.parse import unquote
from logging.config import dictConfig

from fastapi import FastAPI, HTTPException, Depends, Body, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from dotenv import load_dotenv
from starlette.middleware.sessions import SessionMiddleware

# Add the parent directory to the path to ensure all modules can be found
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from Auth.database import engine, Base, get_db
from Auth import schemas, models
from Auth.supabase_utils import upload_pdf_to_supabase, get_signed_url, supabase, SUPABASE_BUCKET
from Auth.auth import router as auth_router, get_current_user
from Generator.summary_generator import generate_stock_summary
from Generator.report_generator import generate_stock_report

load_dotenv()

# --- Production-Ready Logging Configuration ---
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
            "stream": "ext://sys.stdout",
        },
    },
    "root": {
        "level": "INFO",
        "handlers": ["console"],
    },
}
dictConfig(LOGGING_CONFIG)
logger = logging.getLogger(__name__)
# --- End of Logging Configuration ---


# --- Database Initialization ---
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully.")
except Exception as e:
    logger.error(f"Database setup failed: {e}")


# --- FastAPI App Initialization ---
app = FastAPI(title="Investimate AI Backend", version="1.0.0")

# --- Middleware Configuration ---
# IMPORTANT: Add SessionMiddleware for Google OAuth to work. This must come BEFORE CORS.
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SECRET_KEY", "a_very_secret_key_for_session_if_not_set")
)

# --- CORS (Cross-Origin Resource Sharing) Middleware ---
origins = [
    "http://localhost:5173",
    "https://investimate-ai-eight.vercel.app",
    "https://investimate-backend-cedqfyhyhsfpdbg4.centralindia-01.azurewebsites.net"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Routers ---
# This includes all your authentication routes (/login, /signup, /google/login, etc.)
app.include_router(auth_router)

# --- Pydantic Models ---
class StockRequest(BaseModel):
    stock_name: str
    filename: str | None = None

# --- In-memory storage for background job results (can be replaced with Redis/Celery in the future) ---
job_results = {}


# --- Helper Functions ---
def normalize_storage_path(path: str) -> str:
    if not path: return ""
    return path.replace('\\', '/').lstrip('./').lstrip('/')

# --- Background Task Functions ---
def run_summary_generation(job_id: str, stock_name: str, user_id: int):
    """Wraps the async summary generation for background tasks."""
    import asyncio
    logger.info(f"--- [Job {job_id}] Starting background summary generation for {stock_name} ---")
    try:
        summary_data = asyncio.run(generate_stock_summary(stock_name, user_id))
        job_results[job_id] = {"status": "completed", "data": summary_data}
        logger.info(f"--- [Job {job_id}] Finished background summary generation ---")
    except Exception as e:
        logger.error(f"--- [Job {job_id}] Background summary generation failed: {e} ---", exc_info=True)
        job_results[job_id] = {"status": "failed", "error": str(e)}

def run_report_generation(job_id: str, stock_name: str, user_id: int):
    """Wraps the async PDF report generation for background tasks."""
    import asyncio
    logger.info(f"--- [Job {job_id}] Starting background report generation for {stock_name} ---")
    try:
        pdf_path, filename = asyncio.run(generate_stock_report(stock_name, user_id))
        
        if not pdf_path or not filename:
            raise Exception("PDF file was not generated or filename is missing.")
        
        storage_path = f"reports/{filename}"
        upload_pdf_to_supabase(pdf_path, storage_path)
        signed_url = get_signed_url(storage_path)

        if not signed_url:
            raise Exception("Could not generate signed URL for the report.")
        
        result_data = {
            "msg": "PDF report generated", 
            "signed_url": signed_url, 
            "storage_path": storage_path, 
            "filename": filename
        }
        job_results[job_id] = {"status": "completed", "data": result_data}
        logger.info(f"--- [Job {job_id}] Finished background report generation ---")
    except Exception as e:
        logger.error(f"--- [Job {job_id}] Background report generation failed: {e} ---", exc_info=True)
        job_results[job_id] = {"status": "failed", "error": str(e)}


# --- Application Endpoints ---

@app.post("/generate-summary", tags=["Analysis"])
def generate_summary_async(
    req: StockRequest, 
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(get_current_user)
):
    job_id = str(uuid.uuid4())
    job_results[job_id] = {"status": "processing"}
    background_tasks.add_task(run_summary_generation, job_id, req.stock_name, current_user.id)
    return {"message": "Summary generation started", "job_id": job_id}

@app.get("/summary-status/{job_id}", tags=["Analysis"])
def get_summary_status(job_id: str):
    result = job_results.get(job_id)
    if not result:
        raise HTTPException(status_code=404, detail="Job not found")
    return result

@app.post("/generate-report", tags=["Analysis"])
async def generate_report_async(
    req: StockRequest,  
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(get_current_user)
):
    job_id = str(uuid.uuid4())
    job_results[job_id] = {"status": "processing"}
    background_tasks.add_task(run_report_generation, job_id, req.stock_name, current_user.id)
    return {"message": "Report generation started", "job_id": job_id}

@app.get("/report-status/{job_id}", tags=["Analysis"])
def get_report_status(job_id: str):
    result = job_results.get(job_id)
    if not result:
        raise HTTPException(status_code=404, detail="Job not found")
    return result

@app.get("/preview-pdf", tags=["Reports"])
async def preview_pdf(storage_path: str):
    decoded_path = unquote(storage_path)
    res = supabase.storage.from_(SUPABASE_BUCKET).download(decoded_path)
    filename = os.path.basename(decoded_path)
    return StreamingResponse(io.BytesIO(res), media_type="application/pdf", headers={"Content-Disposition": f"inline; filename={filename}"})

@app.post("/save-report", tags=["Reports"])
async def save_report(
    req: StockRequest = Body(...), 
    db: Session = Depends(get_db),
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
    user: schemas.UserOut = Depends(get_current_user)
):
    reports = db.query(models.UserReport).filter(models.UserReport.user_id == user.id).all()
    return [{"id": r.id, "filename": r.filename, "created_at": r.created_at} for r in reports]

@app.delete("/delete-report/{report_id}", tags=["Reports"])
async def delete_report(
    report_id: int, 
    db: Session = Depends(get_db),
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



#______________original main.py without logging_________________________



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




