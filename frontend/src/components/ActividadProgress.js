"use client"

import { useState } from "react"
import { Card, CardContent, Typography, LinearProgress, Box, Button, Alert, Snackbar, Chip } from "@mui/material"
import { useProgress } from "../context/ProgressContext"
import AssignmentIcon from "@mui/icons-material/Assignment"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

const ActividadProgress = ({ actividad, cursoId, contenidoId, indiceActividad }) => {
  const { tieneActividad, obtenerProgresoActividad, agregarActividad, actualizarProgreso } = useProgress()

  const [error, setError] = useState(null)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [cargando, setCargando] = useState(false)

  // Usar el ID real de MongoDB de la actividad en lugar de generar uno
  // Solo usamos el ID compuesto como fallback si no hay _id
  const actividadId = actividad._id || `${cursoId}-${contenidoId}-${indiceActividad}`

  // Obtener el progreso actual de esta actividad
  const progresoActual = obtenerProgresoActividad(actividadId)

  // Verificar si la actividad ya está en el progreso
  const actividadExistente = tieneActividad(actividadId)

  const handleComenzar = async () => {
    try {
      setCargando(true)
      setError(null)

      // Usar el ID real de MongoDB de la actividad
      await agregarActividad(actividadId)

      setMensaje("¡Actividad iniciada correctamente!")
      setOpenSnackbar(true)
    } catch (error) {
      console.error("Error al iniciar actividad:", error)
      setError(error.message || "Error al comenzar la actividad")
      setOpenSnackbar(true)
    } finally {
      setCargando(false)
    }
  }

  const handleActualizar = async (nuevoPorcentaje) => {
    try {
      setCargando(true)
      setError(null)

      // Asegurarse de que el porcentaje esté entre 0 y 100
      const porcentajeSeguro = Math.min(Math.max(nuevoPorcentaje, 0), 100)

      await actualizarProgreso(actividadId, porcentajeSeguro)

      setMensaje(`¡Progreso actualizado al ${porcentajeSeguro}%!`)
      setOpenSnackbar(true)
    } catch (error) {
      console.error("Error al actualizar progreso:", error)
      setError(error.message || "Error al actualizar el progreso")
      setOpenSnackbar(true)
    } finally {
      setCargando(false)
    }
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  // Si no hay datos de actividad, mostrar un mensaje
  if (!actividad || !actividad.titulo) {
    return (
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Información de actividad no disponible
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          mb: 2,
          border: actividadExistente ? "1px solid #4caf50" : "1px solid #e0e0e0",
          boxShadow: actividadExistente ? "0 2px 8px rgba(76, 175, 80, 0.2)" : "none",
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <AssignmentIcon color={actividadExistente ? "primary" : "action"} sx={{ mr: 1 }} />
            <Typography variant="h6" component="div">
              {actividad.titulo}
            </Typography>
            {progresoActual === 100 && (
              <Chip icon={<CheckCircleIcon />} label="Completada" color="success" size="small" sx={{ ml: 1 }} />
            )}
          </Box>

          <Typography variant="body2" color="text.secondary" paragraph>
            {actividad.descripcion}
          </Typography>

          {actividadExistente ? (
            <Box sx={{ width: "100%", mt: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Box sx={{ width: "100%", mr: 1 }}>
                  <LinearProgress variant="determinate" value={progresoActual} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {progresoActual}%
                  </Typography>
                </Box>
              </Box>

              {progresoActual < 100 && (
                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleActualizar(progresoActual + 25)}
                    disabled={cargando}
                  >
                    +25%
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleActualizar(100)}
                    disabled={cargando}
                    color="success"
                  >
                    Completar
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            <Button variant="contained" color="primary" onClick={handleComenzar} sx={{ mt: 1 }} disabled={cargando}>
              {cargando ? "Iniciando..." : "Comenzar Actividad"}
            </Button>
          )}
        </CardContent>
      </Card>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={error ? "error" : "success"} sx={{ width: "100%" }}>
          {error || mensaje}
        </Alert>
      </Snackbar>
    </>
  )
}

export default ActividadProgress

