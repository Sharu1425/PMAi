import express from 'express';
import session from "express-session";
import cors from 'cors';
import connectDB from './backend/database.js';
import passport from "./backend/passportConfig.js";
import userRoutes from './routes/userRoute.js';
import qnRoutes from './routes/qnRoute.js';
import resultRoutes from './routes/resultRoute.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const port = 5001;
connectDB();

// Debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax',
        path: '/'
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use('/db', userRoutes);
app.use('/db', qnRoutes);
app.use('/db', resultRoutes);

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.use((err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log('Environment variables check:');
    console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set');
    console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set');
    console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? 'Set' : 'Not set');
});