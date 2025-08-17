# 📚 PMAi API Documentation

## Overview

The PMAi API provides comprehensive healthcare services including AI-powered symptom analysis, diet recommendations, medication management, and health tracking. All endpoints follow RESTful principles and return consistent JSON responses.

## Base URL

- **Development**: `http://localhost:5001`
- **Production**: `https://pmai-3rq4.onrender.com`

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "success": false
}
```

## Rate Limiting

- **General endpoints**: 100 requests per 15 minutes
- **Authentication endpoints**: 5 requests per 15 minutes
- **AI endpoints**: 10 requests per minute
- **Medication endpoints**: 50 requests per 15 minutes
- **Health endpoints**: 100 requests per 15 minutes

---

## 🔐 Authentication Endpoints

### Google OAuth (Client-side)

**POST** `/auth/google`

Authenticate user with Google OAuth token.

**Request Body:**
```json
{
  "access_token": "google-access-token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Google authentication successful",
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "profilePicture": "profile-picture-url",
    "isAdmin": false
  }
}
```

### Google OAuth (Server-side)

**GET** `/auth/google`

Redirects to Google OAuth consent screen.

### Google OAuth Callback

**GET** `/auth/google/callback`

Google OAuth callback endpoint. Redirects to frontend with user data.

### Logout

**POST** `/auth/logout`

Logout user and destroy session.

**Response:**
```json
{
  "success": true
}
```

### Authentication Status

**GET** `/auth/status`

Check current authentication status.

**Response:**
```json
{
  "isAuthenticated": true,
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "profilePicture": "profile-picture-url",
    "isAdmin": false
  }
}
```

### Face Recognition Endpoints

#### Check Face Status

**GET** `/auth/face-status?userId=<user-id>`

Check if user has registered face recognition.

**Response:**
```json
{
  "hasFaceRegistered": false,
  "message": "Face not registered"
}
```

#### Register Face

**POST** `/auth/register-face`

Register user's face for biometric authentication.

**Request Body:**
```json
{
  "userId": "user-id",
  "faceDescriptor": [0.1, 0.2, 0.3, ...] // 128-dimensional vector
}
```

**Response:**
```json
{
  "success": true,
  "message": "Face registered successfully",
  "hasFaceRegistered": true
}
```

#### Face Login

**POST** `/auth/login-face`

Authenticate user using face recognition.

**Request Body:**
```json
{
  "userId": "user-id",
  "faceDescriptor": [0.1, 0.2, 0.3, ...] // 128-dimensional vector
}
```

**Response:**
```json
{
  "success": true,
  "message": "Face authentication successful",
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "profilePicture": "profile-picture-url",
    "isAdmin": false
  }
}
```

#### Face Identification

**POST** `/auth/identify-face`

Identify user by face without knowing user ID.

**Request Body:**
```json
{
  "faceDescriptor": [0.1, 0.2, 0.3, ...] // 128-dimensional vector
}
```

**Response:**
```json
{
  "success": true,
  "message": "Face authentication successful",
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "profilePicture": "profile-picture-url",
    "isAdmin": false
  }
}
```

---

## 👤 User Management Endpoints

### User Registration

**POST** `/users/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "User Name",
  "username": "username",
  "email": "user@example.com",
  "password": "secure-password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "username": "username",
    "profilePicture": "",
    "isAdmin": false,
    "hasFaceRegistered": false,
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### User Login

**POST** `/users/login`

Authenticate existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "username": "username",
    "profilePicture": "profile-picture-url",
    "isAdmin": false,
    "hasFaceRegistered": true,
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get User Profile

**GET** `/users/profile`

Get current user's profile information.

**Headers:**
```bash
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "username": "username",
    "profilePicture": "profile-picture-url",
    "age": 25,
    "gender": "Male",
    "height": 175,
    "weight": 70,
    "phone": "+1234567890",
    "medicalHistory": [],
    "allergies": [],
    "medications": [],
    "isAdmin": false,
    "hasFaceRegistered": true,
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update User Profile

**PUT** `/users/profile`

Update current user's profile information.

**Headers:**
```bash
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "age": 26,
  "height": 176,
  "weight": 71,
  "allergies": ["peanuts", "shellfish"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user-id",
    "name": "Updated Name",
    "age": 26,
    "height": 176,
    "weight": 71,
    "allergies": ["peanuts", "shellfish"],
    // ... other profile fields
  }
}
```

### Upload Profile Picture

**POST** `/users/upload-avatar`

Upload user's profile picture.

**Headers:**
```bash
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data
```

**Request Body:**
```
FormData with field 'profilePicture' containing image file
```

**Response:**
```json
{
  "success": true,
  "data": {
    "profilePicture": "/uploads/profilePicture-1234567890.jpg"
  },
  "message": "Profile picture uploaded successfully"
}
```

### Delete User Account

**DELETE** `/users/account`

Delete current user's account.

**Headers:**
```bash
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## 🤖 AI Services Endpoints

