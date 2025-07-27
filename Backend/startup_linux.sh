#!/bin/bash
# Production startup script for Azure App Service (Linux)
# This script handles system dependencies, Python packages, and application startup

set -e  # Exit on any error

echo "=== Starting Investimate Backend Deployment ==="
date
echo "Python version: $(python --version)"
echo "Pip version: $(pip --version)"
echo "Current user: $(whoami)"
echo "Working directory: $(pwd)"

# Set working directory to the deployment location
cd /home/site/wwwroot
echo "Deployment directory contents:"
ls -la

echo "=== Installing System Dependencies ==="
# Install system packages required for Selenium and WeasyPrint
# Using apt-get with proper error handling for Azure App Service environment
export DEBIAN_FRONTEND=noninteractive

# Update package lists
if apt-get update; then
    echo "✅ Package lists updated successfully"
else
    echo "⚠️ Package list update failed, continuing..."
fi

# Install essential system packages
echo "Installing system dependencies..."
apt-get install -y --no-install-recommends \
    chromium \
    chromium-driver \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xvfb \
    libgconf-2-4 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fontconfig \
    fonts-dejavu-core \
    libfontconfig1 \
    libfreetype6 \
    2>/dev/null || {
    echo "⚠️ Some system packages failed to install, trying alternative approach..."
    # Fallback: install only critical packages
    apt-get install -y chromium fonts-liberation || echo "⚠️ Minimal system dependencies installation failed"
}

# Verify Chromium installation
if command -v chromium >/dev/null 2>&1; then
    echo "✅ Chromium installed successfully"
    chromium --version || echo "⚠️ Chromium version check failed"
elif command -v chromium-browser >/dev/null 2>&1; then
    echo "✅ Chromium-browser installed successfully"
    # Create symlink for consistent access
    ln -sf /usr/bin/chromium-browser /usr/bin/chromium 2>/dev/null || true
else
    echo "❌ Chromium installation failed - web scraping features may not work"
fi

echo "=== Installing Python Dependencies ==="
# Upgrade pip to latest version
python -m pip install --upgrade pip --no-cache-dir

# Install Python packages with proper error handling
if [ -f "requirements.txt" ]; then
    echo "Installing from requirements.txt..."
    echo "Requirements file contents:"
    head -20 requirements.txt
    
    # Install with retry logic
    for attempt in 1 2 3; do
        echo "Installation attempt $attempt..."
        if python -m pip install -r requirements.txt --no-cache-dir --timeout 300; then
            echo "✅ Requirements installed successfully on attempt $attempt"
            break
        else
            echo "❌ Installation attempt $attempt failed"
            if [ $attempt -eq 3 ]; then
                echo "❌ All installation attempts failed"
                exit 1
            fi
            echo "Retrying in 5 seconds..."
            sleep 5
        fi
    done
elif [ -f "requirements_frozen.txt" ]; then
    echo "Installing from requirements_frozen.txt..."
    python -m pip install -r requirements_frozen.txt --no-cache-dir --timeout 300
else
    echo "❌ No requirements file found!"
    echo "Installing minimal dependencies..."
    python -m pip install fastapi uvicorn pydantic python-multipart --no-cache-dir
fi

echo "=== Verifying Critical Dependencies ==="
# Verify essential packages are installed
python -c "import fastapi; print(f'✅ FastAPI {fastapi.__version__}')" || {
    echo "❌ FastAPI not found - installing..."
    python -m pip install fastapi
}

python -c "import uvicorn; print(f'✅ Uvicorn available')" || {
    echo "❌ Uvicorn not found - installing..."
    python -m pip install uvicorn
}

python -c "import pydantic; print(f'✅ Pydantic available')" || {
    echo "❌ Pydantic not found - installing..."
    python -m pip install pydantic
}

# Verify application files exist
echo "=== Application File Verification ==="
required_files=("application.py" "main.py")
app_file=""

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ Found $file"
        app_file="$file"
        break
    fi
done

if [ -z "$app_file" ]; then
    echo "❌ No application entry point found!"
    echo "Available Python files:"
    find . -name "*.py" -type f | head -10
    exit 1
fi

echo "=== Database Migration ==="
# Run database migrations if Alembic is available
if [ -f "alembic.ini" ] && python -c "import alembic" 2>/dev/null; then
    echo "Running database migrations..."
    if python -m alembic upgrade head 2>/dev/null; then
        echo "✅ Database migrations completed"
    else
        echo "⚠️ Database migration failed or not needed"
    fi
else
    echo "⚠️ Alembic not available - skipping migrations"
fi

echo "=== Environment Configuration ==="
# Set default environment variables
export PORT=${PORT:-8000}
export PYTHONPATH="/home/site/wwwroot:$PYTHONPATH"
export PYTHONUNBUFFERED=1

# Display non-sensitive environment info
echo "Environment: ${ENVIRONMENT:-production}"
echo "Port: $PORT"
echo "Python path: $PYTHONPATH"

# Verify database connectivity if URL is provided
if [ -n "$DATABASE_URL" ]; then
    echo "Database URL configured: ${DATABASE_URL:0:50}..."
    python -c "
