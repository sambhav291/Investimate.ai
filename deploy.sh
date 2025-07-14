#!/bin/bash

# 🚀 Deployment Script for Brokerage Report Automation AI
# This script helps you deploy your application step by step

echo "🚀 Brokerage Report Automation AI - Deployment Helper"
echo "=================================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check dependencies
echo "📋 Checking dependencies..."

if ! command_exists git; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

if ! command_exists python3; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "✅ All dependencies are installed!"

# Choose deployment option
echo ""
echo "🎯 Choose your deployment option:"
echo "1. Vercel (Frontend) + Railway (Backend) - Recommended"
echo "2. Docker + Digital Ocean/AWS"
echo "3. Traditional VPS (Ubuntu Server)"
echo "4. Local development setup"

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "🎉 You chose Vercel + Railway deployment!"
        echo ""
        echo "📝 Steps to follow:"
        echo "1. Push your code to GitHub"
        echo "2. Deploy backend to Railway:"
        echo "   - Go to railway.app"
        echo "   - Create new project from GitHub"
        echo "   - Set root directory to 'Backend'"
        echo "   - Add environment variables (check .env.example)"
        echo "3. Deploy frontend to Vercel:"
        echo "   - Go to vercel.com"
        echo "   - Import from GitHub"
        echo "   - Set root directory to 'Frontend'"
        echo "   - Add VITE_API_URL with your Railway backend URL"
        echo ""
        echo "📋 Environment variables needed:"
        echo "Backend: DATABASE_URL, SECRET_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SUPABASE_URL, SUPABASE_KEY, OPENAI_API_KEY"
        echo "Frontend: VITE_API_URL, VITE_GOOGLE_CLIENT_ID"
        ;;
    2)
        echo "🐳 You chose Docker deployment!"
        echo ""
        echo "📝 Steps to follow:"
        echo "1. Make sure Docker is installed"
        echo "2. Create a .env file with your environment variables"
        echo "3. Run: docker-compose up -d"
        echo "4. Your app will be available at http://localhost"
        ;;
    3)
        echo "🖥️ You chose Traditional VPS deployment!"
        echo ""
        echo "📝 Steps to follow:"
        echo "1. Set up Ubuntu server"
        echo "2. Install: python3-pip, nodejs, npm, nginx, postgresql"
        echo "3. Clone your repository"
        echo "4. Install dependencies and configure"
        echo "5. Set up nginx reverse proxy"
        echo ""
        echo "💡 Check DEPLOYMENT.md for detailed instructions"
        ;;
    4)
        echo "🔧 Setting up local development environment..."
        
        # Setup backend
        echo "📦 Setting up backend..."
        cd Backend
        if [ -f "requirements.txt" ]; then
            echo "Installing Python dependencies..."
            pip3 install -r requirements.txt
        fi
        
        if [ ! -f ".env" ]; then
            cp .env.example .env
            echo "⚠️  Please edit Backend/.env with your environment variables"
        fi
        
        # Setup frontend
        echo "📦 Setting up frontend..."
        cd ../Frontend
        if [ -f "package.json" ]; then
            echo "Installing Node.js dependencies..."
            npm install
        fi
        
        if [ ! -f ".env" ]; then
            cp .env.example .env
            echo "⚠️  Please edit Frontend/.env with your environment variables"
        fi
        
        cd ..
        
        echo "✅ Local development setup complete!"
        echo ""
        echo "🚀 To start development:"
        echo "Backend: cd Backend && uvicorn main:app --reload"
        echo "Frontend: cd Frontend && npm run dev"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "📖 For detailed deployment instructions, check DEPLOYMENT.md"
echo "🎯 Need help? Check the troubleshooting section in DEPLOYMENT.md"
echo ""
echo "🎉 Happy deploying!"
