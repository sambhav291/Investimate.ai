# from fastapi import FastAPI, HTTPException, Depends, Body, Request, status
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import StreamingResponse, RedirectResponse, JSONResponse
# from authlib.integrations.starlette_client import OAuth
# from starlette.middleware.sessions import SessionMiddleware
# from starlette.config import Config
# from sqlalchemy.orm import Session
# from pydantic import BaseModel
# from jose import jwt
# from dotenv import load_dotenv
# import os
# import sys
# import io
# from datetime import datetime, timedelta, timezone

# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
# from Generator.summary_generator import generate_stock_summary
# from Generator.report_generator import generate_stock_report
# from Auth.database import engine, Base
# from Auth import schemas, auth, services, models
# from fastapi.security import OAuth2PasswordRequestForm
# from Auth.supabase_utils import upload_pdf_to_supabase, get_signed_url


# load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

# GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
# GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

# Base.metadata.create_all(bind=engine)
# app = FastAPI()

# app.add_middleware( 
#     SessionMiddleware,
#     secret_key="md384503mr4rm59*r89x#mim@m9"
# )

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# config = Config(environ={
#     "GOOGLE_CLIENT_ID": GOOGLE_CLIENT_ID,
#     "GOOGLE_CLIENT_SECRET": GOOGLE_CLIENT_SECRET,
# })

# oauth = OAuth(config)
# oauth.register(
#     name='google',
#     client_id = GOOGLE_CLIENT_ID,
#     client_secret = GOOGLE_CLIENT_SECRET,
#     server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
#     client_kwargs={
#         'scope': 'openid email profile'
#     }
# )
 

# class StockRequest(BaseModel):
#     stock_name: str

# class RefreshRequest(BaseModel):
#     refresh_token: str


# @app.get("/auth/google/login")
# async def google_login(request: Request):
#     redirect_uri = "http://localhost:8000/auth/google/callback"
#     return await oauth.google.authorize_redirect(request, redirect_uri)
 

# @app.get("/auth/google/callback")
# async def google_callback(request: Request, db: Session = Depends(services.get_db)):
#     token = await oauth.google.authorize_access_token(request)
#     user_info = token.get("userinfo")
#     if not user_info:
#         user_info = jwt.get_unverified_claims(token["id_token"])

#     user = await services.get_user_by_email(user_info['email'], db)
#     if not user:
#         user = await services.create_user_google(user_info, db)
#     else:
#         if user.profile_pic != user_info.get('picture', ''):
#             user.profile_pic = user_info.get('picture', '')
#             db.commit()
#             db.refresh(user)

#     jwt_token = await auth.create_tokens(user)
#     response = RedirectResponse("http://localhost:5173/")
#     response.set_cookie(
#         key="access_token",
#         value=jwt_token["access_token"],
#         httponly=True,
#         secure=False,  # Set to True in production with HTTPS
#         samesite="lax",  # Or "none" if using cross-site cookies with HTTPS
#         max_age=60*60*24*7,
#         path="/"
#     )
#     response.set_cookie(
#         key="refresh_token",
#         value=jwt_token["refresh_token"],
#         httponly=True,
#         secure=False,
#         samesite="lax",
#         max_age=60*60*24*7,
#         path="/"
#     )
#     return response


# @app.post("/signup", response_model=schemas.UserOut)
# async def register(
#     user: schemas.UserCreate, db: Session = Depends(services.get_db)
# ):
#     existing = await services.get_user_by_email(user.email, db)
#     if existing:
#         raise HTTPException(status_code=400, detail="User already exists")
    
#     new_user = await services.create_user(user, db)
#     return await auth.create_tokens(new_user)


# import logging

# # Set up logging at the top of your file
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# @app.post("/login")
# async def login(
#     form_data: OAuth2PasswordRequestForm = Depends(),
#     db: Session = Depends(services.get_db)
# ):
#     logger.info("=== LOGIN ENDPOINT CALLED ===")
#     logger.info(f"Username attempting login: {form_data.username}")
    
#     try:
#         db_user = await auth.authenticate_user(form_data.username, form_data.password, db)
#         logger.info(f"Authentication result: {'Success' if db_user else 'Failed'}")
        
#         if not db_user:
#             logger.error("Authentication failed - invalid credentials")
#             raise HTTPException(status_code=401, detail="Invalid credentials")
        
#         logger.info(f"User authenticated successfully: ID={db_user.id}, Email={getattr(db_user, 'email', 'N/A')}")
        