### Symptom Analysis

**POST** `/api/ai/analyze-symptoms`

Analyze health symptoms using AI.

**Request Body:**
```json
{
  "symptoms": ["headache", "fatigue", "nausea"],
  "message": "I've been feeling unwell lately",
  "conversationHistory": [
    {
      "from": "user",
      "text": "I have a headache"
    },
    {
      "from": "assistant",
      "text": "How long have you had the headache?"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": "Based on your symptoms of headache, fatigue, and nausea, here are some possible causes and home care suggestions:\n\n**Common Causes:**\n- Stress or tension\n- Dehydration\n- Lack of sleep\n- Viral infection\n\n**Home Care Tips:**\n- Rest in a quiet, dark room\n- Stay hydrated with water\n- Practice relaxation techniques\n- Get adequate sleep\n\n**When to Seek Medical Attention:**\n- Severe or persistent headache\n- Headache with fever or stiff neck\n- Headache after head injury\n\nHow long have these symptoms been present?"
}
```

### Diet Recommendations

**POST** `/api/ai/diet-recommendations`

Get personalized diet recommendations.

**Request Body:**
```json
{
  "message": "I want to lose weight and build muscle",
  "conversationHistory": [],
  "userProfile": {
    "age": 25,
    "gender": "Male",
    "healthConditions": [],
    "dietaryRestrictions": ["vegetarian"],
    "weightGoals": "lose weight and build muscle",
    "activityLevel": "moderate"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": "Here's a personalized diet plan for your weight loss and muscle building goals:\n\n**Breakfast:**\n- Greek yogurt with berries and nuts (300 calories)\n- Protein smoothie with plant-based protein powder\n\n**Lunch:**\n- Quinoa bowl with chickpeas, vegetables, and tahini dressing (400 calories)\n- Side of mixed greens\n\n**Dinner:**\n- Lentil curry with brown rice (350 calories)\n- Roasted vegetables\n\n**Snacks:**\n- Hummus with carrot sticks\n- Mixed nuts and seeds\n\n**Key Benefits:**\n- High protein for muscle building\n- Complex carbs for energy\n- Fiber for satiety\n- Vegetarian-friendly\n\nWhat's your current daily calorie intake?"
}
```

### AI Chat

**POST** `/api/ai/chat`

Have a conversation with the AI health assistant.

**Request Body:**
```json
{
  "message": "What are the benefits of meditation?",
  "context": "health and wellness",
  "conversationHistory": []
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Meditation offers numerous health benefits:\n\n**Mental Health:**\n- Reduces stress and anxiety\n- Improves focus and concentration\n- Enhances emotional well-being\n\n**Physical Health:**\n- Lowers blood pressure\n- Improves sleep quality\n- Boosts immune system\n\n**Daily Practice:**\n- Start with 5-10 minutes daily\n- Focus on breathing\n- Find a quiet space\n\n**Tips for Beginners:**\n- Use guided meditation apps\n- Practice at the same time daily\n- Be patient with yourself\n\nHave you tried meditation before?"
  }
}
```

### Meal Planning

**POST** `/api/ai/meal-plan`

Generate a complete meal plan.

**Request Body:**
```json
{
  "calories": 2000,
  "dietType": "Mediterranean",
  "allergies": ["shellfish", "nuts"],
  "meals": 4,
  "userProfile": {
    "age": 30,
    "gender": "Female",
    "activityLevel": "active"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": "**Mediterranean Meal Plan - 2000 Calories**\n\n**Breakfast (500 calories):**\n- Greek yogurt with honey and fresh fruit\n- Whole grain toast with olive oil\n- Herbal tea\n\n**Morning Snack (200 calories):**\n- Hummus with cucumber slices\n- Small apple\n\n**Lunch (600 calories):**\n- Grilled chicken breast with quinoa\n- Roasted vegetables (bell peppers, zucchini, eggplant)\n- Olive oil and lemon dressing\n- Side salad with feta cheese\n\n**Dinner (500 calories):**\n- Baked salmon with herbs\n- Brown rice pilaf\n- Steamed broccoli\n- Glass of red wine (optional)\n\n**Evening Snack (200 calories):**\n- Mixed berries with Greek yogurt\n- Drizzle of honey\n\n**Nutritional Breakdown:**\n- Protein: 25%\n- Carbohydrates: 45%\n- Healthy Fats: 30%\n\nHow does this meal plan align with your preferences?"
}
```

