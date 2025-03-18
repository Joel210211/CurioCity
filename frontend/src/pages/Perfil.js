"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {
  Container,
  Typography,
  Button,
  Avatar,
  Grid,
  LinearProgress,
  Paper,
  Box,
  Card,
  CardContent,
  Divider,
} from "@mui/material"

function Perfil() {
  const { usuario, logout } = useAuth()
  const [perfil, setPerfil] = useState(null)
  const [cursos, setCursos] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        // Simulación de datos de perfil con tareas
        const perfilData = {
          progreso: 50,
          tareas: [
            { titulo: "Tarea 1", progreso: 20 },
            { titulo: "Tarea 2", progreso: 50 },
            { titulo: "Tarea 3", progreso: 80 },
          ],
        }
        setPerfil(perfilData)
      } catch (error) {
        console.error("Error al obtener el perfil:", error)
      }
    }

    const fetchCursos = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("No hay token disponible.")
        return
      }

      try {
        const response = await fetch("http://localhost:5000/api/cursos", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Error al obtener los cursos")
        }

        const data = await response.json()
        setCursos(data)
      } catch (error) {
        console.error("Error al obtener los cursos:", error)
        setCursos([])
      }
    }

    if (usuario) {
      fetchPerfil()
      fetchCursos()
    }
  }, [usuario])

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <Container maxWidth="lg" style={{ marginTop: 20, marginBottom: 20 }}>
      <Grid container spacing={3}>
        {/* Información del usuario */}
        <Grid item xs={12} md={4}>
          <Paper style={{ padding: 20, textAlign: "center" }}>
            <Avatar
              alt={usuario?.nombre || "Usuario"}
              src="/static/images/avatar/1.jpg"
              style={{
                width: 100,
                height: 100,
                margin: "0 auto 20px auto",
                border: "3px solid #f0f0f0",
              }}
            />
            <Typography variant="h5" gutterBottom>
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

            <Button variant="outlined" color="secondary" onClick={handleLogout} style={{ marginTop: 20 }}>
              Cerrar Sesión
            </Button>
          </Paper>
        </Grid>

        {/* Contenido principal */}
        <Grid item xs={12} md={8}>
          <Paper style={{ padding: 20 }}>
            {/* Progreso */}
            <Typography variant="h6" gutterBottom>
              Progreso General
            </Typography>
            {perfil && (
              <Box style={{ marginBottom: 20 }}>
                <Box style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <Typography variant="body2">Completado</Typography>
                  <Typography variant="body2">{perfil.progreso}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={perfil.progreso} style={{ height: 8, borderRadius: 4 }} />
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
              <Typography style={{ textAlign: "center", margin: "20px 0" }}>No hay actividades disponibles</Typography>
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
                        <Typography variant="body2" color="textSecondary" style={{ marginTop: 5, marginBottom: 10 }}>
                          {curso.descripcion}
                        </Typography>
                        <Button variant="contained" size="small" fullWidth>
                          Ver Curso
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography style={{ textAlign: "center", margin: "20px 0" }}>No hay cursos disponibles</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Perfil

