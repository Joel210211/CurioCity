import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import '../styles/Ingles.css';

function Ingles() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:5000/api/cursos/public');
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const cursosIngles = data.filter(curso => curso.materia === 'Inglés');
        setCursos(cursosIngles);
      } catch (error) {
        console.error('Error al obtener los cursos:', error);
        setError(error.message);
        setCursos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  if (loading) {
    return <Container><Typography>Cargando cursos...</Typography></Container>;
  }

  if (error) {
    return <Container><Typography color="error">Error: {error}</Typography></Container>;
  }

  return (
    <Container>
      <Typography variant="h3" gutterBottom>Inglés</Typography>
      <Typography variant="h6" gutterBottom>
        Explora el contenido de inglés para cada grado.
      </Typography>
      <Grid container spacing={4}>
        {cursos.length > 0 ? (
          cursos.map((curso, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper className="grado-paper" elevation={3}>
                <Box className="grado-content">
                  <Typography variant="h5">{curso.grado}</Typography>
                  <Typography variant="body1">{curso.descripcion}</Typography>
                  <ul>
                    {curso.contenido.map((contenido, idx) => (
                      <li key={idx}>
                        <Typography variant="subtitle1">{contenido.titulo}</Typography>
                        <Typography variant="body2">{contenido.descripcion}</Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              </Paper>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography>No hay cursos disponibles para inglés.</Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default Ingles;