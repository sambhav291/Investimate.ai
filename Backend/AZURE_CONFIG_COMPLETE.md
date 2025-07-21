
# 🚀 COMPLETE AZURE APP SERVICE CONFIGURATION GUIDE

## 📊 Configuration Summary
- **App Service**: app-investimate-5o54xtb4rkg7s
- **Resource Group**: investimate-rg  
- **Environment Variables**: 14 to configure
- **Database**: Supabase PostgreSQL (✅ Tested)
- **Status**: Ready for deployment

---

## 🎯 METHOD 1: AZURE PORTAL (RECOMMENDED)

### Step 1: Access Azure Portal
1. Open: **https://portal.azure.com**
2. Sign in with your Azure account
3. Search for **"App Services"** in the top search bar
4. Click on **app-investimate-5o54xtb4rkg7s**

### Step 2: Navigate to Configuration
1. In the left sidebar, click **"Configuration"**
2. Click on **"Application settings"** tab
3. You should see existing settings (if any)

### Step 3: Add Environment Variables
Click **"+ New application setting"** for each variable below:


**Variable 1: ENVIRONMENT**
- **Name**: `ENVIRONMENT`
- **Value**: `production`
- **Display**: production

**Variable 2: DEBUG**
- **Name**: `DEBUG`
- **Value**: `false`
- **Display**: false

**Variable 3: SECRET_KEY**
- **Name**: `SECRET_KEY`
- **Value**: `**SECRET-KEY-PLACEHOLDER**`
- **Display**: y5GB7kX8...0gPbdH9s

**Variable 4: ALGORITHM**
- **Name**: `ALGORITHM`
- **Value**: `HS256`
- **Display**: HS256

**Variable 5: ACCESS_TOKEN_EXPIRE_MINUTES**
- **Name**: `ACCESS_TOKEN_EXPIRE_MINUTES`
- **Value**: `20`
- **Display**: 20

**Variable 6: DATABASE_URL**
- **Name**: `DATABASE_URL`
- **Value**: `postgresql://postgres:**DB-PASSWORD-PLACEHOLDER**@db.fryuuxrvtkijmxsrmytt.supabase.co:5432/postgres?sslmode=require`
- **Display**: postgresql://postgres:**DB-PASSWORD-PLACEHOLDER**@db.fryuuxrvtkijmxsrmytt.supabase.co:5432/postgres?sslmode=require

**Variable 7: SUPABASE_URL**
- **Name**: `SUPABASE_URL`
- **Value**: `https://fryuuxrvtkijmxsrmytt.supabase.co`
- **Display**: https://fryuuxrvtkijmxsrmytt.supabase.co

**Variable 8: SUPABASE_SERVICE_KEY**
- **Name**: `SUPABASE_SERVICE_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyeXV1eHJ2dGtpam14c3JteXR0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDE2Njg3OCwiZXhwIjoyMDY1NzQyODc4fQ.Vkad2bbLYME9T-88lZstb7MTHdmfCEQyHi-34lU7JWs`
- **Display**: eyJhbGci...34lU7JWs

**Variable 9: SUPABASE_BUCKET**
- **Name**: `SUPABASE_BUCKET`
- **Value**: `reports-investimate`
- **Display**: reports-investimate

**Variable 10: GOOGLE_CLIENT_ID**
- **Name**: `GOOGLE_CLIENT_ID`
- **Value**: `**GOOGLE-CLIENT-ID-PLACEHOLDER**`
- **Display**: **GOOGLE-CLIENT-ID-PLACEHOLDER**

**Variable 11: GOOGLE_CLIENT_SECRET**
- **Name**: `GOOGLE_CLIENT_SECRET`
- **Value**: `**GOOGLE-CLIENT-SECRET-PLACEHOLDER**`
- **Display**: GOCSPX-k...KCZ9ivys

**Variable 12: OPENROUTER_KEY**
- **Name**: `OPENROUTER_KEY`
- **Value**: `**OPENROUTER-KEY-PLACEHOLDER**`
- **Display**: sk-or-v1...1ec3ef46

**Variable 13: GEMINI_KEY**
- **Name**: `GEMINI_KEY`
- **Value**: `**GEMINI-KEY-PLACEHOLDER**`
- **Display**: AIzaSyDU...dbZkzNzY

**Variable 14: CORS_ORIGINS**
- **Name**: `CORS_ORIGINS`
- **Value**: `["https://investimate-ai-eight.vercel.app"]`
- **Display**: ["https://investimate-ai-eight.vercel.app"]


### Step 4: Save Configuration
1. After adding all 14 variables, click **"Save"** at the top
2. Wait for **"Successfully saved"** message (30-60 seconds)
3. Azure will automatically restart the app

### Step 5: Verify Deployment
1. Go to **"Overview"** in the left sidebar
2. Check **Status**: Should show **"Running"**
3. Click on the **URL**: https://app-investimate-5o54xtb4rkg7s.azurewebsites.net/
4. You should see FastAPI documentation page

---

## 🎯 METHOD 2: AZURE CLI (IF AVAILABLE)

### Quick Commands (Copy & Paste):

```bash
# Basic Configuration
az webapp config appsettings set --name "app-investimate-5o54xtb4rkg7s" --resource-group "investimate-rg" --settings \
  "ENVIRONMENT=production" \
  "DEBUG=false" \
  "SECRET_KEY=**SECRET-KEY-PLACEHOLDER**" \
  "ALGORITHM=HS256" \
  "ACCESS_TOKEN_EXPIRE_MINUTES=20"

# Database Configuration  
az webapp config appsettings set --name "app-investimate-5o54xtb4rkg7s" --resource-group "investimate-rg" --settings \
  "DATABASE_URL=postgresql://postgres:**DB-PASSWORD-PLACEHOLDER**@db.fryuuxrvtkijmxsrmytt.supabase.co:5432/postgres?sslmode=require" \
  "SUPABASE_URL=https://fryuuxrvtkijmxsrmytt.supabase.co" \
  "SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyeXV1eHJ2dGtpam14c3JteXR0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDE2Njg3OCwiZXhwIjoyMDY1NzQyODc4fQ.Vkad2bbLYME9T-88lZstb7MTHdmfCEQyHi-34lU7JWs" \
  "SUPABASE_BUCKET=reports-investimate"

# API Keys
az webapp config appsettings set --name "app-investimate-5o54xtb4rkg7s" --resource-group "investimate-rg" --settings \
  "GOOGLE_CLIENT_ID=**GOOGLE-CLIENT-ID-PLACEHOLDER**" \
  "GOOGLE_CLIENT_SECRET=**GOOGLE-CLIENT-SECRET-PLACEHOLDER**" \
  "OPENROUTER_KEY=**OPENROUTER-KEY-PLACEHOLDER**" \
  "GEMINI_KEY=**GEMINI-KEY-PLACEHOLDER**" \
  "CORS_ORIGINS=[\"https://investimate-ai-eight.vercel.app\"]"

# Restart App Service
az webapp restart --name "app-investimate-5o54xtb4rkg7s" --resource-group "investimate-rg"
```

---

## 🔍 METHOD 3: VERIFICATION CHECKLIST

After configuration, verify everything is working:

### ✅ Portal Verification:
1. **Configuration**: All 14 variables present
2. **Status**: App Service shows "Running"  
3. **URL**: https://app-investimate-5o54xtb4rkg7s.azurewebsites.net/ loads
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
- ✅ **Main URL**: https://app-investimate-5o54xtb4rkg7s.azurewebsites.net/ 
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
