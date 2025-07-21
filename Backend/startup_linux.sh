#!/bin/bash
# Startup script for Azure App Service (Linux)

echo "Starting FastAPI application..."

# Set working directory
cd /home/site/wwwroot

# Upgrade pip and install dependencies
echo "Installing dependencies..."
python -m pip install --upgrade pip

# Install from requirements.txt if it exists
if [ -f "requirements.txt" ]; then
    echo "Installing from requirements.txt..."
    python -m pip install -r requirements.txt --no-cache-dir
else
    echo "No requirements.txt found, installing essential packages..."
    python -m pip install fastapi uvicorn pydantic python-multipart
fi

# Verify FastAPI installation
echo "Verifying FastAPI installation..."
python -c "import fastapi; print(f'FastAPI {fastapi.__version__} is available')" || {
    echo "FastAPI not found, installing..."
    python -m pip install fastapi uvicorn
}

# Start the application with uvicorn
echo "Starting application with uvicorn..."
exec python -m uvicorn application:app --host 0.0.0.0 --port $PORT