#         # Create tokens
#         logger.info("Creating tokens...")
#         tokens = await auth.create_tokens(db_user)
#         logger.info(f"Tokens created successfully")
#         logger.info(f"Access token (first 30 chars): {tokens['access_token'][:30]}...")
#         logger.info(f"Refresh token (first 30 chars): {tokens['refresh_token'][:30]}...")
        
#         # Decode and log the access token payload for verification
#         try:
#             import jwt
#             import os
#             payload = jwt.decode(
#                 tokens["access_token"], 
#                 os.getenv("SECRET_KEY"), 
#                 algorithms=[os.getenv("ALGORITHM", "HS256")]
#             )
#             logger.info(f"Access token payload: {payload}")
#         except Exception as e:
#             logger.error(f"Failed to decode created access token: {e}")
        
#         # Create response
#         response = JSONResponse(content={
#             "access_token": tokens["access_token"],
#             "refresh_token": tokens["refresh_token"],
#             "token_type": "bearer"
#         })
#         logger.info("JSONResponse created")
        
#         # Set cookies
#         logger.info("Setting access_token cookie...")
#         response.set_cookie(
#             key="access_token",
#             value=tokens["access_token"],
#             httponly=True,
#             secure=False,  # True in production with HTTPS
#             samesite="lax",
#             max_age=60*60*24*7,
#             path="/",
#         )
#         logger.info("Access token cookie set")
        
#         logger.info("Setting refresh_token cookie...")
#         response.set_cookie(
#             key="refresh_token",
#             value=tokens["refresh_token"],
#             httponly=True,
#             secure=False,
#             samesite="lax",
#             max_age=60*60*24*7,
#             path="/",
#         )
#         logger.info("Refresh token cookie set")
#         logger.info("=== LOGIN SUCCESS ===")
        
#         return response
        
#     except HTTPException as e:
#         logger.error(f"HTTP Exception in login: {e.detail}")
#         raise
#     except Exception as e:
#         logger.error(f"Unexpected error in login: {e}")
#         raise HTTPException(status_code=500, detail="Internal server error")

# @app.post("/refresh")
# async def refresh_token(
#     req: RefreshRequest,
#     db: Session = Depends(services.get_db)
# ):
#     logger.info("=== REFRESH ENDPOINT CALLED ===")
#     logger.info(f"Refresh token received (first 30 chars): {req.refresh_token[:30]}...")
    
#     try:
#         logger.info("Attempting to decode refresh token...")
#         payload = jwt.decode(
#             req.refresh_token,
#             os.getenv("SECRET_KEY"),
#             algorithms=[os.getenv("ALGORITHM", "HS256")]
#         )
#         logger.info(f"Refresh token payload decoded: {payload}")
        
#         if payload.get("type") != "refresh":
#             logger.error(f"Invalid token type: {payload.get('type')}")
#             raise HTTPException(status_code=401, detail="Invalid refresh token")
        
#         user_id = payload.get("sub")
#         logger.info(f"User ID from refresh token: {user_id}")
        
#         if not user_id:
#             logger.error("No 'sub' field in refresh token payload")
#             raise HTTPException(status_code=401, detail="Invalid token payload")
        
#         logger.info(f"Querying database for user ID: {user_id}")
#         user = db.query(models.User).filter(models.User.id == int(user_id)).first()
        
#         if not user:
#             logger.error(f"User not found in database for ID: {user_id}")
#             raise HTTPException(status_code=401, detail="User not found")
        
#         logger.info(f"User found: ID={user.id}, Email={getattr(user, 'email', 'N/A')}")
        
#         # Create new tokens
#         logger.info("Creating new tokens...")
#         tokens = await auth.create_tokens(user)
#         logger.info("New tokens created successfully")
#         logger.info(f"New access token (first 30 chars): {tokens['access_token'][:30]}...")
#         logger.info(f"New refresh token (first 30 chars): {tokens['refresh_token'][:30]}...")
        
#         # Verify new access token
#         try:
#             new_payload = jwt.decode(
#                 tokens["access_token"], 
#                 os.getenv("SECRET_KEY"), 
#                 algorithms=[os.getenv("ALGORITHM", "HS256")]
#             )
#             logger.info(f"New access token payload: {new_payload}")
#         except Exception as e:
#             logger.error(f"Failed to decode new access token: {e}")
        
#         response = JSONResponse(content={
#             "access_token": tokens["access_token"],
#             "refresh_token": tokens["refresh_token"],
#             "token_type": "bearer"
#         })
        
#         logger.info("Setting new access_token cookie...")
#         response.set_cookie(
#             key="access_token",
#             value=tokens["access_token"], 
#             httponly=True,
#             secure=False,
#             samesite="lax",
#             max_age=60*60*24*7,
#             path="/",
#         )
        
