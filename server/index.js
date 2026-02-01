require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const linkRoutes = require('./routes/links');

const app = express();

// Global Request Logger
app.use((req, res, next) => {
    console.log(`[GLOBAL LOG] ${req.method} ${req.url}`);
    next();
});

// Middleware - CORS configuration for browser and extensions
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, extensions)
        if (!origin) return callback(null, true);

        // Production: Allow CLIENT_URL from environment
        const clientUrl = process.env.CLIENT_URL;
        
        // Development: Allow localhost origins
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:3000',
            'http://127.0.0.1:5173'
        ];

        // Add production URL if it exists
        if (clientUrl) {
            allowedOrigins.push(clientUrl);
        }

        // Allow Chrome extensions
        if (origin.startsWith('chrome-extension://')) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // For development, allow all origins
        // For production, you might want to restrict this
        callback(null, true);
    },
    credentials: true
}));
app.use(express.json());
const session = require('express-session');
const passport = require('./config/passport');

app.use(session({ secret: process.env.JWT_SECRET || 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);

// 404 Logger for unmatched routes
app.use((req, res, next) => {
    console.log(`[GLOBAL 404] Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ msg: `Route not found: ${req.method} ${req.url}` });
});

// Database Connection
if (!process.env.MONGO_URI) {
    console.error('FATAL ERROR: MONGO_URI is not defined in .env');
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        if (err.name === 'MongooseServerSelectionError') {
            console.error('\n*** HINT: This error usually means your IP address is not whitelisted in MongoDB Atlas. ***');
            console.error('*** Go to Network Access > Add IP Address > Add Current IP Address in your Atlas dashboard. ***\n');
        }
        process.exit(1); // Exit process with failure
    });
