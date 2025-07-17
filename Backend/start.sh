#!/bin/bash

echo "=== RENDER DEPLOYMENT DEBUG ==="
echo "Environment: $ENVIRONMENT"
echo "Port: $PORT"
echo "Database URL set: $(if [ -n "$DATABASE_URL" ]; then echo "YES"; else echo "NO"; fi)"
echo "Google Client ID set: $(if [ -n "$GOOGLE_CLIENT_ID" ]; then echo "YES"; else echo "NO"; fi)"
echo "Frontend URL: $FRONTEND_URL"
echo "Redirect URI: $GOOGLE_REDIRECT_URI"
echo "Starting application..."

python -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
