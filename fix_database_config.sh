#!/bin/bash
# Azure App Service Configuration Update Script

echo "=== Updating Azure App Service Database Configuration ==="

# Your correct connection string (direct connection)
CORRECT_DATABASE_URL="postgresql://postgres:Investimate_291@db.fryuuxrvtkijmxsrmytt.supabase.co:5432/postgres?sslmode=require"

echo "Setting DATABASE_URL to use port 5432 (direct connection)..."
echo "Connection string: postgresql://postgres:****@db.fryuuxrvtkijmxsrmytt.supabase.co:5432/postgres?sslmode=require"

# Update Azure App Service configuration
# Replace 'investimate-backend' and 'your-resource-group' with your actual values
az webapp config appsettings set \
  --name "investimate-backend-ceddryhrfnbpdpg4-centralindia-01" \
  --resource-group "your-resource-group-name" \
  --settings DATABASE_URL="$CORRECT_DATABASE_URL"

if [ $? -eq 0 ]; then
    echo "✅ Database URL updated successfully"
    
    # Restart the app to apply changes
    echo "Restarting App Service..."
    az webapp restart \
      --name "investimate-backend-ceddryhrfnbpdpg4-centralindia-01" \
      --resource-group "your-resource-group-name"
    
    if [ $? -eq 0 ]; then
        echo "✅ App Service restarted successfully"
        echo "🎉 Database configuration fix complete!"
        echo ""
        echo "Next steps:"
        echo "1. Wait 2-3 minutes for the app to fully restart"
        echo "2. Check the logs for database connection status"
        echo "3. Look for '✅ Network connectivity to database: OK' in the logs"
    else
        echo "❌ Failed to restart App Service"
    fi
else
    echo "❌ Failed to update database configuration"
    echo "Please update manually in Azure Portal:"
    echo "1. Go to Azure Portal → App Service → Configuration"
    echo "2. Update DATABASE_URL to: $CORRECT_DATABASE_URL"
    echo "3. Save and restart the app"
fi
