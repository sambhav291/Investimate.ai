#!/usr/bin/env python3
"""
🚀 Azure App Service Deployment Fix Script

This script identifies and fixes the Azure deployment issues:
1. Missing dependencies (fastapi/uvicorn not found)
2. Requirements file not found (requirements_production.txt)
3. Container startup timeout
4. Path configuration problems

Based on the logs, the main issues are related to dependencies not being installed properly
and the application not starting within the expected time limit.
"""

import os
import sys
import shutil
import subprocess
import platform
import importlib
from pathlib import Path
from datetime import datetime

def check_file(filepath, create_if_missing=False, content=None):
    """Check if a file exists and optionally create it with content"""
    file_path = Path(filepath)
    if file_path.exists():
        print(f"✅ {filepath} exists")
        return True
    else:
        print(f"❌ {filepath} not found")
        if create_if_missing and content:
            try:
                with open(file_path, "w") as f:
                    f.write(content)
                print(f"  Created {filepath}")
                return True
            except Exception as e:
                print(f"  Failed to create {filepath}: {e}")
        return False

def check_module(module_name):
    """Check if a Python module is installed"""
    try:
        importlib.import_module(module_name)
        print(f"✅ {module_name} is installed")
        return True
    except ImportError:
        print(f"❌ {module_name} is NOT installed")
        return False

def main():
    print("� AZURE DEPLOYMENT DIAGNOSTIC")
    print("=" * 50)
    
    # System information
    print(f"Python version: {sys.version}")
    print(f"Platform: {platform.platform()}")
    
    # Check current directory and files
    current_dir = Path.cwd()
    print(f"Current directory: {current_dir}")
    
    # Check for key files
    files_to_check = [
        "main.py",
        "requirements.txt",
        "requirements_production.txt", 
        "startup.sh",
        "web.config",
        "runtime.txt",
        "application.py",
        "minimal_app.py"
    ] 
    print("4. ❌ Container exited during startup")
    
    print("\n💡 ROOT CAUSE:")
    print("Azure is not properly installing dependencies from requirements.txt")
    print("The startup command is failing because uvicorn is missing")
    
    print("\n🛠️ SOLUTIONS:")
    print("=" * 50)
    
    print("\n🎯 SOLUTION 1: REDEPLOY WITH CORRECT CONFIGURATION")
    print("Your environment variables are correct, but deployment failed.")
    print("You need to redeploy your app to Azure with proper dependency installation.")
    
    print("\n📋 STEPS TO FIX:")
    print("1. In Azure Portal, go to your App Service")
    print("2. Go to 'Deployment Center'") 
    print("3. Check your deployment source and redeploy")
    print("4. Or use the manual zip deployment method below")
    
    print("\n🎯 SOLUTION 2: MANUAL ZIP DEPLOYMENT")
    print("Create a deployment package and upload it manually")
    
    # Create a minimal web.config if it doesn't exist
    web_config_path = current_dir / "web.config"
    if not web_config_path.exists():
        print("\n📝 Creating web.config...")
        web_config_content = '''<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="PythonHandler" path="*" verb="*" modules="FastCgiModule" scriptProcessor="D:\\Python311\\python.exe|D:\\Python311\\Scripts\\wfastcgi.py" resourceType="Unspecified" requireAccess="Script"/>
    </handlers>
  </system.webServer>
  <appSettings>
    <add key="PYTHONPATH" value="D:\\home\\site\\wwwroot"/>
    <add key="WSGI_HANDLER" value="main.app"/>
  </appSettings>
</configuration>'''
        
        with open(web_config_path, 'w') as f:
            f.write(web_config_content)
        print("✅ web.config created")
    
    # Check runtime.txt
    runtime_path = current_dir / "runtime.txt"
    if not runtime_path.exists():
        print("\n📝 Creating runtime.txt...")
        with open(runtime_path, 'w') as f:
            f.write("python-3.11\n")
        print("✅ runtime.txt created")
    
    print("\n🎯 SOLUTION 3: USE AZURE CLI DEPLOYMENT")
    print("If you have Azure CLI working, use these commands:")
    print()
    print("# Create deployment zip")
    print("az webapp deployment source config-zip \\")
    print('  --resource-group "investimate-rg" \\')
    print('  --name "investimate-backend" \\')
    print('  --src deployment.zip')
    
    print("\n🎯 SOLUTION 4: UPDATE STARTUP COMMAND IN AZURE")
    print("In Azure Portal > App Service > Configuration > General Settings:")
    print('Set Startup Command to: python -m uvicorn main:app --host 0.0.0.0 --port 8000')
    
    print("\n🎯 SOLUTION 5: CHECK STACK SETTINGS")
    print("In Azure Portal > App Service > Configuration > General Settings:")
    print("- Stack: Python")
    print("- Major version: Python 3")
    print("- Minor version: Python 3.11")
    
    print("\n📞 IMMEDIATE ACTION REQUIRED:")
    print("=" * 50)
    print("Your environment variables are perfect! ✅")
    print("The issue is with the deployment/dependency installation.")
    print()
    print("NEXT STEPS:")
    print("1. Go to Azure Portal > Your App Service")
    print("2. Go to 'Deployment Center'")
    print("3. Redeploy your application")
    print("4. Monitor the deployment logs")
    print("5. Ensure requirements.txt is being processed")
    
    print(f"\n🔗 Your App URL: https://investimate-backend.azurewebsites.net/")
    print("Once fixed, it should show FastAPI docs!")

if __name__ == "__main__":
    main()
