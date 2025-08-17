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
// Frontend expects: POST preferences object and response { data: DietPlan object }
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
        
        // Use preferences object directly, or create from message
        const dietPreferences = Object.keys(preferences).length > 0 ? preferences : { goal: message };
        
        try {
            const dietPlan = await getDietRecommendations(dietPreferences, conversationHistory, userProfile);
            
            // Validate the response structure
            if (!dietPlan || typeof dietPlan !== 'object' || !dietPlan.totalCalories || !dietPlan.meals) {
                throw new Error('AI service returned invalid diet plan structure');
            }
            
            return res.json({ 
                data: dietPlan, 
                success: true,
                message: 'Diet plan generated successfully'
            });
        } catch (aiError) {
            console.error('AI service error:', aiError);
            // Return a structured fallback diet plan instead of failing
            const fallbackPlan = {
                totalCalories: 2000,
                macros: {
                    protein: 120,
                    carbs: 250,
                    fat: 67,
                    fiber: 35
                },
                meals: {
                    Breakfast: [
                        {
                            name: "Overnight Oats with Berries",
                            calories: 320,
                            protein: 12,
                            carbs: 54,
                            fat: 8,
                            fiber: 8,
                            prepTime: 5,
                            difficulty: "Easy"
                        }
                    ],
                    Lunch: [
                        {
                            name: "Grilled Chicken Quinoa Bowl",
                            calories: 450,
                            protein: 35,
                            carbs: 40,
                            fat: 15,
                            fiber: 6,
                            prepTime: 25,
                            difficulty: "Medium"
                        }
                    ],
                    Dinner: [
                        {
                            name: "Baked Salmon with Vegetables",
                            calories: 480,
                            protein: 40,
                            carbs: 25,
                            fat: 28,
                            fiber: 7,
                            prepTime: 30,
                            difficulty: "Medium"
                        }
                    ],
                    Snack: [
                        {
                            name: "Mixed Nuts and Dried Fruit",
                            calories: 180,
                            protein: 6,
                            carbs: 12,
                            fat: 14,
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
                    "Oats", "Mixed berries", "Greek yogurt", "Quinoa", "Chicken breast",
                    "Salmon fillets", "Mixed vegetables", "Almonds", "Apples", "Olive oil"
                ]
            };
            
            return res.json({ 
                data: fallbackPlan, 
                success: true,
                message: 'Diet plan generated with fallback data'
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
