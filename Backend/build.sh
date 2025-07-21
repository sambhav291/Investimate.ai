#!/bin/bash
set -e

echo "Starting build process..."

# Check Python version
python --version
echo "Python version check completed"

# Update system packages
apt-get update

# Install system dependencies for Chrome (for Selenium)
apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils

# Install Chrome
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list
apt-get update
apt-get install -y google-chrome-stable

# Upgrade pip and install dependencies
pip install --upgrade pip wheel setuptools

# Install PyTorch CPU-only first to avoid large download
echo "Installing PyTorch CPU-only..."
pip install torch --index-url https://download.pytorch.org/whl/cpu --no-cache-dir --force-reinstall

# Install minimal dependencies to avoid conflicts
echo "Installing minimal dependencies..."
pip install -r requirements.txt --no-cache-dir --force-reinstall

# Create database tables
echo "Setting up database..."
python -c "
import os
import sys
try:
    from sqlalchemy import create_engine
    from Auth.models import Base
    
    # Create database tables
    database_url = os.getenv('DATABASE_URL')
    if database_url:
        engine = create_engine(database_url)
        Base.metadata.create_all(engine)
        print('Database tables created successfully!')
    else:
        print('DATABASE_URL not found, skipping database setup')
except Exception as e:
    print(f'Database setup error: {e}')
    # Don't fail the build for database issues
"

echo "Build completed successfully!"
