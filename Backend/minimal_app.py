#!/usr/bin/env python3
"""
Minimal FastAPI app for Azure Windows App Service
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import sys
import json
import logging
from datetime import datetime

# Configure logging for Windows
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("investimate-minimal")

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
        
@app.get("/system")
async def system_info():
    """System information endpoint"""
    import platform
    
    # Get environment variables (excluding sensitive ones)
    env_vars = {}
    for key in os.environ:
        if not any(sensitive in key.lower() for sensitive in ["key", "secret", "password", "token", "pwd"]):
            env_vars[key] = os.environ[key]
    
    return {
        "python_version": sys.version,
        "platform": platform.platform(),
        "directory": os.getcwd(),
        "contents": os.listdir("."),
        "environment_variables": env_vars,
        "sys_path": sys.path
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
        import pkg_resources
        import platform
        
        # Check what packages are available
        packages = {}
        test_packages = ['fastapi', 'uvicorn', 'pydantic', 'sqlalchemy', 'supabase', 
                          'authlib', 'python-jose', 'python-dotenv', 'httptools']
        
        for pkg in test_packages:
            try:
                spec = importlib.util.find_spec(pkg)
                if spec is not None:
                    try:
                        version = pkg_resources.get_distribution(pkg).version
                        packages[pkg] = f"v{version}"
                    except:
                        packages[pkg] = "available (version unknown)"
                else:
                    packages[pkg] = "missing"
            except Exception as e:
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
