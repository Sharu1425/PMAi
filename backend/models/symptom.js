import mongoose from "mongoose"

const symptomSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  symptoms: [{
    type: String,
    required: true,
  }],
  analysis: {
    possibleConditions: [String],
    confidence: Number,
    urgencyLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    analysis: String,
    recommendations: [String],
  },
  aiResponse: String,
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
symptomSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.model("Symptom", symptomSchema)
