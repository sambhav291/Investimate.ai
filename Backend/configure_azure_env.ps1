# Azure App Service Environment Variables Configuration Script
# Run this script after Azure CLI installation completes

Write-Host "🔧 Configuring Azure App Service Environment Variables..." -ForegroundColor Green

# Basic Configuration
Write-Host "Setting basic configuration..." -ForegroundColor Yellow

Write-Host "Configuring environment variables batch 1..." -ForegroundColor Yellow
az webapp config appsettings set --name "REDACTED-GOOGLE-CLIENT-SECRETECRETECRETrkg7s" --resource-group "investimate-rg" --settings "ENVIRONMENT=production" "DEBUG=false" "SECRET_KEY=YOUR_SECRET_KEY" "ALGORITHM=HS256" "REDACTED-GOOGLE-CLIENT-SECRETECRETECRETTES=20"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Batch 1 configured successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to configure batch 1" -ForegroundColor Red
}

Write-Host "Configuring environment variables batch 2..." -ForegroundColor Yellow
az webapp config appsettings set --name "REDACTED-GOOGLE-CLIENT-SECRETECRETECRETrkg7s" --resource-group "investimate-rg" --settings "DATABASE_URL=postgresql://postgres:PASSWORD@db.example.supabase.co:5432/postgres?sslmode=require" "SUPABASE_URL=https://example.supabase.co" "SUPABASE_SERVICE_KEY=REDACTED-GOOGLE-CLIENT-SECRETECRETECRETY" "SUPABASE_BUCKET=reports-investimate" "GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Batch 2 configured successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to configure batch 2" -ForegroundColor Red
}

Write-Host "Configuring environment variables batch 3..." -ForegroundColor Yellow
az webapp config appsettings set --name "REDACTED-GOOGLE-CLIENT-SECRETECRETECRETrkg7s" --resource-group "investimate-rg" --settings "GOOGLE_CLIENT_SECRET=REDACTED-GOOGLE-CLIENT-SECRETECRETECRETT" "OPENROUTER_KEY=YOUR_OPENROUTER_KEY" "GEMINI_KEY=YOUR_GEMINI_KEY" "CORS_ORIGINS=["https://investimate-ai-eight.vercel.app"]"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Batch 3 configured successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to configure batch 3" -ForegroundColor Red
}

Write-Host "🎉 Environment variable configuration completed!" -ForegroundColor Green
Write-Host "🔍 Verifying deployment..." -ForegroundColor Yellow

# Test the app endpoint
try {
    $response = Invoke-RestMethod -Uri "https://REDACTED-GOOGLE-CLIENT-SECRETECRETECRETrkg7s.azurewebsites.net/" -TimeoutSec 30
    Write-Host "✅ App is responding correctly!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  App might be starting up. Check Azure portal for status." -ForegroundColor Yellow
}
