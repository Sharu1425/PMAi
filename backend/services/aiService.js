import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Validate API key
if (!GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY not found in environment variables. AI features will use fallback responses.');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-2.0-flash" }) : null;

// Fallback responses when AI service is unavailable
const fallbackResponses = {
    symptoms: "I understand you're experiencing symptoms. While I'm currently unable to provide AI-powered analysis, I recommend:\n\n• Rest and stay hydrated\n• Monitor your symptoms\n• Contact a healthcare professional if symptoms persist or worsen\n\nHow long have you been experiencing these symptoms?",
    diet: "I'd be happy to help with dietary advice. Since I'm currently unable to provide AI-powered recommendations, here are some general tips:\n\n• Focus on whole, unprocessed foods\n• Include plenty of fruits and vegetables\n• Stay hydrated with water\n• Consider consulting a registered dietitian\n\nWhat specific dietary goals do you have?",
    mealPlan: "I'd love to help create a meal plan for you. While I'm currently unable to provide AI-powered meal planning, here's a basic structure:\n\n• Breakfast: Protein + complex carbs + healthy fats\n• Lunch: Lean protein + vegetables + whole grains\n• Dinner: Similar to lunch but lighter portions\n• Snacks: Fruits, nuts, or yogurt\n\nWhat's your daily calorie target and dietary preferences?"
};

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

// Helper function to safely call Gemini API
const safeGeminiCall = async (prompt, maxTokens = 300) => {
    if (!model || !GEMINI_API_KEY) {
        throw new Error('AI service not configured');
    }

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.7,
                topP: 0.8,
                topK: 40,
                maxOutputTokens: maxTokens,
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
        console.error('Gemini API Error:', error);
        throw new Error(`AI service error: ${error.message}`);
    }
};

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
        
        try {
            // Try to get AI response
            return await safeGeminiCall(prompt, 300);
        } catch (aiError) {
            console.warn('AI service failed, using fallback response:', aiError.message);
            return fallbackResponses.symptoms;
        }
    } catch (error) {
        console.error('Symptom Analysis Error:', error);
        // Return a helpful fallback response instead of throwing
        return fallbackResponses.symptoms;
    }
};

