"use client"

// frontend/src/components/ContenidoPorGrado.js
import React, { useEffect, useState, useCallback, useMemo } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { 
    Container, 
    Typography, 
    Grid, 
    Paper,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import BookIcon from "@mui/icons-material/Book"
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary"
import AssignmentIcon from "@mui/icons-material/Assignment"
import SchoolIcon from "@mui/icons-material/School"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import CloseIcon from "@mui/icons-material/Close"
import IconButton from "@mui/material/IconButton"
import ActividadProgress from "./ActividadProgress"
import SeleccionActividades from "./estudiante/SeleccionActividades"
import { useAuth } from "../context/AuthContext"
import { useProgress } from "../context/ProgressContext"

// Mover esta función fuera del componente para evitar recreaciones
const getMateria = (path) => {
  const pathSegments = path.split("/")
  const materiaSegment = pathSegments[1]

  const materiaMap = {
    matematicas: "Matemáticas",
    lengua: "Lengua",
    ciencias: "Ciencias",
    musica: "Música",
    plastica: "Plástica",
    ingles: "Inglés",
  }

  return materiaMap[materiaSegment] || ""
}

// Mover el caché a un contexto de React o usar localStorage sería mejor
// pero por ahora lo mantenemos como una variable de módulo
const cursosCache = {}

const ContenidoPorGrado = () => {
  const { grado } = useParams()
  const location = useLocation()
  const { usuario, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Extraer solo las funciones necesarias del contexto
  const { seleccionarCurso, obtenerProgresoActividad, tieneActividad } = useProgress()

  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mensaje, setMensaje] = useState("")
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)

  // Calcular y memorizar la materia para evitar recálculos innecesarios
  const materia = useMemo(() => getMateria(location.pathname), [location.pathname])

    // Función para obtener el nombre completo de la materia para el título
  const getNombreCompleto = useCallback((materiaCorta) => {
        switch (materiaCorta) {
      case "Lengua":
        return "Lengua y Literatura"
      case "Ciencias":
        return "Ciencias Naturales"
      case "Música":
        return "Música y Ritmo"
      case "Plástica":
        return "Arte y Creatividad"
      case "Inglés":
        return "Inglés Básico"
            default:
        return materiaCorta
    }
  }, [])

  // Memorizar el nombre completo de la materia
  const nombreCompletoMateria = useMemo(() => getNombreCompleto(materia), [getNombreCompleto, materia])

  // Función para cargar los cursos - extraída para mejorar legibilidad
  const fetchCursos = useCallback(async () => {
    if (!materia || !grado) {
      setLoading(false)
      return
    }

    // Verificar si ya tenemos los datos en caché
    const cacheKey = `${grado}-${materia}`
    if (cursosCache[cacheKey]) {
      setCursos(cursosCache[cacheKey])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/cursos/grado/${grado.replace("-", " ")}`)

                if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
                }

      const data = await response.json()
                
      let cursosData = []
                if (data && data.success && Array.isArray(data.cursos)) {
        cursosData = data.cursos
                } else if (Array.isArray(data)) {
        cursosData = data
                } else {
        setError("Formato de datos incorrecto")
        setLoading(false)
        return
      }

      const cursosFiltrados = cursosData.filter(
        (curso) => curso.grado === grado.replace("-", " ") && curso.materia === materia,
      )

      // Guardar en caché
      cursosCache[cacheKey] = cursosFiltrados

      setCursos(cursosFiltrados)
      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }, [grado, materia])

  // Simplificar el useEffect para evitar ciclos de renderizado
  useEffect(() => {
    // Usar una bandera para evitar actualizaciones de estado en componentes desmontados
    let isMounted = true

    const loadCursos = async () => {
      if (isMounted) {
        await fetchCursos()
      }
    }

    loadCursos()

    return () => {
      isMounted = false
    }
  }, [fetchCursos])

  // Función para manejar la selección de todo el curso
  const handleSeleccionarCurso = useCallback(
    async (curso) => {
      if (!isAuthenticated) {
        setMensaje("Debes iniciar sesión para seleccionar cursos")
        setError("No has iniciado sesión")
        setOpenSnackbar(true)
        return
      }

      try {
        await seleccionarCurso(curso._id)
        setMensaje(`¡Has seleccionado el curso de ${curso.titulo}!`)
        setError(null)
        setOpenSnackbar(true)
            } catch (error) {
        console.error("Error al seleccionar curso:", error)
        setError(error.message || "Error al seleccionar el curso")
        setOpenSnackbar(true)
      }
    },
    [isAuthenticated, seleccionarCurso],
  )

  // Función para abrir el diálogo de selección de actividades
  const handleSeleccionarActividades = useCallback(
    (curso) => {
      if (!isAuthenticated) {
        setMensaje("Debes iniciar sesión para seleccionar actividades")
        setError("No has iniciado sesión")
        setOpenSnackbar(true)
        return
      }

      setCursoSeleccionado(curso)
      setOpenDialog(true)
    },
    [isAuthenticated],
  )

  // Función para iniciar un curso
  const handleComenzarCurso = useCallback(
    (curso) => {
      navigate(`/curso/${curso._id}`)
    },
    [navigate],
  )

  // Función para cerrar el diálogo
  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false)
    setCursoSeleccionado(null)
  }, [])

  // Función para cerrar snackbar
  const handleCloseSnackbar = useCallback(() => {
    setOpenSnackbar(false)
  }, [])

  // Renderizado condicional simplificado
  const renderContent = () => {
    if (loading) {
      return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Cargando contenido...</Typography>
            </Box>
      )
    }

    if (error) {
      return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Typography color="error">Error: {error}</Typography>
            </Box>
      )
    }

    if (!materia) {
      return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Typography>Materia no válida</Typography>
            </Box>
      )
    }

    if (cursos.length === 0) {
        return (
                <Box sx={{ py: 4 }}>
          <Typography variant="h3" gutterBottom>
            {nombreCompletoMateria} - {grado.replace("-", " ")}
          </Typography>
                    <Paper sx={{ p: 3, mt: 2 }}>
            <Typography>No hay cursos disponibles para este grado en {nombreCompletoMateria}.</Typography>
                    </Paper>
                </Box>
      )
    }

    return (
            <Grid container spacing={4}>
        {cursos.map((curso) => (
                    <Grid item xs={12} key={curso._id}>
                            <Card 
                                elevation={3}
                                sx={{
                borderRadius: "10px",
                transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                },
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Typography 
                                        variant="h5" 
                                        gutterBottom 
                                        color="primary"
                                        sx={{
                    fontWeight: "bold",
                    mb: 2,
                                        }}
                                    >
                                        {curso.titulo}
                                    </Typography>
                                    <Typography 
                                        variant="body1" 
                                        paragraph
                                        sx={{
                    color: "#666",
                    fontSize: "1.1rem",
                    lineHeight: 1.6,
                                        }}
                                    >
                                        {curso.descripcion}
                                    </Typography>

                                    <Divider sx={{ my: 3 }} />

                                    {/* Sección de Contenido */}
                {curso.contenido &&
                  curso.contenido.map((item, index) => (
                                        <Accordion 
                                            key={index} 
                                            sx={{ 
                                                mt: 2,
                        borderRadius: "8px",
                        "&:before": {
                          display: "none",
                        },
                        boxShadow: "none",
                        border: "1px solid #e0e0e0",
                                            }}
                                        >
                                            <AccordionSummary 
                                                expandIcon={<ExpandMoreIcon />}
                                                sx={{
                          backgroundColor: "#f8f9fa",
                          borderRadius: "8px 8px 0 0",
                                                }}
                                            >
                                                <Typography 
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 500,
                            color: "#2c3e50",
                                                    }}
                                                >
                                                    {item.titulo}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails sx={{ p: 3 }}>
                                                <Typography 
                                                    paragraph
                                                    sx={{
                            color: "#666",
                            mb: 3,
                                                    }}
                                                >
                                                    {item.descripcion}
                                                </Typography>

                                                {/* Lista de Recursos */}
                                                {item.recursos && item.recursos.length > 0 && (
                                                    <List>
                                                        {item.recursos.map((recurso, idx) => (
                                                            <ListItem key={idx}>
                                                                <ListItemIcon>
                                  {idx % 3 === 0 ? (
                                    <BookIcon color="primary" />
                                  ) : idx % 3 === 1 ? (
                                    <VideoLibraryIcon color="secondary" />
                                  ) : (
                                    <AssignmentIcon color="action" />
                                  )}
                                                                </ListItemIcon>
                                                                <ListItemText 
                                                                    primary={`Recurso ${idx + 1}`}
                                                                    secondary={recurso}
                                                                    sx={{
                                    "& .MuiListItemText-primary": {
                                      fontWeight: "bold",
                                      color: "#2c3e50",
                                    },
                                                                    }}
                                                                />
                                                                <Button 
                                                                    variant="outlined" 
                                                                    size="small" 
                                                                    href={recurso} 
                                                                    target="_blank"
                                                                    sx={{
                                    borderRadius: "20px",
                                    ml: 2,
                                                                    }}
                                                                >
                                                                    Ver Recurso
                                                                </Button>
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                )}

                                                <Divider sx={{ my: 3 }} />

                                                {/* Actividades */}
                                                <Box sx={{ mt: 3 }}>
                                                    <Typography variant="h6" gutterBottom>
                                                        Actividades
                                                    </Typography>
                                                    <Grid container spacing={3}>
                                                        {item.actividades && Array.isArray(item.actividades) && item.actividades.length > 0 ? (
                              item.actividades.map((actividad, idx) => {
                                // Generar ID de actividad
                                const actividadId = `${curso._id}-${item._id}-${idx}`
                                // Verificar si la actividad ya está en progreso
                                const enProgreso = tieneActividad(actividadId)
                                // Obtener progreso actual
                                const progresoActual = obtenerProgresoActividad(actividadId)

                                return (
                                                                <Grid item xs={12} md={6} key={idx}>
                                                                    <ActividadProgress 
                                                                        actividad={actividad}
                                                                        cursoId={curso._id}
                                                                        contenidoId={item._id}
                                                                        indiceActividad={idx}
                                                                    />
                                    {/* Opcional: Mostrar información adicional del progreso */}
                                    {enProgreso && (
                                      <Typography variant="caption" color="primary">
                                        Progreso actual: {progresoActual}%
                                                                            </Typography>
                                    )}
                                                                </Grid>
                                )
                              })
                                                        ) : (
                                                            <Grid item xs={12}>
                                                                <Typography color="textSecondary">
                                                                    No hay actividades disponibles para este contenido.
                                                                </Typography>
                                                            </Grid>
                                                        )}
                                                    </Grid>
                                                </Box>

                                    {/* Botones de Acción */}
                                    <Box 
                                        sx={{ 
                                            mt: 4, 
                            display: "flex",
                                            gap: 2,
                            flexWrap: "wrap",
                            justifyContent: "flex-start",
                                        }}
                                    >
                                        <Button 
                                            variant="contained" 
                                            startIcon={<SchoolIcon />}
                                            color="primary"
                            onClick={() => handleComenzarCurso(curso)}
                                            sx={{
                              borderRadius: "25px",
                              padding: "10px 24px",
                              textTransform: "none",
                              fontSize: "1rem",
                              fontWeight: "bold",
                              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 6px 8px rgba(0, 0, 0, 0.2)",
                              },
                                            }}
                                        >
                                            Comenzar Curso
                                        </Button>
                                        <Button 
                                            variant="outlined"
                                            color="secondary"
                            startIcon={<AddCircleIcon />}
                            onClick={() => handleSeleccionarCurso(curso)}
                            sx={{
                              borderRadius: "25px",
                              padding: "10px 24px",
                              textTransform: "none",
                              fontSize: "1rem",
                              "&:hover": {
                                backgroundColor: "rgba(156, 39, 176, 0.04)",
                              },
                            }}
                          >
                            Seleccionar Curso Completo
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<AssignmentIcon />}
                            onClick={() => handleSeleccionarActividades(curso)}
                                            sx={{
                              borderRadius: "25px",
                              padding: "10px 24px",
                              textTransform: "none",
                              fontSize: "1rem",
                              "&:hover": {
                                backgroundColor: "rgba(33, 150, 243, 0.04)",
                              },
                            }}
                          >
                            Seleccionar Actividades
                                        </Button>
                                    </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                                </CardContent>
                            </Card>
                    </Grid>
                ))}
            </Grid>
    )
  }

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        {/* Mostrar el encabezado siempre */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              color: "#2c3e50",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {nombreCompletoMateria} - {grado.replace("-", " ")}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{
              fontSize: "1.1rem",
              maxWidth: "800px",
              lineHeight: 1.6,
            }}
          >
            Explora el contenido y recursos disponibles para este nivel
          </Typography>
        </Paper>

        {/* Contenido principal */}
        {renderContent()}
      </Box>

      {/* Diálogo para seleccionar actividades */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">
              {cursoSeleccionado ? `Seleccionar Actividades - ${cursoSeleccionado.titulo}` : "Seleccionar Actividades"}
            </Typography>
            <IconButton aria-label="close" onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
            </Box>
        </DialogTitle>
        <DialogContent dividers>
          {cursoSeleccionado && <SeleccionActividades cursoId={cursoSeleccionado._id} onClose={handleCloseDialog} />}
        </DialogContent>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={error ? "error" : "success"}>
          {error || mensaje}
        </Alert>
      </Snackbar>
        </Container>
  )
}

// Usar React.memo para evitar renderizados innecesarios
export default React.memo(ContenidoPorGrado)

