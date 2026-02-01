// Background service worker for Ledgerly extension

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Ledgerly extension installed');
  } else if (details.reason === 'update') {
    console.log('Ledgerly extension updated');
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getToken') {
    chrome.storage.local.get(['token'], (data) => {
      sendResponse({ token: data.token });
    });
    return true;
  }
  
  if (request.action === 'clearAuth') {
    chrome.storage.local.remove(['token', 'user'], () => {
      sendResponse({ success: true });
    });
    return true;
  }
});
