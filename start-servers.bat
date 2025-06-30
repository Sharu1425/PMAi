@echo off
echo Starting the development server...

:: Start the main server
start cmd /k "cd backend && node index.js"

:: Start the frontend development server
start cmd /k "npm run dev"

echo All servers started successfully! 