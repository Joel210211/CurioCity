import React, { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material"
import { useAuth } from "../../context/AuthContext"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ScheduleIcon from "@mui/icons-material/Schedule"
import StarIcon from "@mui/icons-material/Star"
import axios from "axios"

const ProgresoHijo = () => {
  const { usuario } = useAuth()
  const [hijo, setHijo] = useState(null)
  const [progreso, setProgreso] = useState([])
  // const [cursos, setCursos] = useState([])
  const [calificaciones, setCalificaciones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true)
        setError(null)

        if (!usuario || !usuario.hijosRegistrados) {
          setError("No hay información de estudiante registrada")
          return
        }

        const token = localStorage.getItem("token")
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }

        // Obtener información del hijo
        try {
          const resHijo = await axios.get(
            `http://localhost:5000/api/usuarios/email/${usuario.hijosRegistrados}`,
            config,
          )
          setHijo(resHijo.data)

          // Obtener progreso del hijo
          const resProgreso = await axios.get(
            `http://localhost:5000/api/progreso/estudiante/${resHijo.data._id}`,
            config,
          )
          setProgreso(resProgreso.data)

          // Obtener cursos del hijo
          const resCursos = await axios.get(`http://localhost:5000/api/cursos/grado/${resHijo.data.grado}`, config)
          setCursos(resCursos.data)

          // Obtener calificaciones del hijo
          const resCalificaciones = await axios.get(
            `http://localhost:5000/api/calificaciones/estudiante/${resHijo.data._id}`,
            config,
          )
          setCalificaciones(resCalificaciones.data)
        } catch (err) {
          console.error("Error al obtener datos del estudiante:", err)

          // Para fines de demostración, usamos datos de ejemplo
          setHijo({
            _id: "1",
            nombre: "Juan",
            apellido: "Pérez",
            grado: "3°",
          })

          setProgreso([
            {
              _id: "1",
              curso: { _id: "1", titulo: "Matemáticas 3°" },
              actividad: "act1",
              titulo: "Sumas y restas",
              porcentaje: 75,
              completada: false,
            },
            {
              _id: "2",
              curso: { _id: "2", titulo: "Lengua 3°" },
              actividad: "act2",
              titulo: "Comprensión lectora",
              porcentaje: 100,
              completada: true,
            },
          ])

          setCursos([
            { _id: "1", titulo: "Matemáticas 3°", materia: "Matemáticas" },
            { _id: "2", titulo: "Lengua 3°", materia: "Lengua" },
            { _id: "3", titulo: "Ciencias 3°", materia: "Ciencias" },
          ])

          setCalificaciones([
            {
              _id: "1",
              curso: { titulo: "Matemáticas 3°" },
              actividad: "Examen de sumas",
              calificacion: 8,
              comentario: "Buen trabajo, pero cuidado con las restas",
            },
            {
              _id: "2",
              curso: { titulo: "Lengua 3°" },
              actividad: "Dictado",
              calificacion: 9,
              comentario: "Excelente ortografía",
            },
          ])
        }
      } catch (err) {
        console.error("Error general al cargar datos:", err)
        setError("Error al cargar la información del estudiante")
      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
  }, [usuario])

  // Calcular progreso general
  const calcularProgresoGeneral = () => {
    if (!progreso || progreso.length === 0) return 0

    const total = progreso.length
    const completadas = progreso.filter((p) => p.completada).length

    return Math.round((completadas / total) * 100)
  }

  // Calcular promedio de calificaciones
  const calcularPromedio = () => {
    if (!calificaciones || calificaciones.length === 0) return 0

    const suma = calificaciones.reduce((acc, cal) => acc + cal.calificacion, 0)
    return (suma / calificaciones.length).toFixed(1)
  }

  if (cargando) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    )
  }

  if (!hijo) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No se encontró información del estudiante.
      </Alert>
    )
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Progreso de {hijo.nombre} {hijo.apellido}
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Información General
                </Typography>
                <Typography variant="body1">
                  <strong>Nombre:</strong> {hijo.nombre} {hijo.apellido}
                </Typography>
                <Typography variant="body1">
                  <strong>Grado:</strong> {hijo.grado} Primaria
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" gutterBottom>
                  <strong>Progreso General:</strong>
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Box sx={{ width: "100%", mr: 1 }}>
                    <LinearProgress variant="determinate" value={calcularProgresoGeneral()} />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">
                      {calcularProgresoGeneral()}%
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
                  <strong>Promedio:</strong> {calcularPromedio()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Actividades en Progreso
                </Typography>

                {progreso.length > 0 ? (
                  <List>
                    {progreso.map((item) => (
                      <React.Fragment key={item._id}>
                        <ListItem>
                          <ListItemIcon>
                            {item.completada ? <CheckCircleIcon color="success" /> : <ScheduleIcon color="primary" />}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.titulo}
                            secondary={`Curso: ${item.curso.titulo} | Progreso: ${item.porcentaje}%`}
                          />
                          <Chip
                            label={item.completada ? "Completada" : "En progreso"}
                            color={item.completada ? "success" : "primary"}
                            size="small"
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography align="center" color="textSecondary">
                    No hay actividades en progreso.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Calificaciones Recientes
        </Typography>

        {calificaciones.length > 0 ? (
          <List>
            {calificaciones.map((cal) => (
              <React.Fragment key={cal._id}>
                <ListItem>
                  <ListItemIcon>
                    <StarIcon color={cal.calificacion >= 7 ? "success" : "warning"} />
                  </ListItemIcon>
                  <ListItemText
                    primary={cal.actividad}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="textPrimary">
                          Curso: {cal.curso.titulo}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="textSecondary">
                          {cal.comentario}
                        </Typography>
                      </>
                    }
                  />
                  <Chip
                    label={cal.calificacion}
                    color={cal.calificacion >= 7 ? "success" : "warning"}
                    sx={{ fontWeight: "bold" }}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography align="center" color="textSecondary">
            No hay calificaciones disponibles.
          </Typography>
        )}
      </Paper>
    </Box>
  )
}

export default ProgresoHijo

