#!/usr/bin/env python3
"""
Complete Azure Configuration Solution
- Manual configuration guide
- REST API approach  
- Verification tools
"""
import os
import json
import requests
from dotenv import load_dotenv

def REDACTED-GOOGLE-CLIENT-SECRETion_guide():
    """Create a comprehensive manual configuration guide"""
    
    load_dotenv()
    
    # Get environment variables
    env_vars = {
        'ENVIRONMENT': os.getenv('ENVIRONMENT', 'production'),
        'DEBUG': os.getenv('DEBUG', 'false'),
        'SECRET_KEY': os.getenv('SECRET_KEY'),
        'ALGORITHM': os.getenv('ALGORITHM', 'HS256'),
        'REDACTED-GOOGLE-CLIENT-SECRETTES': os.getenv('REDACTED-GOOGLE-CLIENT-SECRETTES', '20'),
        'DATABASE_URL': os.getenv('DATABASE_URL'),
        'SUPABASE_URL': os.getenv('SUPABASE_URL'),
        'SUPABASE_SERVICE_KEY': os.getenv('SUPABASE_SERVICE_KEY'),
        'SUPABASE_BUCKET': os.getenv('SUPABASE_BUCKET'),
        'GOOGLE_CLIENT_ID': os.getenv('GOOGLE_CLIENT_ID'),
        'GOOGLE_CLIENT_SECRET': os.getenv('GOOGLE_CLIENT_SECRET'),
        'OPENROUTER_KEY': os.getenv('OPENROUTER_KEY'),
        'GEMINI_KEY': os.getenv('GEMINI_KEY'),
        'CORS_ORIGINS': '["https://investimate-ai-eight.vercel.app"]'
    }
    
    # Filter valid variables
    valid_vars = {k: v for k, v in env_vars.items() if v is not None}
    
    guide = f"""
# 🚀 COMPLETE AZURE APP SERVICE CONFIGURATION GUIDE

## 📊 Configuration Summary
- **App Service**: REDACTED-GOOGLE-CLIENT-SECRETrkg7s
- **Resource Group**: investimate-rg  
- **Environment Variables**: {len(valid_vars)} to configure
- **Database**: Supabase PostgreSQL (✅ Tested)
- **Status**: Ready for deployment

---

## 🎯 METHOD 1: AZURE PORTAL (RECOMMENDED)

### Step 1: Access Azure Portal
1. Open: **https://portal.azure.com**
2. Sign in with your Azure account
3. Search for **"App Services"** in the top search bar
4. Click on **REDACTED-GOOGLE-CLIENT-SECRETrkg7s**

### Step 2: Navigate to Configuration
1. In the left sidebar, click **"Configuration"**
2. Click on **"Application settings"** tab
3. You should see existing settings (if any)

### Step 3: Add Environment Variables
Click **"+ New application setting"** for each variable below:

"""
    
    # Add each variable with copy-paste format
    for i, (name, value) in enumerate(valid_vars.items(), 1):
        # Mask sensitive values for display
        display_value = value
        if any(word in name.lower() for word in ['key', 'secret', 'token', 'password']):
            if len(value) > 20:
                display_value = f"{value[:8]}...{value[-8:]}"
        
        guide += f"""
**Variable {i}: {name}**
- **Name**: `{name}`
- **Value**: `{value}`
- **Display**: {display_value}
"""

    guide += f"""

### Step 4: Save Configuration
1. After adding all {len(valid_vars)} variables, click **"Save"** at the top
2. Wait for **"Successfully saved"** message (30-60 seconds)
3. Azure will automatically restart the app

### Step 5: Verify Deployment
1. Go to **"Overview"** in the left sidebar
2. Check **Status**: Should show **"Running"**
3. Click on the **URL**: https://REDACTED-GOOGLE-CLIENT-SECRETrkg7s.azurewebsites.net/
4. You should see FastAPI documentation page

---

## 🎯 METHOD 2: AZURE CLI (IF AVAILABLE)

### Quick Commands (Copy & Paste):

```bash
# Basic Configuration
az webapp config appsettings set --name "REDACTED-GOOGLE-CLIENT-SECRETrkg7s" --resource-group "investimate-rg" --settings \\
  "ENVIRONMENT=production" \\
  "DEBUG=false" \\
  "SECRET_KEY={env_vars.get('SECRET_KEY', 'YOUR_SECRET_KEY')}" \\
  "ALGORITHM=HS256" \\
  "REDACTED-GOOGLE-CLIENT-SECRETTES=20"

# Database Configuration  
az webapp config appsettings set --name "REDACTED-GOOGLE-CLIENT-SECRETrkg7s" --resource-group "investimate-rg" --settings \\
  "DATABASE_URL={env_vars.get('DATABASE_URL', 'YOUR_DATABASE_URL')}" \\
  "SUPABASE_URL={env_vars.get('SUPABASE_URL', 'YOUR_SUPABASE_URL')}" \\
  "SUPABASE_SERVICE_KEY={env_vars.get('SUPABASE_SERVICE_KEY', 'YOUR_SUPABASE_KEY')}" \\
  "SUPABASE_BUCKET={env_vars.get('SUPABASE_BUCKET', 'reports-investimate')}"

# API Keys
az webapp config appsettings set --name "REDACTED-GOOGLE-CLIENT-SECRETrkg7s" --resource-group "investimate-rg" --settings \\
  "GOOGLE_CLIENT_ID={env_vars.get('GOOGLE_CLIENT_ID', 'YOUR_GOOGLE_CLIENT_ID')}" \\
  "GOOGLE_CLIENT_SECRET={env_vars.get('GOOGLE_CLIENT_SECRET', 'REDACTED-GOOGLE-CLIENT-SECRETT')}" \\
  "OPENROUTER_KEY={env_vars.get('OPENROUTER_KEY', 'YOUR_OPENROUTER_KEY')}" \\
  "GEMINI_KEY={env_vars.get('GEMINI_KEY', 'YOUR_GEMINI_KEY')}" \\
  "CORS_ORIGINS=[\\"https://investimate-ai-eight.vercel.app\\"]"

# Restart App Service
az webapp restart --name "REDACTED-GOOGLE-CLIENT-SECRETrkg7s" --resource-group "investimate-rg"
```

---

## 🔍 METHOD 3: VERIFICATION CHECKLIST

After configuration, verify everything is working:

### ✅ Portal Verification:
1. **Configuration**: All {len(valid_vars)} variables present
2. **Status**: App Service shows "Running"  
3. **URL**: https://REDACTED-GOOGLE-CLIENT-SECRETrkg7s.azurewebsites.net/ loads
4. **Logs**: No startup errors in "Log stream"

### ✅ Local Testing:
Run this command to test the deployed app:
```bash
python test_everything.py
```

Expected output:
- ✅ Environment Variables: All present
- ✅ Database Connection: Successful  
- ✅ App Endpoint: Responsive (200 OK)

---

## 🛠️ TROUBLESHOOTING

### Problem: App doesn't start
**Solution**: 
1. Check **"Log stream"** in Azure portal
2. Look for Python/startup errors
3. Ensure all environment variables are set

### Problem: Database connection fails  
**Solution**:
1. Verify `DATABASE_URL` is correct
2. Check Supabase service status
3. Test connection locally first

### Problem: 500 Internal Server Error
**Solution**:
1. Check **"Application Insights"** logs
2. Verify all API keys are valid
3. Check CORS_ORIGINS setting

### Problem: Environment variables not applying
**Solution**:
1. **Save** configuration in portal
2. **Restart** app service manually  
3. Wait 2-3 minutes for full restart

---

## 🎉 SUCCESS INDICATORS

When everything is working correctly:

- ✅ **Portal Status**: "Running" with green checkmark
- ✅ **Main URL**: https://REDACTED-GOOGLE-CLIENT-SECRETrkg7s.azurewebsites.net/ 
- ✅ **API Docs**: /docs endpoint shows FastAPI interface
- ✅ **Health Check**: /health endpoint returns 200 OK
- ✅ **Database**: Connection test passes
- ✅ **Authentication**: OAuth endpoints respond correctly

---

## 📞 NEED HELP?

If you encounter issues:

1. **Check this guide** for troubleshooting steps
2. **Run verification tests** with `python test_everything.py`  
3. **Review Azure logs** in the portal Log stream
4. **Test locally first** to isolate the problem

---

**Your app is 95% ready!** Just add those environment variables and you'll be live! 🚀
"""

    return guide

