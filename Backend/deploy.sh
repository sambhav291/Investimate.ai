#!/bin/bash
# Deployment helper script for GitHub Actions

echo "Running deploy.sh for GitHub Actions deployment..."

# Ensure pip is up to date
pip install --upgrade pip

# Install dependencies
if [ -f "requirements_production.txt" ]; then
    echo "Installing from requirements_production.txt..."
    pip install -r requirements_production.txt
else
    echo "Installing from requirements.txt..."
    pip install -r requirements.txt
fi

# Test FastAPI installation
python -c "import fastapi; print(f'FastAPI version: {fastapi.__version__}')"
echo "Dependencies installed successfully."

# Ensure correct permissions for startup script
chmod +x startup.sh
echo "Made startup.sh executable."

echo "Deploy script completed."
