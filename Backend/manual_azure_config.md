# Manual Azure App Service Configuration Guide

## 📋 Environment Variables Configuration

Since Azure CLI is not readily available, here are manual steps to configure your Azure App Service environment variables:

### **Option 1: Azure Portal (Recommended)**

1. **Login to Azure Portal**: https://portal.azure.com
2. **Navigate to your App Service**:
   - Search for "App Services"
   - Select **app-investimate-5o54xtb4rkg7s**
3. **Go to Configuration**:
   - In the left menu, click **"Configuration"**
   - Click **"Application settings"** tab

### **Environment Variables to Add**

Add these **13 environment variables** by clicking **"+ New application setting"**:

#### **Basic Configuration**
| Name | Value |
|------|-------|
| `ENVIRONMENT` | `production` |
| `DEBUG` | `false` |
| `SECRET_KEY` | `**SECRET-KEY-PLACEHOLDER**` |
| `ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `20` |

#### **Database Configuration**
| Name | Value |
|------|-------|
| `DATABASE_URL` | `postgresql://postgres:**DB-PASSWORD-PLACEHOLDER**@db.fryuuxrvtkijmxsrmytt.supabase.co:5432/postgres?sslmode=require` |
| `SUPABASE_URL` | `https://fryuuxrvtkijmxsrmytt.supabase.co` |
| `SUPABASE_SERVICE_KEY` | `**SUPABASE-SERVICE-KEY-PLACEHOLDER**` |
| `SUPABASE_BUCKET` | `reports-investimate` |

#### **Authentication & API Keys**
| Name | Value |
|------|-------|
| `GOOGLE_CLIENT_ID` | `**GOOGLE-CLIENT-ID-PLACEHOLDER**` |
| `GOOGLE_CLIENT_SECRET` | `**GOOGLE-CLIENT-SECRET-PLACEHOLDER**` |
| `OPENROUTER_KEY` | `**OPENROUTER-KEY-PLACEHOLDER**` |
| `GEMINI_KEY` | `**GEMINI-KEY-PLACEHOLDER**` |

#### **CORS Configuration**
| Name | Value |
|------|-------|
| `CORS_ORIGINS` | `[https://investimate-ai-eight.vercel.app]` |

### **Steps to Apply Configuration**

1. **Add each variable**:
   - Click **"+ New application setting"**
   - Enter **Name** and **Value** from the table above
   - Click **"OK"**

2. **Save Configuration**:
   - After adding all 13 variables, click **"Save"** at the top
   - Wait for Azure to apply the changes (takes ~30 seconds)

3. **Restart App Service**:
   - Go to **"Overview"** in the left menu
   - Click **"Restart"** and confirm

### **Option 2: Azure CLI Commands (If Available)**

```bash
# Set basic configuration
az webapp config appsettings set --name app-investimate-5o54xtb4rkg7s --resource-group investimate-rg \
  --settings ENVIRONMENT=production DEBUG=false SECRET_KEY=**SECRET-KEY-PLACEHOLDER** \
  ALGORITHM=HS256 ACCESS_TOKEN_EXPIRE_MINUTES=20

# Set database configuration  
az webapp config appsettings set --name app-investimate-5o54xtb4rkg7s --resource-group investimate-rg \
  --settings DATABASE_URL="postgresql://postgres:**DB-PASSWORD-PLACEHOLDER**@db.fryuuxrvtkijmxsrmytt.supabase.co:5432/postgres?sslmode=require" \
  SUPABASE_URL=https://fryuuxrvtkijmxsrmytt.supabase.co \
  SUPABASE_SERVICE_KEY=**SUPABASE-SERVICE-KEY-PLACEHOLDER** \
  SUPABASE_BUCKET=reports-investimate

# Set API keys
az webapp config appsettings set --name app-investimate-5o54xtb4rkg7s --resource-group investimate-rg \
  --settings GOOGLE_CLIENT_ID=**GOOGLE-CLIENT-ID-PLACEHOLDER** \
  GOOGLE_CLIENT_SECRET=**GOOGLE-CLIENT-SECRET-PLACEHOLDER** \
  OPENROUTER_KEY=**OPENROUTER-KEY-PLACEHOLDER** \
  GEMINI_KEY=**GEMINI-KEY-PLACEHOLDER** \
  CORS_ORIGINS="[https://investimate-ai-eight.vercel.app]"
```

### **Verification Steps**

After configuration:

1. **Check App Status**:
   - Go to **Overview** in Azure portal
   - Ensure **Status** shows **"Running"**

2. **Test API Endpoint**:
   - Visit: `https://app-investimate-5o54xtb4rkg7s.azurewebsites.net/`
   - Should show FastAPI docs interface

3. **Check Environment Variables**:
   - In Configuration > Application settings
   - Verify all 13 variables are present

## 🔍 Troubleshooting

### If App Doesn't Start:
1. Go to **"Logs"** in left menu
2. Check **"App Service logs"**
3. Look for startup errors

### If Variables Don't Apply:
1. **Save** configuration again
2. **Restart** the app service
3. Wait 2-3 minutes for full restart

## ✅ Success Indicators

✅ **App Status**: Running  
✅ **Environment Variables**: 13/13 configured  
✅ **API Endpoint**: Responsive  
✅ **Database**: Connected (via Supabase)  
✅ **Authentication**: OAuth configured  

---

**Next Steps**: After manual configuration, test your application endpoints to ensure everything is working correctly!
