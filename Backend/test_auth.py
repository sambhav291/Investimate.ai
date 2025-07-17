#!/usr/bin/env python3
"""
Test script to validate authentication fixes
"""
import os
import sys
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the backend directory to the path
sys.path.append(os.path.dirname(__file__))

from Auth.database import engine, Base
from Auth import models, services, auth, schemas
from sqlalchemy.orm import Session

async def test_database_connection():
    """Test database connection"""
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Database connection successful")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

async def test_user_creation():
    """Test user creation"""
    try:
        # Create tables
        Base.metadata.create_all(bind=engine)
        
        # Test user creation
        from Auth.database import SessionLocal
        db = SessionLocal()
        
        # Create a test user
        test_user = schemas.UserCreate(
            username="testuser",
            email="test@example.com",
            password="testpassword123"
        )
        
        # Check if user already exists
        existing = await services.get_user_by_email(test_user.email, db)
        if existing:
            print("✅ User already exists in database")
            user = existing
        else:
            user = await services.create_user(test_user, db)
            print("✅ User created successfully")
        
        # Test token creation
        tokens = await auth.create_tokens(user)
        print("✅ Tokens created successfully")
        
        # Test authentication
        authenticated_user = await auth.authenticate_user(test_user.email, test_user.password, db)
        if authenticated_user:
            print("✅ User authentication successful")
        else:
            print("❌ User authentication failed")
            
        db.close()
        return True
        
    except Exception as e:
        print(f"❌ User creation test failed: {e}")
        return False

async def test_google_user_creation():
    """Test Google user creation"""
    try:
        from Auth.database import SessionLocal
        db = SessionLocal()
        
        # Mock Google user info
        google_user_info = {
            "email": "testgoogle@example.com",
            "name": "Test Google User",
            "picture": "https://example.com/avatar.jpg"
        }
        
        # Check if user already exists
        existing = await services.get_user_by_email(google_user_info["email"], db)
        if existing:
            print("✅ Google user already exists in database")
            user = existing
        else:
            user = await services.create_user_google(google_user_info, db)
            print("✅ Google user created successfully")
        
        # Test token creation
        tokens = await auth.create_tokens(user)
        print("✅ Tokens created for Google user")
        
        # Verify user has correct fields
        print(f"   - User ID: {user.id}")
        print(f"   - Email: {user.email}")
        print(f"   - Name: {user.name}")
        print(f"   - Display Name: {user.display_name}")
        print(f"   - Google Account: {user.is_google_account}")
        
        db.close()
        return True
        
    except Exception as e:
        print(f"❌ Google user creation test failed: {e}")
        return False

async def main():
    """Run all tests"""
    print("🔧 Testing authentication fixes...")
    print("=" * 50)
    
    # Test database connection
    db_ok = await test_database_connection()
    if not db_ok:
        print("❌ Database connection failed. Cannot continue tests.")
        return
    
    # Test regular user creation
    print("\n📝 Testing regular user creation...")
    await test_user_creation()
    
    # Test Google user creation
    print("\n🔍 Testing Google user creation...")
    await test_google_user_creation()
    
    print("\n✅ All tests completed!")

if __name__ == "__main__":
    asyncio.run(main())
