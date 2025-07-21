# Azure App Service Database Connection Troubleshooting Guide

## Step 1: Verify Environment Variables in Azure Portal
1. Go to Azure Portal → Your App Service → Configuration → Application settings
2. Verify these settings exist and are correct:
   - `DATABASE_URL`: Should be your complete Supabase connection string
   - Check if the connection string uses port 5432 or 6543

## Step 2: Update Supabase Network Settings
1. Go to Supabase Dashboard → Your Project → Settings → Database
2. Go to "Connection Pooling" section
3. Find the connection string - it should show the correct port
4. Go to "Network Restrictions" or "Firewall"
5. Either:
   - Add Azure Central India IP ranges: 20.192.0.0/18, 52.172.0.0/16, 104.211.0.0/16
   - OR temporarily allow all IPs (0.0.0.0/0) to test if this is the issue

## Step 3: Test the Correct Connection String
Try both of these formats in your Azure App Service configuration:

### Format 1 (Standard PostgreSQL port):
```
postgresql://postgres:Investimate_291@db.fryuuxrvtkijmxsrmytt.supabase.co:5432/postgres?sslmode=require
```

### Format 2 (Connection pooling port):
```
postgresql://postgres:Investimate_291@db.fryuuxrvtkijmxsrmytt.supabase.co:6543/postgres?sslmode=require
```

## Step 4: Enable VNet Integration (Advanced)
If IP restrictions don't work, you may need VNet integration:
1. Azure Portal → Your App Service → Networking → VNet integration
2. This allows your app to use predictable outbound IPs

## Step 5: Test Connection
After making changes:
1. Restart your App Service
2. Check the logs for the new database diagnostics
3. Look for "Network connectivity to database: OK"

## Quick Fix Commands for Azure CLI
```bash
# Update the database URL directly
az webapp config appsettings set --name investimate-backend --resource-group your-resource-group --settings DATABASE_URL="postgresql://postgres:Investimate_291@db.fryuuxrvtkijmxsrmytt.supabase.co:5432/postgres?sslmode=require"

# Restart the app
az webapp restart --name investimate-backend --resource-group your-resource-group
```
