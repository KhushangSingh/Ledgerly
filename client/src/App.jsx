import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import Background from './components/Background';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import AuthSuccess from './pages/AuthSuccess';
import Dashboard from './pages/Dashboard';
import LinkHub from './pages/LinkHub';
import Categories from './pages/Categories';
import Vault from './pages/Vault';
import Community from './pages/Community';
import Settings from './pages/Settings';
import Starred from './pages/Starred';
import QuickSave from './pages/QuickSave';
import Tools from './pages/Tools';
import Collections from './pages/Collections';

import AddLinkModal from './components/AddLinkModal';

const KeyboardShortcutsWrapper = ({ children, onShowHelp, onAddLink }) => {
  const { isAuthenticated } = useAuth();

  // Only enable shortcuts for authenticated users
  useKeyboardShortcuts(isAuthenticated ? {
    'show-help': onShowHelp,
    'new-link': onAddLink,
    'focus-search': () => {
      const searchInput = document.querySelector('input[type="text"][placeholder*="Search"], input[type="search"]');
      if (searchInput) searchInput.focus();
    },
    'escape': () => {
      // Close any open modals by triggering escape key on body
      document.activeElement?.blur();
    }
  } : {});

  return children;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const isPublicPage = location.pathname === '/' || location.pathname === '/auth';
  const isQuickSave = location.pathname === '/quick-save';

  // QuickSave has its own layout (standalone popup)
  if (isQuickSave) {
    return <>{children}</>;
  }

  return (
    <div className={`min-h-screen font-sans selection:bg-blue-500/30 ${!isPublicPage ? 'lg:pl-64' : ''}`}>
      <Background />
      <Sidebar />
      <div className="w-full relative z-10">
        {children}
      </div>
    </div>
  );
};

function AppContent() {
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);

  return (
    <KeyboardShortcutsWrapper
      onShowHelp={() => setShowShortcutsModal(true)}
      onAddLink={() => setShowAddLinkModal(true)}
    >
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/quick-save" element={<QuickSave />} />

          <Route
            path="/dashboard"
            element={<PrivateRoute><Dashboard /></PrivateRoute>}
          />

          <Route
            path="/link-hub"
            element={<PrivateRoute><LinkHub /></PrivateRoute>}
          />

          <Route
            path="/categories"
            element={<PrivateRoute><Categories /></PrivateRoute>}
          />

          <Route
            path="/vault"
            element={<PrivateRoute><Vault /></PrivateRoute>}
          />

          <Route
            path="/community"
            element={<PrivateRoute><Community /></PrivateRoute>}
          />

          <Route
            path="/starred"
            element={<PrivateRoute><Starred /></PrivateRoute>}
          />

          <Route
            path="/collections"
            element={<PrivateRoute><Collections /></PrivateRoute>}
          />

          <Route
            path="/settings"
            element={<PrivateRoute><Settings /></PrivateRoute>}
          />

          <Route
            path="/tools"
            element={<PrivateRoute><Tools /></PrivateRoute>}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />

      {/* Global Add Link Modal */}
      <AddLinkModal
        isOpen={showAddLinkModal}
        onClose={() => setShowAddLinkModal(false)}
        onLinkAdded={() => {
          // Ideally refresh data, for now just close
          setShowAddLinkModal(false);
        }}
      />

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
    </KeyboardShortcutsWrapper>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;