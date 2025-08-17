import axios from "axios"

const BASE_URL = process.env.API_BASE_URL || "https://pmai-3rq4.onrender.com"

async function testMedicationEndpoints() {
  console.log("🔍 Testing Medication API Endpoints...")
  console.log(`🌐 Testing against: ${BASE_URL}`)
  console.log("")

  try {
    // Test GET medications endpoint (should return 401 without auth)
    console.log("🔍 Testing GET /api/medications (without auth)...")
    try {
      const response = await axios.get(`${BASE_URL}/api/medications`)
      console.log("❌ Unexpected success (should require auth):", response.data)
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("✅ GET /api/medications correctly requires authentication")
      } else {
        console.log("❌ GET /api/medications failed with unexpected status:", error.response?.status)
      }
    }

    // Test POST medications endpoint (should return 401 without auth)
    console.log("\n🔍 Testing POST /api/medications (without auth)...")
    try {
      const response = await axios.post(`${BASE_URL}/api/medications`, {
        name: "Test Medication",
        dosage: "100mg",
        frequency: "Once daily",
        time: "08:00"
      })
      console.log("❌ Unexpected success (should require auth):", response.data)
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("✅ POST /api/medications correctly requires authentication")
      } else {
        console.log("❌ POST /api/medications failed with unexpected status:", error.response?.status)
      }
    }

    // Test with a mock token (should still fail but might give different error)
    console.log("\n🔍 Testing with mock token...")
    try {
      const response = await axios.post(`${BASE_URL}/api/medications`, {
        name: "Test Medication",
        dosage: "100mg",
        frequency: "Once daily",
        time: "08:00"
      }, {
        headers: {
          'Authorization': 'Bearer mock-token'
        }
      })
      console.log("❌ Unexpected success with mock token:", response.data)
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("✅ API correctly rejects invalid tokens")
      } else {
        console.log("❌ API failed with unexpected status:", error.response?.status)
        console.log("Response:", error.response?.data)
      }
    }

  } catch (error) {
    console.error("❌ Test failed:", error.message)
  }

  console.log("\n✨ Medication API test completed!")
}

testMedicationEndpoints().catch(console.error)
