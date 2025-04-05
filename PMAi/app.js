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
You are Dr. PMAi, a friendly AI healthcare assistant for a medical hackathon project. Your job is to have simple, helpful conversations about health symptoms.

Guidelines for your responses:
1. Be friendly and straightforward - use simple language a normal person can understand
2. Keep your responses SHORT and CONCISE (150 words maximum)
3. Avoid medical jargon - explain everything in plain language
4. Don't include disclaimers about not being a real doctor or this being a hackathon project
5. Focus only on explaining symptoms, possible causes, and simple home remedies
6. End with a brief, relevant follow-up question to keep the conversation going
7. Format your response in clear paragraphs with basic bullet points when listing suggestions

Example response structure (keep it under 150 words):
"Based on your symptoms (fever and cold), this sounds like a common cold or flu. This happens when a virus affects your nose and throat.

Some things that might help:
• Rest and drink plenty of fluids
• Take over-the-counter pain relievers for fever
• Use a humidifier for congestion

Do you also have a sore throat or cough?"
`;

// Prompt for the diet planner
const dietPlannerPrompt = `
You are a helpful nutrition expert. Your job is to provide personalized diet suggestions based on user input.

Guidelines for your responses:
1. Keep responses simple and practical - use language anyone can understand
2. Make responses SHORT (under 150 words)
3. Be positive and encouraging
4. Provide specific food suggestions, not just general advice
5. Format meal suggestions with clear bullet points
6. Consider any health conditions, goals, or preferences mentioned
7. End with a brief question about their preferences to gather more information

Example response:
"Based on your goal to lose weight while managing diabetes, here's a balanced meal plan:

Breakfast:
• Greek yogurt with berries and a sprinkle of nuts
• Whole grain toast with avocado

Lunch:
• Grilled chicken salad with olive oil dressing
• Small serving of quinoa

Dinner:
• Baked fish with roasted vegetables
• Small side salad

Snacks:
• Apple slices with almond butter
• Carrot sticks with hummus

Would you prefer more vegetarian options in this plan?"
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

// Endpoint for diet recommendations
app.post('/api/diet-recommendations', async (req, res) => {
    try {
        const { message, conversationHistory, userProfile } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'No message provided' });
        }
        
        console.log('Generating diet recommendations for:', message);
        
        // Create a context from previous conversation
        let conversationContext = '';
        if (conversationHistory && conversationHistory.length > 0) {
            conversationContext = conversationHistory
                .map(msg => `${msg.from === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
                .join('\n');
        }
        
        // Create user profile context if provided
        let userProfileContext = '';
        if (userProfile) {
            userProfileContext = `User Profile Information:
- Age: ${userProfile.age || 'Not specified'}
- Gender: ${userProfile.gender || 'Not specified'}
- Health conditions: ${userProfile.healthConditions || 'None specified'}
- Dietary restrictions: ${userProfile.dietaryRestrictions || 'None specified'}
- Weight goals: ${userProfile.weightGoals || 'Not specified'}
- Activity level: ${userProfile.activityLevel || 'Not specified'}`;
        }
        
        // Construct the prompt for Gemini
        const prompt = `
${dietPlannerPrompt}

${userProfileContext ? `${userProfileContext}\n\n` : ''}
${conversationContext ? `Previous conversation:\n${conversationContext}\n\n` : ''}

User's new message: ${message}

Your response:
`;
        
        // Get response from Gemini API
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        
        console.log('Received diet recommendations from Gemini API');
        
        return res.json({ 
            reply: response,
            success: true 
        });
    } catch (error) {
        console.error('Error generating diet recommendations:', error);
        return res.status(500).json({ 
            error: 'Failed to generate diet recommendations',
            message: error.message 
        });
    }
});

// Test endpoint to check if server is running
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Health assistant API is running (symptoms and diet recommendations)' });
});

app.listen(port, () => {
    console.log(`Health assistant server running at http://localhost:${port}`);
});