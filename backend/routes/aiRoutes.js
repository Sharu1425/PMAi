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
        const reply = await analyzeSymptoms(input, conversationHistory);
        return res.json({ data: reply, success: true });
    } catch (error) {
        console.error('Error analyzing symptoms:', error);
        return res.status(500).json({ 
            error: 'Failed to analyze symptoms',
            message: error.message 
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
        const reply = await getDietRecommendations(prompt, conversationHistory, userProfile);
        return res.json({ data: reply, success: true });
    } catch (error) {
        console.error('Error generating diet recommendations:', error);
        return res.status(500).json({ 
            error: 'Failed to generate diet recommendations',
            message: error.message 
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
                success: false
            });
        }

        // Use the analyzeSymptoms function for chat as well
        const reply = await analyzeSymptoms(message, conversationHistory);
        return res.json({ 
            data: { message: reply }, 
            success: true 
        });
    } catch (error) {
        console.error('Error in AI chat:', error);
        return res.status(500).json({ 
            error: 'Failed to process chat message',
            message: error.message,
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
            success: true 
        });
    } catch (error) {
        console.error('Error generating meal plan:', error);
        return res.status(500).json({ 
            error: 'Failed to generate meal plan',
            message: error.message,
            success: false
        });
    }
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Health assistant API is running (symptoms and diet recommendations)' 
    });
});

export default router;
