import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Breadcrumbs,
} from "@mui/material"
import { useProgress } from "../context/ProgressContext"
import ActividadProgress from "../components/ActividadProgress"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import "../styles/Curso.css"

const Curso = () => {
  const { id } = useParams()
  const { obtenerCurso, loading } = useProgress()
  const [curso, setCurso] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCurso = async () => {
      try {
        const cursoData = await obtenerCurso(id)
        setCurso(cursoData)
      } catch (err) {
        console.error("Error al obtener curso:", err)
        setError("Error al cargar el curso. Por favor, intenta de nuevo.")
      }
    }

    fetchCurso()
  }, [id, obtenerCurso])

  if (loading) {
    return (
      <Container className="curso-container">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="curso-container">
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
        <Box textAlign="center" mt={3}>
          <Button component={Link} to="/cursos" variant="contained" color="primary">
            Volver a Cursos
          </Button>
        </Box>
      </Container>
    )
  }

  if (!curso) {
    return (
      <Container className="curso-container">
        <Alert severity="info" sx={{ mt: 3 }}>
          No se encontró el curso solicitado.
        </Alert>
        <Box textAlign="center" mt={3}>
          <Button component={Link} to="/cursos" variant="contained" color="primary">
            Volver a Cursos
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Container className="curso-container">
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 3, mt: 2 }}>
        <Link to="/cursos" className="breadcrumb-link">
          Cursos
        </Link>
        <Typography color="text.primary">{curso.titulo}</Typography>
      </Breadcrumbs>

      <Paper className="curso-header" elevation={3}>
        <Box className="curso-header-content">
          <Typography variant="h4" className="curso-title">
            {curso.titulo}
          </Typography>
          <Typography variant="subtitle1" className="curso-subtitle">
            {curso.materia} - {curso.grado} Primaria
          </Typography>
          <Typography variant="body1" className="curso-description">
            {curso.descripcion}
          </Typography>
        </Box>
      </Paper>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom className="contenido-title">
          <MenuBookIcon sx={{ mr: 1 }} />
          Contenido del Curso
        </Typography>

        {curso.contenido && curso.contenido.length > 0 ? (
          curso.contenido.map((contenido, index) => (
            <Paper key={index} className="contenido-section" elevation={2}>
              <Typography variant="h6" className="contenido-section-title">
                {contenido.titulo}
              </Typography>
              <Typography variant="body1" className="contenido-section-description">
                {contenido.descripcion}
              </Typography>

              {contenido.recursos && contenido.recursos.length > 0 && (
                <Box mt={2} mb={2}>
                  <Typography variant="subtitle1" gutterBottom>
                    Recursos
                  </Typography>
                  <Grid container spacing={2}>
                    {contenido.recursos.map((recurso, recIndex) => (
                      <Grid item xs={12} sm={6} md={4} key={recIndex}>
                        <Card variant="outlined" className="recurso-card">
                          <CardContent>
                            <Typography variant="body2">{recurso}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                Actividades
              </Typography>

              {contenido.actividades && contenido.actividades.length > 0 ? (
                contenido.actividades.map((actividad, actIndex) => (
                  <ActividadProgress
                    key={actIndex}
                    actividad={actividad}
                    cursoId={curso._id}
                    contenidoId={contenido._id}
                    indiceActividad={actIndex}
                  />
                ))
              ) : (
                <Typography variant="body2" color="textSecondary" align="center">
                  No hay actividades disponibles en esta sección.
                </Typography>
              )}
            </Paper>
          ))
        ) : (
          <Alert severity="info">Este curso aún no tiene contenido disponible.</Alert>
        )}
      </Box>
    </Container>
  )
}

export default Curso

