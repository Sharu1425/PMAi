import express from "express";
import passport from "../backend/passportConfig.js";
import User from "../models/user.js";
import * as tf from '@tensorflow/tfjs-node';
import * as faceapi from "@vladmandic/face-api/dist/face-api.node.js";

const router = express.Router();

// Initialize face-api
faceapi.env.monkeyPatch({ Canvas: null, Image: null, ImageData: null });

router.get("/google", (req, res, next) => {
    console.log("Google auth route hit");
    passport.authenticate("google", { 
        scope: ["profile", "email"],
        prompt: "select_account"
    })(req, res, next);
});

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
    (req, res) => {
        console.log("Google auth successful, user:", req.user);
        // Send user data along with the redirect
        const redirectUrl = new URL("http://localhost:5173/dashboard");
        redirectUrl.searchParams.append("userId", req.user._id);
        redirectUrl.searchParams.append("email", req.user.email);
        redirectUrl.searchParams.append("name", req.user.name);
        res.redirect(redirectUrl.toString());
    }
);

router.post("/logout", (req, res) => {
    console.log("Logout route hit");
    req.logout((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).json({ error: "Error during logout" });
        }
        req.session.destroy((err) => {
            if (err) {
                console.error("Session destruction error:", err);
                return res.status(500).json({ error: "Error during logout" });
            }
            res.clearCookie('connect.sid');
            res.json({ success: true });
        });
    });
});

router.get("/status", (req, res) => {
    console.log("Auth status check:", {
        isAuthenticated: req.isAuthenticated(),
        session: req.session,
        user: req.user
    });
    res.json({ 
        isAuthenticated: req.isAuthenticated(),
        user: req.user ? {
            id: req.user._id,
            email: req.user.email,
            name: req.user.name,
            profilePicture: req.user.profilePicture
        } : null
    });
});

router.post("/face", async (req, res) => {
    try {
        const { faceDescriptor } = req.body;
        
        // Get all users with face descriptors
        const users = await User.find({ faceDescriptor: { $exists: true } });
        
        if (users.length === 0) {
            return res.status(401).json({ 
                success: false, 
                error: "No registered faces found. Please register your face first." 
            });
        }

        // Compare the face descriptor with all registered users
        let bestMatch = null;
        let bestDistance = Infinity;

        for (const user of users) {
            const distance = euclideanDistance(
                faceDescriptor,
                user.faceDescriptor
            );

            if (distance < bestDistance) {
                bestDistance = distance;
                bestMatch = user;
            }
        }

        // Threshold for face matching (adjust this value as needed)
        const threshold = 0.6;
        
        if (bestDistance < threshold) {
            // Set up the session
            req.login(bestMatch, (err) => {
                if (err) {
                    return res.status(500).json({ 
                        success: false, 
                        error: "Error creating session" 
                    });
                }
                return res.json({ 
                    success: true, 
                    user: {
                        _id: bestMatch._id,
                        email: bestMatch.email,
                        name: bestMatch.name,
                        profilePicture: bestMatch.profilePicture
                    }
                });
            });
        } else {
            res.status(401).json({ 
                success: false, 
                error: "Face not recognized. Please try again." 
            });
        }
    } catch (error) {
        console.error("Face authentication error:", error);
        res.status(500).json({ 
            success: false, 
            error: "Error during face authentication" 
        });
    }
});

// Helper function to calculate Euclidean distance
function euclideanDistance(descriptor1, descriptor2) {
    if (!descriptor1 || !descriptor2 || descriptor1.length !== descriptor2.length) {
        throw new Error("Invalid descriptors");
    }
    
    return Math.sqrt(
        descriptor1.reduce((sum, value, i) => {
            const diff = value - descriptor2[i];
            return sum + (diff * diff);
        }, 0)
    );
}

router.post("/face/register", async (req, res) => {
    try {
        const { faceDescriptor, userId } = req.body;
        
        if (!faceDescriptor || !userId) {
            return res.status(400).json({ 
                success: false, 
                error: "Missing required fields" 
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                error: "User not found" 
            });
        }

        // Update user with face descriptor
        user.faceDescriptor = faceDescriptor;
        await user.save();

        res.json({ 
            success: true, 
            message: "Face registered successfully" 
        });
    } catch (error) {
        console.error("Face registration error:", error);
        res.status(500).json({ 
            success: false, 
            error: "Error registering face" 
        });
    }
});

export default router;
