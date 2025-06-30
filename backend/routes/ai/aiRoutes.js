import express from 'express';
import { analyzeSymptoms, getDietRecommendations } from '../../services/aiService.js';

const router = express.Router();

// Endpoint for symptom analysis
router.post('/analyze-symptoms', async (req, res) => {
    try {
        const { message, conversationHistory } = req.body;
        const reply = await analyzeSymptoms(message, conversationHistory);
        return res.json({ reply, success: true });
    } catch (error) {
        console.error('Error analyzing symptoms:', error);
        return res.status(500).json({ 
            error: 'Failed to analyze symptoms',
            message: error.message 
        });
    }
});

// Endpoint for diet recommendations
router.post('/diet-recommendations', async (req, res) => {
    try {
        const { message, conversationHistory, userProfile } = req.body;
        const reply = await getDietRecommendations(message, conversationHistory, userProfile);
        return res.json({ reply, success: true });
    } catch (error) {
        console.error('Error generating diet recommendations:', error);
        return res.status(500).json({ 
            error: 'Failed to generate diet recommendations',
            message: error.message 
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