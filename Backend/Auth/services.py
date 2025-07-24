from sqlalchemy.orm import Session
from . import models, schemas

# ✅ FIX: Removed 'async' as SQLAlchemy ORM calls are synchronous.

def get_user_by_email(email: str, db: Session):
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
        full_name=user.full_name,
        username=user.username or user.email, # Fallback username to email
        profile_pic=user.profile_pic,
        hashed_password=hashed_password,
        is_oauth_user=is_oauth
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user



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


    