# Azure App Service startup configuration
import os
import sys

# Add the current directory to path to ensure all modules are found
sys.path.insert(0, os.path.dirname(__file__))

# Import the main FastAPI application
from main import app as application

# The app object is needed for Azure App Service
app = application

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("application:app", host="0.0.0.0", port=port, log_level="info")
