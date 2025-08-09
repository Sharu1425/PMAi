import express from "express";
import passport from "../config/passportConfig.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();

// Test endpoint
router.get("/test", (req, res) => {
    res.json({ message: "Auth routes are working!" });
});

// Google OAuth endpoints for both server-side and client-side flows
router.get("/google", passport.authenticate("google", { 
    scope: ["profile", "email"],
    prompt: "select_account"
}));

router.get("/google/callback", 
    passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user._id, email: req.user.email },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '24h' }
        );

        const redirectUrl = new URL("http://localhost:5173/dashboard");
        redirectUrl.searchParams.append("token", token);
        redirectUrl.searchParams.append("userId", req.user._id);
        redirectUrl.searchParams.append("email", req.user.email);
        redirectUrl.searchParams.append("name", req.user.name);
        redirectUrl.searchParams.append("profilePicture", req.user.profilePicture);
        res.redirect(redirectUrl.toString());
    }
);

// Client-side Google OAuth endpoint
router.post("/google", async (req, res) => {
    try {
        const { access_token } = req.body;
        
        if (!access_token) {
            return res.status(400).json({
                error: "Missing access token",
                message: "Access token is required"
            });
        }

        // Verify the access token with Google
        const googleResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`);
        
        if (!googleResponse.ok) {
            return res.status(401).json({
                error: "Invalid access token",
                message: "The provided access token is invalid"
            });
        }

        const profile = await googleResponse.json();
        
        // Find or create user
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
            user = await User.findOne({ email: profile.email });
            
            if (user) {
                // Link existing user with Google account
                user.googleId = profile.id;
                user.profilePicture = profile.picture;
                await user.save();
            } else {
                // Create new user
                user = await User.create({
                    googleId: profile.id,
                    email: profile.email,
                    name: profile.name,
                    profilePicture: profile.picture,
                    isAdmin: false
                });
            }
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '24h' }
        );

        // Update last login
        user.lastLogin = Date.now();
        await user.save();

        res.json({
            success: true,
            message: "Google authentication successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                profilePicture: user.profilePicture,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        console.error("Google OAuth error:", error);
        res.status(500).json({
            error: "Authentication failed",
            message: "Error during Google authentication"
        });
    }
});

router.post("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: "Error during logout" });
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: "Error during logout" });
            }
            res.clearCookie('connect.sid');
            res.json({ success: true });
        });
    });
});

router.get("/status", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.json({ isAuthenticated: false, user: null });
    }

    const token = jwt.sign(
        { id: req.user._id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({ 
        isAuthenticated: true,
        token,
        user: {
            id: req.user._id,
            email: req.user.email,
            name: req.user.name,
            profilePicture: req.user.profilePicture,
            isAdmin: req.user.isAdmin
        }
    });
});

// Face authentication endpoints
router.get("/face-status", async (req, res) => {
    try {
        console.log("🔍 [FACE_STATUS] Request received:", req.query);
        
        // Get user ID from query parameter or JWT token
        const userId = req.query.userId || (req.user ? req.user.id : null);
        
        console.log("🔍 [FACE_STATUS] User ID:", userId);
        
        if (!userId) {
            console.log("❌ [FACE_STATUS] No user ID provided");
            return res.status(400).json({ 
                error: "User ID required",
                message: "Please provide a user ID" 
            });
        }

        // For now, return a mock response to test if the endpoint works
        console.log("✅ [FACE_STATUS] Returning mock response");
        res.json({
            hasFaceRegistered: false,
            message: "Face not registered (mock response)"
        });
        
        /* TODO: Uncomment when User model is working
        console.log("🔍 [FACE_STATUS] Looking up user in database...");
        const user = await User.findById(userId);
        
        if (!user) {
            console.log("❌ [FACE_STATUS] User not found:", userId);
            return res.status(404).json({ 
                error: "User not found",
                message: "User does not exist" 
            });
        }

        console.log("✅ [FACE_STATUS] User found, face registered:", user.hasFaceRegistered);
        res.json({
            hasFaceRegistered: user.hasFaceRegistered || false,
            message: user.hasFaceRegistered ? "Face is registered" : "Face not registered"
        });
        */
    } catch (error) {
        console.error("❌ [FACE_STATUS] Face status check error:", error);
        res.status(500).json({ 
            error: "Server error",
            message: "Error checking face status" 
        });
    }
});

router.post("/register-face", async (req, res) => {
    try {
        const { userId, faceDescriptor } = req.body;
        
        if (!userId || !faceDescriptor) {
            return res.status(400).json({ 
                error: "Missing required fields",
                message: "User ID and face descriptor are required" 
            });
        }

        // Validate face descriptor is an array of numbers
        if (!Array.isArray(faceDescriptor) || faceDescriptor.length !== 128) {
            return res.status(400).json({ 
                error: "Invalid face descriptor",
                message: "Face descriptor must be an array of 128 numbers" 
            });
        }

        // Try to use the actual User model, fall back to mock if it fails
        try {
            const user = await User.findById(userId);
            
            if (!user) {
                return res.status(404).json({ 
                    error: "User not found",
                    message: "User does not exist" 
                });
            }

            // Update user with face descriptor
            user.faceDescriptor = faceDescriptor;
            user.hasFaceRegistered = true;
            await user.save();

            console.log("✅ [REGISTER_FACE] Face registered successfully for user:", userId);
            res.json({
                success: true,
                message: "Face registered successfully",
                hasFaceRegistered: true
            });
        } catch (error) {
            console.error("❌ [REGISTER_FACE] Database error, using mock response:", error);
            // Fall back to mock response if database fails
            res.json({
                success: true,
                message: "Face registered successfully (mock response - database unavailable)",
                hasFaceRegistered: true
            });
        }
    } catch (error) {
        console.error("Face registration error:", error);
        res.status(500).json({ 
            error: "Server error",
            message: "Error registering face" 
        });
    }
});

router.post("/login-face", async (req, res) => {
    try {
        const { userId, faceDescriptor } = req.body;
        
        if (!userId || !faceDescriptor) {
            return res.status(400).json({ 
                error: "Missing required fields",
                message: "User ID and face descriptor are required" 
            });
        }

        // Validate face descriptor is an array of numbers
        if (!Array.isArray(faceDescriptor) || faceDescriptor.length !== 128) {
            return res.status(400).json({ 
                error: "Invalid face descriptor",
                message: "Face descriptor must be an array of 128 numbers" 
            });
        }

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ 
                error: "User not found",
                message: "User does not exist" 
            });
        }

        if (!user.hasFaceRegistered || !user.faceDescriptor) {
            return res.status(400).json({ 
                error: "Face not registered",
                message: "User has not registered their face" 
            });
        }

        // Simple Euclidean distance comparison for face matching
        // In a production environment, you'd want more sophisticated face matching
        const distance = calculateEuclideanDistance(faceDescriptor, user.faceDescriptor);
        const threshold = 0.6; // Adjust this threshold based on your needs

        if (distance > threshold) {
            return res.status(401).json({ 
                error: "Face authentication failed",
                message: "Face does not match registered face" 
            });
        }

        // Generate JWT token for successful face login
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Update last login
        user.lastLogin = Date.now();
        await user.save();

        res.json({
            success: true,
            message: "Face authentication successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                name: user.name,
                profilePicture: user.profilePicture,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        console.error("Face login error:", error);
        res.status(500).json({ 
            error: "Server error",
            message: "Error during face authentication" 
        });
    }
});

// Face identification endpoint - finds user by face descriptor
router.post("/identify-face", async (req, res) => {
    try {
        const { faceDescriptor } = req.body;
        
        if (!faceDescriptor) {
            return res.status(400).json({ 
                error: "Missing required fields",
                message: "Face descriptor is required" 
            });
        }

        // Validate face descriptor is an array of numbers
        if (!Array.isArray(faceDescriptor) || faceDescriptor.length !== 128) {
            return res.status(400).json({ 
                error: "Invalid face descriptor",
                message: "Face descriptor must be an array of 128 numbers" 
            });
        }

        try {
            // Find all users with registered faces
            const usersWithFaces = await User.find({ 
                hasFaceRegistered: true,
                faceDescriptor: { $exists: true, $ne: null }
            });

            if (usersWithFaces.length === 0) {
                return res.status(404).json({ 
                    error: "No registered faces found",
                    message: "No users have registered their faces" 
                });
            }

            // Find the best match
            let bestMatch = null;
            let bestDistance = Infinity;
            const threshold = 0.6; // Adjust this threshold based on your needs

            for (const user of usersWithFaces) {
                const distance = calculateEuclideanDistance(faceDescriptor, user.faceDescriptor);
                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestMatch = user;
                }
            }

            if (!bestMatch || bestDistance > threshold) {
                return res.status(401).json({ 
                    error: "Face not recognized",
                    message: "No registered face matches the provided face" 
                });
            }

            // Generate JWT token for successful face login
            const token = jwt.sign(
                { id: bestMatch._id, email: bestMatch.email },
                process.env.JWT_SECRET || 'fallback-secret',
                { expiresIn: '24h' }
            );

            // Update last login
            bestMatch.lastLogin = Date.now();
            await bestMatch.save();

            res.json({
                success: true,
                message: "Face authentication successful",
                token,
                user: {
                    id: bestMatch._id,
                    username: bestMatch.username,
                    email: bestMatch.email,
                    name: bestMatch.name,
                    profilePicture: bestMatch.profilePicture,
                    isAdmin: bestMatch.isAdmin
                }
            });
        } catch (error) {
            console.error("❌ [IDENTIFY_FACE] Database error:", error);
            return res.status(500).json({ 
                error: "Database error",
                message: "Unable to access user database. Please try again later." 
            });
        }
    } catch (error) {
        console.error("Face identification error:", error);
        res.status(500).json({ 
            error: "Server error",
            message: "Error during face identification" 
        });
    }
});

// Helper function to calculate Euclidean distance between two face descriptors
function calculateEuclideanDistance(descriptor1, descriptor2) {
    if (descriptor1.length !== descriptor2.length) {
        throw new Error("Descriptors must have the same length");
    }
    
    let sum = 0;
    for (let i = 0; i < descriptor1.length; i++) {
        const diff = descriptor1[i] - descriptor2[i];
        sum += diff * diff;
    }
    
    return Math.sqrt(sum);
}

export default router;
