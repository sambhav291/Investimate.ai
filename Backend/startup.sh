#!/bin/bash

echo "=== RENDER STARTUP SCRIPT ==="
echo "Working directory: $(pwd)"
echo "Python version: $(python --version)"
echo "Environment: $ENVIRONMENT"
echo "Port: $PORT"

# List files in current directory
echo "Files in current directory:"
ls -la

# Check if main.py exists
if [ -f "main.py" ]; then
    echo "✅ main.py found"
else
    echo "❌ main.py not found"
    exit 1
fi

# Check if we're in the Backend directory
if [ ! -f "main.py" ] && [ -d "Backend" ]; then
    echo "Changing to Backend directory..."
    cd Backend
fi

# Install any missing dependencies
echo "Installing dependencies..."
pip install --no-cache-dir -r requirements.txt

# Test basic import
echo "Testing Python import..."
python -c "import sys; print('Python path:', sys.path); import main; print('✅ main.py imported successfully')" || {
    echo "❌ Failed to import main.py"
    exit 1
}

# Start the application
echo "Starting uvicorn server..."
exec python -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --log-level info
