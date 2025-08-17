# PMAi Troubleshooting Guide

## Common Errors and Solutions

### 1. 500 Server Error on `/users/profile` Endpoint

**Error:** `pmai-3rq4.onrender.com/users/profile:1 Failed to load resource: the server responded with a status of 500`

**Possible Causes:**
- MongoDB connection issues
- JWT token validation failures
- Missing environment variables
- Database authentication problems

**Solutions:**

#### Check Database Connection
```bash
cd backend
npm run test-connection
```

#### Verify Environment Variables
Ensure these are set in your `.env` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pmai
JWT_SECRET=your-secret-key
NODE_ENV=production
```

#### Check Server Logs
Look for these specific error messages:
- `MongoNetworkError` - Database connection issue
- `JsonWebTokenError` - JWT token problem
- `ValidationError` - Data validation failure

#### Test Health Endpoint
```bash
curl https://pmai-3rq4.onrender.com/health
```

### 2. TypeError: Cannot read properties of undefined (reading 'Breakfast')

**Error:** `TypeError: Cannot read properties of undefined (reading 'Breakfast')`

**Cause:** The diet plan API is returning data in an unexpected format, causing the frontend to fail when trying to access meal properties.

**Solutions:**

#### Frontend Fix Applied
The DietRecom component now includes:
- Better error handling for API responses
- Fallback to mock data when API fails
- Validation of API response structure
- Graceful degradation when data is missing

#### Backend Fix Applied
The AI routes now include:
- Better error handling for AI service failures
- Fallback responses when AI service is unavailable
- Input validation and sanitization
- Proper error messages instead of cryptic "m" errors

### 3. Error analyzing symptoms: m

**Error:** `Error analyzing symptoms: m`

**Cause:** The AI service is returning an error response that's not being properly handled, resulting in truncated error messages.

**Solutions:**

#### Backend Improvements
- Enhanced error handling in AI routes
- Fallback responses when AI service fails
- Better error logging and debugging
- Graceful degradation for AI features

#### Frontend Improvements
- Better error message display
- Fallback analysis results
- User-friendly error handling
- Retry mechanisms for failed requests

## Debugging Steps

### 1. Check Server Status
```bash
# Test the health endpoint
curl https://pmai-3rq4.onrender.com/health

# Expected response:
{
  "status": "OK",
  "database": {
    "status": "connected",
    "readyState": 1
  }
}
```

### 2. Test Database Connection
```bash
cd backend
npm run test-connection
```

### 3. Check Environment Variables
```bash
# In your deployment environment, verify:
echo $MONGODB_URI
echo $JWT_SECRET
echo $NODE_ENV
```

### 4. Monitor Server Logs
Look for these patterns:
- `🔍 Profile request for user ID:` - Successful profile requests
- `❌ Profile fetch error:` - Profile fetch failures
- `❌ Database connection error:` - Database issues
- `❌ JWT verification failed:` - Authentication problems

## Prevention Measures

### 1. Environment Variable Validation
The server now validates critical environment variables on startup.

### 2. Graceful Degradation
- AI features fall back to helpful responses when the service is unavailable
- Frontend components handle missing data gracefully
- User experience remains functional even during partial failures

### 3. Comprehensive Error Logging
- Detailed error messages with stack traces
- Categorized error types for easier debugging
- Request/response logging for API endpoints

### 4. Health Monitoring
- Database connection status monitoring
- Memory usage tracking
- Uptime and performance metrics

## Getting Help

If you continue to experience issues:

1. **Check the server logs** for detailed error information
2. **Test the health endpoint** to verify system status
3. **Run the connection test** to diagnose database issues
4. **Verify environment variables** are properly configured
5. **Check MongoDB Atlas** for connection and authentication issues

## Recent Fixes Applied

- ✅ Enhanced auth middleware error handling
- ✅ Improved user profile endpoint error handling
- ✅ Fixed diet plan data validation in frontend
- ✅ Added fallback responses for AI service failures
- ✅ Enhanced error logging and debugging
- ✅ Added comprehensive health check endpoint
- ✅ Created database connection test script
- ✅ Improved frontend error handling and user experience
