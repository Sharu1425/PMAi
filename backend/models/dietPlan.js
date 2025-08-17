import mongoose from "mongoose"

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  protein: {
    type: Number,
    required: true,
  },
  carbs: {
    type: Number,
    required: true,
  },
  fat: {
    type: Number,
    required: true,
  },
  fiber: {
    type: Number,
    required: true,
  },
  prepTime: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
})

const dietPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  preferences: {
    goal: String,
    dietType: String,
    allergies: String,
    activityLevel: String,
    targetCalories: Number,
    mealCount: String,
    budgetRange: String,
  },
  plan: {
    totalCalories: {
      type: Number,
      required: true,
    },
    macros: {
      protein: Number,
      carbs: Number,
      fat: Number,
      fiber: Number,
    },
    meals: {
      Breakfast: [mealSchema],
      Lunch: [mealSchema],
      Dinner: [mealSchema],
      Snack: [mealSchema],
    },
    tips: [String],
    shoppingList: [String],
  },
  aiResponse: String,
  isAIGenerated: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field on save
dietPlanSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.model("DietPlan", dietPlanSchema)
