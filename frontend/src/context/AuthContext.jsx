import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            console.log('Attempting login with:', email);
            console.log('API URL:', import.meta.env.VITE_API_URL);
            const response = await api.post('/login', { user: { email, password } });
            console.log('Login response:', response);
            const token = response.headers['authorization'].split(' ')[1];
            const userData = response.data.data;
            // Response structure is flat: { id, email, admin, ... }
            const userWithAdmin = { ...userData, admin: userData.admin };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userWithAdmin));
            setUser(userWithAdmin);
            return { success: true };
        } catch (error) {
            console.error("Login error details:", error);
            console.error("Error response:", error.response);
            return { success: false, error: error.response?.data?.status?.message || error.response?.data?.error || 'Login failed' };
        }
    };

    const signup = async (email, password, passwordConfirmation, admin) => {
        try {
            const response = await api.post('/signup', { user: { email, password, password_confirmation: passwordConfirmation, admin } });
            const token = response.headers['authorization'].split(' ')[1];
            const userData = response.data.data;
            // Response structure is flat: { id, email, admin, ... }
            const userWithAdmin = { ...userData, admin: userData.admin };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userWithAdmin));
            setUser(userWithAdmin);
            return { success: true };
        } catch (error) {
            console.error("Signup error", error);
            return { success: false, error: error.response?.data?.status?.message || 'Signup failed' };
        }
    };

    const logout = async () => {
        try {
            await api.delete('/logout');
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
