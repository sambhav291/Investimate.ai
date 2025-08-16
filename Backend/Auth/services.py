from sqlalchemy.orm import Session
from . import models, schemas

def get_user_by_email(db: Session, email: str):
    """
    Fetches a single user from the database by their email address.
    """
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate, hashed_password: str | None, is_oauth: bool = False):
    """
    Creates a new user record in the database.
    """
    db_user = models.User(
        email=user.email,
        name=user.name,
        username=user.username or user.email,
        profile_pic=user.profile_pic,
        hashed_password=hashed_password,
        is_google_account=is_oauth
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_or_create_oauth_user(db: Session, user_info: schemas.UserCreate):
    """
    Finds an existing user by email. If not found, creates a new one.
    This is specifically for OAuth (Google) logins.
    """
    db_user = get_user_by_email(db, email=user_info.email)
    
    if db_user:
        return db_user

    return create_user(db=db, user=user_info, hashed_password=None, is_oauth=True)


