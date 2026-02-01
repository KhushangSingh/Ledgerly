const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const AppleStrategy = require('passport-apple'); // Uncomment when you have Apple keys
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Google Strategy (Optional - only if credentials are provided)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback"
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // 1. Check if user exists by googleId
                let user = await User.findOne({ googleId: profile.id });
                if (user) return done(null, user);

                // 2. Check if user exists by email (link account)
                const email = profile.emails[0].value;
                user = await User.findOne({ email });

                if (user) {
                    user.googleId = profile.id;
                    await user.save();
                    return done(null, user);
                }

                // 3. Create new user
                user = new User({
                    username: profile.displayName,
                    email: email,
                    googleId: profile.id,
                    // Password is not required now
                });
                await user.save();
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }));
} else {
    console.log('Google OAuth not configured - skipping Google Strategy');
}

// Apple Strategy (Placeholder until keys are available)
/*
passport.use(new AppleStrategy({
    clientID: process.env.APPLE_SERVICE_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    privateKeyLocation: process.env.APPLE_PRIVATE_KEY_LOCATION, 
    callbackURL: "/api/auth/apple/callback"
},
async (accessToken, refreshToken, idToken, profile, done) => {
    // Similar logic to Google
    // Note: Apple only sends email/name on the FIRST login
}));
*/

module.exports = passport;
