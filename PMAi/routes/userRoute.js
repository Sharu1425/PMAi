import express from "express";
import { loginUser, regUser } from "../../controllers/userController.js";
import User from "../models/user.js";
import Result from "../models/result.js";

const router = express.Router();

// Route for user login
router.post("/users/login", async (req, res) => {
    const { email, password } = req.body;
    const login = await loginUser(email, password);
    res.status(login.status).json({ message: login.message, error: login.error, user: login.user });
});

// Route for user registration
router.post("/users/register", async (req, res) => {
    const { username, email, password } = req.body;
    const reg = await regUser(username, email, password);
    res.status(reg.status).json({ message: reg.message, error: reg.error });
});

router.post("/users/register-face", async (req, res) => {
    const { name, descriptor } = req.body;
  
    try {
      const user = new User({ name, descriptor });
      await user.save();
      res.json({ success: true, message: "Face registered!" });
    } catch (error) {
      res.status(500).json({ error: "Failed to register face" });
    }
});
  
router.get("/users/getEncodings", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// Get user's test history
router.get("/:userId/results", async (req, res) => {
    try {
        // Validate userId format
        if (!req.params.userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid user ID format" });
        }

        // Check if user exists
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const results = await Result.find({ userId: req.params.userId })
            .sort({ date: -1 })
            .select('score totalQuestions date topic difficulty');
        
        res.json({ 
            results,
            totalAttempts: results.length,
            averageScore: results.length > 0 
                ? results.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions), 0) / results.length 
                : 0
        });
    } catch (error) {
        console.error("Error fetching user results:", error);
        res.status(500).json({ 
            error: "Failed to fetch test history",
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

export default router;