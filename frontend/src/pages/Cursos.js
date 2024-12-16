import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import '../styles/Cursos.css'; // Asegúrate de que este archivo CSS exista

const Cursos = () => {
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    // Simulando la obtención de cursos desde una API
    const fetchCursos = async () => {
      const cursosData = [
        { id: 1, title: 'Matemáticas Básicas', description: 'Curso introductorio de matemáticas' },
        { id: 2, title: 'Ciencias Naturales', description: 'Explora el mundo de la ciencia' },
        { id: 3, title: 'Lenguaje y Literatura', description: 'Desarrolla tus habilidades de lectura y escritura' },
        { id: 4, title: 'Inglés', description: 'Aprende inglés de manera interactiva' },
      ];
      setCursos(cursosData);
    };

    fetchCursos();
  }, []);

  return (
    <Container>
      <Typography variant="h4" className="cursos-title" gutterBottom>
        Cursos Disponibles
      </Typography>
      <Grid container spacing={4}>
        {cursos.map((curso) => (
          <Grid item xs={12} sm={6} md={4} key={curso.id}>
            <Card className="curso-card">
              <CardContent>
                <Typography variant="h5" className="curso-title">
                  {curso.title}
                </Typography>
                <Typography className="curso-description">
                  {curso.description}
                </Typography>
                <Button 
                  component={Link} 
                  to={`/cursos/${curso.id}`} 
                  variant="contained" 
                  className="curso-button"
                >
                  Ver Detalles
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Cursos;