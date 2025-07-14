# 🚀 Deployment Guide for Brokerage Report Automation AI

## Project Overview
This is a full-stack application with:
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: FastAPI + Python + Supabase
- **Features**: AI-powered stock analysis, report generation, user authentication

## 🌟 **Option 1: Vercel + Railway (Recommended)**

### **Frontend Deployment (Vercel)**

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/brokerage-report-ai.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub
   - Select your repository
   - Set root directory to `Frontend`
   - Add environment variables:
     - `VITE_API_URL`: Your backend URL (will get this after backend deployment)
     - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth client ID

3. **Domain:** Your app will be available at `https://your-project.vercel.app`

### **Backend Deployment (Railway)**

1. **Go to [railway.app](https://railway.app)**
2. **Create new project**
3. **Deploy from GitHub**
4. **Set root directory to `Backend`**
5. **Add environment variables:**
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   SECRET_KEY=your-super-secret-key
   ALGORITHM=HS256
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-supabase-anon-key
   SUPABASE_BUCKET=your-bucket-name
   OPENAI_API_KEY=your-openai-api-key
   ```

6. **Railway will automatically detect Python and use the start command from `railway.toml`**

## 🌟 **Option 2: Docker + Digital Ocean/AWS**

### **Full Docker Deployment**

1. **Create docker-compose.yml:**
   ```yaml
   version: '3.8'
   services:
     backend:
       build: ./Backend
       ports:
         - "8000:8000"
       environment:
         - DATABASE_URL=${DATABASE_URL}
         - SECRET_KEY=${SECRET_KEY}
         - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
         - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
         - SUPABASE_URL=${SUPABASE_URL}
         - SUPABASE_KEY=${SUPABASE_KEY}
         - OPENAI_API_KEY=${OPENAI_API_KEY}
       volumes:
         - ./Backend/reports:/app/reports
     
     frontend:
       build: ./Frontend
       ports:
         - "80:80"
       depends_on:
         - backend
   ```

2. **Deploy to Digital Ocean App Platform:**
   - Connect your GitHub repository
   - Configure build settings
   - Set environment variables
   - Deploy

## 🌟 **Option 3: Traditional VPS Deployment**

### **Using Ubuntu Server (DigitalOcean, Linode, etc.)**

1. **Server Setup:**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install dependencies
   sudo apt install -y python3-pip nodejs npm nginx postgresql postgresql-contrib
   
   # Install PM2 for process management
   sudo npm install -g pm2
   ```

2. **Deploy Backend:**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/brokerage-report-ai.git
   cd brokerage-report-ai/Backend
   
   # Install Python dependencies
   pip3 install -r requirements.txt
   
   # Set up environment variables
   cp .env.example .env
   # Edit .env with your values
   
   # Start with PM2
   pm2 start "uvicorn main:app --host 0.0.0.0 --port 8000" --name "brokerage-backend"
   ```

3. **Deploy Frontend:**
   ```bash
   cd ../Frontend
   npm install
   npm run build
   
   # Copy build files to nginx
   sudo cp -r dist/* /var/www/html/
   ```

4. **Configure Nginx:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           root /var/www/html;
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## 🔧 **Pre-Deployment Checklist**

### **Environment Variables Setup:**
1. **Supabase:** Create project, set up storage bucket
2. **Google OAuth:** Configure OAuth consent screen and credentials
3. **OpenAI API:** Get API key
4. **Database:** Set up PostgreSQL (or use Supabase database)

### **Security Configurations:**
1. **Update CORS origins** in `main.py` to your production domain
2. **Set secure=True** for cookies in production
3. **Use HTTPS** for all production deployments
4. **Update redirect URIs** in Google OAuth settings

### **Performance Optimizations:**
1. **Enable gzip compression** in nginx
2. **Set up CDN** for static files
3. **Configure caching** for API responses
4. **Optimize database queries**

## 📱 **Post-Deployment Steps**

1. **Test all functionality:**
   - User registration/login
   - Google OAuth
   - Stock analysis generation
   - PDF report creation
   - File upload/download

2. **Monitor performance:**
   - Set up logging
   - Monitor API response times
   - Track error rates

3. **Set up backup:**
   - Database backups
   - File storage backups

## 🔧 **Troubleshooting**

### **Common Issues:**
1. **CORS errors:** Update `allow_origins` in main.py
2. **Database connection:** Check DATABASE_URL format
3. **Google OAuth:** Verify redirect URIs
4. **File upload issues:** Check Supabase permissions

### **Logs to Check:**
- Application logs (pm2 logs or Railway logs)
- Nginx access/error logs
- Database connection logs

## 📞 **Support**

For deployment issues:
1. Check the logs first
2. Verify all environment variables
3. Test API endpoints individually
4. Check network connectivity

---

Choose the deployment option that best fits your needs and budget. Option 1 (Vercel + Railway) is recommended for beginners, while Option 3 gives you more control but requires more setup.
