import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  const login = async (formData) => {
    // Lógica para iniciar sesión y establecer el usuario
    // ...
  };

  const logout = () => {
    setUsuario(null); // Elimina el usuario del estado
    localStorage.removeItem('token'); // Elimina el token del almacenamiento local
    // La navegación se manejará en el componente que llama a logout
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
