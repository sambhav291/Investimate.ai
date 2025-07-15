#!/bin/bash
set -e

echo "Starting build process..."

# Update system packages
apt-get update

# Install system dependencies for PyMuPDF
apt-get install -y \
    build-essential \
    libmupdf-dev \
    libfreetype6-dev \
    libjpeg-dev \
    libopenjp2-7-dev \
    libffi-dev \
    pkg-config

# Upgrade pip and install wheel
pip install --upgrade pip wheel setuptools

# Try to install PyMuPDF with pre-compiled wheel first
echo "Installing PyMuPDF..."
pip install --no-cache-dir --only-binary=all PyMuPDF==1.23.8 PyMuPDFb==1.23.8 || {
    echo "Pre-compiled wheel failed, trying alternative approach..."
    # If that fails, try without compiling from source
    pip install --no-cache-dir --prefer-binary PyMuPDF==1.23.8 PyMuPDFb==1.23.8
}

# Install other dependencies
echo "Installing other dependencies..."
pip install -r requirements.txt

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
