import React, { createContext, useReducer, useContext, useEffect } from 'react';

const AuthContext = createContext();

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
    user: null,
    error: null
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'USER_LOADED':
            return { ...state, isAuthenticated: true, loading: false, user: action.payload };
        case 'LOGIN_SUCCESS':
        case 'REGISTER_SUCCESS':
            localStorage.setItem('token', action.payload.token);
            return { ...state, ...action.payload, isAuthenticated: true, loading: false };
        case 'AUTH_ERROR':
        case 'LOGOUT':
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                error: action.payload
            };
        case 'CLEAR_ERRORS':
            return { ...state, error: null };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Replace with your actual API URL
    const API_URL = 'http://localhost:5000/api/auth';

    useEffect(() => {
        const loadUser = async () => {
            if (localStorage.getItem('token')) {
                try {
                    const res = await fetch(`${API_URL}/me`, {
                        headers: { 'x-auth-token': localStorage.getItem('token') }
                    });
                    const data = await res.json();
                    if (res.ok) dispatch({ type: 'USER_LOADED', payload: data });
                    else dispatch({ type: 'AUTH_ERROR' });
                } catch (err) {
                    dispatch({ type: 'AUTH_ERROR' });
                }
            } else {
                dispatch({ type: 'AUTH_ERROR' });
            }
        };
        loadUser();
    }, []);

    const login = async (formData) => {
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Login failed');
            dispatch({ type: 'LOGIN_SUCCESS', payload: data });
        } catch (err) {
            dispatch({ type: 'AUTH_ERROR', payload: err.message });
            throw err;
        }
    };

    const register = async (formData) => {
        try {
            const res = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Registration failed');
            dispatch({ type: 'REGISTER_SUCCESS', payload: data });
        } catch (err) {
            dispatch({ type: 'AUTH_ERROR', payload: err.message });
            throw err;
        }
    };

    const logout = () => dispatch({ type: 'LOGOUT' });
    const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });

    return (
        <AuthContext.Provider value={{ ...state, login, register, logout, clearErrors }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);