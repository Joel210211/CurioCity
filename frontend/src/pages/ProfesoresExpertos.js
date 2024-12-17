import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Box,
  Avatar,
  Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import '../styles/ProfesoresExpertos.css';

function ProfesoresExpertos() {
  const profesores = [
    { 
      nombre: 'María García', 
      especialidad: 'Matemáticas', 
      experiencia: '10 años',
      imagen: 'https://randomuser.me/api/portraits/women/1.jpg',
      calificacion: 4.8
    },
    { 
      nombre: 'Juan Pérez', 
      especialidad: 'Ciencias', 
      experiencia: '8 años',
      imagen: 'https://randomuser.me/api/portraits/men/1.jpg',
      calificacion: 4.6
    },
    { 
      nombre: 'Ana Rodríguez', 
      especialidad: 'Lengua', 
      experiencia: '12 años',
      imagen: 'https://randomuser.me/api/portraits/women/2.jpg',
      calificacion: 4.9
    },
    { 
      nombre: 'Carlos López', 
      especialidad: 'Inglés', 
      experiencia: '9 años',
      imagen: 'https://randomuser.me/api/portraits/men/2.jpg',
      calificacion: 4.7
    },
  ];

  return (
    <div className="pe-page">
      <Box className="pe-hero-section">
        <Container maxWidth="lg">
          <Typography variant="h2" className="pe-page-title">
            Nuestros Profesores Expertos
          </Typography>
          <Typography variant="h5" className="pe-page-subtitle">
            Conoce a los profesionales dedicados a tu aprendizaje
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" className="pe-content-section">
        <Grid container spacing={4}>
          {profesores.map((profesor, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card className="pe-profesor-card">
                <CardContent>
                  <Avatar
                    alt={profesor.nombre}
                    src={profesor.imagen}
                    className="pe-profesor-avatar"
                  />
                  <Typography variant="h5" className="pe-profesor-nombre">
                    {profesor.nombre}
                  </Typography>
                  <Box display="flex" justifyContent="center" width="100%">
                    <Chip
                      icon={<SchoolIcon />}
                      label={profesor.especialidad}
                      className="pe-profesor-especialidad-chip"
                    />
                  </Box>
                  <Typography className="pe-profesor-experiencia">
                    {profesor.experiencia} de experiencia
                  </Typography>
                  <Box className="pe-profesor-calificacion">
                    <StarIcon className="pe-star-icon" />
                    <Typography component="span">
                      {profesor.calificacion.toFixed(1)}
                    </Typography>
                  </Box>
                  <Button 
                    component={Link} 
                    to={`/profesor/${index}`} 
                    variant="contained" 
                    className="pe-profesor-button"
                  >
                    Ver Perfil
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box className="pe-cta-section">
        <Container maxWidth="lg">
          <Typography variant="h3" className="pe-cta-title">
            ¿Eres un profesor experto?
          </Typography>
          <Typography variant="h6" className="pe-cta-subtitle">
            Únete a nuestra plataforma y comparte tu conocimiento
          </Typography>
          <Button 
            component={Link} 
            to="/register" 
            variant="contained" 
            size="large"
            className="pe-cta-button"
          >
            Regístrate como Profesor
          </Button>
        </Container>
      </Box>
    </div>
  );
}

export default ProfesoresExpertos;

