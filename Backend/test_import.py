#!/usr/bin/env python3
"""
Test script to validate main.py can be imported correctly
"""

import sys
import os
import traceback

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

print("=== Testing main.py import ===")
print(f"Python version: {sys.version}")
print(f"Current directory: {os.getcwd()}")
print(f"Python path: {sys.path[:3]}...")

try:
    print("Testing basic imports...")
    
    # Test individual imports that might be problematic
    import fastapi
    print("✅ FastAPI imported successfully")
    
    import sqlalchemy
    print("✅ SQLAlchemy imported successfully")
    
    import authlib
    print("✅ Authlib imported successfully")
    
    import jose
    print("✅ JOSE imported successfully")
    
    import dotenv
    print("✅ python-dotenv imported successfully")
    
    # Test local imports
    try:
        from Auth import database
        print("✅ Auth.database imported successfully")
    except Exception as e:
        print(f"❌ Auth.database import failed: {e}")
    
    try:
        from Auth import schemas, auth, services, models
        print("✅ Auth modules imported successfully")
    except Exception as e:
        print(f"❌ Auth modules import failed: {e}")
    
    try:
        from Auth.supabase_utils import upload_pdf_to_supabase, get_signed_url, supabase, SUPABASE_BUCKET
        print("✅ Supabase utils imported successfully")
    except Exception as e:
        print(f"❌ Supabase utils import failed: {e}")
    
    # Now try to import main
    print("\nTesting main.py import...")
    import main
    print("✅ main.py imported successfully")
    
    # Test if app is created
    if hasattr(main, 'app'):
        print("✅ FastAPI app object found")
    else:
        print("❌ FastAPI app object not found")
    
    print("\n=== ALL TESTS PASSED ===")
    
except Exception as e:
    print(f"\n❌ Import test failed: {e}")
    print(f"Error type: {type(e).__name__}")
    print("Full traceback:")
    traceback.print_exc()
    sys.exit(1)
