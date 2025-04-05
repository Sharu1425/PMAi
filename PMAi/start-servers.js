/**
 * Helper script to start both servers and test the connection
 * between the main server and the Gemini API server.
 */

const { spawn } = require('child_process');
const path = require('path');
const axios = require('axios');

// Function to start a server process
function startServer(scriptName, serverName) {
  console.log(`Starting ${serverName}...`);
  
  const server = spawn('node', [scriptName], {
    stdio: 'pipe',
    shell: true
  });
  
  server.stdout.on('data', (data) => {
    console.log(`[${serverName}] ${data.toString().trim()}`);
  });
  
  server.stderr.on('data', (data) => {
    console.error(`[${serverName} ERROR] ${data.toString().trim()}`);
  });
  
  server.on('close', (code) => {
    console.log(`${serverName} process exited with code ${code}`);
  });
  
  return server;
}

// Start both servers
const mainServer = startServer('server.js', 'Main Server');
const aiServer = startServer('app.js', 'AI Server');

// Give servers some time to start
setTimeout(async () => {
  try {
    // Test connection to the main server
    const mainServerResponse = await axios.get('http://localhost:5001/api/symptom-service-status');
    console.log('\n===== CONNECTION TEST =====');
    console.log('Main server connection:', mainServerResponse.data);
    
    // If the main server can reach the AI server
    if (mainServerResponse.data.serviceAvailable) {
      console.log('✅ Successfully connected to both servers!');
      console.log('The symptom analyzer should now be working properly.');
      console.log('\nYou can now start the frontend with: npm run dev');
      console.log('Or use the npm run start-all command to start everything at once.');
    } else {
      console.log('❌ Main server is running but cannot connect to the AI server.');
      console.log('Check if the AI server is running on port 3001.');
    }
  } catch (error) {
    console.error('❌ Failed to connect to the main server:', error.message);
    console.log('Check if the main server is running on port 5001.');
  }
}, 5000);

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping servers...');
  mainServer.kill();
  aiServer.kill();
  process.exit();
}); 