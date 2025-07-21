# 🚀 Deployment Script for Brokerage Report Automation AI (Windows)
# PowerShell script for Windows users

Write-Host "🚀 Brokerage Report Automation AI - Deployment Helper" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Function to check if command exists
function Test-Command {
    param($Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

# Check dependencies
Write-Host "📋 Checking dependencies..." -ForegroundColor Yellow

$dependencies = @("git", "node", "npm", "python")
$missingDeps = @()

foreach ($dep in $dependencies) {
    if (-not (Test-Command $dep)) {
        $missingDeps += $dep
    }
}

if ($missingDeps.Count -gt 0) {
    Write-Host "❌ Missing dependencies: $($missingDeps -join ', ')" -ForegroundColor Red
    Write-Host "Please install the missing dependencies first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ All dependencies are installed!" -ForegroundColor Green

# Choose deployment option
Write-Host ""
Write-Host "🎯 Choose your deployment option:" -ForegroundColor Cyan
Write-Host "1. Vercel (Frontend) + Railway (Backend) - Recommended" -ForegroundColor White
Write-Host "2. Docker + Digital Ocean/AWS" -ForegroundColor White
Write-Host "3. Traditional VPS (Ubuntu Server)" -ForegroundColor White
Write-Host "4. Local development setup" -ForegroundColor White

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host "🎉 You chose Vercel + Railway deployment!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📝 Steps to follow:" -ForegroundColor Yellow
        Write-Host "1. Push your code to GitHub" -ForegroundColor White
        Write-Host "2. Deploy backend to Railway:" -ForegroundColor White
        Write-Host "   - Go to railway.app" -ForegroundColor Gray
        Write-Host "   - Create new project from GitHub" -ForegroundColor Gray
        Write-Host "   - Set root directory to 'Backend'" -ForegroundColor Gray
        Write-Host "   - Add environment variables (check .env.example)" -ForegroundColor Gray
        Write-Host "3. Deploy frontend to Vercel:" -ForegroundColor White
        Write-Host "   - Go to vercel.com" -ForegroundColor Gray
        Write-Host "   - Import from GitHub" -ForegroundColor Gray
        Write-Host "   - Set root directory to 'Frontend'" -ForegroundColor Gray
        Write-Host "   - Add VITE_API_URL with your Railway backend URL" -ForegroundColor Gray
        Write-Host ""
        Write-Host "📋 Environment variables needed:" -ForegroundColor Yellow
        Write-Host "Backend: DATABASE_URL, SECRET_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SUPABASE_URL, SUPABASE_KEY, OPENAI_API_KEY" -ForegroundColor Gray
        Write-Host "Frontend: VITE_API_URL, VITE_GOOGLE_CLIENT_ID" -ForegroundColor Gray
    }
    "2" {
        Write-Host "🐳 You chose Docker deployment!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📝 Steps to follow:" -ForegroundColor Yellow
        Write-Host "1. Make sure Docker is installed" -ForegroundColor White
        Write-Host "2. Create a .env file with your environment variables" -ForegroundColor White
        Write-Host "3. Run: docker-compose up -d" -ForegroundColor White
        Write-Host "4. Your app will be available at http://localhost" -ForegroundColor White
    }
    "3" {
        Write-Host "🖥️ You chose Traditional VPS deployment!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📝 Steps to follow:" -ForegroundColor Yellow
        Write-Host "1. Set up Ubuntu server" -ForegroundColor White
        Write-Host "2. Install: python3-pip, nodejs, npm, nginx, postgresql" -ForegroundColor White
        Write-Host "3. Clone your repository" -ForegroundColor White
        Write-Host "4. Install dependencies and configure" -ForegroundColor White
        Write-Host "5. Set up nginx reverse proxy" -ForegroundColor White
        Write-Host ""
        Write-Host "💡 Check DEPLOYMENT.md for detailed instructions" -ForegroundColor Cyan
    }
    "4" {
        Write-Host "🔧 Setting up local development environment..." -ForegroundColor Green
        
        # Setup backend
        Write-Host "📦 Setting up backend..." -ForegroundColor Yellow
        Set-Location Backend
        
        if (Test-Path "requirements.txt") {
            Write-Host "Installing Python dependencies..." -ForegroundColor White
            python -m pip install -r requirements.txt
        }
        
        if (-not (Test-Path ".env")) {
            Copy-Item ".env.example" ".env"
            Write-Host "⚠️  Please edit Backend/.env with your environment variables" -ForegroundColor Yellow
        }
        
        # Setup frontend
        Write-Host "📦 Setting up frontend..." -ForegroundColor Yellow
        Set-Location ../Frontend
        
        if (Test-Path "package.json") {
            Write-Host "Installing Node.js dependencies..." -ForegroundColor White
            npm install
        }
        
        if (-not (Test-Path ".env")) {
            Copy-Item ".env.example" ".env"
            Write-Host "⚠️  Please edit Frontend/.env with your environment variables" -ForegroundColor Yellow
        }
        
        Set-Location ..
        
        Write-Host "✅ Local development setup complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🚀 To start development:" -ForegroundColor Cyan
        Write-Host "Backend: cd Backend && uvicorn main:app --reload" -ForegroundColor White
        Write-Host "Frontend: cd Frontend && npm run dev" -ForegroundColor White
    }
    default {
        Write-Host "❌ Invalid choice. Please run the script again." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "📖 For detailed deployment instructions, check DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host "🎯 Need help? Check the troubleshooting section in DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Happy deploying!" -ForegroundColor Green
