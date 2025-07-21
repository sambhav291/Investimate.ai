#!/bin/bash

# Azure App Service startup script for FastAPI
echo "Starting FastAPI application deployment process..."
echo "Current working directory: $(pwd)"
echo "Directory contents: $(ls -la)"

# Navigate to the app directory
cd /home/site/wwwroot
echo "Changed to /home/site/wwwroot"
echo "Directory contents: $(ls -la)"

# Upgrade pip and install dependencies
echo "Installing dependencies..."
python -m pip install --upgrade pip

# Try different requirements file options
if [ -f "requirements_production.txt" ]; then
    echo "Found requirements_production.txt, installing..."
    python -m pip install --no-cache-dir -r requirements_production.txt
elif [ -f "requirements.txt" ]; then
    echo "Found requirements.txt, installing..."
    python -m pip install --no-cache-dir -r requirements.txt
else
    echo "❌ No requirements file found!"
    echo "Files in directory: $(ls -la)"
    # Install critical packages directly for minimal operation
    echo "Installing critical packages directly..."
    python -m pip install fastapi uvicorn pydantic
fi

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies!"
    echo "Python version: $(python --version)"
    echo "Pip version: $(pip --version)"
    echo "Available packages: $(pip list)"
    # Try installing minimal packages directly instead of exiting
    python -m pip install fastapi uvicorn pydantic
fi

# Test if FastAPI is installed
echo "Testing FastAPI installation..."
python -c "import fastapi; print(f'FastAPI version: {fastapi.__version__}')" || {
    echo "❌ FastAPI not installed, installing now..."
    python -m pip install fastapi uvicorn
}

# Test if uvicorn is installed
echo "Testing uvicorn installation..."
python -c "import uvicorn; print(f'Uvicorn version: {uvicorn.__version__}')" || {
    echo "❌ Uvicorn not installed, installing now..."
    python -m pip install uvicorn
}

# Test minimal app first, which is our fallback option
if [ -f "minimal_app.py" ]; then
    echo "Testing minimal_app.py import..."
    python -c "import minimal_app; print('✅ minimal_app imported successfully')" && USE_MINIMAL_APP=true || {
        echo "❌ Failed to import minimal_app.py"
        USE_MINIMAL_APP=false
    }
fi

# Test application.py import
echo "Testing application.py import..."
python -c "import sys; print('Python path:', sys.path); import application; print('✅ Application imported successfully')" && USE_APPLICATION=true || {
    echo "❌ Failed to import application.py"
    USE_APPLICATION=false
}

# Start the appropriate application
if [ "$USE_APPLICATION" = "true" ]; then
    echo "Starting FastAPI application with application.py..."
    exec python -m uvicorn application:app --host 0.0.0.0 --port ${PORT:-8000} --log-level info
elif [ "$USE_MINIMAL_APP" = "true" ]; then
    echo "Falling back to minimal_app.py..."
    exec python -m uvicorn minimal_app:app --host 0.0.0.0 --port ${PORT:-8000} --log-level info
else
    echo "❌ No valid application entry point found. Creating emergency app..."
    # Create an emergency minimal FastAPI app that will respond to health checks
    cat > emergency_app.py << 'EOL'
from fastapi import FastAPI
app = FastAPI()
@app.get("/")
def read_root():
    return {"status": "online", "message": "Emergency minimal app running - deployment issue detected"}
@app.get("/health")
def health():
    return {"status": "ok"}
EOL
    echo "Starting emergency app..."
    exec python -m uvicorn emergency_app:app --host 0.0.0.0 --port ${PORT:-8000} --log-level info
fi