#         logger.info("Setting new refresh_token cookie...")
#         response.set_cookie(
#             key="refresh_token",
#             value=tokens["refresh_token"],
#             httponly=True,
#             secure=False,
#             samesite="lax",
#             max_age=60*60*24*7,
#             path="/",
#         )
        
#         logger.info("=== REFRESH SUCCESS ===")
#         return response
        
#     except ExpiredSignatureError as e:
#         logger.error(f"Refresh token expired: {e}")
#         raise HTTPException(status_code=401, detail="Token expired")
#     except JWTError as e:
#         logger.error(f"JWT error in refresh: {e}")
#         raise HTTPException(status_code=401, detail="Invalid token")
#     except HTTPException as e:
#         logger.error(f"HTTP Exception in refresh: {e.detail}")
#         raise
#     except Exception as e:
#         logger.error(f"Unexpected error in refresh: {e}")
#         raise HTTPException(status_code=401, detail="Invalid refresh token")

# # @app.post("/login")
# # async def login(
# #     form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(services.get_db)
# # ):
# #     db_user = await auth.authenticate_user(form_data.username, form_data.password, db)
# #     if not db_user:
# #         raise HTTPException(status_code=401, detail="Invalid credentials")
# #     jwt_token = await auth.create_tokens(db_user)
# #     response = JSONResponse(content={
# #         "access_token": jwt_token["access_token"],
# #         "refresh_token": jwt_token["refresh_token"],
# #         "token_type": "bearer"
# #     })
# #     response.set_cookie(
# #         key="access_token",
# #         value=jwt_token["access_token"],
# #         httponly=True,
# #         secure=False,  # True in production
# #         samesite="lax",
# #         max_age=60*60*24*7,
# #         path="/"
# #         domain = "localhost"
# #     )
# #     response.set_cookie(
# #         key="refresh_token",
# #         value=jwt_token["refresh_token"],
# #         httponly=True,
# #         secure=False,
# #         samesite="lax",
# #         max_age=60*60*24*7,
# #         path="/",
# #         domain = "localhost"
# #     )
# #     return response





# # @app.post("/refresh")
# # async def refresh_token(
# #     req: RefreshRequest,
# #     db: Session = Depends(services.get_db)
# #     response: Response = None
# # ):
# #     refresh_token = req.refresh_token
# #     try:
# #         payload = jwt.decode(refresh_token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
# #         if payload.get("type") != "refresh":
# #             raise HTTPException(status_code=401, detail="Invalid refresh token")
# #         user_id = int(payload.get("sub"))
# #         user = db.query(models.User).get(user_id)
# #         if not user:
# #             raise HTTPException(status_code=401, detail="User not found")
# #         # Issue new access token
# #         user_obj = schemas.UserOut.model_validate(user)
# #         to_encode = user_obj.model_dump().copy()
# #         expire = datetime.now(timezone.utc) + timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")))
# #         to_encode.update({"exp": expire})
# #         access_token = jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))
# #         response = JSONResponse(content={"access_token": access_token, "token_type": "bearer"})
# #         response.set_cookie(
# #             key="access_token",
# #             value=access_token,
# #             httponly=True,
# #             secure=False,  # True in production
# #             samesite="lax",
# #             max_age=60*60*24*7,
# #             path="/",
# #             domain = "localhost"
# #         )
# #         return response
# #     except Exception:
# #         raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    


# @app.get("/signup/me")
# async def get_user(
#     user: schemas.UserLogin = Depends(auth.get_current_user)
# ):
#     return user

# @app.post("/generate-summary")
# def generate_summary(req: StockRequest):
#     return generate_stock_summary(req.stock_name)

# # @app.post("/generate-report")
# # async def generate_report(
# #     req: StockRequest,
# # ):
# #     storage_path = generate_stock_report(req.stock_name)
# #     if not storage_path:
# #         raise HTTPException(status_code=500, detail="PDF file was not generated successfully")

# #     signed_url = get_signed_url(storage_path)
# #     if not signed_url:
# #         raise HTTPException(status_code=500, detail="Could not generate Signed URL for PDF")
    
# #     return {
# #         "msg": "PDF report generated successfully",
# #         "signed_url": signed_url,
# #         "storage_path": storage_path  
# #     }

