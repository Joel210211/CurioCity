import React from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import '../styles/Lengua.css'; // Asegúrate de crear este archivo CSS

function Lengua() {
  const grados = [
    'Primer Grado',
    'Segundo Grado',
    'Tercer Grado',
    'Cuarto Grado',
    'Quinto Grado',
    'Sexto Grado'
  ];

  return (
    <Container>
      <Typography variant="h3" gutterBottom>Lengua</Typography>
      <Typography variant="h6" gutterBottom>
        Explora el contenido de lengua para cada grado.
      </Typography>
      <Grid container spacing={4}>
        {grados.map((grado, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper className="grado-paper" elevation={3}>
              <Box className="grado-content">
                <Typography variant="h5">{grado}</Typography>
                <Typography variant="body1">
                  Aquí irá el contenido para {grado.toLowerCase()}.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Lengua;