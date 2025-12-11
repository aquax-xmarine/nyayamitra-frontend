import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
        // Set display name from user data
        setDisplayName(userData.displayName || userData.name);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    setUser(data.user);
    setDisplayName(data.user.displayName || data.user.name);
    return data;
  };

  const signup = async (email, password, name) => {
    const data = await authAPI.signup(email, password, name);
    setUser(data.user);
    setDisplayName(data.user.displayName || data.user.name);
    return data;
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
    setDisplayName(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  // New function to update display name
  const updateDisplayName = async (newName) => {
    if (!user) throw new Error("No user logged in");
    
    try {
      const response = await userAPI.updateDisplayName(newName);
      
      // Also update the user object
      setUser({
        ...user,
        name: newName
      });
      
      return response;
    } catch (error) {
      console.error("Error updating display name:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      logout, 
      updateUser,
      updateDisplayName 
    }}>
      {children}
    </AuthContext.Provider>
  );
};