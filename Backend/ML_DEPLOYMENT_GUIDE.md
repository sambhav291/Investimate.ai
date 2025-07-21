# 🤖 ML Dependencies Management Guide

## Current Setup Status

### ✅ **What's Working Now (F1 Plan)**
- **Basic FastAPI application** running successfully
- **Supabase database** ready for connection
- **OpenAI & Google AI** API integrations available
- **File upload & processing** without ML models
- **Authentication & JWT** working
- **Report generation** (text-based) functional

### ⚠️ **ML Features Requiring B1+ Plan**

The following features need the **B1 plan or higher** due to memory requirements:

#### Heavy ML Dependencies (Currently Commented Out):
```python
# Uncomment these in requirements_minimal.txt when upgrading to B1+:
# torch>=2.0.0
# transformers>=4.30.0  
# huggingface-hub>=0.16.0
```

#### ML-Powered Features That Need B1+:
1. **Sentiment Analysis** (Preprocessing modules)
2. **Text Summarization** with Transformers
3. **Document Classification**
4. **Advanced NLP Processing**

## 🔄 How to Upgrade for Full ML Features

### Step 1: Upgrade App Service Plan
```bash
# Upgrade to B1 plan ($13.14/month)
az appservice plan update --name ASP-investimaterg-b62b --resource-group investimate-rg --sku B1
```

### Step 2: Enable ML Dependencies
```bash
# Uncomment the ML packages in requirements_minimal.txt:
torch>=2.0.0
transformers>=4.30.0  
huggingface-hub>=0.16.0
scikit-learn>=1.3.0
```

### Step 3: Deploy Updated Requirements
```bash
# Deploy with ML dependencies
azd deploy
```

### Step 4: Verify ML Features
Your ML modules in these folders will now work:
- `Preprocessing/` - Sentiment analysis & text classification
- `Enhanced_preprocessing/` - Advanced NLP features
- `Ai_engine/` - AI-powered summarization

## 💡 Current Workarounds on F1 Plan

### Option 1: Use API-Based ML (Recommended)
Instead of local ML models, use:
- **OpenAI GPT** for summarization
- **Google Gemini** for text analysis
- **Cloud APIs** for heavy processing

### Option 2: Lightweight Alternatives
- Use `spacy-small` models instead of transformers
- Use `scikit-learn` simple models
- Use regex-based sentiment analysis

## 🎯 Environment Variables You Need

### Required for Supabase Database:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres:your-password@db.your-project-id.supabase.co:5432/postgres
```

### Required for AI APIs:
```env
OPENAI_API_KEY=your-openai-key
GOOGLE_AI_API_KEY=your-google-ai-key
```

### Add these via Azure CLI:
```bash
az webapp config appsettings set --name "app-investimate-5o54xtb4rkg7s" --resource-group "investimate-rg" --settings "SUPABASE_URL=your-url" "SUPABASE_ANON_KEY=your-key" "DATABASE_URL=your-db-url" "OPENAI_API_KEY=your-openai-key"
```

## 🚀 Next Steps

1. **Set up Supabase** - Get your database credentials
2. **Get API keys** - OpenAI and Google AI
3. **Configure environment variables** in Azure
4. **Test basic features** on F1 plan
5. **Upgrade to B1** when you need ML features
6. **Enable ML dependencies** and redeploy

Your app is ready to scale! 🎉
