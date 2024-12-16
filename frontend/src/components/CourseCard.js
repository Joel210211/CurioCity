import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import '../styles/CourseCard.css';

function CourseCard({ curso }) {
  return (
    <Card className="course-card">
      <CardMedia
        component="img"
        className="card-media"
        image={curso.imagen || "https://via.placeholder.com/140"}
        alt={curso.titulo}
      />
      <CardContent className="card-content">
        <Typography variant="h5" className="card-title">
          {curso.titulo}
        </Typography>
        <Typography variant="body2" className="card-description">
          {curso.descripcion}
        </Typography>
        <Typography variant="body2" className="card-description">
          Grado: {curso.grado}
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          className="card-button"
        >
          Ver Curso
        </Button>
      </CardContent>
    </Card>
  );
}

export default CourseCard;