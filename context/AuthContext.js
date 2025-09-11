import React, { createContext, useContext, useState } from 'react';

// ✅ Tạo context
const AuthContext = createContext();

// ✅ Provider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mặc định là chưa đăng nhập

  const login = () => setIsLoggedIn(true);   // Đăng nhập
  const logout = () => setIsLoggedIn(false); // Đăng xuất

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
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