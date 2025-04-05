# PMAi - Personal Medical Assistant with AI

PMAi is a web application that serves as a personal medical assistant, providing users with features like symptom analysis, diet recommendations, medication reminders, and more.

## Features

- **Symptom Analysis**: AI-powered symptom analyzer using Google's Gemini API
- **Diet Recommendations**: Get personalized diet suggestions
- **Medication Reminders**: Track and get reminders for your medications
- **User Profile**: Manage your personal health information
- **Authentication**: Secure login with email or Google authentication

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB instance
- Google Gemini API key
- For Google authentication: Google OAuth credentials

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GEMINI_API_KEY=your_gemini_api_key
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start all services:
   ```
   npm run start-all
   ```

This will launch:
- React frontend on port 5173
- Main server on port 5001
- Gemini API server on port 3001

## Server Architecture

The application consists of multiple servers:

1. **Frontend Server (Vite)**: Serves the React application
2. **Main Server (server.js)**: Handles authentication, user data, and proxies requests to the AI server
3. **AI Server (app.js)**: Connects to Google's Gemini API for AI-powered features

## Using the Symptom Analyzer

1. Navigate to the Symptoms page
2. Enter your symptoms in the chat interface
3. The AI will analyze your symptoms and provide feedback
4. Continue the conversation to get more detailed information

## Development

- Run frontend only: `npm run dev`
- Run main server only: `npm run server`
- Run AI server only: `npm run ai-server`

## Troubleshooting

- If the symptom analyzer isn't working, check if:
  - All servers are running
  - The Gemini API key is valid
  - The main server can connect to the AI server

## License

This project is licensed under the MIT License.
