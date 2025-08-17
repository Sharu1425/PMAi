import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import morgan from "morgan"
import session from "express-session"
import MongoStore from "connect-mongo"
import dotenv from "dotenv"
dotenv.config()

// Import routes
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import aiRoutes from "./routes/aiRoutes.js"
import medicationRoutes from "./routes/medicationRoutes.js"
import healthRoutes from "./routes/healthRoutes.js"

// Import middleware
// Simple error handler fallback
import rateLimiter from "./middleware/rateLimiter.js"

const app = express()
const PORT = process.env.PORT || 5001

// Security middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        scriptSrc: ["'self'", "https://accounts.google.com"],
        connectSrc: ["'self'", "https://generativelanguage.googleapis.com"],
        frameSrc: ["'self'", "https://accounts.google.com"],
      },
    },
  }),
)

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = [
        process.env.FRONTEND_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://pmai-chi.vercel.app",
      ].filter(Boolean)
      if (!origin || allowed.includes(origin)) return callback(null, true)
      // Allow Vercel preview and OnRender health checks
      if (/vercel\.app$/.test(origin)) return callback(null, true)
      return callback(new Error(`CORS not allowed for origin: ${origin}`))
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
)

// General middleware
app.use(compression())
app.use(morgan("combined"))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"))

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "pmai-session-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || "mongodb://localhost:27017/PMAi",
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
)

// Rate limiting
app.use(rateLimiter)

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    
    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: "1.0.0",
      database: {
        status: dbStatus,
        readyState: mongoose.connection.readyState
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      }
    })
  } catch (error) {
    console.error("Health check error:", error)
    res.status(500).json({
      status: "ERROR",
      timestamp: new Date().toISOString(),
      error: error.message
    })
  }
})

// Debug endpoint for testing frontend connectivity
app.post("/debug", (req, res) => {
  console.log("🔧 DEBUG endpoint hit - Body:", req.body)
  res.json({ 
    message: "Debug endpoint working", 
    received: req.body,
    headers: req.headers 
  })
})

// API routes with logging
app.use("/users", (req, res, next) => {
  console.log(`🌐 ${req.method} /users${req.path} - Body:`, req.body)
  next()
}, userRoutes)
app.use("/auth", authRoutes)
// Support both /api and /api/ai
app.use("/api/ai", aiRoutes)
app.use("/api", aiRoutes)

// Mount medication and health routes
app.use("/api/medications", medicationRoutes)
app.use("/api/health", healthRoutes)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  })
})

// Error handling middleware (basic)
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ success: false, error: "Internal Server Error" })
})

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/PMAi", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

mongoose.connection.on("connected", () => {
  console.log("✅ Connected to MongoDB")
})

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err)
})

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected")
})

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🔄 Shutting down gracefully...")
  await mongoose.connection.close()
  process.exit(0)
})

process.on("SIGTERM", async () => {
  console.log("\n🔄 Received SIGTERM, shutting down gracefully...")
  await mongoose.connection.close()
  process.exit(0)
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`)
  console.log(`🔗 API URL: ${process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
})

export default app