export const getDietRecommendations = async (preferences, conversationHistory, userProfile) => {
    try {
        if (!preferences) {
            throw new Error('No preferences provided');
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
        
        // Enhanced prompt specifically for structured diet plan generation
        const structuredDietPrompt = `
You are a certified nutrition expert creating personalized diet plans. You MUST respond with ONLY a valid JSON object in the exact format specified below.

CRITICAL REQUIREMENTS:
1. RESPONSE FORMAT: Return ONLY valid JSON - no text before or after
2. STRUCTURE: Follow the exact JSON schema provided
3. PERSONALIZATION: Consider user's goals, diet type, and preferences
4. NUTRITIONAL ACCURACY: Ensure proper calorie and macronutrient balance
5. PRACTICALITY: Suggest realistic, accessible foods
6. ALLERGIES: Strictly avoid any foods mentioned in allergies

REQUIRED JSON STRUCTURE:
{
  "totalCalories": number,
  "macros": {
    "protein": number,
    "carbs": number,
    "fat": number,
    "fiber": number
  },
  "meals": {
    "Breakfast": [
      {
        "name": "string",
        "calories": number,
        "protein": number,
        "carbs": number,
        "fat": number,
        "fiber": number,
        "prepTime": number,
        "difficulty": "Easy|Medium|Hard"
      }
    ],
    "Lunch": [same structure as Breakfast],
    "Dinner": [same structure as Breakfast],
    "Snack": [same structure as Breakfast]
  },
  "tips": ["string", "string", "string", "string", "string"],
  "shoppingList": ["string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string"]
}

USER PREFERENCES: ${JSON.stringify(preferences)}
${userProfileContext ? `${userProfileContext}\n\n` : ''}
${conversationContext ? `Previous conversation context:\n${conversationContext}\n\n` : ''}

Generate a personalized diet plan based on the user's preferences. Return ONLY the JSON object with no additional text or explanation.`;
        
        try {
            // Try to get AI response
            const aiResponse = await safeGeminiCall(structuredDietPrompt, 800);
            
            // Try to parse the response as JSON
            try {
                const parsedResponse = JSON.parse(aiResponse);
                
                // Validate the structure
                if (parsedResponse.totalCalories && parsedResponse.meals && parsedResponse.macros) {
                    return parsedResponse;
                } else {
                    throw new Error('Invalid JSON structure');
                }
            } catch (parseError) {
                console.warn('AI response is not valid JSON, using fallback:', parseError.message);
                // Return a structured fallback diet plan
                return generateFallbackDietPlan(preferences);
            }
        } catch (aiError) {
            console.warn('AI service failed, using fallback diet plan:', aiError.message);
            return generateFallbackDietPlan(preferences);
        }
    } catch (error) {
        console.error('Diet Recommendations Error:', error);
        return generateFallbackDietPlan(preferences);
    }
};

// Generate a fallback diet plan when AI fails
const generateFallbackDietPlan = (preferences) => {
    const { goal = 'general health', dietType = 'balanced', targetCalories = 2000 } = preferences;
    
    // Calculate macros based on preferences
    let protein, carbs, fat;
    if (dietType === 'high-protein') {
        protein = Math.round(targetCalories * 0.3 / 4);
        carbs = Math.round(targetCalories * 0.4 / 4);
        fat = Math.round(targetCalories * 0.3 / 9);
    } else if (dietType === 'low-carb') {
        protein = Math.round(targetCalories * 0.3 / 4);
        carbs = Math.round(targetCalories * 0.2 / 4);
        fat = Math.round(targetCalories * 0.5 / 9);
    } else {
        protein = Math.round(targetCalories * 0.25 / 4);
        carbs = Math.round(targetCalories * 0.5 / 4);
        fat = Math.round(targetCalories * 0.25 / 9);
    }
    
    return {
        totalCalories: targetCalories,
        macros: {
            protein,
            carbs,
            fat,
            fiber: 35
        },
        meals: {
            Breakfast: [
                {
                    name: "Overnight Oats with Berries",
                    calories: Math.round(targetCalories * 0.16),
                    protein: Math.round(protein * 0.1),
                    carbs: Math.round(carbs * 0.22),
                    fat: Math.round(fat * 0.12),
                    fiber: 8,
                    prepTime: 5,
                    difficulty: "Easy"
                }
            ],
            Lunch: [
                {
                    name: "Grilled Chicken Quinoa Bowl",
                    calories: Math.round(targetCalories * 0.225),
                    protein: Math.round(protein * 0.3),
                    carbs: Math.round(carbs * 0.16),
                    fat: Math.round(fat * 0.22),
                    fiber: 6,
                    prepTime: 25,
                    difficulty: "Medium"
                }
            ],
            Dinner: [
                {
                    name: "Baked Salmon with Vegetables",
                    calories: Math.round(targetCalories * 0.24),
                    protein: Math.round(protein * 0.2),
                    carbs: Math.round(carbs * 0.1),
                    fat: Math.round(fat * 0.42),
                    fiber: 7,
                    prepTime: 30,
                    difficulty: "Medium"
                }
            ],
            Snack: [
                {
                    name: "Mixed Nuts and Dried Fruit",
                    calories: Math.round(targetCalories * 0.09),
                    protein: Math.round(protein * 0.05),
                    carbs: Math.round(carbs * 0.05),
                    fat: Math.round(fat * 0.21),
                    fiber: 3,
                    prepTime: 1,
                    difficulty: "Easy"
                }
            ]
        },
        tips: [
            "Stay hydrated by drinking at least 8 glasses of water daily",
            "Eat slowly and mindfully to improve digestion",
            "Include a variety of colorful vegetables in your meals",
            "Plan your meals ahead to avoid unhealthy choices",
            "Listen to your body's hunger and fullness cues"
        ],
        shoppingList: [
            "Oats", "Mixed berries", "Quinoa", "Chicken breast", "Salmon fillets",
            "Mixed vegetables", "Almonds", "Olive oil", "Spinach", "Sweet potatoes"
        ]
    };
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
        
        try {
            // Try to get AI response
            return await safeGeminiCall(mealPlanPrompt, 400);
        } catch (aiError) {
            console.warn('AI service failed, using fallback response:', aiError.message);
            return fallbackResponses.mealPlan;
        }
    } catch (error) {
        console.error('Meal Plan Generation Error:', error);
        // Return a helpful fallback response instead of throwing
        return fallbackResponses.mealPlan;
    }
};
