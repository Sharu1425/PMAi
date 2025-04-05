const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const passport = require('passport');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/query', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { query } = req.body;
        
        if (!query) {
            return res.status(400).json({ message: 'Query is required' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `As a medical assistant, please provide a helpful and accurate response to the following query: ${query}`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error) {
        console.error('Gemini API error:', error);
        res.status(500).json({ message: 'Error processing your query' });
    }
});

module.exports = router; 