def REDACTED-GOOGLE-CLIENT-SECRETed():
    """Test the app endpoint with detailed diagnostics"""
    print("🌐 Testing Azure App Service Endpoint...")
    print("=" * 50)
    
    app_url = "https://REDACTED-GOOGLE-CLIENT-SECRETrkg7s.azurewebsites.net"
    endpoints = [
        ("/", "Main API endpoint"),
        ("/docs", "API documentation"), 
        ("/health", "Health check"),
        ("/openapi.json", "OpenAPI schema")
    ]
    
    results = []
    
    for endpoint, description in endpoints:
        full_url = f"{app_url}{endpoint}"
        print(f"\n🔗 Testing: {description}")
        print(f"   URL: {full_url}")
        
        try:
            response = requests.get(full_url, timeout=10)
            
            if response.status_code == 200:
                print(f"   ✅ Status: {response.status_code} OK")
                print(f"   📏 Content: {len(response.text)} characters")
                results.append(f"✅ {description}: Working")
            else:
                print(f"   ⚠️  Status: {response.status_code}")
                print(f"   📄 Response: {response.text[:100]}...")
                results.append(f"⚠️  {description}: Status {response.status_code}")
                
        except requests.exceptions.Timeout:
            print(f"   ⏰ Timeout: App may be starting up")
            results.append(f"⏰ {description}: Timeout (may be starting)")
            
        except requests.exceptions.ConnectionError:
            print(f"   ❌ Connection Error: App may not be running")
            results.append(f"❌ {description}: Connection failed")
            
        except Exception as e:
            print(f"   ❌ Error: {e}")
            results.append(f"❌ {description}: Error")
    
    print("\n" + "=" * 50)
    print("📊 Endpoint Test Results:")
    for result in results:
        print(f"   {result}")
    
    working_count = len([r for r in results if r.startswith("✅")])
    total_count = len(results)
    
    if working_count == total_count:
        print(f"\n🎉 All endpoints working! ({working_count}/{total_count})")
        return True
    elif working_count > 0:
        print(f"\n⚠️  Partial success ({working_count}/{total_count})")
        print("   App may still be starting up or need environment variables")
        return False
    else:
        print(f"\n❌ No endpoints responding ({working_count}/{total_count})")
        print("   Environment variables likely not configured")
        return False

