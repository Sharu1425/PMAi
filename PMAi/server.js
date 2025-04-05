import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import './passportConfig.js'; // Import passport config to register strategies
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import axios from 'axios';

dotenv.config();

console.log("Environment variables loaded:", {
    MONGODB_URI: process.env.MONGODB_URI,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
});

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static('public'));
console.log('Serving static files from:', process.cwd() + '/public');

// Session configuration
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Proxy routes for Gemini API
app.post('/api/symptom-analysis', async (req, res) => {
    try {
        // Forward the request to the Gemini API server
        const response = await axios.post('http://localhost:3001/api/analyze-symptoms', req.body);
        return res.json(response.data);
    } catch (error) {
        console.error('Error proxying symptom analysis request:', error);
        
        // Return appropriate error response
        return res.status(error.response?.status || 500).json({
            error: 'Failed to analyze symptoms',
            message: error.response?.data?.message || error.message,
        });
    }
});

// Proxy route for diet recommendations
app.post('/api/diet-recommendations', async (req, res) => {
    try {
        // Forward the request to the Gemini API server
        const response = await axios.post('http://localhost:3001/api/diet-recommendations', req.body);
        return res.json(response.data);
    } catch (error) {
        console.error('Error proxying diet recommendations request:', error);
        
        // Return appropriate error response
        return res.status(error.response?.status || 500).json({
            error: 'Failed to get diet recommendations',
            message: error.response?.data?.message || error.message,
        });
    }
});

// Health check endpoint for the symptom analysis service
app.get('/api/symptom-service-status', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3001/api/health');
        return res.json({ 
            status: 'ok',
            serviceAvailable: true,
            message: response.data.message
        });
    } catch (error) {
        console.error('Symptom analysis service health check failed:', error);
        return res.json({ 
            status: 'error',
            serviceAvailable: false,
            message: 'Symptom analysis service is not available'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Check connection to symptom analysis service
    axios.get('http://localhost:3001/api/health')
        .then(() => console.log('Connected to health assistant API (symptoms and diet recommendations)'))
        .catch(err => console.error('Health assistant API is not available:', err.message));
}); 