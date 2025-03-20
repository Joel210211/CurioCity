import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext'; // Importar el contexto de autenticación

// Crear el contexto
export const ProgressContext = createContext();

// Proveedor del contexto
export const ProgressProvider = ({ children }) => {
  // Estados para manejar el progreso, carga y errores
  const [progreso, setProgreso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Obtener el estado de autenticación del contexto de Auth
  const { isAuthenticated } = useContext(AuthContext);

  // Cargar el progreso cuando el componente se monta o cuando cambia el estado de autenticación
  useEffect(() => {
    // Solo cargar el progreso si el usuario está autenticado
    if (isAuthenticated) {
      cargarProgreso();
    } else {
      setLoading(false);
      setProgreso(null);
    }
  }, [isAuthenticated]);

  // Función para cargar el progreso del usuario
  const cargarProgreso = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener el token del localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.warn('No hay token disponible, usando datos de ejemplo');
        // Usar datos de ejemplo en desarrollo
        setProgreso({
          total: 0,
          actividades: []
        });
        setLoading(false);
        return;
      }

      console.log('Obteniendo progreso con token:', token);
      
      try {
        // Realizar la solicitud con el token en la cabecera correcta
        const response = await fetch('http://localhost:5000/api/progreso/usuario', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Error de respuesta:', response.status, errorData);
          throw new Error(`Error al cargar el progreso: ${response.status} - ${errorData}`);
        }

        const data = await response.json();
        console.log('Datos de progreso recibidos:', data);
        
        if (data.success) {
          setProgreso(data.progreso);
        } else {
          throw new Error(data.msg || 'Error al cargar el progreso');
        }
      } catch (fetchError) {
        console.error('Error detallado en la solicitud:', fetchError);
        // Usar datos de ejemplo en desarrollo
        console.warn('Usando datos de ejemplo debido al error');
        setProgreso({
          total: 0,
          actividades: []
        });
      }
    } catch (error) {
      console.error('Error al cargar progreso:', error);
      setError(error.message);
      
      // Usar datos de ejemplo en desarrollo
      setProgreso({
        total: 0,
        actividades: []
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar el progreso de una actividad específica
  const actualizarProgreso = async (actividadId, nuevoProgreso) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay token disponible');
      }
      
      const response = await fetch(`http://localhost:5000/api/progreso/actividad/${actividadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ progreso: nuevoProgreso })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error de respuesta:', response.status, errorData);
        throw new Error('Error al actualizar el progreso');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.msg || 'Error al actualizar el progreso');
      }
      
      // Actualizar el estado local
      setProgreso(prevProgreso => {
        if (!prevProgreso) return data.progreso;
        
        // Actualizar la actividad específica en el array de actividades
        const actividadesActualizadas = prevProgreso.actividades.map(act => 
          act.actividadId === actividadId 
            ? { ...act, progreso: nuevoProgreso } 
            : act
        );
        
        // Si la actividad no existe, la añadimos
        if (!prevProgreso.actividades.some(act => act.actividadId === actividadId)) {
          actividadesActualizadas.push({
            actividadId,
            progreso: nuevoProgreso
          });
        }
        
        // Calcular el nuevo progreso total
        const total = actividadesActualizadas.length > 0
          ? actividadesActualizadas.reduce((sum, act) => sum + act.progreso, 0) / actividadesActualizadas.length
          : 0;
        
        return {
          ...prevProgreso,
          total,
          actividades: actividadesActualizadas
        };
      });
      
      return data.progreso;
    } catch (error) {
      console.error('Error al actualizar progreso:', error);
      throw error;
    }
  };

  // Función para añadir una nueva actividad al progreso
  const agregarActividad = async (actividadId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay token disponible');
      }
      
      const response = await fetch(`http://localhost:5000/api/progreso/actividad`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ 
          actividadId,
          progreso: 0 // Inicialmente 0%
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error de respuesta:', response.status, errorData);
        throw new Error('Error al añadir la actividad');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.msg || 'Error al añadir la actividad');
      }
      
      // Actualizar el estado local
      setProgreso(prevProgreso => {
        if (!prevProgreso) return data.progreso;
        
        // Verificar si la actividad ya existe
        if (prevProgreso.actividades.some(act => act.actividadId === actividadId)) {
          return prevProgreso; // No hacer nada si ya existe
        }
        
        // Añadir la nueva actividad
        const actividadesActualizadas = [
          ...prevProgreso.actividades,
          { actividadId, progreso: 0 }
        ];
        
        // Recalcular el progreso total
        const total = actividadesActualizadas.length > 0
          ? actividadesActualizadas.reduce((sum, act) => sum + act.progreso, 0) / actividadesActualizadas.length
          : 0;
        
        return {
          ...prevProgreso,
          total,
          actividades: actividadesActualizadas
        };
      });
      
      return data.progreso;
    } catch (error) {
      console.error('Error al añadir actividad:', error);
      throw error;
    }
  };

  // Función para eliminar una actividad del progreso
  const eliminarActividad = async (actividadId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay token disponible');
      }
      
      const response = await fetch(`http://localhost:5000/api/progreso/actividad/${actividadId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error de respuesta:', response.status, errorData);
        throw new Error('Error al eliminar la actividad');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.msg || 'Error al eliminar la actividad');
      }
      
      // Actualizar el estado local
      setProgreso(prevProgreso => {
        if (!prevProgreso) return data.progreso;
        
        // Filtrar la actividad eliminada
        const actividadesActualizadas = prevProgreso.actividades.filter(
          act => act.actividadId !== actividadId
        );
        
        // Recalcular el progreso total
        const total = actividadesActualizadas.length > 0
          ? actividadesActualizadas.reduce((sum, act) => sum + act.progreso, 0) / actividadesActualizadas.length
          : 0;
        
        return {
          ...prevProgreso,
          total,
          actividades: actividadesActualizadas
        };
      });
      
      return data.progreso;
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
      throw error;
    }
  };

  // Función para obtener el progreso de una actividad específica
  const obtenerProgresoActividad = (actividadId) => {
    if (!progreso || !progreso.actividades) return 0;
    
    const actividad = progreso.actividades.find(act => act.actividadId === actividadId);
    return actividad ? actividad.progreso : 0;
  };

  // Función para verificar si una actividad está en el progreso
  const tieneActividad = (actividadId) => {
    if (!progreso || !progreso.actividades) return false;
    return progreso.actividades.some(act => act.actividadId === actividadId);
  };

  // Función mejorada para obtener cursos
  const obtenerCursos = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.warn('No hay token disponible, usando datos de ejemplo');
        return datosEjemploCursos();
      }
      
      const response = await fetch('http://localhost:5000/api/cursos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en respuesta HTTP:', response.status, errorText);
        throw new Error(`Error al obtener los cursos: ${response.status}`);
      }

      const data = await response.json();
      console.log('Datos de cursos recibidos:', data);
      
      if (!data.success) {
        throw new Error(data.msg || 'Error al obtener los cursos');
      }
      
      return data.cursos;
    } catch (error) {
      console.error('Error detallado en la solicitud:', error);
      return datosEjemploCursos();
    }
  };

  // Función auxiliar para datos de ejemplo consistentes
  const datosEjemploCursos = () => {
    console.log('Usando datos de ejemplo para cursos');
    return [
      { _id: '1', titulo: 'Matemáticas', descripcion: 'Curso de matemáticas básicas', grado: '1', materia: 'Matemáticas' },
      { _id: '2', titulo: 'Ciencias', descripcion: 'Curso de ciencias naturales', grado: '1', materia: 'Ciencias' },
      { _id: '3', titulo: 'Historia', descripcion: 'Curso de historia universal', grado: '1', materia: 'Historia' }
    ];
  };

  // Función para obtener actividades de un curso
  const obtenerActividadesCurso = async (cursoId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay token disponible');
      }
      
      const response = await fetch(`http://localhost:5000/api/actividades/curso/${cursoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error de respuesta:', response.status, errorData);
        throw new Error('Error al obtener las actividades');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.msg || 'Error al obtener las actividades');
      }
      
      return data.actividades;
    } catch (error) {
      console.error('Error al obtener actividades:', error);
      throw error;
    }
  };

  // Retornar el proveedor con todos los valores y funciones
  return (
    <ProgressContext.Provider
      value={{
        progreso,
        loading,
        error,
        cargarProgreso,
        actualizarProgreso,
        agregarActividad,
        eliminarActividad,
        obtenerProgresoActividad,
        tieneActividad,
        obtenerCursos,
        obtenerActividadesCurso
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress debe ser usado dentro de un ProgressProvider');
  }
  return context;
};

export default ProgressProvider;