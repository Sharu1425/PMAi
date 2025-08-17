import express from 'express';
import { analyzeSymptoms, getDietRecommendations, generateMealPlan } from '../services/aiService.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// AI-specific rate limiting to prevent abuse
const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 AI requests per minute
    message: {
        error: 'Too many AI requests',
        message: 'Please wait a moment before making more AI requests',
        success: false
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Health check endpoint for AI service
router.get('/health', (req, res) => {
    try {
        const aiStatus = {
            status: 'operational',
            timestamp: new Date().toISOString(),
            features: {
                symptomAnalysis: 'available',
                dietRecommendations: 'available',
                mealPlanning: 'available',
                chat: 'available'
            },
            environment: process.env.NODE_ENV || 'development',
            geminiConfigured: !!process.env.GEMINI_API_KEY
        };
        
        res.json({
            success: true,
            data: aiStatus,
            message: 'AI service is operational'
        });
    } catch (error) {
        console.error('AI health check error:', error);
        res.status(500).json({
            success: false,
            error: 'Health check failed',
            message: error.message
        });
    }
});

// Endpoint for symptom analysis
// Frontend expects: POST body { symptoms: string[] } and response { data: string }
router.post('/analyze-symptoms', aiLimiter, async (req, res) => {
    try {
        const { message, conversationHistory, symptoms } = req.body;
        
        // Input validation
        if (!message && (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0)) {
            return res.status(400).json({
                error: 'Missing input',
                message: 'Please provide either a message or symptoms array',
                success: false
            });
        }
        
        const input = Array.isArray(symptoms) ? symptoms.join(', ') : message;
        
        try {
            const reply = await analyzeSymptoms(input, conversationHistory);
            
            if (!reply || typeof reply !== 'string') {
                throw new Error('AI service returned invalid response format');
            }
            
            return res.json({ 
                data: reply, 
                success: true,
                message: 'Symptom analysis completed successfully'
            });
        } catch (aiError) {
            console.error('AI service error:', aiError);
            // Return a helpful fallback response instead of failing
            const fallbackResponse = "I understand you're experiencing symptoms. While I'm currently unable to provide AI-powered analysis, I recommend monitoring your symptoms and consulting a healthcare professional if they persist or worsen. What specific symptoms are you experiencing?";
            
            return res.json({ 
                data: fallbackResponse, 
                success: true,
                message: 'Analysis completed with fallback response'
            });
        }
    } catch (error) {
        console.error('Error analyzing symptoms:', error);
        return res.status(500).json({ 
            error: 'Failed to analyze symptoms',
            message: 'Internal server error. Please try again later.',
            success: false
        });
    }
});

// Endpoint for diet recommendations
// Frontend expects: POST preferences object and response { data: string }
router.post('/diet-recommendations', aiLimiter, async (req, res) => {
    try {
        const { message, conversationHistory, userProfile, ...preferences } = req.body;
        
        // Input validation
        if (!message && Object.keys(preferences).length === 0) {
            return res.status(400).json({
                error: 'Missing input',
                message: 'Please provide either a message or dietary preferences',
                success: false
            });
        }
        
        const prompt = message || JSON.stringify(preferences);
        
        try {
            const reply = await getDietRecommendations(prompt, conversationHistory, userProfile);
            
            if (!reply || typeof reply !== 'string') {
                throw new Error('AI service returned invalid response format');
            }
            
            return res.json({ 
                data: reply, 
                success: true,
                message: 'Diet recommendations generated successfully'
            });
        } catch (aiError) {
            console.error('AI service error:', aiError);
            // Return a helpful fallback response instead of failing
            const fallbackResponse = "I'd be happy to help with dietary advice. Since I'm currently unable to provide AI-powered recommendations, here are some general tips: focus on whole, unprocessed foods, include plenty of fruits and vegetables, stay hydrated with water, and consider consulting a registered dietitian. What specific dietary goals do you have?";
            
            return res.json({ 
                data: fallbackResponse, 
                success: true,
                message: 'Recommendations generated with fallback response'
            });
        }
    } catch (error) {
        console.error('Error generating diet recommendations:', error);
        return res.status(500).json({ 
            error: 'Failed to generate diet recommendations',
            message: 'Internal server error. Please try again later.',
            success: false
        });
    }
});

// Chat endpoint for AI conversations
router.post('/chat', aiLimiter, async (req, res) => {
    try {
        const { message, context, conversationHistory } = req.body;
        
        if (!message) {
            return res.status(400).json({
                error: 'Message is required',
                message: 'Please provide a message to chat with the AI',
                success: false
            });
        }

        // Use the analyzeSymptoms function for chat as well
        const reply = await analyzeSymptoms(message, conversationHistory);
        
        return res.json({ 
            data: { message: reply }, 
            success: true,
            message: 'Chat response generated successfully'
        });
    } catch (error) {
        console.error('Error in AI chat:', error);
        return res.status(500).json({ 
            error: 'Failed to process chat message',
            message: 'Internal server error. Please try again later.',
            success: false
        });
    }
});

// Meal plan generation endpoint
router.post('/meal-plan', aiLimiter, async (req, res) => {
    try {
        const { calories, dietType, allergies, meals, userProfile } = req.body;
        
        if (!calories || !dietType || !meals) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'Calories, diet type, and number of meals are required',
                success: false
            });
        }

        // Use the specialized meal planning function
        const reply = await generateMealPlan(calories, dietType, allergies || [], meals, userProfile);
        
        return res.json({ 
            data: reply, 
            success: true,
            message: 'Meal plan generated successfully'
        });
    } catch (error) {
        console.error('Error generating meal plan:', error);
        return res.status(500).json({ 
            error: 'Failed to generate meal plan',
            message: 'Internal server error. Please try again later.',
            success: false
        });
    }
});

export default router;
