import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid } from '@mui/material';
import Nivel from './Nivel'; // Asegúrate de importar el componente Nivel
import '../styles/Ciencias.css';

function Ciencias() {
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
        const cursosCiencias = data.filter(curso => curso.materia === 'Ciencias');
        setCursos(cursosCiencias);
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

  // Agrupar cursos por grado
  const cursosPorGrado = {};
  cursos.forEach(curso => {
    if (!cursosPorGrado[curso.grado]) {
      cursosPorGrado[curso.grado] = [];
    }
    cursosPorGrado[curso.grado].push(curso);
  });

  return (
    <Container>
      <Typography variant="h3" gutterBottom>Ciencias</Typography>
      <Typography variant="h6" gutterBottom>
        Explora el contenido de ciencias para cada grado.
      </Typography>
      <Grid container spacing={4}>
        {Object.keys(cursosPorGrado).map(grado => (
          <Nivel key={grado} grado={grado} cursos={cursosPorGrado[grado]} />
        ))}
      </Grid>
    </Container>
  );
}

export default Ciencias;