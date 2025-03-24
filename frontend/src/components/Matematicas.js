import { useState, useEffect } from "react";
import { Container, Typography, Grid, Card, CardContent, Button, Box, CircularProgress, Alert } from "@mui/material";
import { Link } from "react-router-dom";

const Matematicas = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setLoading(true);
        // Usar la ruta pública en lugar de la protegida
        const response = await fetch("http://localhost:5000/api/cursos/public");
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Filtrar solo los cursos de matemáticas
          const cursosFiltrados = data.cursos.filter(curso => 
            curso.materia && curso.materia.toLowerCase() === "matemáticas"
          );
          setCursos(cursosFiltrados);
        } else {
          throw new Error(data.msg || "Error al obtener los cursos");
        }
      } catch (error) {
        console.error("Error al obtener los cursos:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" p={2}>
        <Alert severity="error">{error}</Alert>
        <Button variant="contained" color="primary" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Intentar de nuevo
        </Button>
      </Box>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mt: 4, mb: 4 }}>
        Cursos de Matemáticas
      </Typography>
      
      {cursos.length === 0 ? (
        <Typography align="center" color="textSecondary">
          No hay cursos disponibles en este momento.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {cursos.map((curso) => (
            <Grid item xs={12} sm={6} md={4} key={curso._id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {curso.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {curso.descripcion}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    Grado: {curso.grado}
                  </Typography>
                </CardContent>
                <Box p={2} pt={0}>
                  <Button 
                    component={Link} 
                    to={`/curso/${curso._id}`}
                    variant="contained" 
                    color="primary" 
                    fullWidth
                  >
                    Ver Curso
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Matematicas;