import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password, userType) => {
    try {
      const response = await authService.login(email, password, userType);
      if (response.success) {
        setUser(response.data.user);
        return { success: true, userType };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const register = async (data, userType = 'student') => {
    try {
      let response;
      if (userType === 'student') {
        response = await authService.registerStudent(data);
      } else if (userType === 'teacher') {
        response = await authService.registerTeacher(data);
      }
      
      if (response.success) {
        setUser(response.data.user);
        localStorage.setItem('accessToken', response.data.tokens.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return { success: true, userType };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
