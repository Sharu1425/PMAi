import jwt from "jsonwebtoken"
import User from "../models/user.js"

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({
        error: "Access denied",
        message: "No token provided",
      })
    }

    // Add better error handling for JWT verification
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError.message)
      if (jwtError.name === "JsonWebTokenError") {
        return res.status(401).json({
          error: "Access denied",
          message: "Invalid token",
        })
      }
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          error: "Access denied",
          message: "Token expired",
        })
      }
      throw jwtError
    }

    // Add better error handling for user lookup
    let user
    try {
      user = await User.findById(decoded.id)
    } catch (dbError) {
      console.error("Database error in auth middleware:", dbError)
      return res.status(500).json({
        error: "Database error",
        message: "Failed to verify user",
      })
    }

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: "Access denied",
        message: "Invalid token or user not found",
      })
    }

    req.user = decoded
    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    console.error("Error stack:", error.stack)
    
    // Don't expose internal error details to client
    res.status(500).json({
      error: "Authentication failed",
      message: "Internal server error",
    })
  }
}

// Optional auth middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
      const user = await User.findById(decoded.id)

      if (user && user.isActive) {
        req.user = decoded
      }
    }

    next()
  } catch (error) {
    // Continue without authentication
    next()
  }
}

export { auth, optionalAuth }
