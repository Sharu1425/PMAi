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

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    const user = await User.findById(decoded.id)

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: "Access denied",
        message: "Invalid token or user not found",
      })
    }

    req.user = decoded
    next()
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Access denied",
        message: "Invalid token",
      })
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Access denied",
        message: "Token expired",
      })
    }

    console.error("Auth middleware error:", error)
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
