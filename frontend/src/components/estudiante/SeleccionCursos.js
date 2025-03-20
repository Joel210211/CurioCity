// src/components/estudiante/SeleccionCursos.js
import { useState, useEffect } from "react";
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  CircularProgress, 
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton
} from "@mui/material";
import { useProgress } from "../../context/ProgressContext";
import { Link } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import CloseIcon from "@mui/icons-material/Close";
import SeleccionActividades from "./SeleccionActividades";

const SeleccionCursos = () => {
  const { obtenerCursos } = useProgress();
  const [cursos, setCursos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setLoading(true);
        const cursosData = await obtenerCursos();
        setCursos(cursosData);
      } catch (err) {
        console.error("Error al obtener cursos:", err);
        setError("Error al cargar los cursos. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, [obtenerCursos]);

  const handleSeleccionarActividades = (curso) => {
    setCursoSeleccionado(curso);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCursoSeleccionado(null);
  };

  if (loading && cursos.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error && cursos.length === 0) {
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
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <SchoolIcon sx={{ mr: 1 }} /> Mis Cursos Disponibles
      </Typography>

      {cursos.length === 0 ? (
        <Typography align="center" color="textSecondary">
          No hay cursos disponibles para tu grado.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {cursos.map((curso) => (
            <Grid item xs={12} sm={6} md={4} key={curso._id || curso.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  },
                }}
                className="curso-card"
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" gutterBottom className="curso-title">
                    {curso.titulo || curso.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph className="curso-description">
                    {curso.descripcion}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    Grado: {curso.grado}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    Materia: {curso.materia}
                  </Typography>
                </CardContent>
                <Box p={2} pt={0} display="flex" justifyContent="space-between">
                  <Button
                    component={Link}
                    to={`/curso/${curso._id || curso.id}`}
                    variant="outlined"
                    color="primary"
                    sx={{ flex: 1, mr: 1 }}
                    className="curso-button"
                  >
                    Ver Curso
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ flex: 1, ml: 1 }}
                    onClick={() => handleSeleccionarActividades(curso)}
                    className="curso-button"
                  >
                    Actividades
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Diálogo para seleccionar actividades */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {cursoSeleccionado?.titulo || cursoSeleccionado?.nombre || "Seleccionar Actividades"}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {cursoSeleccionado && (
            <SeleccionActividades 
              cursoId={cursoSeleccionado._id || cursoSeleccionado.id} 
              onClose={handleCloseDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SeleccionCursos;