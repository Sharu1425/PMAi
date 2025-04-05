import express from "express";
import { loginUser, regUser } from "../controllers/userController.js";
import User from "../models/user.js";

const router = express.Router();

// Debug endpoint to check user existence and details
router.get("/debug/user/:email", async (req, res) => {
    try {
        const { email } = req.params;
        console.log("Checking user existence for email:", email);
        const user = await User.findOne({ email });
        console.log("User found:", user ? "Yes" : "No");
        
        if (user) {
            console.log("User details:", {
                id: user._id,
                email: user.email,
                username: user.username,
                hasPassword: !!user.password,
                isGoogleUser: !!user.googleId,
                passwordHash: user.password ? "Exists" : "None",
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            });
            
            res.json({ 
                exists: true, 
                user: {
                    id: user._id,
                    email: user.email,
                    username: user.username,
                    hasPassword: !!user.password,
                    isGoogleUser: !!user.googleId,
                    createdAt: user.createdAt,
                    lastLogin: user.lastLogin
                }
            });
        } else {
            res.json({ exists: false, message: "User not found" });
        }
    } catch (error) {
        console.error("Debug error:", error);
        res.status(500).json({ error: "Error checking user" });
    }
});

// Route for user login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt for email:", email);
        const login = await loginUser(email, password);
        res.status(login.status).json({ 
            message: login.message, 
            error: login.error, 
            user: login.user,
            token: login.token 
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            message: "An error occurred during login",
            error: error.message 
        });
    }
});

// Route for user registration
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log("Registration attempt for email:", email);
        const reg = await regUser(username, email, password);
        res.status(reg.status).json({ 
            message: reg.message, 
            error: reg.error,
            user: reg.user,
            token: reg.token 
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ 
            message: "An error occurred during registration",
            error: error.message 
        });
    }
});

export default router;