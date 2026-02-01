const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String, // URL to image/icon
        default: ''
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    stack: {
        type: String,
        trim: true,
        default: ''
    },
    starredBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isStarred: { // Deprecated, use starredBy
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        required: true,
        enum: [
            'AI & ML',
            'Design',
            'Development',
            'Productivity',
            'Marketing',
            'Content Creation',
            'Collaboration',
            'Business',
            'No-Code',
            'Data & Analytics',
            'Security',
            'Sales',
            'Finance',
            'Education',
            'E-commerce',
            'Customer Support',
            'HR & Hiring',
            'Legal',
            'Web3 & Crypto',
            'Utilities',
            'Other'
        ],
        default: 'Other'
    },
    subCategory: {
        type: String,
        trim: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    clicks: {
        type: Number,
        default: 0
    },
    pricing: {
        type: String, // 'Free', 'Paid', 'Freemium'
        default: 'Free'
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    isOfficial: {
        type: Boolean,
        default: false
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add indexes for better query performance
linkSchema.index({ isPublic: 1, isOfficial: 1, clicks: -1 });

module.exports = mongoose.model('Link', linkSchema);
