import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

async function testConnection() {
  console.log("🔍 Testing database connection...")
  
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/PMAi", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    
    console.log("✅ Database connected successfully")
    
    // Test a simple query
    const User = mongoose.model("User", new mongoose.Schema({}))
    const userCount = await User.countDocuments()
    console.log(`✅ Database query successful. User count: ${userCount}`)
    
  } catch (error) {
    console.error("❌ Database connection failed:", error.message)
    console.error("Error details:", error)
  } finally {
    await mongoose.connection.close()
    console.log("🔌 Database connection closed")
  }
}

async function testEnvironment() {
  console.log("\n🔍 Testing environment variables...")
  
  const requiredVars = [
    "MONGODB_URI",
    "JWT_SECRET",
    "NODE_ENV"
  ]
  
  requiredVars.forEach(varName => {
    const value = process.env[varName]
    if (value) {
      console.log(`✅ ${varName}: ${varName === "JWT_SECRET" ? "***" : value}`)
    } else {
      console.log(`❌ ${varName}: NOT SET`)
    }
  })
  
  console.log(`\n🌍 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`🔗 MongoDB URI: ${process.env.MONGODB_URI ? "SET" : "NOT SET"}`)
}

async function main() {
  console.log("🚀 PMAi Backend Connection Test")
  console.log("=" * 40)
  
  await testEnvironment()
  await testConnection()
  
  console.log("\n✨ Test completed!")
}

main().catch(console.error)
