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
    # Fix the database URL format for SQLAlchemy
    if SQLALCHEMY_DATABASE_URL and SQLALCHEMY_DATABASE_URL != "postgresql://user:pass@localhost:5432/db":
        # Debug: Show the exact URL structure
        print(f"Original URL: {SQLALCHEMY_DATABASE_URL}")
        
        # Convert postgres:// to postgresql:// if needed
        if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
            SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)
            print(f"Converted URL: {SQLALCHEMY_DATABASE_URL}")
        
        # Handle the specific format: postgresql://postgres.user:pass@host:port/db
        if "postgres.fryuuxrvtkijmxsrmytt:" in SQLALCHEMY_DATABASE_URL:
            # Convert to standard format
            SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres.fryuuxrvtkijmxsrmytt:", "postgres:")
            print(f"Fixed URL format: {SQLALCHEMY_DATABASE_URL}")
        
        # Create the engine with robust settings for production
        engine = create_engine(
            SQLALCHEMY_DATABASE_URL,
            pool_size=1,  # Minimal pool size for free tier
            max_overflow=0,  # No overflow
            pool_pre_ping=True,
            pool_recycle=3600,  # Recycle connections after 1 hour
            echo=False,  # Disable SQL logging
            connect_args={
                "connect_timeout": 30,
                "application_name": "investimate-backend",
                "options": "-c default_transaction_isolation=read_committed"
            },
            pool_reset_on_return='commit'  # Reset connection state
        )
        print("Database engine created successfully")
    else:
        # For missing/invalid URL, use SQLite fallback
        print("Using SQLite fallback database")
        engine = create_engine(
            "sqlite:///./fallback.db", 
            echo=False,
            connect_args={"check_same_thread": False}
        )
    
except Exception as e:
    print(f"ERROR creating database engine: {e}")
    print(f"Problematic URL: {SQLALCHEMY_DATABASE_URL}")
    # Create a fallback SQLite engine
    print("Using fallback SQLite database due to error")
    engine = create_engine(
        "sqlite:///./fallback.db", 
        echo=False,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()