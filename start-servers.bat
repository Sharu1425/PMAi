@echo off
echo Starting PMAi Application...
echo.
echo This will start the AI server, main server, and frontend in separate windows.
echo.
echo Press Ctrl+C in each window to stop the servers when done.
echo.
timeout /t 3

:: Start the AI server in a new window
start cmd /k "cd %~dp0 && echo Starting Gemini AI Server... && node app.js"

:: Wait a moment for the AI server to initialize
timeout /t 2

:: Start the main server in a new window
start cmd /k "cd %~dp0 && echo Starting Main Server... && node server.js"

:: Wait a moment for the main server to initialize
timeout /t 2

:: Start the frontend in a new window
start cmd /k "cd %~dp0 && echo Starting Frontend... && npm run dev"

echo.
echo All services started successfully!
echo.
echo Frontend URL: http://localhost:5173
echo Main Server API: http://localhost:5001
echo AI Server API: http://localhost:3001
echo.
echo PMAi is now fully running.
echo.
pause 