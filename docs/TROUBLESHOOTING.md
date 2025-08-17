# 🐛 PMAi Troubleshooting Guide

This guide helps you resolve common issues with the PMAi application.

## 🚨 Common Error: 500 Internal Server Error on AI Endpoints

### Symptoms
- Frontend shows "Error analyzing symptoms: m" or "Error sending chat message: m"
- Browser console shows "Failed to load resource: the server responded with a status of 500"
- AI features return generic error messages

### Root Causes & Solutions

#### 1. **Missing or Invalid Gemini API Key**

**Problem**: `GEMINI_API_KEY` environment variable is not set or invalid.

**Symptoms**:
- AI endpoints return 500 errors
- Console shows "API key not valid" errors
- Fallback responses are used instead of AI-generated content

**Solutions**:

**Option A: Set Environment Variable**
```bash
# Backend directory
export GEMINI_API_KEY=your-actual-gemini-api-key
# or add to .env file
echo "GEMINI_API_KEY=your-actual-gemini-api-key" >> .env
```

**Option B: Get New API Key**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Create new API key or regenerate existing one
4. Update your environment variable

**Option C: Verify API Key Format**
- API key should be a long string (usually 39 characters)
- No spaces or special characters at the beginning/end
- Key should start with "AI" for Gemini API

#### 2. **Gemini API Not Enabled**

**Problem**: Gemini API is not enabled in Google Cloud project.

**Solution**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Library"
3. Search for "Gemini API"
4. Click "Enable" if not already enabled

#### 3. **API Quota Exceeded**

**Problem**: You've hit the rate limit or quota for Gemini API.

**Symptoms**:
- Errors about quota limits
- 429 status codes
- "Quota exceeded" messages

**Solutions**:
1. Check your Google Cloud billing
2. Monitor API usage in Google Cloud Console
3. Implement proper rate limiting in your app
4. Consider upgrading to paid tier if needed

#### 4. **Network/Firewall Issues**

**Problem**: Server can't reach Google's API endpoints.

**Symptoms**:
- Timeout errors
- Network connection failures
- Intermittent 500 errors

**Solutions**:
1. Check server's internet connectivity
2. Verify firewall rules allow outbound HTTPS
3. Test with `curl` or `wget` to Google APIs
4. Check proxy settings if applicable

## 🔧 Testing & Diagnosis

### 1. **Check AI Service Health**

Test the AI service health endpoint:
```bash
curl https://your-domain.com/api/ai/health
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "status": "operational",
    "geminiConfigured": true,
    "features": {
      "symptomAnalysis": "available",
      "dietRecommendations": "available",
      "mealPlanning": "available",
      "chat": "available"
    }
  }
}
```

### 2. **Test Individual AI Endpoints**

**Symptom Analysis**:
```bash
curl -X POST https://your-domain.com/api/ai/analyze-symptoms \
  -H "Content-Type: application/json" \
  -d '{"symptoms": ["headache"]}'
```

**Chat Endpoint**:
```bash
curl -X POST https://your-domain.com/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'
```

### 3. **Check Server Logs**

Look for these log messages:
- `⚠️  GEMINI_API_KEY not found in environment variables`
- `AI service failed, using fallback response`
- `Gemini API Error: [GoogleGenerativeAI Error]`

### 4. **Environment Variable Check**

Verify environment variables are set correctly:
```bash
# Check if variable exists
echo $GEMINI_API_KEY

# Check .env file
cat .env | grep GEMINI_API_KEY

# Check in Node.js
node -e "console.log('API Key:', process.env.GEMINI_API_KEY ? 'Set' : 'Not Set')"
```

## 🛠️ Fixes & Workarounds

### 1. **Immediate Fix: Use Fallback Responses**

The AI service now includes fallback responses that work even when the Gemini API is unavailable:

- **Symptom Analysis**: General health guidance and recommendations
- **Diet Recommendations**: Basic nutritional advice and tips
- **Meal Planning**: Structured meal plan templates

### 2. **Environment Variable Setup**

**Development**:
```env
# .env file
GEMINI_API_KEY=your-development-api-key
NODE_ENV=development
```

**Production**:
```env
# Production environment
GEMINI_API_KEY=your-production-api-key
NODE_ENV=production
```

### 3. **API Key Validation**

Add this to your startup script:
```javascript
if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY not found. AI features will use fallback responses.');
} else {
    console.log('✅ Gemini API configured successfully');
}
```

### 4. **Error Handling Improvements**

The AI service now:
- Catches API errors gracefully
- Returns helpful fallback responses
- Logs errors for debugging
- Never crashes with 500 errors

## 📊 Monitoring & Alerts

### 1. **Health Check Endpoints**

Monitor these endpoints:
- `/health` - General server health
- `/api/ai/health` - AI service status
- `/api/ai/analyze-symptoms` - Symptom analysis functionality

### 2. **Log Monitoring**

Watch for these log patterns:
- `AI service failed, using fallback response`
- `Gemini API Error`
- `API key not valid`

### 3. **Performance Metrics**

Track:
- Response times for AI endpoints
- Error rates
- Fallback response usage
- API quota consumption

## 🚀 Production Deployment Checklist

### Before Deploying

- [ ] Set `GEMINI_API_KEY` in production environment
- [ ] Enable Gemini API in Google Cloud Console
- [ ] Verify API quotas and billing
- [ ] Test AI endpoints with production API key
- [ ] Monitor error logs after deployment

### After Deploying

- [ ] Check AI service health endpoint
- [ ] Test symptom analysis functionality
- [ ] Verify chat endpoint works
- [ ] Monitor for 500 errors
- [ ] Check fallback response usage

## 🔍 Debugging Commands

### 1. **Test API Key Validity**

```bash
# Test if API key can reach Gemini API
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://generativelanguage.googleapis.com/v1beta/models"
```

### 2. **Check Environment Variables**

```bash
# List all environment variables
env | grep -i gemini

# Check specific variable
echo "API Key: ${GEMINI_API_KEY:0:10}..."
```

### 3. **Test Network Connectivity**

```bash
# Test connection to Google APIs
curl -I https://generativelanguage.googleapis.com

# Test DNS resolution
nslookup generativelanguage.googleapis.com
```

## 📞 Getting Help

### 1. **Check Logs First**

Always check server logs before asking for help:
```bash
# View recent logs
tail -f logs/app.log

# Search for AI-related errors
grep -i "ai\|gemini\|error" logs/app.log
```

### 2. **Gather Information**

When reporting issues, include:
- Error messages from browser console
- Server logs
- Environment (development/production)
- API key status (without exposing the actual key)
- Steps to reproduce

### 3. **Common Solutions**

Most AI service issues are resolved by:
1. Setting the correct `GEMINI_API_KEY`
2. Enabling Gemini API in Google Cloud
3. Checking API quotas and billing
4. Verifying network connectivity

## 🎯 Quick Fix Summary

**For 500 errors on AI endpoints:**

1. **Check API Key**: Verify `GEMINI_API_KEY` is set and valid
2. **Enable API**: Ensure Gemini API is enabled in Google Cloud
3. **Check Quotas**: Verify you haven't exceeded API limits
4. **Test Health**: Use `/api/ai/health` endpoint to diagnose
5. **Monitor Logs**: Check server logs for specific error messages

**The AI service now includes fallback responses, so even if the Gemini API fails, users will still get helpful responses instead of errors.**

---

**Need more help?** Check the main documentation or create an issue in the repository.
