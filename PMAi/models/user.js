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
    faceDescriptor: {
        type: Array,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
});

// Only hash password if it's modified and user is not using Google auth
userSchema.pre("save", async function(next) {
    if (!this.isModified("password") || this.googleId) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    if (this.googleId) {
        return false; // Google users don't have a password to compare
    }
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Method to update last login
userSchema.methods.updateLastLogin = async function() {
    this.lastLogin = Date.now();
    await this.save();
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;