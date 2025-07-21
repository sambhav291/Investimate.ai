import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from sqlalchemy import text
from Auth.database import engine, Base
import logging
import os
import time

logger = logging.getLogger(__name__)

# Global variable to track database initialization
database_initialized = False
database_connected = False

async def initialize_database():
    """Initialize database connection lazily on first request"""
    global database_initialized, database_connected
    
    if database_initialized:
        return database_connected
    
    try:
        logger.info("Initializing database connection...")
        ENVIRONMENT = os.getenv("ENVIRONMENT", "production")
        max_retries = 2 if ENVIRONMENT == "production" else 1
        
        for attempt in range(max_retries):
            try:
                with engine.connect() as conn:
                    result = conn.execute(text("SELECT 1"))
                    logger.info("Database connection test successful")
                    database_connected = True
                    break
            except Exception as db_error:
                logger.warning(f"Database connection attempt {attempt + 1} failed: {db_error}")
                if attempt < max_retries - 1:
                    await asyncio.sleep(1)
                else:
                    logger.error("All database connection attempts failed")
                    logger.warning("Continuing without database connection")
        
        if database_connected:
            Base.metadata.create_all(bind=engine)
            logger.info("Database tables created successfully")
        else:
            logger.warning("Database tables not created - no connection")
            
    except Exception as e:
        logger.error(f"Database setup failed: {e}")
        logger.warning("Application will continue without database connection")
    finally:
        database_initialized = True
    
    return database_connected

@asynccontextmanager
async def lifespan(app: FastAPI):
    """FastAPI lifespan handler for background tasks"""
    # Startup
    logger.info("FastAPI application starting...")
    
    # Initialize database in background
    asyncio.create_task(initialize_database())
    
    yield
    
    # Shutdown
    logger.info("FastAPI application shutting down...")
