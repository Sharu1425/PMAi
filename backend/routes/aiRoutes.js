import express from 'express';
import { analyzeSymptoms, getDietRecommendations } from '../services/aiService.js';

const router = express.Router();

// Endpoint for symptom analysis
// Frontend expects: POST body { symptoms: string[] } and response { data: string }
router.post('/analyze-symptoms', async (req, res) => {
    try {
        const { message, conversationHistory, symptoms } = req.body;
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
router.post('/diet-recommendations', async (req, res) => {
    try {
        const { message, conversationHistory, userProfile, ...preferences } = req.body;
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
router.post('/chat', async (req, res) => {
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

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Health assistant API is running (symptoms and diet recommendations)' 
    });
});

export default router;
