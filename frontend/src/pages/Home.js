import React from 'react';
import { 
  Container, 
  Typography, 
  Button,
  Box,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { Link } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import '../styles/Home.css';
import '../components/Footer'
import Footer from '../components/Footer';

function Home() {
  const features = [
    {
      icon: <MenuBookIcon fontSize="large" />,
      title: 'Contenido Interactivo',
      description: 'Aprende con lecciones interactivas y ejercicios prácticos diseñados para cada nivel.',
      path: '/interactive-content'
    },
    {
      icon: <SchoolIcon fontSize="large" />,
      title: 'Profesores Expertos',
      description: 'Nuestros profesores están altamente calificados y dedicados a tu aprendizaje.',
      path: '/profesores-expertos'
    },
    {
      icon: <GroupIcon fontSize="large" />,
      title: 'Aprendizaje Colaborativo',
      description: 'Participa en actividades grupales y aprende junto a tus compañeros.'
    },
    {
      icon: <EmojiEventsIcon fontSize="large" />,
      title: 'Sistema de Logros',
      description: 'Gana medallas y reconocimientos mientras avanzas en tu aprendizaje.'
    }
  ];

  return (
    <div className="home-page">
      {/* Sección Hero */}
      <Box className="hero-section">
        <Container>
          <div className="hero-content">
            <Typography variant="h2" className="hero-title">
              Bienvenido a Tu Patio de Juegos
            </Typography>
            <Typography variant="h5" className="hero-subtitle">
              Aprende, crece y diviértete con nuestra plataforma educativa diseñada especialmente para ti
            </Typography>
            <Button 
              component={Link} 
              to="/register" 
              variant="contained" 
              size="large"
              className="hero-button"
            >
              Comienza Ahora
            </Button>
          </div>
        </Container>
      </Box>

      {/* Sección de Características */}
      <Container className="features-section">
        <Typography variant="h3" className="section-title">
          ¿Por qué elegirnos?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className="feature-card">
              <Box 
                component={feature.path ? Link : 'div'} 
                to={feature.path} 
                style={{ textDecoration: 'none', width: '100%', height: '100%' }}
              >
                <CardContent>
                  <Box className="feature-icon">
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" className="feature-title">
                    {feature.title}
                  </Typography>
                  <Typography className="feature-description">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>
          ))}
        </Grid>
      </Container>

      {/* Sección de Materias */}
      <Container className="subjects-section">
        <Typography variant="h3" className="section-title">
          Nuestras Materias
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card className="subject-card">
              <CardContent>
                <Typography variant="h5" className="subject-title">
                  Matemáticas
                </Typography>
                <Typography className="subject-description">
                  Aprende matemáticas de forma divertida con ejercicios interactivos.
                </Typography>
                <Button component={Link} to="/matematicas" variant="contained">
                  Ver Más
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card className="subject-card">
              <CardContent>
                <Typography variant="h5" className="subject-title">
                  Lengua
                </Typography>
                <Typography className="subject-description">
                  Mejora tus habilidades de lectura y escritura con actividades dinámicas.
                </Typography>
                <Button component={Link} to="/lengua" variant="contained">
                  Ver Más
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card className="subject-card">
              <CardContent>
                <Typography variant="h5" className="subject-title">
                  Ciencias
                </Typography>
                <Typography className="subject-description">
                  Descubre el fascinante mundo de las ciencias naturales.
                </Typography>
                <Button component={Link} to="/ciencias" variant="contained">
                  Ver Más
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card className="subject-card">
              <CardContent>
                <Typography variant="h5" className="subject-title">
                  Inglés
                </Typography>
                <Typography className="subject-description">
                  Aprende inglés con métodos interactivos y conversaciones prácticas.
                </Typography>
                <Button component={Link} to="/ingles" variant="contained">Ver Más</Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card className="subject-card">
              <CardContent>
                <Typography variant="h5" className="subject-title">
                  Música
                </Typography>
                <Typography className="subject-description">
                  Explora el mundo de la música a través de teoría y práctica instrumental.
                </Typography>
                <Button component={Link} to="/musica" variant="contained">Ver Más</Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card className="subject-card">
              <CardContent>
                <Typography variant="h5" className="subject-title">
                  Plastica
                </Typography>
                <Typography className="subject-description">
                  Desarrolla tu creatividad con diferentes técnicas artísticas y proyectos.
                </Typography>
                <Button component={Link} to="/plastica" variant="contained">Ver Más</Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Sección CTA */}
      <Box className="cta-section">
        <Container>
          <Typography variant="h3" className="cta-title">
            ¿Listo para comenzar tu viaje educativo?
          </Typography>
          <Typography variant="h6" className="cta-subtitle">
            Únete a nuestra comunidad de estudiantes y comienza a aprender hoy mismo
          </Typography>
          <Button 
            component={Link} 
            to="/register" 
            variant="contained" 
            size="large"
            className="cta-button"
          >
            Registrarse Ahora
          </Button>
        </Container>
      </Box>
      <Footer/>
    </div>
  );
}

export default Home;

