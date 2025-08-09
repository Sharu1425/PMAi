import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import crypto from "crypto"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    username: {
      type: String,
      trim: true,
      maxlength: [50, "Username cannot exceed 50 characters"],
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    age: {
      type: Number,
      min: [0, "Age cannot be negative"],
      max: [150, "Age cannot exceed 150"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    height: {
      type: Number,
      min: [0, "Height cannot be negative"],
    },
    weight: {
      type: Number,
      min: [0, "Weight cannot be negative"],
    },
    phone: {
      type: String,
      trim: true,
    },
    medicalHistory: [
      {
        type: String,
        trim: true,
      },
    ],
    allergies: [
      {
        type: String,
        trim: true,
      },
    ],
    medications: [
      {
        type: String,
        trim: true,
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      sparse: true,
    },
    hasFaceRegistered: {
      type: Boolean,
      default: false,
    },
    faceDescriptor: {
      type: [Number],
      select: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password
        delete ret.faceDescriptor
        delete ret.emailVerificationToken
        delete ret.passwordResetToken
        delete ret.passwordResetExpires
        return ret
      },
    },
  },
)

// Index for better query performance
userSchema.index({ email: 1 })
userSchema.index({ googleId: 1 })
userSchema.index({ createdAt: -1 })

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const saltRounds = Number.parseInt(process.env.BCRYPT_ROUNDS) || 12
    this.password = await bcrypt.hash(this.password, saltRounds)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false
  return bcrypt.compare(candidatePassword, this.password)
}

// Method to generate password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex")
  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000 // 10 minutes
  return resetToken
}

// Method to calculate BMI
userSchema.methods.calculateBMI = function () {
  if (!this.weight || !this.height) return null
  const heightInMeters = this.height / 100
  return (this.weight / (heightInMeters * heightInMeters)).toFixed(1)
}

// Method to get public profile (exclude sensitive data)
userSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    username: this.username,
    profilePicture: this.profilePicture,
    isAdmin: this.isAdmin,
    hasFaceRegistered: this.hasFaceRegistered,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return this.name
})

// Static method to find by email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() })
}

// Static method to find active users
userSchema.statics.findActiveUsers = function () {
  return this.find({ isActive: true })
}

export default mongoose.model("User", userSchema)
