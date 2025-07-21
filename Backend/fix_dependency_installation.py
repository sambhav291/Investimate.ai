#!/usr/bin/env python3
"""
🎯 AZURE DEPENDENCY INSTALLATION FIX

The startup command is correct, but Azure isn't installing dependencies properly.
This creates files to force proper dependency installation.
"""

import os
from pathlib import Path

def create_oryx_manifest():
    """Create .oryx_prod_node file to help Azure understand this is a Python app"""
    current_dir = Path.cwd()
    
    # Create .deployment file
    deployment_content = """[config]
command = deploy.cmd"""
    
    with open(current_dir / ".deployment", "w") as f:
        f.write(deployment_content)
    print("✅ Created .deployment file")
    
    # Create deploy.cmd
    deploy_cmd_content = """@echo off
echo Installing Python dependencies...
python -m pip install --upgrade pip
python -m pip install -r requirements_minimal.txt
echo Dependencies installed successfully!"""
    
    with open(current_dir / "deploy.cmd", "w") as f:
        f.write(deploy_cmd_content)
    print("✅ Created deploy.cmd file")

def fix_requirements():
    """Ensure requirements_minimal.txt has uvicorn explicitly"""
    current_dir = Path.cwd()
    req_file = current_dir / "requirements_minimal.txt"
    
    if req_file.exists():
        with open(req_file, "r") as f:
            content = f.read()
        
        # Check if uvicorn is explicitly mentioned
        if "uvicorn==" not in content:
            print("❌ uvicorn not found in requirements_minimal.txt")
            # Add uvicorn at the top
            new_content = "# Web server\nuvicorn==0.35.0\n\n" + content
            with open(req_file, "w") as f:
                f.write(new_content)
            print("✅ Added uvicorn==0.35.0 to requirements_minimal.txt")
        else:
            print("✅ uvicorn already in requirements_minimal.txt")

def create_app_py_alias():
    """Create app.py that imports from main.py as backup"""
    current_dir = Path.cwd()
    app_py_content = """# Azure App Service entry point
from main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
"""
    
    with open(current_dir / "app.py", "w") as f:
        f.write(app_py_content)
    print("✅ Created app.py as backup entry point")

def update_web_config():
    """Update web.config for better Azure compatibility"""
    current_dir = Path.cwd()
    web_config_content = """<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <httpPlatform processPath="python" 
                  arguments="main.py" 
                  startupTimeLimit="60" 
                  startupRetryCount="3">
      <environmentVariables>
        <environmentVariable name="PYTHONPATH" value="D:\\home\\site\\wwwroot" />
      </environmentVariables>
    </httpPlatform>
  </system.webServer>
</configuration>"""
    
    with open(current_dir / "web.config", "w") as f:
        f.write(web_config_content)
    print("✅ Updated web.config")

def main():
    print("🔧 FIXING AZURE DEPENDENCY INSTALLATION")
    print("=" * 50)
    
    print("\n🎯 ROOT CAUSE IDENTIFIED:")
    print("- Startup command is CORRECT ✅")
    print("- Environment variables are CORRECT ✅")  
    print("- Issue: Azure build process is not installing dependencies")
    
    print("\n🛠️ APPLYING FIXES:")
    
    # 1. Fix requirements
    fix_requirements()
    
    # 2. Create deployment files
    create_oryx_manifest()
    
    # 3. Create backup entry point
    create_app_py_alias()
    
    # 4. Update web.config
    update_web_config()
    
    print("\n📦 CREATING NEW DEPLOYMENT PACKAGE...")
    
    # Create updated deployment zip
    import zipfile
    
    current_dir = Path.cwd()
    zip_path = current_dir / "fixed_deployment.zip"
    
    include_files = [
        "main.py",
        "app.py",  # New backup entry point
        "requirements_minimal.txt",
        ".deployment",  # New deployment config
        "deploy.cmd",   # New deployment script
        "runtime.txt",
        "web.config",
        "application.py",
        ".env"
    ]
    
    include_dirs = [
        "Auth", "Ai_engine", "Enhanced_preprocessing", 
        "Generator", "Pdf_report_maker", "Preprocessing", 
        "Scraper", "alembic"
    ]
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file_name in include_files:
            file_path = current_dir / file_name
            if file_path.exists():
                # Always use requirements.txt as the filename in zip
                if file_name == "requirements_minimal.txt":
                    zipf.write(file_path, "requirements.txt")
                else:
                    zipf.write(file_path, file_name)
        
        # Add directories
        for dir_name in include_dirs:
            dir_path = current_dir / dir_name
            if dir_path.exists():
                for root, dirs, files in os.walk(dir_path):
                    for file in files:
                        if file.endswith('.py'):
                            file_path = Path(root) / file
                            arcname = file_path.relative_to(current_dir)
                            zipf.write(file_path, arcname)
    
    print(f"✅ Created fixed_deployment.zip ({zip_path.stat().st_size / 1024:.1f} KB)")
    
    print("\n🚀 DEPLOYMENT INSTRUCTIONS:")
    print("=" * 50)
    print("1. Go to Azure Portal > Your App Service")
    print("2. Go to 'Advanced Tools' > 'Go' (Kudu console)")
    print("3. Go to 'Tools' > 'Zip Push Deploy'")
    print("4. Upload 'fixed_deployment.zip'")
    print("5. Wait for deployment to complete (watch the console)")
    print("6. Go back to App Service > Overview > Restart")
    print("7. Check logs in 'Log stream'")
    
    print("\n🔍 WHAT THE FIXES DO:")
    print("- .deployment & deploy.cmd: Forces pip install during deployment")
    print("- Updated requirements: Ensures uvicorn is explicitly installed")
    print("- app.py: Provides backup entry point if main.py fails")
    print("- web.config: Better Azure Python configuration")
    
    print(f"\n🌐 Test URL: https://REDACTED-GOOGLE-CLIENT-SECRETrkg7s.azurewebsites.net/")
    print("Should show FastAPI docs after successful deployment!")

if __name__ == "__main__":
    main()
