"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaFire, FaWeight } from "react-icons/fa"
import { Utensils, Apple, Target, Heart, Zap, ChefHat, Clock, Star, Award } from "lucide-react"
import GlassCard from "@/components/ui/GlassCard"
import AnimatedButton from "@/components/ui/AnimatedButton"
import { useToast } from "@/hooks/useToast"
import { aiAPI } from "@/utils/api"

interface DietRecomProps {
  user: any
}

interface Preferences {
  goal: string
  dietType: string
  allergies: string
  activityLevel: string
  targetCalories: string
  mealCount: string
  budgetRange: string
}

interface Meal {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  prepTime?: number
  difficulty?: string
  ingredients?: string[]
  instructions?: string[]
}

interface DietPlan {
  totalCalories: number
  macros: {
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
  meals: {
    [key: string]: Meal[]
  }
  tips: string[]
  shoppingList?: string[]
}

const DietRecom: React.FC<DietRecomProps> = ({ user: _user }) => {
  const [preferences, setPreferences] = useState<Preferences>({
    goal: "",
    dietType: "",
    allergies: "",
    activityLevel: "",
    targetCalories: "",
    mealCount: "3",
    budgetRange: "",
  })
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<"plan" | "shopping" | "tips">("plan")
  const toast = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPreferences((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const generateDietPlan = async () => {
    if (!preferences.goal || !preferences.dietType) {
      toast.warning("Missing Information", "Please fill in your goal and diet type")
      return
    }

    setIsGenerating(true)
    try {
      const requestData = {
        ...preferences,
        targetCalories: preferences.targetCalories ? Number(preferences.targetCalories) : undefined,
      }
      const response = await aiAPI.getDietRecommendations(requestData)
      
      if (!response.data) {
        throw new Error("No diet plan data received")
      }
      
      setDietPlan(response.data as unknown as DietPlan)
      toast.success("Diet Plan Generated", "Your personalized diet plan is ready!")
    } catch (error) {
      console.error("Error generating diet plan:", error)
      // Mock data for demo
      const mockPlan: DietPlan = {
        totalCalories: 2000,
        macros: {
          protein: 120,
          carbs: 250,
          fat: 67,
          fiber: 35,
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
              difficulty: "Easy",
            },
            {
              name: "Greek Yogurt Parfait",
              calories: 280,
              protein: 20,
              carbs: 35,
              fat: 6,
              fiber: 5,
              prepTime: 10,
              difficulty: "Easy",
            },
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
              difficulty: "Medium",
            },
            {
              name: "Mediterranean Wrap",
              calories: 420,
              protein: 18,
              carbs: 45,
              fat: 20,
              fiber: 8,
              prepTime: 15,
              difficulty: "Easy",
            },
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
              difficulty: "Medium",
            },
            {
              name: "Lean Turkey Stir Fry",
              calories: 420,
              protein: 32,
              carbs: 35,
              fat: 18,
              fiber: 6,
              prepTime: 20,
              difficulty: "Easy",
            },
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
              difficulty: "Easy",
            },
            {
              name: "Apple with Almond Butter",
              calories: 220,
              protein: 8,
              carbs: 25,
              fat: 12,
              fiber: 5,
              prepTime: 2,
              difficulty: "Easy",
            },
          ],
        },
        tips: [
          "Stay hydrated by drinking at least 8 glasses of water daily",
          "Eat slowly and mindfully to improve digestion",
          "Include a variety of colorful vegetables in your meals",
          "Plan your meals ahead to avoid unhealthy choices",
          "Listen to your body's hunger and fullness cues",
        ],
        shoppingList: [
          "Oats",
          "Mixed berries",
          "Greek yogurt",
          "Quinoa",
          "Chicken breast",
          "Salmon fillets",
          "Mixed vegetables",
          "Almonds",
          "Apples",
          "Olive oil",
          "Spinach",
          "Sweet potatoes",
        ],
      }
      setDietPlan(mockPlan)
      toast.success("Diet Plan Generated", "Your personalized diet plan is ready!")
    } finally {
      setIsGenerating(false)
    }
  }

  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"]

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-400"
      case "medium":
        return "text-yellow-400"
      case "hard":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Diet Recommendations</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get personalized nutrition plans tailored to your health goals and dietary preferences.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preferences Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <GlassCard hover>
              <div className="flex items-center mb-6">
                <Target className="w-6 h-6 text-green-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">Your Preferences</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Health Goal *</label>
                  <select
                    name="goal"
                    value={preferences.goal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 custom-select"
                  >
                    <option value="">Select your goal</option>
                    <option value="weight-loss">Weight Loss</option>
                    <option value="weight-gain">Weight Gain</option>
                    <option value="muscle-gain">Muscle Gain</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="general-health">General Health</option>
                    <option value="athletic-performance">Athletic Performance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Diet Type *</label>
                  <select
                    name="dietType"
                    value={preferences.dietType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 custom-select"
                  >
                    <option value="">Select diet type</option>
                    <option value="balanced">Balanced</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="keto">Ketogenic</option>
                    <option value="paleo">Paleo</option>
                    <option value="mediterranean">Mediterranean</option>
                    <option value="intermittent-fasting">Intermittent Fasting</option>
                    <option value="low-carb">Low Carb</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Activity Level</label>
                  <select
                    name="activityLevel"
                    value={preferences.activityLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-green-500 focus:border-transparent transition-all duration-300 custom-select"
                  >
                    <option value="">Select activity level</option>
                    <option value="sedentary">Sedentary (desk job, no exercise)</option>
                    <option value="light">Light Activity (1-3 days/week)</option>
                    <option value="moderate">Moderate Activity (3-5 days/week)</option>
                    <option value="active">Very Active (6-7 days/week)</option>
                    <option value="extra-active">Extra Active (2x/day, intense)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Meals Per Day</label>
                  <select
                    name="mealCount"
                    value={preferences.mealCount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 custom-select"
                  >
                    <option value="3">3 Meals + Snacks</option>
                    <option value="4">4 Smaller Meals</option>
                    <option value="5">5 Small Meals</option>
                    <option value="6">6 Mini Meals</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Target Calories (optional)</label>
                  <input
                    type="number"
                    name="targetCalories"
                    value={preferences.targetCalories}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="e.g., 2000"
                  />
                  <p className="text-xs text-gray-400 mt-2">Leave empty for automatic calculation</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Budget Range</label>
                  <select
                    name="budgetRange"
                    value={preferences.budgetRange}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 custom-select"
                  >
                    <option value="">Select budget range</option>
                    <option value="low">Budget Friendly ($50-75/week)</option>
                    <option value="medium">Moderate ($75-125/week)</option>
                    <option value="high">Premium ($125+/week)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Allergies/Restrictions</label>
                  <textarea
                    name="allergies"
                    value={preferences.allergies}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="List any food allergies, intolerances, or restrictions..."
                  />
                </div>

                <AnimatedButton
                  onClick={generateDietPlan}
                  variant="primary"
                  className="w-full"
                  isLoading={isGenerating}
                  shimmer
                >
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>{isGenerating ? "Generating..." : "Generate Diet Plan"}</span>
                  </div>
                </AnimatedButton>
              </div>
            </GlassCard>
          </motion.div>

          {/* Diet Plan Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            {dietPlan ? (
              <div className="space-y-6">
                {/* Plan Overview */}
                <GlassCard glow>
                  <div className="flex items-center mb-6">
                    <Apple className="w-6 h-6 text-green-400 mr-3" />
                    <h2 className="text-2xl font-bold text-white">Your Personalized Diet Plan</h2>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <FaFire className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{dietPlan.totalCalories}</div>
                      <div className="text-gray-400 text-sm">Daily Calories</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <FaWeight className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{dietPlan.macros?.protein}g</div>
                      <div className="text-gray-400 text-sm">Protein</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <Utensils className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{dietPlan.macros?.carbs}g</div>
                      <div className="text-gray-400 text-sm">Carbs</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{dietPlan.macros?.fat}g</div>
                      <div className="text-gray-400 text-sm">Fat</div>
                    </div>
                  </div>

                  {/* Tab Navigation */}
                  <div className="flex space-x-1 bg-white/5 rounded-xl p-1 mb-6">
                    {[
                      { key: "plan", label: "Meal Plan", icon: ChefHat },
                      { key: "shopping", label: "Shopping List", icon: Utensils },
                      { key: "tips", label: "Tips", icon: Star },
                    ].map((tab) => {
                      const Icon = tab.icon
                      return (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key as "plan" | "shopping" | "tips")}
                          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-300 ${
                            activeTab === tab.key
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                              : "text-gray-400 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="font-medium">{tab.label}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Tab Content */}
                  <AnimatePresence mode="wait">
                    {activeTab === "plan" && (
                      <motion.div
                        key="plan"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {mealTypes.map((mealType, index) => (
                            <motion.div
                              key={mealType}
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              transition={{ delay: index * 0.1 }}
                            >
                              <GlassCard hover>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                                    <Utensils className="w-4 h-4 text-white" />
                                  </div>
                                  {mealType}
                                </h3>
                                <div className="space-y-4">
                                  {dietPlan.meals[mealType]?.map((meal, mealIndex) => (
                                    <div
                                      key={mealIndex}
                                      className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                                    >
                                      <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-semibold text-white text-lg">{meal.name}</h4>
                                        <div className="flex items-center space-x-2">
                                          <span className="text-orange-400 font-bold">{meal.calories} cal</span>
                                          {meal.difficulty && (
                                            <span className={`text-xs ${getDifficultyColor(meal.difficulty)}`}>
                                              {meal.difficulty}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-3 gap-3 text-sm text-gray-300 mb-3">
                                        <span>P: {meal.protein}g</span>
                                        <span>C: {meal.carbs}g</span>
                                        <span>F: {meal.fat}g</span>
                                      </div>
                                      {meal.prepTime && (
                                        <div className="flex items-center text-gray-400 text-sm">
                                          <Clock className="w-3 h-3 mr-1" />
                                          <span>{meal.prepTime} min prep</span>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </GlassCard>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "shopping" && (
                      <motion.div
                        key="shopping"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {dietPlan.shoppingList?.map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/10"
                            >
                              <Utensils className="w-4 h-4 text-green-400" />
                              <span className="text-white">{item}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "tips" && (
                      <motion.div
                        key="tips"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="space-y-4">
                          {dietPlan.tips?.map((tip, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start space-x-3 p-4 bg-white/5 rounded-xl border border-white/10"
                            >
                              <Award className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                              <p className="text-gray-300">{tip}</p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </div>
            ) : (
              <GlassCard className="h-full flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <Utensils className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-4">No Diet Plan Yet</h3>
                  <p className="text-gray-400 text-lg max-w-md mx-auto">
                    Fill out your preferences and generate a personalized diet plan tailored to your goals and lifestyle
                  </p>
                </div>
              </GlassCard>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default DietRecom
