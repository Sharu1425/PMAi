import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "./models/user.js";
import dotenv from "dotenv";

dotenv.config();

console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
console.log("Google Client Secret:", process.env.GOOGLE_CLIENT_SECRET);

// Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5001/api/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const existingUser = await User.findOne({ email: profile.emails[0].value });
                if (existingUser) {
                    // Update existing user with Google info if not present
                    if (!existingUser.googleId) {
                        existingUser.googleId = profile.id;
                        existingUser.name = profile.displayName;
                        existingUser.profilePicture = profile.photos[0].value;
                        await existingUser.save();
                    }
                    return done(null, existingUser);
                }

                // Create new user
                const username = profile.emails[0].value.split('@')[0];
                const newUser = new User({
                    username,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    name: profile.displayName,
                    profilePicture: profile.photos[0].value,
                    isAdmin: false
                });
                await newUser.save();
                done(null, newUser);
            } catch (error) {
                console.error("Google auth error:", error);
                done(error, false);
            }
        }
    )
);

// JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(
    new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
        try {
            const user = await User.findById(jwtPayload.id);
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        console.error("Deserialize error:", error);
        done(error, null);
    }
});

export default passport;

