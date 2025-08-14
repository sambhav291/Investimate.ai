#!/usr/bin/env python3
"""
Database initialization script that creates tables safely.
This script handles existing tables gracefully.
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_database_url():
    """Get database URL from environment variables."""
    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        logger.error("DATABASE_URL environment variable not set")
        return None
    return db_url

def create_tables_safely(engine):
    """Create tables using safe SQL that doesn't fail if tables exist."""
    
    # SQL commands that are safe to run multiple times
    safe_sql_commands = [
        # Create users table if not exists
        """
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR UNIQUE,
            email VARCHAR UNIQUE NOT NULL,
            hashed_password VARCHAR,
            name VARCHAR,
            profile_pic VARCHAR,
            is_google_account BOOLEAN DEFAULT FALSE
        );
        """,
        
        # Create indexes for users table
        """
        CREATE INDEX IF NOT EXISTS ix_users_id ON users (id);
        """,
        """
        CREATE INDEX IF NOT EXISTS ix_users_username ON users (username);
        """,
        """
        CREATE INDEX IF NOT EXISTS ix_users_email ON users (email);
        """,
        
        # Create user_reports table if not exists
        """
        CREATE TABLE IF NOT EXISTS user_reports (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            filename VARCHAR NOT NULL,
            filepath VARCHAR NOT NULL,
            file_size INTEGER,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        """,
        
        # Create index for user_reports table
        """
        CREATE INDEX IF NOT EXISTS ix_user_reports_id ON user_reports (id);
        """,
        
        # Create jobs table if not exists
        """
        CREATE TABLE IF NOT EXISTS jobs (
            id VARCHAR PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            status VARCHAR DEFAULT 'processing',
            result JSON,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        """,
        
        # Create index for jobs table
        """
        CREATE INDEX IF NOT EXISTS ix_jobs_id ON jobs (id);
        """
    ]
    
    with engine.connect() as connection:
        with connection.begin():
            for sql_command in safe_sql_commands:
                try:
                    logger.info(f"Executing: {sql_command.strip()[:50]}...")
                    connection.execute(text(sql_command))
                    logger.info("✓ Success")
                except SQLAlchemyError as e:
                    logger.warning(f"Command failed (this may be expected): {e}")
                    continue

def main():
    """Main function to initialize database."""
    logger.info("Starting database initialization...")
    
    # Get database URL
    db_url = get_database_url()
    if not db_url:
        logger.error("Cannot proceed without DATABASE_URL")
        sys.exit(1)
    
    try:
        # Create engine
        engine = create_engine(db_url)
        logger.info("✓ Database engine created successfully")
        
        # Test connection
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        logger.info("✓ Database connection successful")
        
        # Create tables safely
        create_tables_safely(engine)
        logger.info("✓ Database tables initialized successfully")
        
        logger.info("Database initialization completed successfully!")
        
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
