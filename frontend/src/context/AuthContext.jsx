import { createContext, useState } from 'react';
import authService from '../services/authService.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // THE FIX: Initialize state from localStorage
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });

  const login = async (userData) => {
    const user = await authService.login(userData);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;