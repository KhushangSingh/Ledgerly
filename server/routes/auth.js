const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const passport = require('passport');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ msg: 'Please provide all required fields' });
        }

        // Check if user already exists
        let existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ msg: 'User with this email already exists' });
            }
            if (existingUser.username === username) {
                return res.status(400).json({ msg: 'Username already taken' });
            }
        }

        // Create new user
        const user = new User({
            username,
            email,
            password
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to database
        await user.save();

        // Create JWT payload
        const payload = {
            user: {
                id: user.id
            }
        };

        // Sign token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email
                    }
                });
            }
        );
    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).json({ msg: 'Server error during registration' });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ msg: 'Please provide email and password' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check if user has a password (might be OAuth-only user)
        if (!user.password) {
            return res.status(400).json({ msg: 'Please login with Google/GitHub or set a password' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create JWT payload
        const payload = {
            user: {
                id: user.id
            }
        };

        // Sign token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) {
                    console.error('JWT signing error:', err.message);
                    return res.status(500).json({ msg: 'Server error during login' });
                }
                res.json({
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email
                    }
                });
            }
        );
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ msg: 'Server error during login' });
    }
});

// @route   GET /api/auth/me
// @desc    Get authenticated user
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Get user error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   DELETE /api/auth/me
// @desc    Delete user and all associated data
// @access  Private
router.delete('/me', auth, async (req, res) => {
    try {
        // 1. Delete all links associated with user
        const Link = require('../models/Link');
        await Link.deleteMany({ user: req.user.id });

        // 2. Delete the user
        await User.findByIdAndDelete(req.user.id);

        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error('Delete user error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET /api/auth/google
// @desc    Auth with Google
// @access  Public
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @route   GET /api/auth/google/callback
// @desc    Google auth callback
// @access  Public
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/auth?error=LoginFailed` }),
    (req, res) => {
        // Successful authentication, redirect home.
        const payload = {
            user: {
                id: req.user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                // Redirect to client with token
                res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/success?token=${token}`);
            }
        );
    }
);

// @route   GET /api/auth/github
// @desc    Auth with GitHub
// @access  Public
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// @route   GET /api/auth/github/callback
// @desc    GitHub auth callback
// @access  Public
router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/auth?error=LoginFailed` }),
    (req, res) => {
        // Successful authentication, redirect home.
        const payload = {
            user: {
                id: req.user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                // Redirect to client with token
                res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/success?token=${token}`);
            }
        );
    }
);

module.exports = router;
