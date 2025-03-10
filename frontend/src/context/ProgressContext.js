import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ProgressContext = createContext();

export const useProgress = () => {
    return useContext(ProgressContext);
};

export const ProgressProvider = ({ children }) => {
    const [progresoActividades, setProgresoActividades] = useState([]);
    const [loading, setLoading] = useState(true);
    const { usuario } = useAuth();

    useEffect(() => {
        if (usuario) {
            cargarProgreso();
        }
    }, [usuario]);

    const cargarProgreso = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/progreso/usuario', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al cargar el progreso');
            }
            
            const data = await response.json();
            setProgresoActividades(data);
        } catch (error) {
            console.error('Error al cargar progreso:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const iniciarActividad = async (cursoId, actividadId, contenidoId, indiceActividad, titulo) => {
        try {
            const response = await fetch('http://localhost:5000/api/progreso', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ 
                    cursoId, 
                    actividadId, 
                    contenidoId,
                    indiceActividad,
                    titulo 
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al iniciar la actividad');
            }

            const data = await response.json();
            setProgresoActividades([...progresoActividades, data]);
            return data;
        } catch (error) {
            console.error('Error al iniciar actividad:', error);
            throw error;
        }
    };

    const actualizarProgreso = async (progresoId, porcentaje, completada) => {
        try {
            const response = await fetch(`http://localhost:5000/api/progreso/${progresoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ porcentaje, completada })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al actualizar el progreso');
            }

            const data = await response.json();
            setProgresoActividades(progresoActividades.map(p => 
                p._id === progresoId ? data : p
            ));
            return data;
        } catch (error) {
            console.error('Error al actualizar progreso:', error);
            throw error;
        }
    };

    const value = {
        progresoActividades,
        loading,
        iniciarActividad,
        actualizarProgreso,
        cargarProgreso
    };

    return (
        <ProgressContext.Provider value={value}>
            {children}
        </ProgressContext.Provider>
    );
}; 