# @app.post("/generate-report")
# async def generate_report(req: StockRequest):
#     print(f"[API] Generating report for: {req.stock_name}")
#     storage_path = generate_stock_report(req.stock_name)
#     if not storage_path:
#         print("[API] PDF file was not generated successfully")
#         raise HTTPException(status_code=500, detail="PDF file was not generated successfully")
#     signed_url = get_signed_url(storage_path)
#     if not signed_url:  
#         print("[API] Could not generate signed URL for PDF")
#         raise HTTPException(status_code=500, detail="Could not generate signed URL for PDF.")
#     print(f"[API] Returning signed URL: {signed_url}")
#     return {
#         "msg": "PDF report generated successfully",
#         "signed_url": signed_url,
#         "storage_path": storage_path
#     }

# @app.get("/preview-pdf")
# async def preview_pdf(
#     storage_path: str,
#     download: int = 0,
#     user: schemas.UserOut = Depends(auth.get_current_user)
# ):
#     try:
#         res = supabase.storage.from_(SUPABASE_BUCKET).download(storage_path)
#         disposition = "attachment" if download else "inline"
#         return StreamingResponse(
#             io.BytesIO(res),
#             media_type="application/pdf",
#             headers={"Content-Disposition": f"{disposition}; filename={os.path.basename(storage_path)}"}
#         )
#     except Exception as e:
#         print(f"[ERROR] Proxy PDF failed: {e}")
#         raise HTTPException(status_code=404, detail="PDF not found")
    
    
# @app.post("/save-report")
# async def save_report(
#     req: StockRequest = Body(...),
#     db: Session = Depends(services.get_db),
#     user: schemas.UserOut = Depends(auth.get_current_user)
# ):
#     safe_name = req.stock_name.replace(' ', '_')
#     storage_path = f"{safe_name}_report.pdf"

#     existing = db.query(models.UserReport).filter_by(
#         user_id=user.id,
#         filename=f"{safe_name}_report.pdf"
#     ).first()
#     if existing:
#         return {"msg": "Report already saved", "id": existing.id}

#     report = models.UserReport(
#         user_id=user.id,
#         filename=f"{safe_name}_report.pdf",
#         filepath=storage_path
#     )
#     db.add(report)
#     db.commit()
#     db.refresh(report)
#     return {"msg": "Report saved to library", "id": report.id}

# @app.get("/get-report-url/{report_id}")
# async def get_report_url(
#     report_id: int,
#     db: Session = Depends(services.get_db),
#     user: schemas.UserOut = Depends(auth.get_current_user)
# ):
#     report = db.query(models.UserReport).filter_by(id=report_id, user_id=user.id).first()
#     if not report:
#         raise HTTPException(status_code=404, detail="Report not found")
#     signed_url = get_signed_url(report.filepath)
#     return {"signed_url": signed_url}


# @app.get("/my-reports")
# async def list_my_reports(
#     db: Session = Depends(services.get_db),
#     user: schemas.UserOut = Depends(auth.get_current_user)
# ):
#     reports = db.query(models.UserReport).filter(models.UserReport.user_id == user.id).all()
#     return [
#         {"id": r.id, "filename": r.filename, "created_at": r.created_at}
#         for r in reports
#     ]

# @app.get("/my-reports/{report_id}")
# async def get_report_info(
#     report_id: int,
#     db: Session = Depends(services.get_db),
#     user: schemas.UserOut = Depends(auth.get_current_user)
# ):
#     report = db.query(models.UserReport).filter(
#         models.UserReport.id == report_id, models.UserReport.user_id == user.id
#     ).first()
#     if not report:
#         raise HTTPException(status_code=404, detail="Report not found")
#     return {
#         "filepath": report.filepath,  
#         "filename": report.filename
#     }

# # @app.get("/preview-pdf")
# # async def preview_pdf(storage_path: str, user: schemas.UserOut = Depends(auth.get_current_user)):
# #     try:
# #         res = supabase.storage.from_(SUPABASE_BUCKET).download(storage_path)
# #         return StreamingResponse(
# #             io.BytesIO(res),
# #             media_type="application/pdf",
# #             headers={"Content-Disposition": f"inline; filename={os.path.basename(storage_path)}"}
# #         )
# #     except Exception as e:
# #         print(f"[ERROR] Proxy PDF failed: {e}")
# #         raise HTTPException(status_code=404, detail="PDF not found")

# @app.delete("/delete-report/{report_id}")
# async def delete_report(
#     report_id: int,
#     db: Session = Depends(services.get_db),
#     user: schemas.UserOut = Depends(auth.get_current_user)
# ):
#     report = db.query(models.UserReport).filter(
#         models.UserReport.id == report_id, models.UserReport.user_id == user.id
#     ).first()
#     if not report:
#         raise HTTPException(status_code=404, detail="Report not found")
#     db.delete(report)
#     db.commit()
#     return {"msg": "Report deleted"}



 