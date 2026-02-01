import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 text-sm animate-pulse">Authenticating...</p>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;