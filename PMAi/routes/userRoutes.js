import express from "express";
import { loginUser, regUser } from "../controllers/userController.js";
import User from "../models/user.js";
import passport from "passport";

const router = express.Router();

// Debug endpoint to check user existence and details
router.get("/debug/user/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });
        
        if (user) {
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
        // Extract credentials from request body
        const { email, password } = req.body;
        
        // Log the login attempt (do not log passwords)
        console.log(`Login attempt for email: ${email}`);
        
        // Call the login controller function
        const result = await loginUser(email, password);
        
        // Send appropriate response based on the result
        res.status(result.status).json({ 
            message: result.message, 
            error: result.error, 
            user: result.user,
            token: result.token 
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
        // Extract user data from request body
        const { username, email, password } = req.body;
        
        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Missing required fields",
                error: "All fields are required"
            });
        }
        
        // Call the registration controller function
        const result = await regUser(username, email, password);
        
        // Send appropriate response based on the result
        res.status(result.status).json({ 
            message: result.message, 
            error: result.error,
            user: result.user,
            token: result.token 
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ 
            message: "An error occurred during registration",
            error: error.message 
        });
    }
});

// Protected route to get user profile
router.get("/profile", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        // Fetch user data excluding password for security
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.json(user);
    } catch (error) {
        console.error("Profile error:", error);
        res.status(500).json({ error: "Error fetching profile" });
    }
});

// Route for user logout
router.post("/logout", async (req, res) => {
    try {
        // For JWT-based authentication, the client should remove the token
        // Here we just log the logout action and return a success response
        
        // If userId is provided, update the lastLogout timestamp in user record
        const { userId } = req.body;
        if (userId) {
            await User.findByIdAndUpdate(userId, { lastLogout: Date.now() });
        }
        
        // Return success
        res.status(200).json({ 
            success: true,
            message: "Logout successful" 
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ 
            success: false,
            message: "An error occurred during logout",
            error: error.message 
        });
    }
});

export default router;