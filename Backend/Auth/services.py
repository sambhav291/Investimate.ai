from sqlalchemy.orm import Session
from .database import Base, engine, SessionLocal

from . import models, auth, schemas

def create_database_tables():
    return Base.metadata.create_all(bind = engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_user_by_email(email: str, db: Session):
    return db.query(models.User).filter(models.User.email == email).first()

async def  create_user(user: schemas.UserCreate, db: Session):
    hashed = auth.hash_password(user.password)
    new_user = models.User(
        username = user.username,
        email = user.email,
        hashed_password = hashed)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

async def create_user_google(user_info, db: Session):
    # user_info: dict from Google (contains 'email', 'name', 'picture', etc.)
    user = models.User(
        email=user_info['email'],
        name=user_info.get('name', ''),
        profile_pic=user_info.get('picture', ''),
        is_google_account=True  
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


    