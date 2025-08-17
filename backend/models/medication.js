import mongoose from "mongoose"

const medicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    default: "",
  },
  reminders: {
    type: Boolean,
    default: true,
  },
  taken: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    default: "General",
  },
  color: {
    type: String,
    default: "from-purple-500 to-blue-500",
  },
  isActive: {
    type: Boolean,
    default: true,
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
medicationSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.model("Medication", medicationSchema)
