import React, { createContext, useContext, useState } from 'react';

// ✅ Tạo context
const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('customer');

  // login nhận user info
  const login = (user) => {
    setIsLoggedIn(true);
    setUserId(user?._id || null);
    setUsername(user?.username || '');
    setRole(user?.role || 'customer');
  };
  const logout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setUsername('');
    setRole('customer');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, username, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook để sử dụng context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};