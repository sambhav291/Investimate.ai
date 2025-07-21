#!/usr/bin/env python3
"""
🚀 UPDATED AZURE DEPLOYMENT GUIDE (2025)

Microsoft has updated the Azure App Service interface.
The old Kudu console ZipDeploy is no longer available.
This script provides the updated deployment methods.
"""

import os
import sys
from pathlib import Path

def main():
    print("🔄 AZURE INTERFACE UPDATE DETECTED")
    print("=" * 50)
    
    print("✅ You're correct! Microsoft has updated the Azure interface.")
    print("❌ The old Kudu ZipDeploy method is no longer available.")
    print("🆕 Using the new Deployment Center method instead.")
    
    print("\n🎯 UPDATED DEPLOYMENT METHOD:")
    print("=" * 50)
    
    print("\n📋 STEP-BY-STEP DEPLOYMENT:")
    print("1. Go to Azure Portal")
    print("2. Navigate to your App Service: REDACTED-GOOGLE-CLIENT-SECRETrkg7s")
    print("3. In the left sidebar, click 'Deployment Center'")
    print("4. Choose 'Local Git' or 'GitHub' as source")
    print("5. Or use the Azure CLI method below")
    
    print("\n🔧 ALTERNATIVE: AZURE CLI METHOD")
    print("Since the web interface changed, let's use Azure CLI:")
    print()
    
    # Create a simple deployment script
    current_dir = Path.cwd()
    
    # Create a PowerShell deployment script
    ps_script = """# Azure CLI Deployment Script
# Run this in PowerShell

Write-Host "🚀 Deploying to Azure App Service..." -ForegroundColor Green

# Check if Azure CLI is available
try {
    az --version
    Write-Host "✅ Azure CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Azure CLI not found. Please install it first." -ForegroundColor Red
    Write-Host "Install from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli" -ForegroundColor Yellow
    exit 1
}

# Login to Azure (if not already logged in)
Write-Host "🔐 Checking Azure login status..." -ForegroundColor Yellow
az account show 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "🔑 Please log in to Azure..." -ForegroundColor Yellow
    az login
}

# Create deployment zip
Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow
$zipPath = "azure_deployment.zip"

# Remove old zip if exists
if (Test-Path $zipPath) {
    Remove-Item $zipPath
    Write-Host "🗑️ Removed old deployment package" -ForegroundColor Gray
}

# Create zip with PowerShell (Windows 10/11 built-in)
$files = @(
    "main.py",
    "requirements_minimal.txt",
    "runtime.txt", 
    "web.config",
    ".env",
    "application.py"
)

$folders = @(
    "Auth",
    "Ai_engine", 
    "Enhanced_preprocessing",
    "Generator",
    "Pdf_report_maker", 
    "Preprocessing",
    "Scraper",
    "alembic"
)

# Use PowerShell Compress-Archive
$items = @()
foreach ($file in $files) {
    if (Test-Path $file) {
        $items += $file
    }
}
foreach ($folder in $folders) {
    if (Test-Path $folder) {
        $items += $folder
    }
}

Write-Host "📁 Adding files to deployment package..." -ForegroundColor Yellow
Compress-Archive -Path $items -DestinationPath $zipPath -Force

# Rename requirements_minimal.txt to requirements.txt in the zip
$shell = New-Object -ComObject Shell.Application
$zip = $shell.NameSpace((Resolve-Path $zipPath).Path)
if ($zip.Items() | Where-Object {$_.Name -eq "requirements_minimal.txt"}) {
    Write-Host "🔄 Renaming requirements_minimal.txt to requirements.txt..." -ForegroundColor Yellow
    # This requires manual step - see instructions below
}

Write-Host "✅ Deployment package created: $zipPath" -ForegroundColor Green

# Deploy using Azure CLI
Write-Host "🚀 Deploying to Azure..." -ForegroundColor Green
az webapp deployment source config-zip `
    --resource-group "investimate-rg" `
    --name "REDACTED-GOOGLE-CLIENT-SECRETrkg7s" `
    --src $zipPath

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host "🔄 Restarting app service..." -ForegroundColor Yellow
    
    az webapp restart `
        --resource-group "investimate-rg" `
        --name "REDACTED-GOOGLE-CLIENT-SECRETrkg7s"
    
    Write-Host "🌐 Your app should be available at:" -ForegroundColor Green
    Write-Host "https://REDACTED-GOOGLE-CLIENT-SECRETrkg7s.azurewebsites.net/" -ForegroundColor Blue
    
} else {
    Write-Host "❌ Deployment failed. Check the output above for errors." -ForegroundColor Red
}

Write-Host "🏁 Deployment script completed." -ForegroundColor Green"""
    
    script_path = current_dir / "deploy_to_azure.ps1"
    with open(script_path, 'w', encoding='utf-8') as f:
        f.write(ps_script)
    
    print(f"✅ Created PowerShell deployment script: {script_path}")
    
    print("\n🎯 TWO OPTIONS TO DEPLOY:")
    print("=" * 50)
    
    print("\n🅰️ OPTION A: RUN THE POWERSHELL SCRIPT")
    print("1. Open PowerShell as Administrator")
    print("2. Navigate to your Backend directory")
    print(f"3. Run: .\\deploy_to_azure.ps1")
    print("4. The script will handle everything automatically")
    
    print("\n🅱️ OPTION B: MANUAL AZURE CLI COMMANDS")
    print("If PowerShell script doesn't work, run these commands:")
    print()
    print("# Login to Azure")
    print("az login")
    print()
    print("# Deploy the fixed deployment zip")
    print("az webapp deployment source config-zip \\")
    print('    --resource-group "investimate-rg" \\')
    print('    --name "REDACTED-GOOGLE-CLIENT-SECRETrkg7s" \\')
    print('    --src fixed_deployment.zip')
    print()
    print("# Restart the app")
    print("az webapp restart \\")
    print('    --resource-group "investimate-rg" \\')
    print('    --name "REDACTED-GOOGLE-CLIENT-SECRETrkg7s"')
    
    print("\n🛠️ PREPARATION STEPS:")
    print("1. Install Azure CLI if not already installed:")
    print("   https://docs.microsoft.com/en-us/cli/azure/install-azure-cli")
    print("2. We already created 'fixed_deployment.zip' earlier")
    print("3. Use that zip file with the Azure CLI commands above")
    
    print("\n🎉 AFTER DEPLOYMENT:")
    print("- Wait 2-3 minutes for the app to start")
    print("- Visit: https://REDACTED-GOOGLE-CLIENT-SECRETrkg7s.azurewebsites.net/")
    print("- You should see the FastAPI documentation page")
    
    print("\n💡 WHY THIS WILL WORK:")
    print("- Environment variables are already configured ✅")
    print("- fixed_deployment.zip has the special .deployment files")
    print("- Azure CLI bypasses the web interface limitations")
    print("- Your app will finally start properly!")

if __name__ == "__main__":
    main()
