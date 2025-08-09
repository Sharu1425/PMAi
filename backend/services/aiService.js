import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

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
`;

export const analyzeSymptoms = async (message, conversationHistory) => {
    try {
        if (!message) {
            throw new Error('No message provided');
        }
        
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
        return result.response.text();
    } catch (error) {
        throw error;
    }
};

export const getDietRecommendations = async (message, conversationHistory, userProfile) => {
    try {
        if (!message) {
            throw new Error('No message provided');
        }
        
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
        return result.response.text();
    } catch (error) {
        throw error;
    }
};
