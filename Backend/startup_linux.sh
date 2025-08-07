#!/bin/bash

echo "--- Startup script initiated ---"
date

# --- STEP 1: Change to the correct application directory ---
cd /home/site/wwwroot/Backend/
echo "✅ Changed working directory to: $(pwd)"

# --- STEP 2: Install System Dependencies for PDF Generation ---
echo "--- STEP 2: Installing system dependencies ---"
apt-get update -y && apt-get install -y \
    chromium \
    chromium-driver \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libxss1 \
    libgconf-2-4 \
    libxtst6 \
    libxrender1 \
    libpangocairo-1.0-0 \
    libatk1.0-0 \
    libcairo-gobject2 \
    libgtk-3-0 \
    libgdk-pixbuf2.0-0 \
    libharfbuzz0b \
    libfribidi0 \
    fontconfig \
    --no-install-recommends

if [ $? -eq 0 ]; then
    echo "✅ System dependencies installed successfully."
    # Verify Chromium installation
    which chromium || which chromium-driver || echo "⚠️ Chromium or driver not found in PATH"
else
    echo "❌ System dependency installation failed."
    exit 1
fi

# --- STEP 3: Install Python Packages with optimization ---
echo "--- STEP 3: Installing Python dependencies from requirements.txt ---"
pip install --upgrade pip


# Use --no-cache-dir to avoid filling up disk
pip install --no-cache-dir -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Python requirements installed successfully."
else
    echo "❌ FATAL: Python requirements installation failed. Exiting."
    exit 1
fi

# --- STEP 4: Set Chrome/Chromium path for Selenium ---
export CHROME_BIN="/usr/bin/chromium"
export CHROMIUM_BIN="/usr/bin/chromium"

# --- STEP 5: Start the Gunicorn Server ---
echo "--- STEP 5: Starting application with Gunicorn ---"
gunicorn -w 1 --threads 2 -k uvicorn.workers.UvicornWorker main:app \
    --timeout 600 \
    --bind 0.0.0.0:8000 \
    --log-level info \
    --max-requests 1000 \
    --max-requests-jitter 100





# #!/bin/bash

# echo "--- Startup script initiated ---"
# date

# # --- STEP 1: Change to the correct application directory ---
# cd /home/site/wwwroot/Backend/
# echo "✅ Changed working directory to: $(pwd)"


# # --- STEP 2: Install System Dependencies for Chrome AND WeasyPrint ---
# echo "--- STEP 2: Installing system dependencies ---"
# apt-get update -y && apt-get install -y \
#     chromium \
#     libpangocairo-1.0-0 \
#     libharfbuzz0b \
#     libfribidi0 \
#     fontconfig

# if [ $? -eq 0 ]; then
#     echo "✅ System dependencies installed successfully."
# else
#     echo "❌ System dependency installation failed."
# fi


# # --- STEP 3: Install Python Packages ---
# echo "--- STEP 3: Installing Python dependencies from requirements.txt ---"
# pip install --upgrade pip
# # pip install -r requirements.txt
# pip install --no-cache-dir -r requirements.txt
# if [ $? -eq 0 ]; then
#     echo "✅ Python requirements installed successfully."
# else
#     # This part is crucial. If pip install fails, the script will exit.
#     echo "❌ FATAL: Python requirements installation failed. Exiting."
#     exit 1
# fi


# # --- STEP 4: Start the Gunicorn Server ---
# echo "--- STEP 4: Starting application with Gunicorn ---"
# # gunicorn -w 1 -k uvicorn.workers.UvicornWorker main:app --timeout 600 --bind 0.0.0.0:8000 --log-level info
# gunicorn -w 2 --threads 4 -k uvicorn.workers.UvicornWorker main:app --timeout 600 --bind 0.0.0.0:8000 --log-level info


