import express from "express";
import { loginUser, regUser } from "../controllers/userController.js";

const router = express.Router();

// Route for user login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const login = await loginUser(email, password);
    res.status(login.status).json({ message: login.message, error: login.error, user: login.user });
});

// Route for user registration
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    const reg = await regUser(username, email, password);
    res.status(reg.status).json({ message: reg.message, error: reg.error });
});

export default router;