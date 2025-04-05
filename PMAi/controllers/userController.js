import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const loginUser = async (email, password) => {
    try {
        console.log("Attempting to find user with email:", email)
        const user = await User.findOne({ email });
        console.log("User lookup result:", user ? "User found" : "User not found")
        
        if (!user) {
            console.log("User not found for email:", email)
            return { 
                status: 401, 
                error: "Invalid email or password",
                message: "Please check your credentials and try again"
            };
        }
        
        console.log("User found, checking authentication method")
        console.log("Stored password hash:", user.password ? "Exists" : "Does not exist")
        console.log("User is Google user:", !!user.googleId)
        
        if (!user.password && user.googleId) {
            console.log("User is Google-only, no password set")
            return {
                status: 401,
                error: "Google account",
                message: "This account was created with Google. Please use Google login instead."
            };
        }
        
        if (!user.password) {
            console.log("No password set for user")
            return {
                status: 401,
                error: "No password",
                message: "No password set for this account. Please reset your password."
            };
        }
        
        console.log("Attempting password comparison")
        const isMatch = await user.comparePassword(password);
        console.log("Password verification result:", isMatch ? "Password matches" : "Password does not match")
        
        if (!isMatch) {
            console.log("Password mismatch for user:", email)
            return { 
                status: 401, 
                error: "Invalid password",
                message: "The password you entered is incorrect. Please try again."
            };
        }
        
        console.log("Password verified, generating token")
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // Update last login
        await user.updateLastLogin();
        
        return { 
            status: 200, 
            message: "Login Successful", 
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
            error: "Error logging in",
            message: "An unexpected error occurred. Please try again later."
        };
    }
};

const regUser = async (username, email, password) => {
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return { status: 409, error: "User already exists" };

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword,
            isAdmin: false
        });
        
        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return { 
            status: 201, 
            message: "User Registered Successfully",
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
        return { status: 500, error: "Error registering user" };
    }
};

export { loginUser, regUser };