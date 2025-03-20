// src/components/estudiante/MisActividades.js
import { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Grid, 
  LinearProgress, 
  CircularProgress, 
  Alert,
  Slider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import { useProgress } from "../../context/ProgressContext";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DeleteIcon from "@mui/icons-material/Delete";

const MisActividades = () => {
  const { 
    progreso, 
    loading, 
    error, 
    actualizarProgreso, 
    eliminarActividad,
    cargarProgreso
  } = useProgress();
  
  const [actividades, setActividades] = useState([]);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [nuevoProgreso, setNuevoProgreso] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [actualizando, setActualizando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  // Cargar actividades del progreso
  useEffect(() => {
    if (progreso && progreso.actividades) {
      // Aquí deberíamos obtener los detalles de cada actividad
      // Por ahora, usamos los datos básicos del progreso
      setActividades(progreso.actividades);
    }
  }, [progreso]);

  // Abrir diálogo para actualizar progreso
  const handleOpenDialog = (actividad) => {
    setActividadSeleccionada(actividad);
    setNuevoProgreso(actividad.progreso);
    setOpenDialog(true);
  };

  // Cerrar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setActividadSeleccionada(null);
  };

  // Abrir diálogo para eliminar actividad
  const handleOpenDeleteDialog = (actividad) => {
    setActividadSeleccionada(actividad);
    setOpenDeleteDialog(true);
  };

  // Cerrar diálogo de eliminación
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setActividadSeleccionada(null);
  };

  // Actualizar progreso de una actividad
  const handleActualizarProgreso = async () => {
    try {
      setActualizando(true);
      await actualizarProgreso(actividadSeleccionada.actividadId, nuevoProgreso);
      await cargarProgreso(); // Recargar el progreso
      handleCloseDialog();
    } catch (error) {
      console.error("Error al actualizar progreso:", error);
    } finally {
      setActualizando(false);
    }
  };

  // Eliminar una actividad
  const handleEliminarActividad = async () => {
    try {
      setEliminando(true);
      await eliminarActividad(actividadSeleccionada.actividadId);
      await cargarProgreso(); // Recargar el progreso
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error al eliminar actividad:", error);
    } finally {
      setEliminando(false);
    }
  };

  if (loading && !actividades.length) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <AssignmentIcon sx={{ mr: 1 }} /> Mis Actividades
      </Typography>

      {actividades.length === 0 ? (
        <Alert severity="info">
          No tienes actividades seleccionadas. Puedes añadir actividades desde la pestaña "Mis Cursos".
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {actividades.map((actividad) => (
            <Grid item xs={12} sm={6} key={actividad.actividadId}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {actividad.titulo || `Actividad ${actividad.actividadId.substring(0, 5)}...`}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={actividad.progreso} 
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" color="text.secondary">
                        {`${Math.round(actividad.progreso)}%`}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      onClick={() => handleOpenDialog(actividad)}
                    >
                      Actualizar Progreso
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleOpenDeleteDialog(actividad)}
                    >
                      Eliminar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Diálogo para actualizar progreso */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Actualizar Progreso</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Mueve el deslizador para actualizar tu progreso en esta actividad.
          </DialogContentText>
          <Box sx={{ mt: 3 }}>
            <Slider
              value={nuevoProgreso}
              onChange={(e, newValue) => setNuevoProgreso(newValue)}
              aria-labelledby="progreso-slider"
              valueLabelDisplay="on"
              step={5}
              marks
              min={0}
              max={100}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={actualizando}>
            Cancelar
          </Button>
          <Button 
            onClick={handleActualizarProgreso} 
            color="primary"
            disabled={actualizando}
          >
            {actualizando ? "Actualizando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para eliminar actividad */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Eliminar Actividad</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar esta actividad de tu lista? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={eliminando}>
            Cancelar
          </Button>
          <Button 
            onClick={handleEliminarActividad} 
            color="error"
            disabled={eliminando}
          >
            {eliminando ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MisActividades;