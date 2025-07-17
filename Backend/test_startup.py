#!/usr/bin/env python3
"""
Test script to debug startup issues
"""
import os
import sys
import traceback
from dotenv import load_dotenv

print("=== STARTUP TEST ===")
print(f"Python version: {sys.version}")
print(f"Working directory: {os.getcwd()}")

try:
    print("Loading environment variables...")
    load_dotenv()
    
    print("Checking environment variables...")
    print(f"DATABASE_URL: {bool(os.getenv('DATABASE_URL'))}")
    print(f"GOOGLE_CLIENT_ID: {bool(os.getenv('GOOGLE_CLIENT_ID'))}")
    print(f"GOOGLE_CLIENT_SECRET: {bool(os.getenv('GOOGLE_CLIENT_SECRET'))}")
    
    print("Testing database connection...")
    from Auth.database import engine
    from sqlalchemy import text
    
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("✅ Database connection successful")
    
    print("Testing FastAPI imports...")
    from fastapi import FastAPI
    print("✅ FastAPI imports successful")
    
    print("Testing authentication imports...")
    from Auth import auth, services, models
    print("✅ Auth imports successful")
    
    print("=== ALL TESTS PASSED ===")
    
except Exception as e:
    print(f"❌ ERROR: {e}")
    print(f"Error type: {type(e).__name__}")
    traceback.print_exc()
    sys.exit(1)
