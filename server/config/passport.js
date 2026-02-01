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

// GitHub Strategy (Optional - only if credentials are provided)
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    const GitHubStrategy = require('passport-github2').Strategy;

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/api/auth/github/callback"
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // 1. Check if user exists by githubId
                let user = await User.findOne({ githubId: profile.id });
                if (user) return done(null, user);

                // 2. Check if user exists by email (link account)
                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
                if (email) {
                    user = await User.findOne({ email });
                    if (user) {
                        user.githubId = profile.id;
                        await user.save();
                        return done(null, user);
                    }
                }

                // 3. Create new user
                user = new User({
                    username: profile.username || profile.displayName,
                    email: email,
                    githubId: profile.id,
                    // Password is not required for OAuth users
                });
                await user.save();
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }));
} else {
    console.log('GitHub OAuth not configured - skipping GitHub Strategy');
}

module.exports = passport;
