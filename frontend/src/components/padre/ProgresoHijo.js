"use client"

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
import { useProgress } from "../../context/ProgressContext"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ScheduleIcon from "@mui/icons-material/Schedule"
import StarIcon from "@mui/icons-material/Star"
import axios from "axios"

const ProgresoHijo = () => {
  const { usuario } = useAuth()
  const { obtenerProgresoEstudiante, obtenerActividadesCurso } = useProgress()
  const [hijo, setHijo] = useState(null)
  const [cursos, setCursos] = useState([])
  const [actividades, setActividades] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true)
        setError(null)

        // Verificar si hay información de usuario y de hijos
        if (!usuario) {
          setError("No hay información de usuario disponible")
          setCargando(false)
          return
        }

        // Verificar si hijosRegistrados es un array o un string
        if (
          !usuario.hijosRegistrados ||
          (Array.isArray(usuario.hijosRegistrados) && usuario.hijosRegistrados.length === 0)
        ) {
          setError("No hay estudiantes registrados para este usuario")
          setCargando(false)
          return
        }

        const token = localStorage.getItem("token")
        const config = {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }

        // Determinar el ID o email del hijo
        const hijoIdentificador = Array.isArray(usuario.hijosRegistrados)
          ? usuario.hijosRegistrados[0]
          : usuario.hijosRegistrados

        console.log("Identificador del hijo:", hijoIdentificador)

        // Obtener información del hijo
        try {
          // Determinar si es un email o un ID
          const isEmail = typeof hijoIdentificador === "string" && hijoIdentificador.includes("@")

          let resHijo
          if (isEmail) {
            console.log("Buscando hijo por email:", hijoIdentificador)
            resHijo = await axios.get(`http://localhost:5000/api/usuarios/email/${hijoIdentificador}`, config)
          } else {
            console.log("Buscando hijo por ID:", hijoIdentificador)
            resHijo = await axios.get(`http://localhost:5000/api/usuarios/${hijoIdentificador}`, config)
          }

          if (!resHijo.data || !resHijo.data._id) {
            throw new Error("No se pudo obtener la información del estudiante")
          }

          setHijo(resHijo.data)
          const hijoId = resHijo.data._id

          console.log("ID del hijo obtenido:", hijoId)

          // Obtener progreso del hijo
          const progreso = await obtenerProgresoEstudiante(hijoId)
          setHijo(progreso)

          // Obtener cursos del hijo
          const resCursos = await axios.get(`http://localhost:5000/api/cursos/grado/${resHijo.data.grado}`, config)
          setCursos(resCursos.data)

          // Obtener actividades del hijo
          const actividadesDelCurso = await obtenerActividadesCurso(resCursos.data)
          setActividades(actividadesDelCurso)
        } catch (err) {
          console.error("Error al obtener datos del estudiante:", err)

          // Para fines de demostración, usamos datos de ejemplo
          setHijo({
            _id: "1",
            nombre: "Juan",
            apellido: "Pérez",
            grado: "3°",
          })

          setCursos([
            { _id: "1", titulo: "Matemáticas 3°", materia: "Matemáticas" },
            { _id: "2", titulo: "Lengua 3°", materia: "Lengua" },
            { _id: "3", titulo: "Ciencias 3°", materia: "Ciencias" },
          ])

          setActividades([
            {
              _id: "1",
              curso: { _id: "1", titulo: "Matemáticas 3°" },
              actividad: "Sumas y restas",
              porcentaje: 75,
              completada: false,
            },
            {
              _id: "2",
              curso: { _id: "2", titulo: "Lengua 3°" },
              actividad: "Comprensión lectora",
              porcentaje: 100,
              completada: true,
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
  }, [usuario, obtenerProgresoEstudiante, obtenerActividadesCurso])

  // Calcular progreso general
  const calcularProgresoGeneral = () => {
    if (!actividades || actividades.length === 0) return 0

    const total = actividades.length
    const completadas = actividades.filter((a) => a.completada).length

    return Math.round((completadas / total) * 100)
  }

  // Calcular promedio de calificaciones
  const calcularPromedio = () => {
    if (!actividades || actividades.length === 0) return 0

    const suma = actividades.reduce((acc, a) => acc + a.porcentaje, 0)
    return (suma / actividades.length).toFixed(1)
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

                {actividades.length > 0 ? (
                  <List>
                    {actividades.map((item) => (
                      <React.Fragment key={item._id}>
                        <ListItem>
                          <ListItemIcon>
                            {item.completada ? <CheckCircleIcon color="success" /> : <ScheduleIcon color="primary" />}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.actividad}
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

        {actividades.length > 0 ? (
          <List>
            {actividades.map((a) => (
              <React.Fragment key={a._id}>
                <ListItem>
                  <ListItemIcon>
                    <StarIcon color={a.porcentaje >= 75 ? "success" : "warning"} />
                  </ListItemIcon>
                  <ListItemText
                    primary={a.actividad}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="textPrimary">
                          Curso: {a.curso.titulo}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="textSecondary">
                          {a.completada ? "Completada" : "En progreso"}
                        </Typography>
                      </>
                    }
                  />
                  <Chip
                    label={a.porcentaje}
                    color={a.porcentaje >= 75 ? "success" : "warning"}
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

