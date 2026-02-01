// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const WEBSITE_URL = 'http://localhost:5173';

// DOM Elements
const loginView = document.getElementById('login-view');
const mainView = document.getElementById('main-view');
const loadingView = document.getElementById('loading-view');

const loginForm = document.getElementById('login-form');
const addLinkForm = document.getElementById('add-link-form');
const logoutBtn = document.getElementById('logout-btn');
const webLoginBtn = document.getElementById('web-login-btn');

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');

const userName = document.getElementById('user-name');
const pageFavicon = document.getElementById('page-favicon');
const pageTitle = document.getElementById('page-title');
const pageUrl = document.getElementById('page-url');

const titleInput = document.getElementById('title');
const categorySelect = document.getElementById('category');
const tagsInput = document.getElementById('tags');
const pricingSelect = document.getElementById('pricing');
const isPublicCheckbox = document.getElementById('is-public');

const saveError = document.getElementById('save-error');
const saveSuccess = document.getElementById('save-success');
const saveBtn = document.getElementById('save-btn');

// Current page data
let currentPageData = {
  url: '',
  title: '',
  favicon: ''
};

// Show/Hide views
function showView(view) {
  loginView.classList.add('hidden');
  mainView.classList.add('hidden');
  loadingView.classList.add('hidden');
  view.classList.remove('hidden');
}

// Initialize extension
async function init() {
  showView(loadingView);
  
  // Check for stored token
  const data = await chrome.storage.local.get(['token', 'user']);
  
  if (data.token && data.user) {
    // Verify token is still valid
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 'x-auth-token': data.token }
      });
      
      if (response.ok) {
        const user = await response.json();
        showMainView(user);
        await captureCurrentPage();
      } else {
        // Token expired
        await chrome.storage.local.remove(['token', 'user']);
        showView(loginView);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      showView(loginView);
    }
  } else {
    showView(loginView);
  }
}

// Clean up page title - format as "SiteName - PageName" from URL
function cleanTitle(title, url) {
  return formatTitleFromUrl(url);
}

// Extract clean website name from URL
function extractSiteName(url) {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    const domainName = hostname.split('.')[0]; // e.g., "udemy" from "udemy.com"
    
    // Capitalize first letter
    return domainName.charAt(0).toUpperCase() + domainName.slice(1);
  } catch (e) {
    return '';
  }
}

// Convert kebab-case or snake_case to Title Case
function toTitleCase(str) {
  return str
    .replace(/[-_]/g, ' ') // Replace dashes and underscores with spaces
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters (camelCase)
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}

// Format title as "SiteName - PageName" from URL
function formatTitleFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const siteName = extractSiteName(url);
    
    // Get path segments, filter out empty ones and common generic segments
    const pathSegments = urlObj.pathname
      .split('/')
      .filter(seg => seg && !['user', 'users', 'profile', 'page', 'pages', 'view', 'watch', 'channel'].includes(seg.toLowerCase()));
    
    if (pathSegments.length === 0) {
      // Homepage - just return site name
      return siteName;
    }
    
    // Get the most meaningful segment (usually first or second)
    let pageName = pathSegments[0];
    
    // If it's a very short segment like 'u' or 'p', try next one
    if (pageName.length <= 2 && pathSegments.length > 1) {
      pageName = pathSegments[1];
    }
    
    // Convert to readable format
    pageName = toTitleCase(pageName);
    
    return `${siteName} - ${pageName}`;
  } catch (e) {
    return '';
  }
}

// Capture current tab info
async function captureCurrentPage() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab) {
      const cleanedTitle = cleanTitle(tab.title, tab.url);
      
      currentPageData = {
        url: tab.url,
        title: cleanedTitle || '',
        favicon: tab.favIconUrl || ''
      };
      
      // Update preview
      pageTitle.textContent = currentPageData.title;
      pageUrl.textContent = currentPageData.url;
      pageFavicon.src = currentPageData.favicon || 'icons/icon48.png';
      pageFavicon.onerror = () => { pageFavicon.src = 'icons/icon48.png'; };
      
      // Pre-fill title
      titleInput.value = currentPageData.title;
      
      // Try to auto-detect category based on URL/title
      autoDetectCategory(currentPageData.url, currentPageData.title);
    }
  } catch (err) {
    console.error('Failed to capture page:', err);
  }
}

// Auto-detect category based on URL/title keywords
function autoDetectCategory(url, title) {
  const text = (url + ' ' + title).toLowerCase();
  
  const categoryKeywords = {
    'AI & ML': ['ai', 'artificial', 'machine learning', 'ml', 'gpt', 'openai', 'chatgpt', 'llm', 'neural'],
    'Design': ['design', 'figma', 'sketch', 'adobe', 'canva', 'dribbble', 'behance', 'ui', 'ux'],
    'Development': ['github', 'gitlab', 'code', 'dev', 'programming', 'api', 'npm', 'developer', 'stack'],
    'Productivity': ['notion', 'trello', 'asana', 'todoist', 'productivity', 'calendar', 'task'],
    'Marketing': ['marketing', 'seo', 'analytics', 'ads', 'campaign', 'social media'],
    'Content Creation': ['youtube', 'video', 'podcast', 'content', 'creator', 'editing'],
    'Collaboration': ['slack', 'teams', 'discord', 'zoom', 'meet', 'collaboration'],
    'Business': ['crm', 'erp', 'business', 'enterprise', 'saas'],
    'No-Code': ['nocode', 'no-code', 'webflow', 'bubble', 'zapier', 'airtable'],
    'Data & Analytics': ['data', 'analytics', 'dashboard', 'tableau', 'powerbi', 'chart'],
    'Security': ['security', 'vpn', 'password', 'auth', 'encryption', 'cyber'],
    'Finance': ['finance', 'banking', 'payment', 'stripe', 'invoice', 'accounting'],
    'Education': ['learn', 'course', 'education', 'tutorial', 'academy', 'udemy', 'coursera'],
    'E-commerce': ['shop', 'ecommerce', 'shopify', 'store', 'cart', 'commerce'],
    'Utilities': ['tool', 'utility', 'converter', 'generator', 'calculator']
  };
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      categorySelect.value = category;
      return;
    }
  }
}

