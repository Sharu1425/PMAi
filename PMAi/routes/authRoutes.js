import express from "express";
import passport from "../passportConfig.js";
import User from "../models/user.js";

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
    passport.authenticate("google", { failureRedirect: "http://localhost:5174/login" }),
    (req, res) => {
        console.log("Google auth successful, user:", req.user);
        // Send user data along with the redirect
        const redirectUrl = new URL("http://localhost:5174/dashboard");
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


export default router;