---

## 💊 Medication Management Endpoints

### Get All Medications

**GET** `/api/medications`

Get user's medication list.

**Headers:**
```bash
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Aspirin",
      "dosage": "100mg",
      "frequency": "Once daily",
      "time": "09:00",
      "instructions": "Take with food",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Add New Medication

**POST** `/api/medications`

Add a new medication to user's list.

**Headers:**
```bash
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "Ibuprofen",
  "dosage": "400mg",
  "frequency": "Every 6 hours as needed",
  "time": "08:00",
  "instructions": "Take with food to avoid stomach upset"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "2",
    "name": "Ibuprofen",
    "dosage": "400mg",
    "frequency": "Every 6 hours as needed",
    "time": "08:00",
    "instructions": "Take with food to avoid stomach upset",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Medication added successfully"
}
```

### Update Medication

**PUT** `/api/medications/:id`

Update existing medication information.

**Headers:**
```bash
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "dosage": "500mg",
  "frequency": "Every 8 hours as needed"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "2",
    "name": "Ibuprofen",
    "dosage": "500mg",
    "frequency": "Every 8 hours as needed",
    "time": "08:00",
    "instructions": "Take with food to avoid stomach upset",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Medication updated successfully"
}
```

### Delete Medication

**DELETE** `/api/medications/:id`

Remove medication from user's list.

**Headers:**
```bash
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Medication deleted successfully"
}
```

### Mark Medication as Taken

**PATCH** `/api/medications/:id/taken`

Mark medication as taken or not taken.

**Headers:**
```bash
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "taken": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Medication marked as taken"
}
```

---

## 🏥 Health Tracking Endpoints

### Get All Symptoms

**GET** `/api/health/symptoms`

Get user's symptom history.

**Headers:**
```bash
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Headache",
      "severity": "moderate",
      "duration": "2 hours",
      "description": "Dull pain in the forehead",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Add New Symptom

**POST** `/api/health/symptoms`

Log a new symptom.

**Headers:**
```bash
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "Fatigue",
  "severity": "mild",
  "duration": "1 day",
  "description": "Feeling tired and low energy"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "2",
    "name": "Fatigue",
    "severity": "mild",
    "duration": "1 day",
    "description": "Feeling tired and low energy",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Symptom added successfully"
}
```

### Get Health Statistics

**GET** `/api/health/stats`

Get comprehensive health statistics.

**Headers:**
```bash
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSymptoms": 5,
    "totalMedications": 3,
    "healthScore": 85,
    "lastCheckup": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Diet Plans

**GET** `/api/health/diet-plans`

Get user's saved diet plans.

**Headers:**
```bash
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Balanced Diet Plan",
      "description": "A balanced diet for general health",
      "calories": 2000,
      "meals": ["Breakfast", "Lunch", "Dinner"],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Save Diet Plan

**POST** `/api/health/diet-plans`

Save a new diet plan.

**Headers:**
```bash
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "Weight Loss Plan",
  "description": "Low-calorie diet for weight loss",
  "calories": 1500,
  "meals": ["Breakfast", "Lunch", "Dinner", "Snack"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "2",
    "name": "Weight Loss Plan",
    "description": "Low-calorie diet for weight loss",
    "calories": 1500,
    "meals": ["Breakfast", "Lunch", "Dinner", "Snack"],
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Diet plan saved successfully"
}
```

---

## 🔧 Utility Endpoints

### Health Check

**GET** `/health`

Check server health and status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "version": "1.0.0"
}
```

### Debug Endpoint

**POST** `/debug`

Debug endpoint for testing frontend connectivity.

**Request Body:**
```json
{
  "test": "data",
  "message": "Hello from frontend"
}
```

**Response:**
```json
{
  "message": "Debug endpoint working",
  "received": {
    "test": "data",
    "message": "Hello from frontend"
  },
  "headers": {
    "content-type": "application/json",
    "user-agent": "Mozilla/5.0..."
  }
}
```

---

## 🚨 Error Codes

| Status Code | Error Type | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Invalid input or missing required fields |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

## 📝 Notes

- All timestamps are in ISO 8601 format
- File uploads are limited to 5MB and image files only
- Rate limits are applied per IP address
- JWT tokens expire after 24 hours
- Face descriptors must be 128-dimensional vectors
- User IDs are MongoDB ObjectIds

---

**For more information, see the main README.md file.**