// Show main view with user info
function showMainView(user) {
  userName.textContent = `Welcome, ${user.username}!`;
  showView(mainView);
}

// Get token from website (alternative login)
webLoginBtn.addEventListener('click', async () => {
  loginError.textContent = '';
  webLoginBtn.disabled = true;
  webLoginBtn.innerHTML = '<span>Checking...</span>';
  
  try {
    // First, try to find an existing tab with Ledgerly website
    const tabs = await chrome.tabs.query({ url: `${WEBSITE_URL}/*` });
    
    if (tabs.length > 0) {
      // Website is open, inject script to get token from localStorage
      const result = await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          const token = localStorage.getItem('token');
          const userStr = localStorage.getItem('user');
          return { token, user: userStr ? JSON.parse(userStr) : null };
        }
      });
      
      if (result && result[0] && result[0].result && result[0].result.token) {
        const { token, user } = result[0].result;
        
        // Verify token is valid
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: { 'x-auth-token': token }
        });
        
        if (response.ok) {
          const userData = await response.json();
          await chrome.storage.local.set({ token, user: userData });
          showMainView(userData);
          await captureCurrentPage();
          return;
        }
      }
      
      loginError.textContent = 'Not logged in on website. Please login there first.';
    } else {
      // Website not open, open it in a new tab
      await chrome.tabs.create({ url: WEBSITE_URL });
      loginError.textContent = 'Website opened. Login there, then try again.';
    }
  } catch (err) {
    console.error('Web login error:', err);
    loginError.textContent = 'Failed to get token. Try opening the website and logging in first.';
  } finally {
    webLoginBtn.disabled = false;
    webLoginBtn.innerHTML = '<span>🌐 Get token from website</span>';
  }
});

// Login handler
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  
  loginError.textContent = '';
  const loginBtn = document.getElementById('login-btn');
  loginBtn.disabled = true;
  loginBtn.innerHTML = '<span>Logging in...</span>';
  
  console.log('Attempting login for:', email); // Debug log
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    console.log('Response status:', response.status); // Debug log
    
    const data = await response.json();
    console.log('Response data:', data); // Debug log
    
    if (response.ok) {
      // Store token and user
      await chrome.storage.local.set({ 
        token: data.token, 
        user: data.user 
      });
      
      showMainView(data.user);
      await captureCurrentPage();
    } else {
      loginError.textContent = data.msg || 'Login failed. Please try again.';
    }
  } catch (err) {
    console.error('Login error:', err);
    loginError.textContent = 'Connection error. Is the server running at localhost:5000?';
  } finally {
    loginBtn.disabled = false;
    loginBtn.innerHTML = '<span>Login</span>';
  }
});

// Logout handler
logoutBtn.addEventListener('click', async () => {
  await chrome.storage.local.remove(['token', 'user']);
  showView(loginView);
  emailInput.value = '';
  passwordInput.value = '';
});

// Save link handler
addLinkForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  saveError.textContent = '';
  saveSuccess.classList.add('hidden');
  saveBtn.disabled = true;
  saveBtn.innerHTML = '<span>Saving...</span>';
  
  const { token } = await chrome.storage.local.get(['token']);
  
  if (!token) {
    saveError.textContent = 'Please login again.';
    saveBtn.disabled = false;
    saveBtn.innerHTML = '<span>Save to Vault</span>';
    return;
  }
  
  const linkData = {
    title: titleInput.value.trim(),
    url: currentPageData.url,
    image: currentPageData.favicon || `https://www.google.com/s2/favicons?domain=${new URL(currentPageData.url).hostname}&sz=128`,
    category: categorySelect.value,
    tags: tagsInput.value.split(',').map(tag => tag.trim()).filter(Boolean),
    pricing: pricingSelect.value,
    isPublic: isPublicCheckbox.checked
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify(linkData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      saveSuccess.classList.remove('hidden');
      saveBtn.innerHTML = '<span>✓ Saved!</span>';
      
      // Reset form after delay
      setTimeout(() => {
        saveSuccess.classList.add('hidden');
        saveBtn.innerHTML = '<span>Save to Vault</span>';
        saveBtn.disabled = false;
        tagsInput.value = '';
      }, 2000);
    } else {
      // Check if duplicate URL error
      if (data.existingLink) {
        saveError.textContent = `Already saved as "${data.existingLink.title}"`;
      } else {
        saveError.textContent = data.msg || 'Failed to save link.';
      }
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<span>Save to Vault</span>';
    }
  } catch (err) {
    console.error('Save error:', err);
    saveError.textContent = 'Connection error. Please try again.';
    saveBtn.disabled = false;
    saveBtn.innerHTML = '<span>Save to Vault</span>';
  }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
