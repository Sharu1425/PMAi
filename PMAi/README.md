# PMAi - Personal Medical Assistant

A modern web application that provides personalized medical assistance using AI technology.

## Features

- User authentication (Email/Password & Google)
- Secure JWT-based authentication
- AI-powered medical assistance using Google's Gemini
- Modern UI with medical theme
- Responsive design

## Tech Stack

### Frontend
- React
- Tailwind CSS
- Framer Motion
- React Router
- Axios

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- Google OAuth
- Google Gemini API

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your credentials:
   - MongoDB URI
   - JWT Secret
   - Google Client ID
   - Gemini API Key

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:5001
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/google` - Google OAuth
- GET `/api/auth/me` - Get current user

### Gemini API
- POST `/api/gemini/query` - Get AI response for medical queries

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
