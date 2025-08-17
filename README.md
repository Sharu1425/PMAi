# 🏥 PMAi - AI-Powered Healthcare Assistant

**PMAi** is a comprehensive healthcare application that combines AI-powered symptom analysis, personalized diet recommendations, medication management, and health tracking. Built with modern web technologies and powered by Google's Gemini AI.

## ✨ Features

### 🤖 AI-Powered Healthcare
- **Symptom Analysis**: Get instant insights about health symptoms with AI-powered analysis
- **Diet Recommendations**: Personalized nutrition advice based on health goals and restrictions
- **Meal Planning**: Complete meal plans with calorie targets and dietary preferences
- **AI Chat**: Interactive health conversations with context awareness

### 👤 User Management
- **Authentication**: Secure login/signup with JWT tokens
- **Google OAuth**: One-click login with Google accounts
- **Face Recognition**: Biometric authentication using facial recognition
- **Profile Management**: Comprehensive health profiles with medical history

### 💊 Health Tracking
- **Medication Management**: Track medications, dosages, and schedules
- **Symptom Logging**: Record and monitor health symptoms
- **Health Statistics**: Comprehensive health metrics and insights
- **Diet Plans**: Save and manage personalized nutrition plans

### 🔒 Security & Performance
- **Rate Limiting**: Protected against API abuse
- **Input Validation**: Robust error handling and data validation
- **CORS Configuration**: Secure cross-origin resource sharing
- **Compression**: Optimized response times

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive design
- **React Router** for navigation
- **Axios** for API communication

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Google Gemini AI** for intelligent responses
- **JWT** for authentication
- **Passport.js** for OAuth strategies
- **Multer** for file uploads
- **Rate Limiting** for API protection

### AI & Services
- **Google Generative AI (Gemini 2.0 Flash)**
- **Custom AI Prompts** for healthcare and nutrition
- **Context-Aware Responses** with conversation history
- **Personalized Recommendations** based on user profiles

## 📁 Project Structure

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

## 🔌 API Endpoints

### Authentication (`/auth`)
- `POST /auth/google` - Google OAuth client-side authentication
- `GET /auth/google` - Google OAuth server-side flow
- `GET /auth/google/callback` - Google OAuth callback
- `POST /auth/logout` - User logout
- `GET /auth/status` - Authentication status check
- `GET /auth/face-status` - Face registration status
- `POST /auth/register-face` - Face registration
- `POST /auth/login-face` - Face authentication
- `POST /auth/identify-face` - Face identification

### Users (`/users`)
- `POST /users/register` - User registration
- `POST /users/login` - User login
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `POST /users/upload-avatar` - Profile picture upload
- `DELETE /users/account` - Delete user account

### AI Services (`/api/ai`)
- `POST /api/ai/analyze-symptoms` - Symptom analysis with AI
- `POST /api/ai/diet-recommendations` - Personalized diet advice
- `POST /api/ai/chat` - AI-powered health conversations
- `POST /api/ai/meal-plan` - Complete meal planning
- `GET /api/ai/health` - AI service health check

### Medications (`/api/medications`)
- `GET /api/medications` - Get user medications
- `POST /api/medications` - Add new medication
- `PUT /api/medications/:id` - Update medication
- `DELETE /api/medications/:id` - Delete medication
- `PATCH /api/medications/:id/taken` - Mark medication as taken

### Health Tracking (`/api/health`)
- `GET /api/health/symptoms` - Get user symptoms
- `POST /api/health/symptoms` - Add new symptom
- `GET /api/health/stats` - Health statistics
- `GET /api/health/diet-plans` - Get saved diet plans
- `POST /api/health/diet-plans` - Save new diet plan

### Utility Endpoints
- `GET /health` - Server health check
- `POST /debug` - Debug endpoint for testing

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB instance
- Google Cloud account (for Gemini AI)
- Google OAuth credentials (optional)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PMAi/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   # Server Configuration
   PORT=5001
   NODE_ENV=development
   
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/PMAi
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Session Configuration
   SESSION_SECRET=your-session-secret-key-here
   
   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:5001/auth/google/callback
   
   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   
   # Google AI Configuration
   GEMINI_API_KEY=your-gemini-api-key
   
   # Bcrypt Configuration
   BCRYPT_ROUNDS=12
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../src
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## 🤖 AI Features Configuration

### Enhanced AI Prompts
The AI service uses carefully crafted prompts for optimal responses:

- **Health Assistant**: Medical guidance with safety disclaimers
- **Diet Planner**: Nutritional advice with personalization
- **Meal Planner**: Structured meal plans with nutritional balance

### AI Safety Features
- Content filtering and safety settings
- Medical consultation recommendations
- Allergy and dietary restriction awareness
- Rate limiting to prevent abuse

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Rate Limiting** for all API endpoints
- **Input Validation** with comprehensive error handling
- **CORS Configuration** for secure cross-origin requests
- **Helmet.js** for security headers
- **File Upload Validation** with size and type restrictions

## 📊 Performance Features

- **Response Compression** for faster data transfer
- **MongoDB Indexing** for optimized queries
- **Rate Limiting** to maintain service quality
- **Error Handling** with graceful fallbacks
- **Logging** with Morgan for monitoring

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### API Testing
Use tools like Postman or curl to test endpoints:
```bash
# Health check
curl http://localhost:5001/health

# Test AI endpoint
curl -X POST http://localhost:5001/api/ai/analyze-symptoms \
  -H "Content-Type: application/json" \
  -d '{"symptoms": ["headache", "fatigue"]}'
```

## 🚀 Deployment

### Backend Deployment
1. Set environment variables for production
2. Use PM2 or similar process manager
3. Configure MongoDB Atlas for production database
4. Set up proper CORS origins

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to Vercel, Netlify, or similar platforms
3. Update API base URL in environment variables

## 📝 API Documentation

### Request/Response Format
All API endpoints follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "success": false
}
```

### Authentication
Most endpoints require JWT authentication:
```bash
Authorization: Bearer <your-jwt-token>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support & Troubleshooting

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

### 🚨 Common Issues

**AI Service 500 Errors**: If you're getting 500 errors on AI endpoints, check the [Troubleshooting Guide](docs/TROUBLESHOOTING.md) for solutions.

**Quick Fix**: Most AI issues are resolved by setting the correct `GEMINI_API_KEY` environment variable.

### 📚 Documentation

- [API Documentation](docs/API.md) - Complete API reference
- [Setup Guide](docs/SETUP.md) - Installation and deployment
- [Troubleshooting Guide](docs/TROUBLESHOOTING.md) - Common issues and solutions

## 🔄 Changelog

### Latest Updates
- ✅ Complete API endpoint implementation
- ✅ Enhanced AI prompts for better responses
- ✅ Comprehensive security features
- ✅ File upload system with validation
- ✅ Rate limiting and abuse protection
- ✅ Input validation and error handling
- ✅ Medication and health tracking APIs
- ✅ Face recognition authentication
- ✅ Google OAuth integration

---

**PMAi** - Empowering healthcare with AI technology 🚀