def main():
    """Main function"""
    print("🚀 Azure App Service Complete Configuration Tool")
    print("=" * 60)
    
    # Create configuration guide
    print("📝 Creating configuration guide...")
    guide_content = REDACTED-GOOGLE-CLIENT-SECRETion_guide()
    
    # Save guide to file
    guide_file = "AZURE_CONFIG_COMPLETE.md"
    with open(guide_file, 'w', encoding='utf-8') as f:
        f.write(guide_content)
    
    print(f"✅ Configuration guide saved: {guide_file}")
    
    # Test current app status
    print("\n🔧 Testing current app status...")
    app_working = REDACTED-GOOGLE-CLIENT-SECRETed()
    
    # Provide next steps
    print("\n🎯 NEXT STEPS:")
    if app_working:
        print("   ✅ Your app is already working!")
        print("   🎉 Configuration appears to be complete")
    else:
        print("   📋 Follow the manual configuration guide:")
        print(f"   📄 Open: {guide_file}")
        print("   🌐 Go to: https://portal.azure.com")
        print("   ⚙️  Configure environment variables")
        print("   🔄 Restart app service")
    
    print("\n📞 Run 'python test_everything.py' after configuration")
    print("🌟 Your app will be live at: https://REDACTED-GOOGLE-CLIENT-SECRETrkg7s.azurewebsites.net/")

if __name__ == "__main__":
    main()
