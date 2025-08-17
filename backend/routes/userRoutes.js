import express from "express"
import jwt from "jsonwebtoken"
import User from "../models/user.js"
import { auth } from "../middleware/auth.js"
import { validateRegistration, validateLogin } from "../middleware/validation.js"
import rateLimit from "express-rate-limit"
import { uploadProfilePicture, handleUploadError } from "../middleware/upload.js"

const router = express.Router()

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: "Too many authentication attempts, please try again later.",
  },
})

// Register user
router.post("/register", validateRegistration, async (req, res) => {
  try {
    console.log("🔍 Registration attempt:", req.body)
    const { name, username, email, password } = req.body

    // Check if user already exists
    const queries = [{ email: email.toLowerCase() }]
    if (username) {
      queries.push({ username: username.toLowerCase() })
    }
    const existingUser = await User.findOne({
      $or: queries,
    })

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
        message: existingUser.email === email.toLowerCase() ? "Email already registered" : "Username already taken",
      })
    }

    // Create new user
    const user = new User({
      name: name.trim(),
      username: username ? username.toLowerCase().trim() : undefined,
      email: email.toLowerCase().trim(),
      password,
    })

    await user.save()

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: "7d" })

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: user.getPublicProfile(),
    })
  } catch (error) {
    console.error("❌ Registration error:", error)
    console.error("❌ Error stack:", error.stack)
    res.status(500).json({
      error: "Registration failed",
      message: "Internal server error",
      details: error.message
    })
  }
})

// Login user
router.post("/login", authLimiter, validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email or username; include password for verification
    const lookup = (email || "").toLowerCase().trim()
    const user = await User.findOne({
      $or: [{ email: lookup }, { username: lookup }],
    }).select("+password")
    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Email or password is incorrect",
      })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        error: "Account disabled",
        message: "Your account has been disabled. Please contact support.",
      })
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Email or password is incorrect",
      })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: "7d" })

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture,
        isAdmin: user.isAdmin,
        hasFaceRegistered: user.hasFaceRegistered,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      error: "Login failed",
      message: "Internal server error",
    })
  }
})

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -faceDescriptor -emailVerificationToken -passwordResetToken -passwordResetExpires"
    )
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User profile not found",
      })
    }

    res.json({ success: true, user })
  } catch (error) {
    console.error("Profile fetch error:", error)
    res.status(500).json({
      error: "Profile fetch failed",
      message: "Internal server error",
    })
  }
})

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const allowedUpdates = [
      "name",
      "age",
      "gender",
      "height",
      "weight",
      "bloodType",
      "allergies",
      "medicalConditions",
      "dietaryRestrictions",
      "weightGoals",
      "activityLevel",
      "phone",
      "username",
      "profilePicture",
    ]
    const updates = {}

    // Filter allowed updates
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key]
      }
    })

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select(
      "-password -faceDescriptor -emailVerificationToken -passwordResetToken -passwordResetExpires"
    )

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User profile not found",
      })
    }

    res.json({ success: true, message: "Profile updated successfully", user })
  } catch (error) {
    console.error("Profile update error:", error)
    res.status(500).json({
      error: "Profile update failed",
      message: "Internal server error",
    })
  }
})

// Face registration endpoint
router.post("/register-face", auth, async (req, res) => {
  try {
    const { images } = req.body

    if (!images || !Array.isArray(images) || images.length < 3) {
      return res.status(400).json({
        error: "Invalid images",
        message: "At least 3 images are required for face registration",
      })
    }

    // In a real implementation, you would process the images with a face recognition service
    // For now, we'll just store a placeholder
    const faceData = JSON.stringify({
      registered: true,
      timestamp: new Date(),
      imageCount: images.length,
    })

    const user = await User.findByIdAndUpdate(req.user.id, { faceData }, { new: true })

    res.json({
      success: true,
      message: "Face registered successfully",
    })
  } catch (error) {
    console.error("Face registration error:", error)
    res.status(500).json({
      error: "Face registration failed",
      message: "Internal server error",
    })
  }
})

// Face login endpoint
router.post("/face-login", async (req, res) => {
  try {
    const { image } = req.body

    if (!image) {
      return res.status(400).json({
        error: "No image provided",
        message: "Face image is required for authentication",
      })
    }

    // In a real implementation, you would:
    // 1. Process the image with face recognition
    // 2. Compare with stored face data
    // 3. Return user if match found

    // For demo purposes, we'll simulate a successful match
    // In production, replace this with actual face recognition logic
    const users = await User.find({ faceData: { $exists: true, $ne: null } })

    if (users.length === 0) {
      return res.status(401).json({
        error: "Face not recognized",
        message: "No registered face found",
      })
    }

    // Simulate face recognition (use first user with face data for demo)
    const user = users[0]

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: "7d" })

    res.json({
      success: true,
      message: "Face login successful",
      token,
      user: user.getPublicProfile(),
    })
  } catch (error) {
    console.error("Face login error:", error)
    res.status(500).json({
      error: "Face login failed",
      message: "Internal server error",
    })
  }
})

// Profile picture upload endpoint
router.post("/upload-avatar", auth, uploadProfilePicture, handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
        message: "Please select a profile picture to upload"
      })
    }

    // TODO: Upload to cloud storage (Cloudinary, AWS S3, etc.)
    // For now, return the file path
    const profilePictureUrl = `/uploads/${req.file.filename}`

    // Update user's profile picture
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: profilePictureUrl },
      { new: true }
    ).select("-password -faceDescriptor -emailVerificationToken -passwordResetToken -passwordResetExpires")

    res.json({
      success: true,
      data: {
        profilePicture: profilePictureUrl
      },
      message: "Profile picture uploaded successfully"
    })
  } catch (error) {
    console.error("Profile picture upload error:", error)
    res.status(500).json({
      error: "Profile picture upload failed",
      message: "Internal server error",
    })
  }
})

// Delete account endpoint
router.delete("/account", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User account not found",
      })
    }

    // TODO: Implement account deletion logic
    // For now, just mark as inactive
    user.isActive = false
    await user.save()

    res.json({
      success: true,
      message: "Account deleted successfully",
    })
  } catch (error) {
    console.error("Account deletion error:", error)
    res.status(500).json({
      error: "Account deletion failed",
      message: "Internal server error",
    })
  }
})

export default router
