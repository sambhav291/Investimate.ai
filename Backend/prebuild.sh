#!/bin/bash

# Pre-build script for Azure App Service
echo "=== Starting pre-build script ==="

# Use system Python instead of Oryx Python
export PATH="/usr/bin:/bin:$PATH"

# Install pip if not available
if ! command -v pip &> /dev/null; then
    echo "Installing pip..."
    python3 -m ensurepip --upgrade
fi

# Install dependencies
echo "Installing Python dependencies..."
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt

echo "=== Pre-build completed successfully ==="
