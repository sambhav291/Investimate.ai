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
# pip install -r requirements.txt
pip install --no-cache-dir -r requirements.txt
if [ $? -eq 0 ]; then
    echo "✅ Python requirements installed successfully."
else
    # This part is crucial. If pip install fails, the script will exit.
    echo "❌ FATAL: Python requirements installation failed. Exiting."
    exit 1
fi


# --- STEP 4: Start the Gunicorn Server ---
echo "--- STEP 4: Starting application with Gunicorn ---"
# gunicorn -w 1 -k uvicorn.workers.UvicornWorker main:app --timeout 600 --bind 0.0.0.0:8000 --log-level info
gunicorn -w 2 --threads 4 -k uvicorn.workers.UvicornWorker main:app --timeout 600 --bind 0.0.0.0:8000 --log-level info
