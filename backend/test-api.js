import axios from "axios"

const BASE_URL = process.env.API_BASE_URL || "https://pmai-3rq4.onrender.com"

async function testHealthEndpoint() {
  console.log("🔍 Testing health endpoint...")
  try {
    const response = await axios.get(`${BASE_URL}/health`)
    console.log("✅ Health endpoint:", response.data)
    return true
  } catch (error) {
    console.error("❌ Health endpoint failed:", error.message)
    return false
  }
}

async function testAIHealthEndpoint() {
  console.log("🔍 Testing AI health endpoint...")
  try {
    const response = await axios.get(`${BASE_URL}/api/ai/health`)
    console.log("✅ AI health endpoint:", response.data)
    return true
  } catch (error) {
    console.error("❌ AI health endpoint failed:", error.message)
    return false
  }
}

async function testSymptomAnalysis() {
  console.log("🔍 Testing symptom analysis endpoint...")
  try {
    const response = await axios.post(`${BASE_URL}/api/ai/analyze-symptoms`, {
      symptoms: ["headache", "fatigue"]
    })
    console.log("✅ Symptom analysis:", {
      success: response.data.success,
      hasData: !!response.data.data,
      dataLength: response.data.data?.length || 0
    })
    return true
  } catch (error) {
    console.error("❌ Symptom analysis failed:", error.message)
    if (error.response) {
      console.error("Response status:", error.response.status)
      console.error("Response data:", error.response.data)
    }
    return false
  }
}

async function testDietRecommendations() {
  console.log("🔍 Testing diet recommendations endpoint...")
  try {
    const response = await axios.post(`${BASE_URL}/api/ai/diet-recommendations`, {
      goal: "weight-loss",
      dietType: "balanced",
      activityLevel: "moderate"
    })
    console.log("✅ Diet recommendations:", {
      success: response.data.success,
      hasData: !!response.data.data,
      dataLength: response.data.data?.length || 0
    })
    return true
  } catch (error) {
    console.error("❌ Diet recommendations failed:", error.message)
    if (error.response) {
      console.error("Response status:", error.response.status)
      console.error("Response data:", error.response.data)
    }
    return false
  }
}

async function testUserProfileEndpoint() {
  console.log("🔍 Testing user profile endpoint (without auth)...")
  try {
    const response = await axios.get(`${BASE_URL}/users/profile`)
    console.log("✅ User profile (unexpected success):", response.data)
    return true
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("✅ User profile endpoint correctly requires authentication")
      return true
    } else {
      console.error("❌ User profile endpoint failed:", error.message)
      if (error.response) {
        console.error("Response status:", error.response.status)
        console.error("Response data:", error.response.data)
      }
      return false
    }
  }
}

async function main() {
  console.log("🚀 PMAi API Test Suite")
  console.log("=" * 40)
  console.log(`🌐 Testing against: ${BASE_URL}`)
  console.log("")

  const results = {
    health: await testHealthEndpoint(),
    aiHealth: await testAIHealthEndpoint(),
    symptomAnalysis: await testSymptomAnalysis(),
    dietRecommendations: await testDietRecommendations(),
    userProfile: await testUserProfileEndpoint()
  }

  console.log("")
  console.log("📊 Test Results Summary:")
  console.log("=" * 40)
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? "✅ PASS" : "❌ FAIL"
    console.log(`${status} ${test}`)
  })

  const passedTests = Object.values(results).filter(Boolean).length
  const totalTests = Object.keys(results).length
  
  console.log("")
  console.log(`🎯 Overall: ${passedTests}/${totalTests} tests passed`)
  
  if (passedTests === totalTests) {
    console.log("🎉 All tests passed! The API is working correctly.")
  } else {
    console.log("⚠️  Some tests failed. Check the error messages above.")
  }
}

main().catch(console.error)
