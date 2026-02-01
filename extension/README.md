# Ledgerly Chrome Extension

A Chrome extension that allows you to quickly save links to your Ledgerly vault while browsing any website.

## Features

- 🔐 **Secure Login** - Login with your Ledgerly account credentials
- 📸 **Auto-Capture** - Automatically captures page title, URL, and favicon
- 🏷️ **Smart Categories** - Auto-detects category based on website content
- ⚡ **Quick Save** - Add tags, set pricing, and save in seconds
- 🌐 **Public/Private** - Choose to share with community or keep private

## Installation

### Development/Local Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the `extension` folder from your Ledgerly project
5. The Ledgerly extension icon should appear in your toolbar

### Usage

1. Navigate to any website you want to save
2. Click the Ledgerly extension icon in your toolbar
3. Login with your Ledgerly credentials (first time only)
4. The page info will be auto-captured
5. Select a category and add optional tags
6. Click **Save to Vault**

## Configuration

By default, the extension connects to `http://localhost:5000`. 

For production, update the `API_BASE_URL` in `popup.js`:

```javascript
const API_BASE_URL = 'https://your-production-api.com/api';
```

## Files Structure

```
extension/
├── manifest.json      # Chrome extension manifest (v3)
├── popup.html         # Extension popup UI
├── popup.css          # Popup styles
├── popup.js           # Popup logic & API calls
├── background.js      # Service worker
└── icons/
    ├── icon16.png     # Toolbar icon
    ├── icon48.png     # Extension menu icon
    └── icon128.png    # Chrome Web Store icon
```

## Permissions

- `activeTab` - To read current tab's URL, title, and favicon
- `storage` - To store authentication token locally

## Development

The extension uses Chrome Extension Manifest V3 with:
- Service worker for background tasks
- Local storage for token persistence
- Fetch API for server communication

## Troubleshooting

**"Connection error" on login:**
- Make sure the Ledgerly server is running (`npm start` in server folder)
- Check if the API URL is correct in `popup.js`

**Extension not loading:**
- Make sure all files are present in the extension folder
- Check Chrome's extension error logs at `chrome://extensions/`

**Token expired:**
- Simply login again through the extension
