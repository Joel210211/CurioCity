// src/components/estudiante/SeleccionActividades.js
import { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Checkbox, 
  FormControlLabel,
  Grid,
  Alert,
  CircularProgress,
  Snackbar
} from "@mui/material";
import { useProgress } from "../../context/ProgressContext";
import AddTaskIcon from "@mui/icons-material/AddTask";

const SeleccionActividades = ({ cursoId, onClose }) => {
  const [actividades, setActividades] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  const { obtenerActividadesCurso, agregarActividad, tieneActividad } = useProgress();

  // Cargar actividades del curso
  useEffect(() => {
    const fetchActividades = async () => {
      try {
        setLoading(true);
        const actividadesData = await obtenerActividadesCurso(cursoId);
        
        // Marcar las actividades que ya están seleccionadas
        const actividadesConEstado = actividadesData.map(actividad => ({
          ...actividad,
          seleccionada: tieneActividad(actividad._id)
        }));
        
        setActividades(actividadesConEstado);
        
        // Inicializar las actividades seleccionadas
        setSeleccionadas(
          actividadesConEstado
            .filter(act => !act.seleccionada) // Solo las que no están ya seleccionadas
            .map(act => act._id)
        );
      } catch (err) {
        console.error("Error al obtener actividades:", err);
        setError("No se pudieron cargar las actividades. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    if (cursoId) {
      fetchActividades();
    }
  }, [cursoId, obtenerActividadesCurso, tieneActividad]);

  // Manejar la selección de actividades
  const handleToggleActividad = (actividadId) => {
    setSeleccionadas(prev => {
      if (prev.includes(actividadId)) {
        return prev.filter(id => id !== actividadId);
      } else {
        return [...prev, actividadId];
      }
    });
  };

  // Guardar las actividades seleccionadas
  const handleGuardarSeleccion = async () => {
    try {
      setLoading(true);
      
      // Añadir cada actividad seleccionada al progreso
      for (const actividadId of seleccionadas) {
        await agregarActividad(actividadId);
      }
      
      setMensaje("¡Actividades añadidas correctamente!");
      setOpenSnackbar(true);
      
      // Cerrar el diálogo después de un breve retraso
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
    } catch (error) {
      console.error("Error al guardar actividades:", error);
      setError("No se pudieron guardar las actividades. Por favor, intenta de nuevo.");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading && actividades.length === 0) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && actividades.length === 0) {
    return <Alert severity="error">{error}</Alert>;
  }

  const actividadesDisponibles = actividades.filter(act => !act.seleccionada);

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
        <AddTaskIcon sx={{ mr: 1 }} /> Seleccionar Actividades
      </Typography>
      
      {actividadesDisponibles.length === 0 ? (
        <Alert severity="info">
          Ya has seleccionado todas las actividades disponibles para este curso.
        </Alert>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" paragraph>
            Selecciona las actividades que deseas añadir a tu perfil:
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {actividadesDisponibles.map((actividad) => (
              <Grid item xs={12} sm={6} key={actividad._id}>
                <Card 
                  variant="outlined"
                  sx={{
                    border: seleccionadas.includes(actividad._id) 
                      ? '1px solid #4caf50' 
                      : '1px solid #e0e0e0',
                    bgcolor: seleccionadas.includes(actividad._id) 
                      ? 'rgba(76, 175, 80, 0.08)' 
                      : 'transparent'
                  }}
                >
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={seleccionadas.includes(actividad._id)}
                          onChange={() => handleToggleActividad(actividad._id)}
                          color="primary"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="subtitle1">{actividad.titulo}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {actividad.descripcion}
                          </Typography>
                        </Box>
                      }
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box display="flex" justifyContent="flex-end">
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleGuardarSeleccion}
              disabled={seleccionadas.length === 0 || loading}
            >
              {loading ? "Guardando..." : "Añadir Actividades"}
            </Button>
          </Box>
        </>
      )}
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={mensaje || error}
      />
    </Box>
  );
};

export default SeleccionActividades;