import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Simula la recuperación del usuario con el token
      setUsuario({ id: '123', nombre: 'Usuario', token });
    }
  }, []);

  const login = async (formData) => {
    // Lógica para iniciar sesión y establecer el usuario
    // Simulación de inicio de sesión
    setUsuario({ id: '123', nombre: 'Usuario', token: 'token123' });
    localStorage.setItem('token', 'token123');
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
