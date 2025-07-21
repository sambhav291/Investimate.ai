#!/bin/bash
# Startup script for Azure App Service (Linux)

echo "=== Starting FastAPI application ==="
date
echo "Python version: $(python --version)"
echo "Pip version: $(pip --version)"

# Set working directory
cd /home/site/wwwroot
echo "Working directory: $(pwd)"

# List files to verify deployment
echo "Files in current directory:"
ls -la

# Upgrade pip and install dependencies
echo "=== Installing dependencies ==="
python -m pip install --upgrade pip

# Install from requirements.txt if it exists
if [ -f "requirements.txt" ]; then
    echo "Found requirements.txt, installing..."
    cat requirements.txt
    python -m pip install -r requirements.txt --no-cache-dir --user
    if [ $? -eq 0 ]; then
        echo "✅ Requirements installation completed successfully"
    else
        echo "❌ Requirements installation failed, trying without --user flag..."
        python -m pip install -r requirements.txt --no-cache-dir
    fi
elif [ -f "requirements_frozen.txt" ]; then
    echo "Found requirements_frozen.txt, installing..."
    python -m pip install -r requirements_frozen.txt --no-cache-dir --user || python -m pip install -r requirements_frozen.txt --no-cache-dir
else
    echo "No requirements file found, installing essential packages..."
    python -m pip install fastapi uvicorn pydantic python-multipart python-jose passlib bcrypt python-dotenv sqlalchemy --user
fi

# Verify FastAPI installation
echo "=== Verifying installations ==="
python -c "import fastapi; print(f'✅ FastAPI {fastapi.__version__} is available')" || {
    echo "❌ FastAPI not found, installing..."
    python -m pip install fastapi uvicorn
}

# Verify other critical dependencies
python -c "import uvicorn; print('✅ Uvicorn is available')" || echo "❌ Uvicorn not available"
python -c "import pydantic; print('✅ Pydantic is available')" || echo "❌ Pydantic not available"

# Check if application file exists
if [ -f "application.py" ]; then
    echo "✅ application.py found"
else
    echo "❌ application.py not found!"
    echo "Available Python files:"
    find . -name "*.py" | head -5
fi

# Set default port if not provided
export PORT=${PORT:-8000}
echo "Starting application on port $PORT"

# Start the application with uvicorn
echo "=== Starting application with uvicorn ==="
exec python -m uvicorn application:app --host 0.0.0.0 --port $PORT --log-level info
