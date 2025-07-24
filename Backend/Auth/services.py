from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from . import models, auth, schemas
from .database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_user_by_email(email: str, db: Session):
    return db.query(models.User).filter(models.User.email == email).first()

async def create_user(user_data: schemas.UserCreate, db: Session, is_oauth: bool = False):
    hashed_password = None
    if not is_oauth:
        if not user_data.password:
            raise ValueError("Password is required for non-OAuth user creation.")
        hashed_password = auth.hash_password(user_data.password)

    db_user = models.User(
        email=user_data.email,
        full_name=user_data.full_name,
        username=user_data.username or user_data.email,
        profile_pic=user_data.profile_pic,
        hashed_password=hashed_password,
        is_oauth_user=is_oauth
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/signup", response_model=schemas.Token, tags=["User Services"])
async def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = await get_user_by_email(user.email, db)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User with this email already exists.")
    
    new_user = await create_user(user, db)
    return await auth.create_tokens(new_user)

@router.post("/login", response_model=schemas.Token, tags=["User Services"])
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = await auth.authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    return await auth.create_tokens(user)

@router.post("/refresh", response_model=schemas.Token, tags=["User Services"])
async def refresh_access_token(req: schemas.RefreshRequest, db: Session = Depends(get_db)):
    try:
        payload = auth.jwt.decode(req.refresh_token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token type")
        
        user_id = payload.get("sub")
        user = db.query(models.User).filter(models.User.id == int(user_id)).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
            
        return await auth.create_tokens(user)
    except auth.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except auth.JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

@router.get("/signup/me", response_model=schemas.UserOut, tags=["User Services"])
async def get_current_user_endpoint(user: schemas.UserOut = Depends(auth.get_current_user_dependency())):
    return user

@router.post("/logout", tags=["User Services"])
async def logout_user():
    response = JSONResponse(content={"message": "Logged out successfully"})
    response.delete_cookie(key="access_token_cookie")
    response.delete_cookie(key="refresh_token_cookie")
    return response

@router.post("/token/from-cookie", response_model=schemas.Token, tags=["User Services"])
async def get_token_from_cookie(request: Request, db: Session = Depends(get_db)):
    user = auth.get_current_user(request, db)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated via cookie")
    
    db_user = await get_user_by_email(user.email, db)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found in database")

    return await auth.create_tokens(db_user)




# from sqlalchemy.orm import Session
# from .database import Base, engine, SessionLocal

# from . import models, auth, schemas

# def create_database_tables():
#     return Base.metadata.create_all(bind = engine)

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     except Exception as e:
#         print(f"Database session error: {e}")
#         db.rollback()
#         raise
#     finally:
#         db.close()

# async def get_user_by_email(email: str, db: Session):
#     try:
#         return db.query(models.User).filter(models.User.email == email).first()
#     except Exception as e:
#         print(f"Error getting user by email: {e}")
#         return None

# async def  create_user(user: schemas.UserCreate, db: Session):
#     try:
#         hashed = auth.hash_password(user.password)
#         new_user = models.User(
#             username = user.username,
#             email = user.email,
#             name = user.username,  # Set name field to username
#             hashed_password = hashed,
#             is_google_account = False
#         )
#         db.add(new_user)
#         db.commit()
#         db.refresh(new_user)
#         return new_user
#     except Exception as e:
#         print(f"Error creating user: {e}")
#         db.rollback()
#         raise

# async def create_user_google(user_info, db: Session):
#     try:
#         new_user = models.User(
#             username = user_info.get('name', user_info.get('email', 'Unknown')),
#             email = user_info['email'],
#             name = user_info.get('name', user_info.get('email', 'Unknown')),  # Set name field
#             profile_pic = user_info.get('picture', ''),
#             is_google_account = True
#         )
#         db.add(new_user)
#         db.commit()
#         db.refresh(new_user)
#         return new_user
#     except Exception as e:
#         print(f"Error creating Google user: {e}")
#         db.rollback()
#         raise


    