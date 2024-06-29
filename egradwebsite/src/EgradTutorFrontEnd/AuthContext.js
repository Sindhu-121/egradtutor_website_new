import React, { createContext, useState } from 'react';

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({ token: null, user_Id: null, role: null });

  const login = (token, user_Id, role) => {
    setAuthState({ token, user_Id, role });
    localStorage.setItem('token', token);
    localStorage.setItem('user_Id', user_Id);
    localStorage.setItem('role', role);
  };

  const logout = () => {
    setAuthState({ token: null, user_Id: null, role: null });
    localStorage.removeItem('token');
    localStorage.removeItem('user_Id');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