import os
from urllib.parse import urlparse
try:
    url = urlparse(os.getenv('DATABASE_URL'))
    print(f'Database host: {url.hostname}')
    print(f'Database port: {url.port}')
    print('✅ Database URL parsed successfully')
except Exception as e:
    print(f'⚠️ Database URL parsing failed: {e}')
" 2>/dev/null || echo "⚠️ Database URL verification failed"
else
    echo "⚠️ DATABASE_URL not configured"
fi

echo "=== Starting Application ==="
echo "Starting FastAPI application on port $PORT..."
echo "Application file: $app_file"
echo "Command: python -m uvicorn application:app --host 0.0.0.0 --port $PORT --log-level info"

# Start the application with proper error handling
exec python -m uvicorn application:app \
    --host 0.0.0.0 \
    --port "$PORT" \
    --log-level info \
    --access-log \
    --no-use-colors \
    --timeout-keep-alive 65





# #!/bin/bash
# # Startup script for Azure App Service (Linux)   

# echo "=== Starting FastAPI application ==="
# date
# echo "Python version: $(python --version)"
# echo "Pip version: $(pip --version)"


# echo "=== Installing system dependencies for Chrome ==="
# apt-get update
# # Try installing 'chromium' first, which is the more common name now.
# apt-get install -y chromium
# # If that fails, try the older 'chromium-browser' name as a fallback.
# if [ $? -ne 0 ]; then
#     echo "--- 'chromium' not found, trying 'chromium-browser' ---"
#     apt-get install -y chromium-browser
# fi

# if [ -f "/usr/bin/chromium" ] || [ -f "/usr/bin/chromium-browser" ]; then
#     echo "✅ System dependencies for Chrome installed successfully."
# else
#     echo "❌ Failed to install system dependencies for Chrome. Scraping will likely fail."
# fi


# # Set working directory
# cd /home/site/wwwroot
# echo "Working directory: $(pwd)"

# # List files to verify deployment
# echo "Files in current directory:"
# ls -la

# # Upgrade pip and install dependencies
# echo "=== Installing Python dependencies ==="
# python -m pip install --upgrade pip

# # Install from requirements.txt if it exists
# if [ -f "requirements.txt" ]; then
#     echo "Found requirements.txt, installing..."
#     cat requirements.txt
#     python -m pip install -r requirements.txt --no-cache-dir --user
#     if [ $? -eq 0 ]; then
#         echo "✅ Requirements installation completed successfully"
#     else
#         echo "❌ Requirements installation failed, trying without --user flag..."
#         python -m pip install -r requirements.txt --no-cache-dir
#     fi
# elif [ -f "requirements_frozen.txt" ]; then
#     echo "Found requirements_frozen.txt, installing..."
#     python -m pip install -r requirements_frozen.txt --no-cache-dir --user || python -m pip install -r requirements_frozen.txt --no-cache-dir
# else
#     echo "No requirements file found, installing essential packages..."
#     python -m pip install fastapi uvicorn pydantic python-multipart python-jose passlib bcrypt python-dotenv sqlalchemy --user
# fi

# # Verify FastAPI installation
# echo "=== Verifying installations ==="
# python -c "import fastapi; print(f'✅ FastAPI {fastapi.__version__} is available')" || {
#     echo "❌ FastAPI not found, installing..."
#     python -m pip install fastapi uvicorn
# }

# # Verify other critical dependencies
# python -c "import uvicorn; print('✅ Uvicorn is available')" || echo "❌ Uvicorn not available"
# python -c "import pydantic; print('✅ Pydantic is available')" || echo "❌ Pydantic not available"

# # Check if application file exists
# if [ -f "application.py" ]; then
#     echo "✅ application.py found"
# else
#     echo "❌ application.py not found!"
#     echo "Available Python files:"
#     find . -name "*.py" | head -5
# fi

# # Add database connectivity diagnostics
# echo "=== Database Connection Diagnostics ==="
# if [ -n "$DATABASE_URL" ]; then
#     echo "Database URL configured: ${DATABASE_URL:0:30}..."
#     # Extract host and port for connectivity test
#     DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\):.*/\1/p')
#     DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    
#     echo "Testing network connectivity to database..."
#     echo "Host: $DB_HOST"
#     echo "Port: $DB_PORT"
    
#     # Test basic connectivity
#     if command -v nc >/dev/null 2>&1; then
#         if nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; then
#             echo "✅ Network connectivity to database: OK"
#         else
#             echo "❌ Network connectivity to database: FAILED"
#             echo "This may be due to firewall or network restrictions"
#         fi
#     else
#         echo "⚠️ netcat not available for connectivity test"
#     fi
# else
#     echo "❌ DATABASE_URL environment variable not set"
# fi

# # Set default port if not provided
# export PORT=${PORT:-8000}
# echo "Starting application on port $PORT"

# # Start the application with uvicorn
# echo "=== Starting application with uvicorn ==="
# exec python -m uvicorn application:app --host 0.0.0.0 --port $PORT --log-level info




# _____________________________________________________________________________
