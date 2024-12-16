import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import QuizIcon from '@mui/icons-material/Quiz';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ScienceIcon from '@mui/icons-material/Science';
import '../styles/InteractiveContent.css';

function InteractiveContent() {
  const contents = [
    {
      title: 'Cuestionarios Interactivos',
      description: 'Pon a prueba tus conocimientos con cuestionarios dinámicos y recibe retroalimentación instantánea.',
      icon: <QuizIcon fontSize="large" />,
      path: '/quizzes',
      image: '/images/quiz-image.jpg'
    },
    {
      title: 'Juegos Educativos',
      description: 'Aprende mientras te diviertes con juegos diseñados para reforzar conceptos clave.',
      icon: <VideogameAssetIcon fontSize="large" />,
      path: '/games',
      image: '/images/games-image.jpg'
    },
    {
      title: 'Lecturas Interactivas',
      description: 'Explora historias y textos con elementos interactivos que mejoran la comprensión.',
      icon: <MenuBookIcon fontSize="large" />,
      path: '/readings',
      image: '/images/reading-image.jpg'
    },
    {
      title: 'Experimentos Virtuales',
      description: 'Realiza experimentos científicos en un entorno virtual seguro y educativo.',
      icon: <ScienceIcon fontSize="large" />,
      path: '/experiments',
      image: '/images/experiments-image.jpg'
    }
  ];

  return (
    <div className="interactive-content-page">
      <Box className="hero-section2">
        <Container>
          <Typography variant="h2" className="page-title">
            Contenido Interactivo
          </Typography>
          <Typography variant="h5" className="page-subtitle">
            Explora nuestras diferentes herramientas de aprendizaje interactivo
          </Typography>
        </Container>
      </Box>

      <Container className="content-section">
        <Grid container spacing={4}>
          {contents.map((content, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Card className="content-card">
                <CardMedia
                  component="div"
                  className="card-media"
                >
                  <Box className="icon-overlay">
                    {content.icon}
                  </Box>
                </CardMedia>
                <CardContent className="card-content">
                  <Typography variant="h5" className="content-title">
                    {content.title}
                  </Typography>
                  <Typography className="content-description">
                    {content.description}
                  </Typography>
                  <Button
                    component={Link}
                    to={content.path}
                    variant="contained"
                    className="content-button"
                  >
                    Explorar
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}

export default InteractiveContent;