import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure Axios base URL for production deployment
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || '';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
          
          // Configure Axios Authorization Header
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          // Verify/refresh user data from backend
          const response = await axios.get('/api/v1/auth/me');
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
          console.error("Auth initialization failed. Session cleared.", error);
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/v1/auth/login', { email, password });
      const { access_token, user: loggedUser } = response.data;
      
      setToken(access_token);
      setUser(loggedUser);
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      return loggedUser;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Authentication failed.";
      throw new Error(errorMsg);
    }
  };

  const register = async (payload) => {
    try {
      // payload: { email, password, role, company_name/hospital_name, full_name }
      const response = await axios.post('/api/v1/auth/register', payload);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Registration failed.";
      throw new Error(errorMsg);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
