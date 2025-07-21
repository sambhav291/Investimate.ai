#!/usr/bin/env python3
"""
Emergency minimal FastAPI app for Azure startup
This ensures port 8000 responds immediately while full app loads
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import sys
import json
from datetime import datetime

app = FastAPI(title="Investimate Backend", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "Investimate Backend is running",
        "timestamp": datetime.now().isoformat(),
        "environment": os.getenv("ENVIRONMENT", "production"),
        "version": "1.0.0"
    }

@app.get("/health")
async def health():
    """Health check endpoint for Azure App Service"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "uptime": "service_running",
        "dependencies": {
            "database": "checking...",
            "storage": "checking..."
        }
    }

@app.get("/status")
async def status():
    """Detailed status endpoint"""
    try:
        import importlib.util
        
        # Check what packages are available
        packages = {}
        test_packages = ['fastapi', 'uvicorn', 'pydantic', 'sqlalchemy', 'supabase']
        
        for pkg in test_packages:
            try:
                spec = importlib.util.find_spec(pkg)
                packages[pkg] = "available" if spec is not None else "missing"
            except:
                packages[pkg] = "error"
        
        return {
            "status": "operational",
            "timestamp": datetime.now().isoformat(),
            "python_version": sys.version,
            "packages": packages,
            "environment_vars": {
                "ENVIRONMENT": os.getenv("ENVIRONMENT", "not_set"),
                "PORT": os.getenv("PORT", "8000"),
                "DATABASE_URL": "present" if os.getenv("DATABASE_URL") else "missing",
                "GOOGLE_CLIENT_ID": "present" if os.getenv("GOOGLE_CLIENT_ID") else "missing"
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    
    print(f"Starting minimal FastAPI server on port {port}")
    print(f"Environment: {os.getenv('ENVIRONMENT', 'production')}")
    print(f"Python version: {sys.version}")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        access_log=True,
        log_level="info"
    )
