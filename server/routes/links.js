const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Link = require('../models/Link');

// @route   GET api/links
// @desc    Get all public links (Official & Community) sorted by popularity
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const links = await Link.find({ isPublic: true })
            .populate('user', 'username avatar')
            .sort({ isOfficial: -1, clicks: -1, createdAt: -1 });
        res.json(injectUserFields(links, req.user.id));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/links/:id/click
// @desc    Increment link click count
// @access  Private
router.post('/:id/click', auth, async (req, res) => {
    try {
        await Link.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } });
        res.json({ msg: 'Click registered' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/links/my-links
// @desc    Get user's own links (both public and private) - for Vault page
// @access  Private
router.get('/my-links', auth, async (req, res) => {
    try {
        const links = await Link.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(injectUserFields(links, req.user.id));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/links/community
// @desc    Get public links from other users - for Community page
// @access  Private
router.get('/community', auth, async (req, res) => {
    try {
        const links = await Link.find({
            isPublic: true
        })
            .populate('user', 'username')
            .sort({ createdAt: -1 });
        res.json(injectUserFields(links, req.user.id));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/links/all
// @desc    Get all links (for Categories page)
// @access  Private
router.get('/all', auth, async (req, res) => {
    try {
        const links = await Link.find({})
            .populate('user', 'username')
            .sort({ createdAt: -1 });
        res.json(links);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/links/starred
// @desc    Get user's starred links
// @access  Private
router.get('/starred', auth, async (req, res) => {
    try {
        const links = await Link.find({
            $or: [
                { starredBy: req.user.id },
                { user: req.user.id, isStarred: true } // Legacy fallback
            ]
        }).sort({ createdAt: -1 }).populate('user', 'username');
        res.json(injectUserFields(links, req.user.id));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/links/trending
// @desc    Get trending public links
// @access  Private
router.get('/trending', auth, async (req, res) => {
    try {
        const links = await Link.find({
            isPublic: true,
            user: { $ne: req.user.id }
        })
            .sort({ createdAt: -1 })
            .limit(3)
            .populate('user', 'username');
        res.json(links);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/links/:id/star
// @desc    Toggle star status for a link (Global)
// @access  Private
router.put('/:id/star', auth, async (req, res) => {
    try {
        const link = await Link.findById(req.params.id);

        if (!link) {
            return res.status(404).json({ msg: 'Link not found' });
        }

        // Check if already starred
        const index = link.starredBy.indexOf(req.user.id);

        if (index === -1) {
            // Not starred, add user
            link.starredBy.push(req.user.id);
            // Legacy support (optional, only reliable if 1 user)
            if (link.user.toString() === req.user.id) link.isStarred = true;
        } else {
            // Already starred, remove user
            link.starredBy.splice(index, 1);
            if (link.user.toString() === req.user.id) link.isStarred = false;
        }

        await link.save();

        // Return updated link with computed isStarred
        const linkObj = link.toObject();
        linkObj.isStarred = link.starredBy.includes(req.user.id);

        res.json(linkObj);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});





// Helper to inject user-specific boolean fields (isStarred)
const injectUserFields = (links, userId) => {
    return links.map(link => {
        const linkObj = link.toObject ? link.toObject() : link;

        // Starred Status
        linkObj.isStarred = link.starredBy ? link.starredBy.some(id => id.toString() === userId) : false;
        if ((!link.starredBy || link.starredBy.length === 0) && link.user && link.user._id && link.user._id.toString() === userId) {
            linkObj.isStarred = linkObj.isStarred || link.isStarred; // Legacy fallback
        }

        return linkObj;
    });
};

// Helper to normalize URL for comparison
const normalizeUrl = (urlStr) => {
    try {
        let normalized = urlStr.trim().toLowerCase();
        // Remove trailing slash
        if (normalized.endsWith('/')) {
            normalized = normalized.slice(0, -1);
        }
        // Remove www.
        normalized = normalized.replace('://www.', '://');
        return normalized;
    } catch (e) {
        return urlStr;
    }
};

// @route   POST api/links
// @desc    Add new link
// @access  Private
router.post('/', auth, async (req, res) => {
    const { title, url, category, subCategory, tags, pricing, image, isPublic, stack, isStarred } = req.body;

    try {
        const normalizedUrl = normalizeUrl(url);

        // Check if URL already exists in user's vault
        const userLinks = await Link.find({ user: req.user.id });
        const existingLink = userLinks.find(link => normalizeUrl(link.url) === normalizedUrl);

        if (existingLink) {
            return res.status(400).json({
                msg: 'URL already exists in your vault',
                existingLink: {
                    title: existingLink.title,
                    url: existingLink.url,
                    _id: existingLink._id
                }
            });
        }

        const newLink = new Link({
            title,
            url,
            category,
            subCategory,
            tags,
            pricing,
            image,
            stack,
            isPublic: isPublic !== undefined ? isPublic : true,
            user: req.user.id,
            starredBy: isStarred ? [req.user.id] : []
        });

        // Legacy sync
        if (isStarred) newLink.isStarred = true;

        const link = await newLink.save();
        res.json(link);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/links/:id
// @desc    Update link
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { title, url, category, subCategory, tags, pricing, image, isPublic, stack, isStarred } = req.body;

    // Build link object
    const linkFields = {};
    if (title) linkFields.title = title;
    if (url) linkFields.url = url;
    if (category) linkFields.category = category;
    if (subCategory) linkFields.subCategory = subCategory;
    if (tags) linkFields.tags = tags;
    if (pricing) linkFields.pricing = pricing;
    if (image) linkFields.image = image;
    if (stack !== undefined) linkFields.stack = stack;
    if (isStarred !== undefined) linkFields.isStarred = isStarred;
    if (isPublic !== undefined) linkFields.isPublic = isPublic;

    try {
        let link = await Link.findById(req.params.id);

        if (!link) return res.status(404).json({ msg: 'Link not found' });

        // Make sure user owns link
        if (link.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        link = await Link.findByIdAndUpdate(req.params.id,
            { $set: linkFields },
            { new: true });

        res.json(link);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/links/:id
// @desc    Delete link
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let link = await Link.findById(req.params.id);

        if (!link) return res.status(404).json({ msg: 'Link not found' });

        // Make sure user owns link
        if (link.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Link.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Link removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/links/export
// @desc    Export user's links as JSON or CSV
// @access  Private
router.get('/export', auth, async (req, res) => {
    try {
        const format = req.query.format || 'json';
        const links = await Link.find({ user: req.user.id }).sort({ createdAt: -1 });

        if (format === 'csv') {
            // Generate CSV
            const headers = ['Title', 'URL', 'Category', 'Tags', 'Pricing', 'Description', 'Is Public', 'Is Starred', 'Clicks', 'Created At'];
            const csvRows = [headers.join(',')];

            links.forEach(link => {
                const row = [
                    `"${(link.title || '').replace(/"/g, '""')}"`,
                    `"${link.url}"`,
                    `"${link.category || ''}"`,
                    `"${(link.tags || []).join(';')}"`,
                    `"${link.pricing || ''}"`,
                    `"${(link.description || '').replace(/"/g, '""')}"`,
                    link.isPublic ? 'Yes' : 'No',
                    link.isStarred ? 'Yes' : 'No',
                    link.clicks || 0,
                    link.createdAt ? new Date(link.createdAt).toISOString() : ''
                ];
                csvRows.push(row.join(','));
            });

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=ledgerly-links.csv');
            return res.send(csvRows.join('\n'));
        }

        // Default: JSON export
        const exportData = links.map(link => ({
            title: link.title,
            url: link.url,
            category: link.category,
            tags: link.tags,
            pricing: link.pricing,
            description: link.description,
            isPublic: link.isPublic,
            isStarred: link.isStarred,
            clicks: link.clicks,
            createdAt: link.createdAt
        }));

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=ledgerly-links.json');
        res.json(exportData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/links/import
// @desc    Import bookmarks from Chrome/Firefox HTML file or Ledgerly JSON
// @access  Private
router.post('/import', auth, async (req, res) => {
    try {
        const { bookmarks, format } = req.body;

        if (!bookmarks) {
            return res.status(400).json({ msg: 'No bookmarks data provided' });
        }

        let linksToImport = [];

        if (format === 'json') {
            // Ledgerly JSON format
            linksToImport = bookmarks.map(b => ({
                title: b.title || 'Untitled',
                url: b.url,
                category: b.category || 'Other',
                tags: b.tags || [],
                pricing: b.pricing || 'Free',
                description: b.description || '',
                isPublic: b.isPublic !== undefined ? b.isPublic : true,
                user: req.user.id
            }));
        } else {
            // Chrome/Firefox HTML bookmark format (parsed on frontend, sent as array)
            linksToImport = bookmarks.map(b => ({
                title: b.title || 'Untitled',
                url: b.url,
                category: 'Other',
                tags: [],
                pricing: 'Free',
                description: '',
                isPublic: true,
                user: req.user.id
            }));
        }

        // Filter out invalid URLs and duplicates
        const existingLinks = await Link.find({ user: req.user.id }).select('url');
        const existingUrls = new Set(existingLinks.map(l => normalizeUrl(l.url)));

        const validLinks = linksToImport.filter(link => {
            if (!link.url || !link.url.startsWith('http')) return false;
            const normalized = normalizeUrl(link.url);
            if (existingUrls.has(normalized)) return false;
            existingUrls.add(normalized); // Prevent duplicates within import
            return true;
        });

        if (validLinks.length === 0) {
            return res.status(400).json({ msg: 'No valid new links to import' });
        }

        // Get favicon for each link
        const linksWithFavicons = validLinks.map(link => {
            try {
                const urlObj = new URL(link.url);
                link.image = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`;
            } catch (e) { }
            return link;
        });

        const imported = await Link.insertMany(linksWithFavicons);

        res.json({
            msg: `Successfully imported ${imported.length} links`,
            count: imported.length,
            skipped: linksToImport.length - imported.length
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
