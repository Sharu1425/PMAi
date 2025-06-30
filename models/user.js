import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: function() { return !this.googleId; },
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: function() { return !this.googleId; }
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    name: String,
    profilePicture: String,
    // Health profile information
    age: Number,
    gender: String,
    weight: Number,
    height: Number,
    bloodType: String,
    allergies: String,
    dietaryRestrictions: String,
    medicalConditions: String,
    weightGoals: String,
    activityLevel: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre("save", async function(next) {
    // Only hash the password if it's modified (or new)
    if (!this.isModified("password") || this.googleId) {
        return next();
    }
    
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        
        // Hash the password using the salt
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(plainPassword) {
    if (!this.password) {
        return false;
    }
    
    try {
        // Compare plain password with the hashed password in the database
        return await bcrypt.compare(plainPassword, this.password);
    } catch (error) {
        console.error("Password comparison error:", error);
        return false;
    }
};

// Method to update last login
userSchema.methods.updateLastLogin = async function() {
    this.lastLogin = Date.now();
    await this.save();
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;