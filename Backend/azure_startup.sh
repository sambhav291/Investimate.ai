#!/bin/bash

# Azure optimized startup script with enhanced error handling and timeouts
echo "=== Starting Azure App Service deployment at $(date) ==="

# Set error handling
set -e
set -o pipefail

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function to handle errors
error_exit() {
    log "ERROR: $1"
    exit 1
}

# Create a simple health check endpoint first
log "Setting up temporary health check..."
cat > /tmp/simple_health.py << 'EOF'
from fastapi import FastAPI
import uvicorn
import os

app = FastAPI()

@app.get("/health")
async def health():
    return {"status": "installing", "message": "Dependencies are being installed"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port, timeout_keep_alive=0)
EOF

# Start background health check server
log "Starting temporary health check server on port 8000..."
nohup python3 /tmp/simple_health.py > /tmp/health.log 2>&1 &
HEALTH_PID=$!
log "Health check server started with PID: $HEALTH_PID"

# Give Azure something to ping while we install dependencies
sleep 5

# Install dependencies in background
log "Starting dependency installation..."
{
    # Upgrade pip first
    python3 -m pip install --upgrade pip --timeout=300 || error_exit "Failed to upgrade pip"
    
    # Install in groups to avoid memory issues
    log "Installing core web framework packages..."
    python3 -m pip install fastapi uvicorn pydantic sqlalchemy alembic --timeout=300 || error_exit "Failed to install core packages"
    
    log "Installing authentication packages..."
    python3 -m pip install python-multipart python-jose[cryptography] passlib[bcrypt] authlib itsdangerous email-validator --timeout=300 || error_exit "Failed to install auth packages"
    
    log "Installing database and utilities..."
    python3 -m pip install psycopg2-binary python-dotenv requests certifi --timeout=300 || error_exit "Failed to install database packages"
    
    log "Installing Google packages..."
    python3 -m pip install google-generativeai REDACTED-GOOGLE-CLIENT-SECRET google-auth --timeout=300 || error_exit "Failed to install Google packages"
    
    log "Installing Supabase packages..."
    python3 -m pip install supabase storage3 --timeout=300 || error_exit "Failed to install Supabase packages"
    
    log "Installing data processing packages..."
    python3 -m pip install pandas numpy pypdf --timeout=300 || error_exit "Failed to install data packages"
    
    log "Installing web scraping packages..."
    python3 -m pip install selenium webdriver-manager beautifulsoup4 lxml --timeout=300 || error_exit "Failed to install scraping packages"
    
    # Install remaining packages with longer timeout for ML packages
    log "Installing AI/ML packages (this may take longer)..."
    python3 -m pip install openai nltk --timeout=600 || error_exit "Failed to install AI packages"
    
    # Install heavy ML packages last with very long timeout
    log "Installing torch and transformers (this will take several minutes)..."
    python3 -m pip install torch transformers huggingface-hub --timeout=900 || error_exit "Failed to install ML packages"
    
    log "All dependencies installed successfully!"
    echo "DEPS_INSTALLED=true" > /tmp/install_status
} &

INSTALL_PID=$!
log "Dependency installation started with PID: $INSTALL_PID"

# Wait for installation to complete with periodic status updates
WAIT_COUNT=0
while kill -0 $INSTALL_PID 2>/dev/null; do
    WAIT_COUNT=$((WAIT_COUNT + 1))
    if [ $WAIT_COUNT -eq 30 ]; then  # Every 30 seconds
        log "Still installing dependencies... (elapsed: $((WAIT_COUNT * 1)) seconds)"
        WAIT_COUNT=0
    fi
    sleep 1
done

# Check if installation was successful
if [ -f /tmp/install_status ] && grep -q "DEPS_INSTALLED=true" /tmp/install_status; then
    log "Dependencies installation completed successfully!"
else
    error_exit "Dependencies installation failed!"
fi

# Stop the temporary health check
log "Stopping temporary health check server..."
kill $HEALTH_PID 2>/dev/null || true

# Wait a moment for the port to be freed
sleep 3

# Start the actual application
log "Starting main application..."
export PYTHONPATH="${PYTHONPATH}:/home/site/wwwroot/Backend"
cd /home/site/wwwroot/Backend

# Start with single worker to reduce memory usage during startup
log "Launching uvicorn server..."
exec python3 -m uvicorn main:app \
    --host 0.0.0.0 \
    --port 8000 \
    --timeout-keep-alive 0 \
    --workers 1 \
    --access-log \
    --log-level info \
    --loop asyncio

log "=== Startup script completed ==="
