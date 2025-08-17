import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Enhanced prompt for the health assistant with specific medical guidance
const healthAssistantPrompt = `
You are Dr. PMAi, a friendly AI healthcare assistant. Your role is to provide helpful, accurate health information and symptom analysis.

CRITICAL GUIDELINES:
1. RESPONSE FORMAT: Keep responses between 100-150 words maximum
2. LANGUAGE: Use simple, clear language that anyone can understand
3. MEDICAL ACCURACY: Provide evidence-based information about symptoms and causes
4. SAFETY: Always recommend consulting a healthcare professional for serious symptoms
5. STRUCTURE: Use clear paragraphs and bullet points for easy reading
6. TONE: Be empathetic, professional, and encouraging
7. FOLLOW-UP: End with a relevant question to continue the conversation

RESPONSE STRUCTURE:
- Brief symptom explanation in simple terms
- Common causes (2-3 points)
- Home care suggestions (2-3 practical tips)
- When to seek medical attention (if applicable)
- One follow-up question

IMPORTANT: Focus on education and guidance, not diagnosis. Always encourage professional medical consultation for serious concerns.
`;

// Enhanced prompt for the diet planner with specific nutritional guidance
const dietPlannerPrompt = `
You are a certified nutrition expert providing personalized dietary recommendations. Your goal is to create practical, healthy meal plans.

CRITICAL GUIDELINES:
1. RESPONSE FORMAT: Keep responses between 100-150 words maximum
2. SPECIFICITY: Provide concrete food suggestions, not vague advice
3. PERSONALIZATION: Consider user's health conditions, goals, and preferences
4. PRACTICALITY: Suggest easily accessible foods and simple preparation methods
5. NUTRITIONAL BALANCE: Ensure recommendations include proper macronutrients
6. STRUCTURE: Use clear bullet points and organized meal suggestions
7. FOLLOW-UP: End with a question to gather more preferences

RESPONSE STRUCTURE:
- Brief summary of dietary approach
- Specific meal suggestions with portion sizes
- Key nutritional benefits
- Practical tips for implementation
- One follow-up question about preferences

IMPORTANT: Always consider dietary restrictions, allergies, and health conditions mentioned by the user.
`;

// Enhanced prompt for meal planning with specific nutritional requirements
const mealPlannerPrompt = `
You are a professional meal planner creating structured, nutritionally balanced meal plans. Your goal is to provide detailed, actionable meal plans.

CRITICAL GUIDELINES:
1. RESPONSE FORMAT: Keep responses between 150-200 words maximum
2. STRUCTURE: Provide a complete daily meal plan with specific foods
3. NUTRITIONAL ACCURACY: Ensure calorie and macronutrient balance
4. VARIETY: Include diverse food options and cooking methods
5. PRACTICALITY: Suggest realistic portion sizes and preparation time
6. ALLERGIES: Strictly avoid any foods mentioned in allergies
7. FORMAT: Use clear meal categories with specific food items

MEAL PLAN STRUCTURE:
- Daily calorie target and macronutrient breakdown
- Breakfast: Specific foods with portions
- Lunch: Specific foods with portions  
- Dinner: Specific foods with portions
- Snacks: Healthy options with portions
- Preparation tips and alternatives
- One follow-up question about preferences

IMPORTANT: Create realistic, sustainable meal plans that users can actually follow.
`;

export const analyzeSymptoms = async (message, conversationHistory) => {
    try {
        if (!message) {
            throw new Error('No message provided');
        }
        
        // Create a context from previous conversation
        let conversationContext = '';
        if (conversationHistory && conversationHistory.length > 0) {
            // Limit conversation history to last 5 exchanges to maintain context without overwhelming
            const recentHistory = conversationHistory.slice(-5);
            conversationContext = recentHistory
                .map(msg => `${msg.from === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
                .join('\n');
        }
        
        // Construct the enhanced prompt for Gemini
        const prompt = `
${healthAssistantPrompt}

${conversationContext ? `Previous conversation context:\n${conversationContext}\n\n` : ''}

USER'S CURRENT SYMPTOM/QUESTION: ${message}

Please provide a helpful, accurate response following the guidelines above. Focus on the specific symptoms or health concerns mentioned.

Your response:
`;
        
        // Get response from Gemini API with safety settings
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.7,
                topP: 0.8,
                topK: 40,
                maxOutputTokens: 300,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        });
        
        return result.response.text();
    } catch (error) {
        console.error('AI Service Error:', error);
        throw new Error(`AI service temporarily unavailable: ${error.message}`);
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
            const recentHistory = conversationHistory.slice(-3);
            conversationContext = recentHistory
                .map(msg => `${msg.from === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
                .join('\n');
        }
        
        // Create enhanced user profile context
        let userProfileContext = '';
        if (userProfile && Object.keys(userProfile).length > 0) {
            userProfileContext = `USER PROFILE (Use this information to personalize recommendations):
- Age: ${userProfile.age || 'Not specified'}
- Gender: ${userProfile.gender || 'Not specified'}
- Health conditions: ${userProfile.healthConditions || 'None specified'}
- Dietary restrictions: ${userProfile.dietaryRestrictions || 'None specified'}
- Weight goals: ${userProfile.weightGoals || 'Not specified'}
- Activity level: ${userProfile.activityLevel || 'Not specified'}
- Allergies: ${userProfile.allergies || 'None specified'}

IMPORTANT: Strictly avoid any foods mentioned in allergies or dietary restrictions.`;
        }
        
        // Construct the enhanced prompt for Gemini
        const prompt = `
${dietPlannerPrompt}

${userProfileContext ? `${userProfileContext}\n\n` : ''}
${conversationContext ? `Previous conversation context:\n${conversationContext}\n\n` : ''}

USER'S DIETARY REQUEST: ${message}

Please provide personalized dietary recommendations following the guidelines above. Consider the user's profile information and provide specific, actionable advice.

Your response:
`;
        
        // Get response from Gemini API with safety settings
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.6,
                topP: 0.8,
                topK: 40,
                maxOutputTokens: 300,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        });
        
        return result.response.text();
    } catch (error) {
        console.error('AI Service Error:', error);
        throw new Error(`AI service temporarily unavailable: ${error.message}`);
    }
};

// New specialized function for meal planning
export const generateMealPlan = async (calories, dietType, allergies, meals, userProfile) => {
    try {
        if (!calories || !dietType || !meals) {
            throw new Error('Missing required parameters for meal planning');
        }
        
        // Create enhanced meal planning prompt
        const mealPlanPrompt = `
${mealPlannerPrompt}

USER'S MEAL PLAN REQUIREMENTS:
- Daily Calorie Target: ${calories} calories
- Diet Type: ${dietType}
- Number of Meals: ${meals} per day
- Allergies to Avoid: ${allergies && allergies.length > 0 ? allergies.join(', ') : 'None'}
${userProfile ? `- User Profile: ${JSON.stringify(userProfile)}` : ''}

Please create a detailed, nutritionally balanced meal plan that meets these specific requirements. Ensure the plan is practical, varied, and follows the diet type guidelines.

Your response:
`;
        
        // Get response from Gemini API with safety settings
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: mealPlanPrompt }] }],
            generationConfig: {
                temperature: 0.5,
                topP: 0.8,
                topK: 40,
                maxOutputTokens: 400,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        });
        
        return result.response.text();
    } catch (error) {
        console.error('AI Service Error:', error);
        throw new Error(`AI service temporarily unavailable: ${error.message}`);
    }
};
