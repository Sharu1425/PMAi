import express from "express";
import passport from "../config/passportConfig.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/google", passport.authenticate("google", { 
    scope: ["profile", "email"],
    prompt: "select_account"
}));

router.get("/google/callback", 
    passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user._id, email: req.user.email },
            process.env.JWT_SECRET,
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

export default router;
