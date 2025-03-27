// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// Crear el contexto
export const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  // Definir los estados
  const [usuario, setUsuario] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cursosSeleccionados, setCursosSeleccionados] = useState([]); // Estado para cursos seleccionados

  // Verificar si hay un token al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verificar si el token es válido
          const decodedToken = jwtDecode(token);
          
          // Verificar si el token ha expirado
          if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            setUsuario(null);
            setIsAuthenticated(false);
          } else {
            // Obtener información del usuario desde el backend
            try {
              const response = await fetch('http://localhost:5000/api/auth/usuario', {
                headers: {
                  'x-auth-token': token
                }
              });
              
              if (response.ok) {
                const data = await response.json();
                setUsuario(data.usuario);
                setIsAuthenticated(true);
              } else {
                throw new Error('Respuesta inválida del servidor');
              }
            } catch (error) {
              console.error('Error al verificar el usuario:', error);
              setUsuario(null);
              setIsAuthenticated(false);
            }
          }
        } catch (error) {
          console.error('Error al decodificar el token:', error);
          localStorage.removeItem('token');
          setUsuario(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Función de login
  const login = async (tokenOrUser) => {
    try {
      // Verificar si lo que recibimos es un token o un objeto usuario
      if (typeof tokenOrUser === 'string') {
        // Es un token, lo decodificamos
        localStorage.setItem('token', tokenOrUser);
        
        try {
          const decodedToken = jwtDecode(tokenOrUser);
          
          // Obtener información del usuario desde el backend
          const response = await fetch('http://localhost:5000/api/auth/usuario', {
            headers: {
              'x-auth-token': tokenOrUser
            }
          });
          
          if (!response.ok) {
            throw new Error('Error al obtener información del usuario');
          }
          
          const data = await response.json();
          setUsuario(data.usuario);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error al decodificar el token:', error);
          throw error;
        }
      } else if (tokenOrUser && typeof tokenOrUser === 'object') {
        // Es un objeto usuario, lo usamos directamente
        setUsuario(tokenOrUser);
        setIsAuthenticated(true);
      } else {
        throw new Error('Token o usuario inválido');
      }
    } catch (error) {
      console.error('Error en login:', error);
      localStorage.removeItem('token');
      setUsuario(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  // Función de logout
  const logout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
    setIsAuthenticated(false);
  };

  // Función para seleccionar curso
  const seleccionarCurso = (cursoId) => {
    // Lógica para agregar el curso al perfil del usuario
    const curso = { _id: cursoId, titulo: "Curso Ejemplo" }; // Reemplaza con la lógica real
    setCursosSeleccionados((prevCursos) => [...prevCursos, curso]);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        isAuthenticated,
        loading,
        login,
        logout,
        cursosSeleccionados, // Agregar cursos seleccionados al contexto
        seleccionarCurso, // Agregar la función de selección de curso
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};