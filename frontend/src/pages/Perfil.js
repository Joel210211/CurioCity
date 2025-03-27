import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {
  Container,
  Typography,
  Button,
  Avatar,
  Grid,
  Paper,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  LinearProgress,
  Card,
  CardContent,
  Divider,
} from "@mui/material"
import SeleccionCursos from "../components/estudiante/SeleccionCursos"
import MisActividades from "../components/estudiante/MisActividades"
import GestionContenido from "../components/profesor/GestionContenido"
import ProgresoHijo from "../components/padre/ProgresoHijo"
import "../styles/Perfil.css"

// Modificar la función Perfil para incluir pestañas según el rol
function Perfil() {
  const { usuario, logout, cursosSeleccionados } = useAuth()
  const [perfil, setPerfil] = useState(null)
  const [cursos] = useState([])
  const [tabValue, setTabValue] = useState(0)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        setCargando(true)
        setError(null)

        const token = localStorage.getItem("token")
        if (!token) {
          setError("No hay token disponible")
          return
        }

        const response = await fetch("http://localhost:5000/api/perfil", {
          method: "GET",
          headers: {
            "x-auth-token": token,
          },
        })

        if (!response.ok) {
          throw new Error("Error al obtener el perfil")
        }

        const data = await response.json()
        setPerfil(data.perfil)
      } catch (error) {
        console.error("Error al obtener el perfil:", error)
        setError("Error al cargar el perfil")

        // Para fines de demostración, usamos datos de ejemplo
        setPerfil({
          progreso: 50,
          tareas: [
            { titulo: "Tarea 1", progreso: 20 },
            { titulo: "Tarea 2", progreso: 50 },
            { titulo: "Tarea 3", progreso: 80 },
          ],
        })
      } finally {
        setCargando(false)
      }
    }

    if (usuario) {
      fetchPerfil()
    }
  }, [usuario])

  // Agregar el manejador de cambio de pestaña
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  if (!usuario) {
    return (
      <Container maxWidth="sm" style={{ marginTop: 20, marginBottom: 20 }}>
        <Alert severity="warning">Debes iniciar sesión para acceder a tu perfil.</Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/login")}
          style={{ marginTop: 20 }}
          fullWidth
        >
          Iniciar Sesión
        </Button>
      </Container>
    )
  }

  if (cargando) {
    return (
      <Container style={{ marginTop: 20, marginBottom: 20, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    )
  }

  // Modificar el return para incluir las pestañas según el rol
  return (
    <Container maxWidth="lg" className="perfil-container" style={{ marginTop: 20, marginBottom: 20 }}>
      <Grid container spacing={3}>
        {/* Información del usuario - mantener igual */}
        <Grid item xs={12} md={4}>
          <Paper className="perfil-paper user-info" style={{ padding: 20, textAlign: "center" }}>
            <Avatar
              alt={usuario?.nombre || "Usuario"}
              src="/static/images/avatar/1.jpg"
              className="perfil-avatar"
              style={{
                width: 100,
                height: 100,
                margin: "0 auto 20px auto",
                border: "3px solid #f0f0f0",
              }}
            />
            <Typography variant="h5" className="user-name" gutterBottom>
              {usuario?.nombre} {usuario?.apellido}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {usuario?.email}
            </Typography>
            <Typography variant="body2" style={{ marginTop: 10 }}>
              Rol: {usuario?.rol ? usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1) : "Usuario"}
            </Typography>

            {usuario?.rol === "estudiante" && usuario?.grado && (
              <Typography variant="body2" style={{ marginTop: 5 }}>
                Grado: {usuario.grado}
              </Typography>
            )}

            {usuario?.rol === "profesor" && usuario?.especialidad && (
              <>
                <Typography variant="body2" style={{ marginTop: 5 }}>
                  Especialidad: {usuario.especialidad}
                </Typography>
                <Typography variant="body2" style={{ marginTop: 5 }}>
                  Experiencia: {usuario.experiencia} años
                </Typography>
              </>
            )}

            {usuario?.rol === "padre" && usuario?.hijosRegistrados && (
              <Typography variant="body2" style={{ marginTop: 5 }}>
                Hijo registrado: {usuario.hijosRegistrados}
              </Typography>
            )}

            <Button
              variant="outlined"
              color="secondary"
              onClick={handleLogout}
              className="logout-button"
              style={{ marginTop: 20 }}
            >
              Cerrar Sesión
            </Button>
          </Paper>
        </Grid>

        {/* Contenido principal según el rol */}
        <Grid item xs={12} md={8}>
          <Paper className="perfil-paper" style={{ padding: 20 }}>
            {cargando ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            ) : (
              <>
                {/* Contenido para estudiantes */}
                {usuario?.rol === "estudiante" && (
                  <Box>
                    <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
                      <Tab label="Mis Cursos" />
                      <Tab label="Mis Actividades" />
                    </Tabs>

                    {tabValue === 0 && (
                      <>
                        <SeleccionCursos />
                        <Button 
                          variant="contained" 
                          color="primary" 
                          component={Link} 
                          to="/" 
                          sx={{ mt: 2 }}
                        >
                          Explorar Cursos
                        </Button>
                      </>
                    )}
                    {tabValue === 1 && <MisActividades />}
                  </Box>
                )}

                {/* Contenido para profesores */}
                {usuario?.rol === "profesor" && (
                  <Box>
                    <GestionContenido />
                  </Box>
                )}

                {/* Contenido para padres */}
                {usuario?.rol === "padre" && (
                  <Box>
                    <ProgresoHijo />
                  </Box>
                )}

                {/* Contenido por defecto si no hay rol específico */}
                {!usuario?.rol && (
                  <Box>
                    {/* Mantener el contenido original del perfil */}
                    <Typography variant="h6" gutterBottom>
                      Progreso General
                    </Typography>
                    {perfil && (
                      <Box style={{ marginBottom: 20 }}>
                        <Box style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <Typography variant="body2">Completado</Typography>
                          <Typography variant="body2">{perfil.progreso}%</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={perfil.progreso}
                          style={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    )}

                    <Divider style={{ margin: "20px 0" }} />

                    {/* Actividades */}
                    <Typography variant="h6" gutterBottom>
                      Actividades
                    </Typography>
                    {perfil && perfil.tareas && perfil.tareas.length > 0 ? (
                      <div>
                        {perfil.tareas.map((tarea, index) => (
                          <Card key={index} style={{ marginBottom: 10 }}>
                            <CardContent>
                              <Typography variant="subtitle1">{tarea.titulo}</Typography>
                              <Box style={{ display: "flex", alignItems: "center", marginTop: 5 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={tarea.progreso}
                                  style={{ height: 6, borderRadius: 3, flexGrow: 1, marginRight: 10 }}
                                />
                                <Typography variant="body2">{tarea.progreso}%</Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Typography style={{ textAlign: "center", margin: "20px 0" }}>
                        No hay actividades disponibles
                      </Typography>
                    )}

                    <Divider style={{ margin: "20px 0" }} />

                    {/* Cursos */}
                    <Typography variant="h6" gutterBottom>
                      Mis Cursos
                    </Typography>
                    {Array.isArray(cursos) && cursos.length > 0 ? (
                      <Grid container spacing={2}>
                        {cursos.map((curso, index) => (
                          <Grid item xs={12} sm={6} key={index}>
                            <Card>
                              <CardContent>
                                <Typography variant="subtitle1">{curso.titulo}</Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  style={{ marginTop: 5, marginBottom: 10 }}
                                >
                                  {curso.descripcion}
                                </Typography>
                                <Button variant="contained" size="small">
                                  Ver Curso
                                </Button>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Typography style={{ textAlign: "center", margin: "20px 0" }}>
                        No hay cursos disponibles
                      </Typography>
                    )}
                  </Box>
                )}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Perfil

