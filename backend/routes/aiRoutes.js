import express from "express"
import rateLimit from "express-rate-limit"
import { auth } from "../middleware/auth.js"
import { analyzeSymptoms, getDietRecommendations } from "../services/aiService.js"
import Symptom from "../models/symptom.js"
import DietPlan from "../models/dietPlan.js"
import AIChat from "../models/aiChat.js"

const router = express.Router()

// Rate limiting for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per windowMs
  message: {
    error: "Too many AI requests, please try again later.",
  },
})

// Endpoint for symptom analysis
// Frontend expects: POST body { symptoms: string[] } and response { data: string }
router.post('/analyze-symptoms', auth, aiLimiter, async (req, res) => {
    try {
        const { message, conversationHistory, symptoms } = req.body
        const userId = req.user.id
        
        // Input validation
        if (!message && (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0)) {
            return res.status(400).json({
                error: 'Missing input',
                message: 'Please provide either a message or symptoms array',
                success: false
            })
        }
        
        const input = Array.isArray(symptoms) ? symptoms.join(', ') : message
        
        try {
            const reply = await analyzeSymptoms(input, conversationHistory)
            
            if (!reply || typeof reply !== 'string') {
                throw new Error('AI service returned invalid response format')
            }
            
            // Save to database
            const symptomRecord = new Symptom({
                userId,
                symptoms: Array.isArray(symptoms) ? symptoms : [input],
                aiResponse: reply,
                analysis: {
                    possibleConditions: ["General Analysis"],
                    confidence: 70,
                    urgencyLevel: "medium",
                    analysis: reply,
                    recommendations: ["Monitor symptoms", "Consult healthcare professional if needed"]
                }
            })
            
            await symptomRecord.save()
            
            return res.json({ 
                data: reply, 
                success: true,
                message: 'Symptom analysis completed successfully'
            })
        } catch (aiError) {
            console.error('AI service error:', aiError)
            // Return a helpful fallback response instead of failing
            const fallbackResponse = "I understand you're experiencing symptoms. While I'm currently unable to provide AI-powered analysis, I recommend monitoring your symptoms and consulting a healthcare professional if they persist or worsen. What specific symptoms are you experiencing?"
            
            // Save fallback response to database
            const symptomRecord = new Symptom({
                userId,
                symptoms: Array.isArray(symptoms) ? symptoms : [input],
                aiResponse: fallbackResponse,
                analysis: {
                    possibleConditions: ["General Analysis"],
                    confidence: 50,
                    urgencyLevel: "medium",
                    analysis: fallbackResponse,
                    recommendations: ["Monitor symptoms", "Consult healthcare professional if needed"]
                }
            })
            
            await symptomRecord.save()
            
            return res.json({ 
                data: fallbackResponse, 
                success: true,
                message: 'Analysis completed with fallback response'
            })
        }
    } catch (error) {
        console.error('Error analyzing symptoms:', error)
        return res.status(500).json({ 
            error: 'Failed to analyze symptoms',
            message: 'Internal server error. Please try again later.',
            success: false
        })
    }
})

// Endpoint for diet recommendations
// Frontend expects: POST preferences object and response { data: DietPlan object }
router.post('/diet-recommendations', auth, aiLimiter, async (req, res) => {
    try {
        const { message, conversationHistory, userProfile, ...preferences } = req.body
        const userId = req.user.id
        
        // Input validation
        if (!message && Object.keys(preferences).length === 0) {
            return res.status(400).json({
                error: 'Missing input',
                message: 'Please provide either a message or dietary preferences',
                success: false
            })
        }
        
        // Use preferences object directly, or create from message
        const dietPreferences = Object.keys(preferences).length > 0 ? preferences : { goal: message }
        
        try {
            const dietPlan = await getDietRecommendations(dietPreferences, conversationHistory, userProfile)
            
            // Validate the response structure
            if (!dietPlan || typeof dietPlan !== 'object' || !dietPlan.totalCalories || !dietPlan.meals) {
                throw new Error('AI service returned invalid diet plan structure')
            }
            
            // Save to database
            const dietPlanRecord = new DietPlan({
                userId,
                preferences: dietPreferences,
                plan: dietPlan,
                aiResponse: JSON.stringify(dietPlan),
                isAIGenerated: true
            })
            
            await dietPlanRecord.save()
            
            return res.json({ 
                data: dietPlan, 
                success: true,
                message: 'Diet plan generated successfully'
            })
        } catch (aiError) {
            console.error('AI service error:', aiError)
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
            }
            
            // Save fallback plan to database
            const dietPlanRecord = new DietPlan({
                userId,
                preferences: dietPreferences,
                plan: fallbackPlan,
                aiResponse: "Fallback diet plan generated",
                isAIGenerated: false
            })
            
            await dietPlanRecord.save()
            
            return res.json({ 
                data: fallbackPlan, 
                success: true,
                message: 'Diet plan generated with fallback data'
            })
        }
    } catch (error) {
        console.error('Error generating diet recommendations:', error)
        return res.status(500).json({ 
            error: 'Failed to generate diet recommendations',
            message: 'Internal server error. Please try again later.',
            success: false
        })
    }
})

// Get user's symptom history
router.get('/symptoms/history', auth, async (req, res) => {
    try {
        const userId = req.user.id
        const symptoms = await Symptom.find({ userId })
            .sort({ createdAt: -1 })
            .limit(10)
        
        res.json({
            success: true,
            data: symptoms
        })
    } catch (error) {
        console.error('Error fetching symptom history:', error)
        res.status(500).json({
            error: 'Failed to fetch symptom history',
            message: 'Internal server error'
        })
    }
})

// Get user's diet plan history
router.get('/diet-plans/history', auth, async (req, res) => {
    try {
        const userId = req.user.id
        const dietPlans = await DietPlan.find({ userId })
            .sort({ createdAt: -1 })
            .limit(10)
        
        res.json({
            success: true,
            data: dietPlans
        })
    } catch (error) {
        console.error('Error fetching diet plan history:', error)
        res.status(500).json({
            error: 'Failed to fetch diet plan history',
            message: 'Internal server error'
        })
    }
})

export default router
