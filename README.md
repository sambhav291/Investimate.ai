# 🚀 Investimate.ai - Brokerage Report Automation AI

## 📋 Project Overview

Investimate.ai is an AI-powered brokerage report automation platform that generates comprehensive stock analysis reports using free local machine learning models and natural language processing.

## ✨ Features

- **AI-Powered Analysis**: Generate detailed stock reports using free local AI models
- **Multi-Source Data**: Scrapes annual reports, conference calls, and forum discussions
- **PDF Report Generation**: Creates professional PDF reports with charts and analysis
- **User Authentication**: Secure login with Google OAuth and email/password
- **Report Library**: Save and manage generated reports
- **Real-time Preview**: Interactive PDF preview with download capabilities
- **Cost-Free AI**: No API costs - runs entirely on local CPU-based models

## 🛠 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Database with Supabase
- **Free Local AI** - Hugging Face transformers (CPU-only)
- **NLTK** - Natural language processing and sentiment analysis
- **Supabase** - Backend-as-a-Service for storage and auth

### Frontend
- **React** - Modern JavaScript library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React PDF** - PDF viewing component

## 🚀 Deployment

This project is configured for easy deployment on modern platforms:

- **Frontend**: Vercel
- **Backend**: Railway
- **Database**: Supabase
- **Storage**: Supabase Storage

See `DEPLOYMENT.md` for detailed deployment instructions.

## 📁 Project Structure

```
├── Backend/           # FastAPI backend
│   ├── main.py       # Main application
│   ├── Ai_engine/    # AI processing modules
│   ├── Auth/         # Authentication system
│   ├── Generator/    # Report generation
│   └── Scraper/      # Data scraping
├── Frontend/         # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── utils/
│   └── public/
└── docs/            # Documentation
```

## 🔧 Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL or Supabase account

### Backend Setup
```bash
cd Backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd Frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

## 🌟 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For support, email sambhav291@gmail.com or create an issue on GitHub.

---

**Built with ❤️ by Sambhav**
