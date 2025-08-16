import os
import sys
import io
import logging
import uuid
import asyncio
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

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from Auth.database import engine, Base, get_db, SessionLocal
from Auth import schemas, models
from Auth.supabase_utils import supabase, SUPABASE_BUCKET
from Auth.auth import router as auth_router, get_current_user
from Generator.summary_generator import generate_stock_summary
from Generator.report_generator import generate_stock_report

load_dotenv()


# --- Logging Configuration ---
LOGGING_CONFIG = {
    "version": 1, "disable_existing_loggers": False,
    "formatters": {"default": {"format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"}},
    "handlers": {"console": {"class": "logging.StreamHandler", "formatter": "default", "stream": "ext://sys.stdout"}},
    "root": {"level": "INFO", "handlers": ["console"]},
}
dictConfig(LOGGING_CONFIG)
logger = logging.getLogger(__name__)

# --- FastAPI App Initialization ---
app = FastAPI(title="Investimate AI Backend", version="1.0.0")

# --- Middleware ---
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SECRET_KEY", "a_default_secret_key"))
origins = [
    "http://localhost:5173",
    "https://investimate-ai-eight.vercel.app",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Routers ---
app.include_router(auth_router)

# --- Pydantic Models ---
class JobRequest(BaseModel):
    company: str
    filename: str | None = None

class SaveReportRequest(BaseModel):
    stock_name: str
    filename: str

# --- Background Task Wrappers ---
def run_summary_generation(job_id: str, company_name: str, user_id: int):
    logger.info(f"--- [Job {job_id}] Starting background summary generation for {company_name} ---")

    final_status = "completed"
    result_data = None

    try:
        summary_data = asyncio.run(generate_stock_summary(company_name, user_id))
        result_data = summary_data
        logger.info(f"--- [Job {job_id}] Finished background summary generation ---")

    except Exception as e:
        logger.error(f"--- [Job {job_id}] Summary generation failed: {e} ---", exc_info=True)
        final_status = "failed"
        result_data = {"error": str(e)}

    finally:
        db = SessionLocal()
        try:
            logger.info(f"--- [Job {job_id}] FINALLY BLOCK: Attempting to update job status to '{final_status}' ---")
            job = db.query(models.Job).filter(models.Job.id == job_id).first()
            if job:
                job.status = final_status
                job.result = result_data
                db.commit()
                logger.info(f"--- [Job {job_id}] FINALLY BLOCK: Successfully committed status '{final_status}' to DB. ---")
            else:
                logger.error(f"--- [Job {job_id}] FINALLY BLOCK: Job not found in DB, could not update status. ---")
        except Exception as e:
            logger.error(f"--- [Job {job_id}] FINALLY BLOCK: An exception occurred during DB update: {e} ---", exc_info=True)
            db.rollback()
        finally:
            db.close()

def run_report_generation(job_id: str, company_name: str, user_id: int):
    logger.info(f"--- [Job {job_id}] Starting background report generation for {company_name} ---")

    final_status = "completed"
    final_result = None

    try:
        result_data = asyncio.run(generate_stock_report(company_name, user_id))
        if not result_data or "signed_url" not in result_data:
            raise Exception("Report generation failed to return a valid signed URL.")

        final_result = result_data
        logger.info(f"--- [Job {job_id}] Finished background report generation successfully ---")

    except Exception as e:
        logger.error(f"--- [Job {job_id}] Report generation failed: {e} ---", exc_info=True)
        final_status = "failed"
        final_result = {"error": str(e)}

    finally: 
        db = SessionLocal()
        try:
            logger.info(f"--- [Job {job_id}] FINALLY BLOCK: Attempting to update job status to '{final_status}' ---")
            job = db.query(models.Job).filter(models.Job.id == job_id).first()
            if job:
                job.status = final_status
                job.result = final_result
                db.commit()
                logger.info(f"--- [Job {job_id}] FINALLY BLOCK: Successfully committed status '{final_status}' to DB. ---")
            else:
                logger.error(f"--- [Job {job_id}] FINALLY BLOCK: Job not found in DB, could not update status. ---")
        except Exception as e:
            logger.error(f"--- [Job {job_id}] FINALLY BLOCK: An exception occurred during DB update: {e} ---", exc_info=True)
            db.rollback()
        finally:
            db.close()

# --- API Endpoints ---
@app.post("/generate-summary", tags=["Analysis"], status_code=202)
async def generate_summary_endpoint(
    req: JobRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    user: schemas.UserOut = Depends(get_current_user)
):
    job_id = str(uuid.uuid4())
    new_job = models.Job(id=job_id, user_id=user.id, status="processing")
    db.add(new_job)
    db.commit()

    background_tasks.add_task(run_summary_generation, job_id, req.company, user.id)
    return {"message": "Summary generation started", "job_id": job_id}

@app.post("/generate-report", tags=["Reports"], status_code=202)
async def generate_report_endpoint(
    req: JobRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    user: schemas.UserOut = Depends(get_current_user)
):
    job_id = str(uuid.uuid4())
    new_job = models.Job(id=job_id, user_id=user.id, status="processing")
    db.add(new_job)
    db.commit()

    background_tasks.add_task(run_report_generation, job_id, req.company, user.id)
    return {"message": "Report generation started.", "job_id": job_id}

@app.get("/job-status/{job_id}", tags=["Analysis", "Reports"])
async def get_job_status(
    job_id: str,
    db: Session = Depends(get_db),
    user: schemas.UserOut = Depends(get_current_user)
):
    job = db.query(models.Job).filter(models.Job.id == job_id, models.Job.user_id == user.id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    return {"status": job.status, "data": job.result}

@app.get("/preview-pdf", tags=["Reports"])
async def preview_pdf(storage_path: str):
    decoded_path = unquote(storage_path)
    res = supabase.storage.from_(SUPABASE_BUCKET).download(decoded_path)
    filename = os.path.basename(decoded_path)
    return StreamingResponse(io.BytesIO(res), media_type="application/pdf", headers={"Content-Disposition": f"inline; filename={filename}"})

@app.post("/save-report", tags=["Reports"])
async def save_report(
    # req: JobRequest = Body(...), 
    req: SaveReportRequest = Body(...),
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
    return [{"id": r.id, "filename": r.filename, "filepath": r.filepath, "created_at": r.created_at} for r in reports]

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











