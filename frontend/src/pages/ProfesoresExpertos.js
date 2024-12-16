import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import '../styles/ProfesoresExpertos.css';

function ProfesoresExpertos() {
  const profesores = [
    { nombre: 'María García', especialidad: 'Matemáticas', experiencia: '10 años' },
    { nombre: 'Juan Pérez', especialidad: 'Ciencias', experiencia: '8 años' },
    { nombre: 'Ana Rodríguez', especialidad: 'Lenguaje', experiencia: '12 años' },
    { nombre: 'Carlos López', especialidad: 'Inglés', experiencia: '9 años' },
  ];

  return (
    <div className="profesores-expertos-page">
      <Box className="hero-section">
        <Container>
          <Typography variant="h2" className="page-title">
            Nuestros Profesores Expertos
          </Typography>
          <Typography variant="h5" className="page-subtitle">
            Conoce a los profesionales dedicados a tu aprendizaje
          </Typography>
        </Container>
      </Box>

      <Container className="content-section">
        <Grid container spacing={4}>
          {profesores.map((profesor, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card className="profesor-card">
                <CardContent>
                  <Typography variant="h5" className="profesor-nombre">
                    {profesor.nombre}
                  </Typography>
                  <Typography className="profesor-especialidad">
                    Especialidad: {profesor.especialidad}
                  </Typography>
                  <Typography className="profesor-experiencia">
                    Experiencia: {profesor.experiencia}
                  </Typography>
                  <Button 
                    component={Link} 
                    to={`/profesor/${index}`} 
                    variant="contained" 
                    className="profesor-button"
                  >
                    Ver Perfil
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box className="cta-section">
        <Container>
          <Typography variant="h4" className="cta-title">
            ¿Eres un profesor experto?
          </Typography>
          <Typography variant="h6" className="cta-subtitle">
            Únete a nuestra plataforma y comparte tu conocimiento
          </Typography>
          <Button 
            component={Link} 
            to="/register" 
            variant="contained" 
            size="large"
            className="cta-button"
          >
            Regístrate como Profesor
          </Button>
        </Container>
      </Box>
    </div>
  );
}

export default ProfesoresExpertos;

