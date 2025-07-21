#!/usr/bin/env python3
"""
🔍 Azure App Status Checker & Deployment Diagnostics

Check the current status of the Azure app and provide solutions.
"""

import requests
import sys
from datetime import datetime

def check_app_status():
    """Check the current status of the Azure app"""
    
    print("🔍 CHECKING AZURE APP STATUS")
    print("=" * 50)
    
    app_url = "https://REDACTED-GOOGLE-CLIENT-SECRETrkg7s.azurewebsites.net/"
    
    print(f"📊 Testing URL: {app_url}")
    print(f"🕒 Time: {datetime.now()}")
    
    try:
        print("\n⏳ Making request to your app...")
        response = requests.get(app_url, timeout=30)
        
        print(f"📈 Status Code: {response.status_code}")
        print(f"📏 Response Length: {len(response.text)} characters")
        
        # Check for common error patterns
        if response.status_code == 500:
            print("❌ 500 Internal Server Error - App is crashing")
        elif response.status_code == 503:
            print("❌ 503 Service Unavailable - App is not responding")  
        elif response.status_code == 404:
            print("❌ 404 Not Found - App routing issue")
        elif response.status_code == 200:
            print("✅ 200 OK - App is responding")
        
        # Check response content
        response_text = response.text.lower()
        
        if "application error" in response_text:
            print("🚨 DETECTED: Application Error page")
            return "APPLICATION_ERROR"
        elif "fastapi" in response_text:
            print("✅ DETECTED: FastAPI is running")
            return "SUCCESS"
        elif "internal server error" in response_text:
            print("🚨 DETECTED: Internal Server Error")
            return "INTERNAL_ERROR"
        elif "service unavailable" in response_text:
            print("🚨 DETECTED: Service Unavailable")
            return "SERVICE_UNAVAILABLE"
        else:
            print("⚠️  DETECTED: Unknown response")
            print("📄 First 500 characters of response:")
            print("-" * 40)
            print(response.text[:500])
            print("-" * 40)
            return "UNKNOWN"
            
    except requests.exceptions.Timeout:
        print("⏰ TIMEOUT: App is not responding within 30 seconds")
        return "TIMEOUT"
    except requests.exceptions.ConnectionError:
        print("🔌 CONNECTION ERROR: Cannot reach the app")
        return "CONNECTION_ERROR"
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return "ERROR"

def diagnose_issues(status):
    """Provide solutions based on the detected status"""
    
    print("\n🔧 DIAGNOSIS & SOLUTIONS")
    print("=" * 50)
    
    if status == "APPLICATION_ERROR":
        print("🎯 ISSUE: Application Error")
        print("📋 LIKELY CAUSES:")
        print("1. Dependencies not installed (uvicorn missing)")
        print("2. Code errors during startup")
        print("3. Environment variables missing")
        print("4. Database connection issues")
        
        print("\n🛠️ SOLUTIONS:")
        print("1️⃣ Check Azure Log Stream for detailed errors")
        print("2️⃣ Verify all environment variables are set")
        print("3️⃣ Ensure requirements.txt has all dependencies")
        print("4️⃣ Check if main.py has syntax errors")
        
    elif status == "TIMEOUT" or status == "SERVICE_UNAVAILABLE":
        print("🎯 ISSUE: App is not responding")
        print("📋 LIKELY CAUSES:")
        print("1. App is still starting up")
        print("2. Container crashed during startup")
        print("3. Port binding issues")
        
        print("\n🛠️ SOLUTIONS:")
        print("1️⃣ Wait 5-10 minutes for startup")
        print("2️⃣ Check if app service is running")
        print("3️⃣ Restart the app service")
        
    elif status == "SUCCESS":
        print("🎉 SUCCESS: App is working correctly!")
        print("✅ FastAPI is running and responding")
        return
        
    else:
        print("🎯 ISSUE: Unknown problem")
        print("📋 GENERAL SOLUTIONS:")
        print("1️⃣ Check Azure Activity Log")
        print("2️⃣ Review deployment logs")
        print("3️⃣ Try redeploying the app")

def provide_next_steps():
    """Provide immediate next steps"""
    
    print("\n🚀 IMMEDIATE NEXT STEPS")
    print("=" * 50)
    
    print("1. 🔍 CHECK LOGS:")
    print("   - Azure Portal > Your App Service > Log stream")
    print("   - Look for startup errors or missing dependencies")
    
    print("\n2. 📊 CHECK APP SERVICE STATUS:")
    print("   - Azure Portal > Your App Service > Overview")
    print("   - Ensure status shows 'Running'")
    print("   - If stopped, click 'Start'")
    
    print("\n3. 🔄 TRY RESTART:")
    print("   - Azure Portal > Your App Service > Overview")
    print("   - Click 'Restart' button")
    print("   - Wait 3-5 minutes")
    
    print("\n4. 🎯 IF STILL BROKEN:")
    print("   - The deployment package may need fixes")
    print("   - We may need to redeploy with corrections")
    
    print(f"\n🌐 TEST URL: https://REDACTED-GOOGLE-CLIENT-SECRETrkg7s.azurewebsites.net/")
    print("Expected: FastAPI interactive documentation")

def main():
    print("🚀 AZURE APP DIAGNOSTICS")
    print("=" * 50)
    print("Checking your deployed FastAPI application...")
    
    # Check app status
    status = check_app_status()
    
    # Provide diagnosis
    diagnose_issues(status)
    
    # Provide next steps
    provide_next_steps()
    
    print("\n📞 SUMMARY:")
    if status == "SUCCESS":
        print("✅ Your app is working correctly!")
    else:
        print("❌ Your app has issues that need to be resolved")
        print("🔧 Follow the solutions above to fix the problems")
    
    print("\n💡 Remember:")
    print("- Your environment variables are correctly configured")
    print("- The issue is likely with the deployment or dependencies")
    print("- Check the Azure logs for specific error messages")

if __name__ == "__main__":
    main()
