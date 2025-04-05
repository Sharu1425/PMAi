import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import axios from 'axios';
import User from './models/user.js';

dotenv.config();

console.log('Starting server...');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Prompt for the health assistant
const healthAssistantPrompt = `
You are a Personal Health Assistant AI called PMAi. Your role is to help users understand their health symptoms. 
Follow these guidelines:

1. Be empathetic and professional in your responses.
2. Ask clarifying questions if the user's symptoms are vague.
3. Provide general information on common causes of symptoms.
4. Suggest when medical attention might be appropriate.
5. NEVER provide definitive medical diagnoses.
6. ALWAYS include a disclaimer that your advice should not replace professional medical consultation.
7. Focus on providing educational information about health conditions.
8. Explain severity indicators that would warrant immediate medical attention.
9. Format your responses in a clear, easy-to-read way.
10. Keep responses concise but helpful.

Disclaimer to include with serious symptoms: "Based on what you've described, this could be serious. I recommend seeking immediate medical attention."
`;

const app = express();
const port = 3001;
let Topic = "Science";
let QnCount = 5;
let Difficulty = "Easy";

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5001'],
    credentials: true
}));
app.use(express.json());

// Endpoint for symptom analysis
app.post('/api/analyze-symptoms', async (req, res) => {
    try {
        const { message, conversationHistory } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'No message provided' });
        }
        
        console.log('Analyzing symptoms for message:', message);
        
        // Create a context from previous conversation
        let conversationContext = '';
        if (conversationHistory && conversationHistory.length > 0) {
            conversationContext = conversationHistory
                .map(msg => `${msg.from === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
                .join('\n');
        }
        
        // Construct the prompt for Gemini
        const prompt = `
${healthAssistantPrompt}

${conversationContext ? `Previous conversation:\n${conversationContext}\n\n` : ''}

User's new message: ${message}

Your response:
`;
        
        // Get response from Gemini API
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        
        console.log('Received response from Gemini API');
        
        return res.json({ 
            reply: response,
            success: true 
        });
    } catch (error) {
        console.error('Error analyzing symptoms:', error);
        return res.status(500).json({ 
            error: 'Failed to analyze symptoms',
            message: error.message 
        });
    }
});

// Test endpoint to check if server is running
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Health assistant API is running' });
});

app.listen(port, () => {
    console.log(`Symptom analysis server running at http://localhost:${port}`);
});