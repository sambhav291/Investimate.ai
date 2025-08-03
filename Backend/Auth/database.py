from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)
load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Global variables - will be initialized later
engine = None
SessionLocal = None
Base = declarative_base()

def init_database():
    """Initialize database connection lazily"""
    global engine, SessionLocal
    
    if engine is not None:
        return engine
    
    logger.info("Initializing database connection...")
    
    if not SQLALCHEMY_DATABASE_URL:
        logger.error("DATABASE_URL environment variable not found!")
        # Use SQLite fallback
        engine = create_engine(
            "sqlite:///./fallback.db", 
            echo=False,
            connect_args={"check_same_thread": False}
        )
        SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
        return engine
    
    try:
        # Fix URL format
        database_url = SQLALCHEMY_DATABASE_URL
        if database_url.startswith("postgres://"):
            database_url = database_url.replace("postgres://", "postgresql://", 1)
        
        # Handle special format for Supabase/hosted databases
        if "postgres.fryuuxrvtkijmxsrmytt:" in database_url:
            database_url = database_url.replace("postgres.fryuuxrvtkijmxsrmytt:", "postgres:")
        
        # Create engine with optimized settings for cloud deployment
        engine = create_engine(
            database_url,
            pool_size=1,
            max_overflow=0,
            pool_pre_ping=True,
            pool_recycle=1800,  # 30 minutes
            echo=False,
            connect_args={
                "connect_timeout": 10,
                "application_name": "investimate-backend",
                "options": "-c REDACTED-GOOGLE-CLIENT-SECRETation=read_committed"
            },
            pool_reset_on_return='commit'
        )
        
        SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
        logger.info("Database engine created successfully")
        
        # Test connection
        with engine.connect() as conn:
            conn.execute("SELECT 1")
            logger.info("Database connection test successful")
            
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        logger.info("Using SQLite fallback")
        engine = create_engine(
            "sqlite:///./fallback.db", 
            echo=False,
            connect_args={"check_same_thread": False}
        )
        SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
    
    return engine

# Initialize Base
Base = declarative_base()

def get_db():
    """Dependency for getting database session"""
    if engine is None:
        init_database()
    
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
