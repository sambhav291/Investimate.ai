#!/bin/bash

echo "=== RENDER DEPLOYMENT DEBUG ==="
echo "Environment: $ENVIRONMENT"
echo "Port: $PORT"
echo "Current directory: $(pwd)"
echo "Python version: $(python --version)"
echo "Database URL set: $(if [ -n "$DATABASE_URL" ]; then echo "YES"; else echo "NO"; fi)"
echo "Google Client ID set: $(if [ -n "$GOOGLE_CLIENT_ID" ]; then echo "YES"; else echo "NO"; fi)"
echo "Frontend URL: $FRONTEND_URL"
echo "Redirect URI: $GOOGLE_REDIRECT_URI"
echo "CORS Origins: $CORS_ORIGINS"

# Test if main.py is accessible
echo "Testing main.py import..."
python -c "import main; print('✅ main.py imported successfully')" || echo "❌ Failed to import main.py"

echo "Starting application with verbose logging..."
python -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --log-level info --access-log
