import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loadUser } = useAuth(); // Ensure loadUser is exposed in AuthContext, or we just rely on localStorage check in App/AuthProvider

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            // We need to trigger a reload or state update. 
            // If AuthProvider checks token on mount/update, we might need a way to re-trigger it.
            // Simplest way is a hard reload or exposing a method.
            // Let's assume loading the user again will fix state.
            window.location.href = '/link-hub';
        } else {
            navigate('/auth');
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm animate-pulse">Completing login...</p>
        </div>
    );
};

export default AuthSuccess;
