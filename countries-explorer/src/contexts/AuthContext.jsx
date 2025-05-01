// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios to include credentials (cookies)
  axios.defaults.withCredentials = true;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/auth/status`);
      
      if (response.data.isAuthenticated) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
      console.error('Auth check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const addFavoriteCountry = async (countryCode) => {
    try {
      const response = await axios.post(`${API_URL}/user/favorites`, { countryCode });
      setUser(prev => ({
        ...prev,
        favoriteCountries: response.data.favoriteCountries
      }));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add favorite');
      throw err;
    }
  };

  const removeFavoriteCountry = async (countryCode) => {
    try {
      const response = await axios.delete(`${API_URL}/user/favorites/${countryCode}`);
      setUser(prev => ({
        ...prev,
        favoriteCountries: response.data.favoriteCountries
      }));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove favorite');
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    addFavoriteCountry,
    removeFavoriteCountry
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};