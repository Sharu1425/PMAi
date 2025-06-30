/**
 * Test script to verify the symptom analyzer API is working correctly.
 * This script tests both direct access to the AI server and
 * access through the main server proxy.
 */

const axios = require('axios');

async function testSymptomAnalyzer() {
  console.log('Testing Symptom Analyzer API...\n');
  
  // Test data
  const testMessage = "I have a headache and fever for the last 2 days";
  
  try {
    // First test the health endpoints
    console.log('1. Testing AI Server health endpoint...');
    try {
      const healthResponse = await axios.get('http://localhost:3001/api/health');
      console.log('✅ AI Server health check:', healthResponse.data);
    } catch (error) {
      console.error('❌ AI Server health check failed:', error.message);
      console.log('Make sure the AI server is running: npm run ai-server');
      return;
    }
    
    console.log('\n2. Testing Main Server symptom service status endpoint...');
    try {
      const statusResponse = await axios.get('http://localhost:5001/api/symptom-service-status');
      console.log('✅ Main Server can connect to AI Server:', statusResponse.data);
    } catch (error) {
      console.error('❌ Main Server symptom service status check failed:', error.message);
      console.log('Make sure the main server is running: npm run server');
      return;
    }
    
    // Now test the actual symptom analysis endpoints
    console.log('\n3. Testing direct API endpoint...');
    try {
      console.log('Sending message:', testMessage);
      const directResponse = await axios.post('http://localhost:3001/api/analyze-symptoms', {
        message: testMessage,
        conversationHistory: []
      });
      
      console.log('✅ Direct API call successful!');
      console.log('Response preview:', directResponse.data.reply.substring(0, 100) + '...');
    } catch (error) {
      console.error('❌ Direct API call failed:', error.message);
      console.log('Error details:', error.response?.data || 'No detailed error information');
    }
    
    console.log('\n4. Testing proxy API endpoint...');
    try {
      console.log('Sending message:', testMessage);
      const proxyResponse = await axios.post('http://localhost:5001/api/symptom-analysis', {
        message: testMessage,
        conversationHistory: []
      });
      
      console.log('✅ Proxy API call successful!');
      console.log('Response preview:', proxyResponse.data.reply.substring(0, 100) + '...');
    } catch (error) {
      console.error('❌ Proxy API call failed:', error.message);
      console.log('Error details:', error.response?.data || 'No detailed error information');
    }
    
    console.log('\n=== Test Summary ===');
    console.log('Check the results above to see if all tests passed.');
    console.log('If all tests passed, the Symptom Analyzer should be working correctly in the application.');
    console.log('If any tests failed, check the error messages and make sure both servers are running.');
    
  } catch (error) {
    console.error('Unexpected error during testing:', error);
  }
}

// Run the tests
testSymptomAnalyzer(); 