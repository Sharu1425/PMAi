# 🚀 PMAi Setup Guide

This guide will walk you through setting up the PMAi project on your local machine and deploying it to production.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher (comes with Node.js)
- **MongoDB** 6.0 or higher (local or cloud)
- **Git** for version control

### Check Your Versions

```bash
node --version
npm --version
git --version
```

## 🏗️ Project Structure

```
PMAi/
├── backend/                 # Backend server
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── services/           # Business logic & AI services
│   ├── utils/              # Utility functions
│   └── uploads/            # File upload directory
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
└── docs/                   # Documentation
```

## 🔧 Backend Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd PMAi
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/PMAi

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production

# Session Configuration
SESSION_SECRET=your-session-secret-key-here-change-in-production

# Google OAuth Configuration (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5001/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Google AI Configuration
GEMINI_API_KEY=your-gemini-api-key

# Bcrypt Configuration
BCRYPT_ROUNDS=12

# Cloud Storage (Optional - for production)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (Optional - for production)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 4. MongoDB Setup

#### Option A: Local MongoDB

1. **Install MongoDB Community Edition**
   - [Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
   - [macOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
   - [Linux](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. **Start MongoDB Service**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

3. **Verify Connection**
   ```bash
   mongosh
   # or
   mongo
   ```

#### Option B: MongoDB Atlas (Cloud)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create Cluster**
   - Choose "Free" tier
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Configure Database Access**
   - Go to "Database Access"
   - Add a new database user
   - Remember username and password

4. **Configure Network Access**
   - Go to "Network Access"
   - Add your IP address or `0.0.0.0/0` for all access

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

### 5. Google AI Setup

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Gemini API**
   - Go to "APIs & Services" > "Library"
   - Search for "Gemini API"
   - Click "Enable"

3. **Create API Key**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key

4. **Add to Environment**
   ```env
   GEMINI_API_KEY=your-gemini-api-key
   ```

### 6. Google OAuth Setup (Optional)

1. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" user type
   - Fill in required information

2. **Create OAuth Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5001/auth/google/callback` (development)
     - `https://yourdomain.com/auth/google/callback` (production)

3. **Add to Environment**
   ```env
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

### 7. Create Uploads Directory

```bash
mkdir uploads
```

### 8. Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

**Expected Output:**
```
🚀 Server running on port 5001
📱 Frontend URL: http://localhost:5173
🔗 API URL: http://localhost:5001
🌍 Environment: development
✅ Connected to MongoDB
```

## 🎨 Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd ../src
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `src` directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5001

# Google OAuth (Optional)
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# App Configuration
VITE_APP_NAME=PMAi
VITE_APP_VERSION=1.0.0
```

### 4. Start Frontend Development Server

```bash
npm run dev
```

**Expected Output:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## 🧪 Testing the Setup

### 1. Backend Health Check

```bash
curl http://localhost:5001/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "version": "1.0.0"
}
```

### 2. Frontend Access

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001

### 3. Test AI Endpoint

```bash
curl -X POST http://localhost:5001/api/ai/analyze-symptoms \
  -H "Content-Type: application/json" \
  -d '{"symptoms": ["headache", "fatigue"]}'
```

## 🚀 Production Deployment

### Backend Deployment

#### Option A: Render (Recommended for Free Tier)

1. **Connect Repository**
   - Go to [Render](https://render.com/)
   - Sign up with GitHub
   - Connect your PMAi repository

2. **Create Web Service**
   - Click "New" > "Web Service"
   - Select your repository
   - Configure settings:
     - **Name**: pmai-backend
     - **Environment**: Node
     - **Build Command**: `cd backend && npm install`
     - **Start Command**: `cd backend && npm start`

3. **Environment Variables**
   - Add all environment variables from your `.env` file
   - Update URLs for production:
     ```env
     NODE_ENV=production
     FRONTEND_URL=https://your-frontend-domain.com
     MONGODB_URI=your-production-mongodb-uri
     ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

#### Option B: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create App**
   ```bash
   heroku create pmai-backend
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-production-mongodb-uri
   heroku config:set JWT_SECRET=your-production-jwt-secret
   # ... add all other environment variables
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### Frontend Deployment

#### Option A: Vercel (Recommended)

1. **Connect Repository**
   - Go to [Vercel](https://vercel.com/)
   - Sign up with GitHub
   - Import your PMAi repository

2. **Configure Build Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `./src`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Environment Variables**
   - Add your production API URL:
     ```env
     VITE_API_BASE_URL=https://your-backend-domain.com
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

#### Option B: Netlify

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com/)
   - Sign up with GitHub
   - Connect your repository

2. **Configure Build Settings**
   - **Build command**: `cd src && npm run build`
   - **Publish directory**: `src/dist`

3. **Environment Variables**
   - Add your production API URL

4. **Deploy**
   - Click "Deploy site"

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit `.env` files to version control
- Use strong, unique secrets for production
- Rotate secrets regularly

### 2. CORS Configuration
- Restrict CORS origins in production
- Only allow your frontend domain

### 3. Rate Limiting
- Monitor rate limit violations
- Adjust limits based on usage patterns

### 4. Database Security
- Use strong database passwords
- Restrict database access by IP
- Enable MongoDB authentication

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Check connection string
mongodb://username:password@host:port/database
```

#### 2. Port Already in Use
```bash
# Find process using port 5001
lsof -i :5001

# Kill process
kill -9 <PID>
```

#### 3. Module Not Found
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 4. AI Service Not Working
- Verify `GEMINI_API_KEY` is set correctly
- Check Google Cloud Console for API quotas
- Ensure Gemini API is enabled

### Getting Help

1. **Check Logs**
   - Backend: Check terminal output
   - Frontend: Check browser console

2. **Verify Environment Variables**
   - Ensure all required variables are set
   - Check for typos in variable names

3. **Test Individual Components**
   - Test MongoDB connection separately
   - Test AI service with simple requests

4. **Create Issue**
   - Document the problem clearly
   - Include error messages and logs
   - Specify your environment

## 📚 Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Google AI Documentation](https://ai.google.dev/docs)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/guide/)

## 🎉 Success!

Once you've completed all steps, you should have:

- ✅ Backend server running on port 5001
- ✅ Frontend application running on port 5173
- ✅ MongoDB database connected
- ✅ AI services working with Gemini
- ✅ All API endpoints accessible
- ✅ File upload system functional

Your PMAi application is now ready for development and testing! 🚀

---

**Need help?** Check the troubleshooting section or create an issue in the repository.
