#!/bin/bash

echo "--- Startup script initiated ---"
date

# --- STEP 1: Change to the correct application directory ---
cd /home/site/wwwroot/Backend/
echo "✅ Changed working directory to: $(pwd)"


# --- STEP 2: Install System Dependencies for Chrome AND WeasyPrint ---
echo "--- STEP 2: Installing system dependencies ---"
apt-get update -y && apt-get install -y \
    chromium \
    libpangocairo-1.0-0 \
    libharfbuzz0b \
    libfribidi0 \
    fontconfig

if [ $? -eq 0 ]; then
    echo "✅ System dependencies installed successfully."
else
    echo "❌ System dependency installation failed."
fi


# --- STEP 3: Install Python Packages ---
echo "--- STEP 3: Installing Python dependencies from requirements.txt ---"
pip install --upgrade pip
pip install -r requirements.txt
if [ $? -eq 0 ]; then
    echo "✅ Python requirements installed successfully."
else
    # This part is crucial. If pip install fails, the script will exit.
    echo "❌ FATAL: Python requirements installation failed. Exiting."
    exit 1
fi


# --- STEP 4: Start the Gunicorn Server ---
echo "--- STEP 4: Starting application with Gunicorn ---"
gunicorn -w 1 -k uvicorn.workers.UvicornWorker main:app --timeout 600 --bind 0.0.0.0:8000 --log-level info




#script without logs new one_______________________________________________________
# #!/bin/bash

# # --- STEP 1: Change to the correct directory ---
# # This is the most important step. All subsequent commands depend on this.
# cd /home/site/wwwroot/Backend/

# # --- STEP 2: Install System Dependencies (One-time setup) ---
# echo "=== Installing system dependencies for Chrome (if not already installed) ==="
# apt-get update && apt-get install -y chromium

# # --- STEP 3: Install Python Packages ---
# echo "=== Installing Python dependencies from requirements.txt ==="
# pip install --upgrade pip
# pip install -r requirements.txt

# # --- STEP 4: Start the Application ---
# echo "=== Starting application with uvicorn ==="
# uvicorn main:app --host 0.0.0.0 --port 8000 --log-level info




#old script with logs__________________________________________________________
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
# exec python -m uvicorn main:app --host 0.0.0.0 --port $PORT --log-level info


