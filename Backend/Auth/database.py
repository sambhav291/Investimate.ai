from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

load_dotenv()
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Debug: Print database URL (without password for security)
if SQLALCHEMY_DATABASE_URL:
    # Hide password in logs
    safe_url = SQLALCHEMY_DATABASE_URL.replace(":Investimate_291@", ":****@")
    print(f"Database URL loaded: {safe_url}")
else:
    print("ERROR: DATABASE_URL environment variable not found!")
    # Fallback to a default connection (this will fail but with a clearer error)
    SQLALCHEMY_DATABASE_URL = "postgresql://user:pass@localhost:5432/db"

# Production database configuration with connection pooling
try:
    # Check if the URL already contains connection parameters
    if SQLALCHEMY_DATABASE_URL and "?" in SQLALCHEMY_DATABASE_URL:
        # URL already has parameters, don't add connect_args
        engine = create_engine(
            SQLALCHEMY_DATABASE_URL,
            pool_size=10,
            max_overflow=20,
            pool_pre_ping=True,
            pool_recycle=3600,  # Recycle connections after 1 hour
        )
    else:
        # URL doesn't have parameters, add them via connect_args
        engine = create_engine(
            SQLALCHEMY_DATABASE_URL,
            pool_size=10,
            max_overflow=20,
            pool_pre_ping=True,
            pool_recycle=3600,  # Recycle connections after 1 hour
            connect_args={
                "sslmode": "require",
                "options": "-c timezone=utc"
            } if "postgres" in SQLALCHEMY_DATABASE_URL else {}
        )
    print("Database engine created successfully")
except Exception as e:
    print(f"ERROR creating database engine: {e}")
    # Create a fallback SQLite engine
    engine = create_engine("sqlite:///./fallback.db")
    print("Using fallback SQLite database")

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()