import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from local storage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('manufacture_user');
        const storedToken = localStorage.getItem('manufacture_token');

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Failed to parse local storage user data:', err);
        localStorage.removeItem('manufacture_user');
        localStorage.removeItem('manufacture_token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, ...userData } = response.data;
      
      localStorage.setItem('manufacture_token', token);
      localStorage.setItem('manufacture_user', JSON.stringify(userData));
      
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Signup handler
  const signup = async (fullName, email, password, confirmPassword) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/auth/signup', {
        fullName,
        email,
        password,
        confirmPassword,
      });
      const { token, ...userData } = response.data;

      localStorage.setItem('manufacture_token', token);
      localStorage.setItem('manufacture_user', JSON.stringify(userData));

      setUser(userData);
      return userData;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('manufacture_token');
    localStorage.removeItem('manufacture_user');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    signup,
    logout,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
