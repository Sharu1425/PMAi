import express from "express";
import passport from "../passportConfig.js";
import jwt from "jsonwebtoken";

const router = express.Router();

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
        
        // Generate JWT token
        const token = jwt.sign(
            { id: req.user._id, email: req.user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send user data and token
        const redirectUrl = new URL("http://localhost:5173/dashboard");
        redirectUrl.searchParams.append("token", token);
        redirectUrl.searchParams.append("userId", req.user._id);
        redirectUrl.searchParams.append("email", req.user.email);
        redirectUrl.searchParams.append("name", req.user.name);
        redirectUrl.searchParams.append("profilePicture", req.user.profilePicture);
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
    
    if (!req.isAuthenticated()) {
        return res.json({ isAuthenticated: false, user: null });
    }

    // Generate new JWT token
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

export default router;
