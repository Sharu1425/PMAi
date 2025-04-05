import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const loginUser = async (email, password) => {
    try {
        // Validate inputs
        if (!email || !password) {
            return { 
                status: 400, 
                error: "Missing credentials", 
                message: "Email and password are required" 
            };
        }

        // Find user by email
        const user = await User.findOne({ email });
        
        // Check if user exists
        if (!user) {
            return { 
                status: 401, 
                error: "Authentication failed", 
                message: "Invalid email or password" 
            };
        }
        
        // Check if it's a Google account without password
        if (user.googleId && !user.password) {
            return {
                status: 401,
                error: "Google account",
                message: "Please use Google login for this account"
            };
        }
        
        // Compare passwords using bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            return { 
                status: 401, 
                error: "Authentication failed", 
                message: "Invalid email or password" 
            };
        }
        
        // Generate JWT token for authentication
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || "fallback_secret_key",
            { expiresIn: '24h' }
        );
        
        // Update last login timestamp
        user.lastLogin = Date.now();
        await user.save();
        
        // Return success with token and user data
        return { 
            status: 200, 
            message: "Login successful", 
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                name: user.name,
                profilePicture: user.profilePicture,
                isAdmin: user.isAdmin
            },
            token 
        };
    } catch (error) {
        console.error("Login error:", error);
        return { 
            status: 500, 
            error: "Server error", 
            message: "An unexpected error occurred during login" 
        };
    }
};

const regUser = async (username, email, password) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { 
                status: 409, 
                error: "User already exists",
                message: "An account with this email already exists" 
            };
        }

        // Create new user
        const newUser = new User({ 
            username, 
            email, 
            password,
            isAdmin: false
        });
        
        // Save user (password will be automatically hashed by the pre-save hook)
        await newUser.save();

        // Generate token for automatic login after registration
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET || "fallback_secret_key",
            { expiresIn: '24h' }
        );

        // Return success with user data and token
        return { 
            status: 201, 
            message: "Registration successful",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                name: newUser.name,
                profilePicture: newUser.profilePicture,
                isAdmin: newUser.isAdmin
            },
            token 
        };
    } catch (error) {
        console.error("Registration error:", error);
        return { 
            status: 500, 
            error: "Registration failed",
            message: "An unexpected error occurred during registration" 
        };
    }
};

export { loginUser, regUser };