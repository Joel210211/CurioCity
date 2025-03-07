// frontend/src/components/ContenidoPorGrado.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Grid } from '@mui/material';

const ContenidoPorGrado = () => {
    const { grado } = useParams(); // Obtiene el grado de la URL
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/cursos/grado/${grado.replace('-', ' ')}`);
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();
                setCursos(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCursos();
    }, [grado]);

    if (loading) return <Typography>Cargando contenido...</Typography>;
    if (error) return <Typography color="error">Error: {error}</Typography>;

    // Filtrar los cursos por grado y materia
    const cursosFiltrados = cursos.filter(curso => curso.grado === grado.replace('-', ' '));

    if (cursosFiltrados.length === 0) {
        return <Typography>No hay curso disponible para este grado.</Typography>;
    }

    return (
        <Container>
            <Typography variant="h3">Contenido para {grado.replace('-', ' ')}</Typography>
            <Grid container spacing={4}>
                {cursosFiltrados.map(curso => (
                    <Grid item xs={12} key={curso._id}>
                        <Typography variant="h5">{curso.titulo}</Typography>
                        <Typography variant="body1">{curso.descripcion}</Typography>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ContenidoPorGrado;