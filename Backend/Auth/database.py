import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# --- Load Environment Variables ---
# This ensures that the .env file in the same directory is loaded.
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

# Load variables from the root .env file as a fallback
load_dotenv() 

# --- Database URL Configuration ---
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
    print("CRITICAL ERROR: DATABASE_URL environment variable not found!")
    # Use a fallback in-memory SQLite database to prevent crashing on import,
    # but the application will not function correctly.
    SQLALCHEMY_DATABASE_URL = "sqlite:///./fallback.db"

# --- Database Engine Setup ---
try:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        # Recommended settings for production databases like PostgreSQL
        pool_pre_ping=True,  # Checks if connections are alive before use
        connect_args={"connect_timeout": 30}
    )
    print("Database engine created successfully.")
except Exception as e:
    print(f"ERROR creating database engine: {e}")
    print("Using fallback SQLite database due to error.")
    engine = create_engine(
        "sqlite:///./error_fallback.db",
        connect_args={"check_same_thread": False} # Required for SQLite
    )

# --- Session and Base ---
# SessionLocal is the factory for creating new database sessions.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base is the class your ORM models will inherit from.
Base = declarative_base()


# --- Dependency Function ---
def get_db():
    """
    FastAPI dependency to get a database session.
    This function creates a new session for each request and ensures it's
    closed afterward, even if an error occurs.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()






# import os
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, declarative_base
# from dotenv import load_dotenv

# # --- Load Environment Variables ---
# # This ensures that the .env file in the same directory is loaded.
# dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
# if os.path.exists(dotenv_path):
#     load_dotenv(dotenv_path)

# # Load variables from the root .env file as a fallback
# load_dotenv() 

# # --- Database URL Configuration ---
# SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# if not SQLALCHEMY_DATABASE_URL:
#     print("CRITICAL ERROR: DATABASE_URL environment variable not found!")
#     # Use a fallback in-memory SQLite database to prevent crashing on import,
#     # but the application will not function correctly.
#     SQLALCHEMY_DATABASE_URL = "sqlite:///./fallback.db"

# # --- Database Engine Setup ---
# try:
#     engine = create_engine(
#         SQLALCHEMY_DATABASE_URL,
#         # Recommended settings for production databases like PostgreSQL
#         pool_pre_ping=True,  # Checks if connections are alive before use
#         connect_args={"connect_timeout": 30}
#     )
#     print("Database engine created successfully.")
# except Exception as e:
#     print(f"ERROR creating database engine: {e}")
#     print("Using fallback SQLite database due to error.")
#     engine = create_engine(
#         "sqlite:///./error_fallback.db",
#         connect_args={"check_same_thread": False} # Required for SQLite
#     )

# # --- Session and Base ---
# # SessionLocal is the factory for creating new database sessions.
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# # Base is the class your ORM models will inherit from.
# Base = declarative_base()


# # --- Dependency Function ---
# def get_db():
#     """
#     FastAPI dependency to get a database session.
#     This function creates a new session for each request and ensures it's
#     closed afterward, even if an error occurs.
#     """
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()
