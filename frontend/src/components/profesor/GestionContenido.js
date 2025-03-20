import React, { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import { useProgress } from "../../context/ProgressContext"
import axios from "axios"

const GestionContenido = () => {
  const { obtenerCursos, loading } = useProgress()
  const [cursos, setCursos] = useState([])
  const [tabValue, setTabValue] = useState(0)
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState("") // 'curso', 'contenido', 'actividad'
  const [formData, setFormData] = useState({})
  const [editIndex, setEditIndex] = useState(-1)
  const [contenidoIndex, setContenidoIndex] = useState(-1)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const cursosData = await obtenerCursos()
        setCursos(cursosData)
      } catch (err) {
        console.error("Error al obtener cursos:", err)
        setError("Error al cargar los cursos. Por favor, intenta de nuevo.")
      }
    }

    fetchCursos()
  }, [obtenerCursos])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleSelectCurso = (curso) => {
    setCursoSeleccionado(curso)
    setTabValue(1)
  }

  const handleOpenDialog = (type, data = {}, index = -1, contIndex = -1) => {
    setDialogType(type)
    setFormData(data)
    setEditIndex(index)
    setContenidoIndex(contIndex)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setFormData({})
    setEditIndex(-1)
    setContenidoIndex(-1)
    setSubmitError(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async () => {
    setSubmitLoading(true)
    setSubmitError(null)

    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }

      let response

      if (dialogType === "curso") {
        if (editIndex === -1) {
          // Crear nuevo curso
          response = await axios.post("http://localhost:5000/api/cursos", formData, config)
          const updatedCursos = await obtenerCursos()
          setCursos(updatedCursos)
        } else {
          // Actualizar curso existente
          response = await axios.put(`http://localhost:5000/api/cursos/${cursos[editIndex]._id}`, formData, config)
          const updatedCursos = await obtenerCursos()
          setCursos(updatedCursos)
        }
      } else if (dialogType === "contenido") {
        const cursoActualizado = { ...cursoSeleccionado }

        if (editIndex === -1) {
          // Agregar nuevo contenido
          if (!cursoActualizado.contenido) {
            cursoActualizado.contenido = []
          }
          cursoActualizado.contenido.push({
            titulo: formData.titulo,
            descripcion: formData.descripcion,
            recursos: [],
            actividades: [],
          })
        } else {
          // Actualizar contenido existente
          cursoActualizado.contenido[editIndex] = {
            ...cursoActualizado.contenido[editIndex],
            titulo: formData.titulo,
            descripcion: formData.descripcion,
          }
        }

        response = await axios.put(
          `http://localhost:5000/api/cursos/${cursoSeleccionado._id}`,
          cursoActualizado,
          config,
        )
        setCursoSeleccionado(response.data)
      } else if (dialogType === "actividad") {
        const cursoActualizado = { ...cursoSeleccionado }

        if (editIndex === -1) {
          // Agregar nueva actividad
          if (!cursoActualizado.contenido[contenidoIndex].actividades) {
            cursoActualizado.contenido[contenidoIndex].actividades = []
          }
          cursoActualizado.contenido[contenidoIndex].actividades.push({
            tipo: formData.tipo,
            titulo: formData.titulo,
            descripcion: formData.descripcion,
          })
        } else {
          // Actualizar actividad existente
          cursoActualizado.contenido[contenidoIndex].actividades[editIndex] = {
            ...cursoActualizado.contenido[contenidoIndex].actividades[editIndex],
            tipo: formData.tipo,
            titulo: formData.titulo,
            descripcion: formData.descripcion,
          }
        }

        response = await axios.put(
          `http://localhost:5000/api/cursos/${cursoSeleccionado._id}`,
          cursoActualizado,
          config,
        )
        setCursoSeleccionado(response.data)
      }

      handleCloseDialog()
    } catch (err) {
      console.error("Error al guardar:", err)
      setSubmitError("Error al guardar los cambios. Inténtalo de nuevo.")
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDeleteItem = async (type, index, contIndex = -1) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este elemento?")) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }

      if (type === "curso") {
        await axios.delete(`http://localhost:5000/api/cursos/${cursos[index]._id}`, config)
        const updatedCursos = await obtenerCursos()
        setCursos(updatedCursos)
      } else if (type === "contenido") {
        const cursoActualizado = { ...cursoSeleccionado }
        cursoActualizado.contenido.splice(index, 1)

        const response = await axios.put(
          `http://localhost:5000/api/cursos/${cursoSeleccionado._id}`,
          cursoActualizado,
          config,
        )
        setCursoSeleccionado(response.data)
      } else if (type === "actividad") {
        const cursoActualizado = { ...cursoSeleccionado }
        cursoActualizado.contenido[contIndex].actividades.splice(index, 1)

        const response = await axios.put(
          `http://localhost:5000/api/cursos/${cursoSeleccionado._id}`,
          cursoActualizado,
          config,
        )
        setCursoSeleccionado(response.data)
      }
    } catch (err) {
      console.error("Error al eliminar:", err)
      alert("Error al eliminar el elemento. Inténtalo de nuevo.")
    }
  }

  if (loading) {
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

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Gestión de Contenido
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Cursos" />
          <Tab label="Contenido" disabled={!cursoSeleccionado} />
        </Tabs>

        {tabValue === 0 && (
          <Box>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog("curso")}
              >
                Nuevo Curso
              </Button>
            </Box>

            <List>
              {cursos.length > 0 ? (
                cursos.map((curso, index) => (
                  <React.Fragment key={curso._id}>
                    <ListItem
                      button
                      onClick={() => handleSelectCurso(curso)}
                      selected={cursoSeleccionado && cursoSeleccionado._id === curso._id}
                    >
                      <ListItemText
                        primary={curso.titulo}
                        secondary={`Grado: ${curso.grado} | Materia: ${curso.materia}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleOpenDialog("curso", curso, index)
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteItem("curso", index)
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < cursos.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <Typography align="center" color="textSecondary">
                  No hay cursos disponibles. Crea uno nuevo.
                </Typography>
              )}
            </List>
          </Box>
        )}

        {tabValue === 1 && cursoSeleccionado && (
          <Box>
            <Typography variant="h6" gutterBottom>
              {cursoSeleccionado.titulo} - Contenido
            </Typography>

            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog("contenido")}
              >
                Nuevo Contenido
              </Button>
            </Box>

            {cursoSeleccionado.contenido && cursoSeleccionado.contenido.length > 0 ? (
              cursoSeleccionado.contenido.map((contenido, index) => (
                <Paper key={index} sx={{ mb: 3, p: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6">{contenido.titulo}</Typography>
                    <Box>
                      <IconButton aria-label="edit" onClick={() => handleOpenDialog("contenido", contenido, index)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton aria-label="delete" onClick={() => handleDeleteItem("contenido", index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="body2" paragraph>
                    {contenido.descripcion}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="subtitle1">Actividades</Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenDialog("actividad", {}, -1, index)}
                    >
                      Nueva Actividad
                    </Button>
                  </Box>

                  {contenido.actividades && contenido.actividades.length > 0 ? (
                    <List>
                      {contenido.actividades.map((actividad, actIndex) => (
                        <React.Fragment key={actIndex}>
                          <ListItem>
                            <ListItemText primary={actividad.titulo} secondary={`Tipo: ${actividad.tipo}`} />
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                aria-label="edit"
                                onClick={() => handleOpenDialog("actividad", actividad, actIndex, index)}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => handleDeleteItem("actividad", actIndex, index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                          {actIndex < contenido.actividades.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="textSecondary" align="center">
                      No hay actividades en este contenido. Agrega una nueva.
                    </Typography>
                  )}
                </Paper>
              ))
            ) : (
              <Typography align="center" color="textSecondary">
                No hay contenido disponible. Crea uno nuevo.
              </Typography>
            )}
          </Box>
        )}
      </Paper>

      {/* Diálogos para crear/editar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === "curso" && (editIndex === -1 ? "Nuevo Curso" : "Editar Curso")}
          {dialogType === "contenido" && (editIndex === -1 ? "Nuevo Contenido" : "Editar Contenido")}
          {dialogType === "actividad" && (editIndex === -1 ? "Nueva Actividad" : "Editar Actividad")}
        </DialogTitle>
        <DialogContent>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

          {dialogType === "curso" && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="titulo"
                  label="Título del Curso"
                  fullWidth
                  value={formData.titulo || ""}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="descripcion"
                  label="Descripción"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.descripcion || ""}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Grado</InputLabel>
                  <Select name="grado" value={formData.grado || ""} onChange={handleInputChange} label="Grado">
                    {["1°", "2°", "3°", "4°", "5°", "6°"].map((grado) => (
                      <MenuItem key={grado} value={grado}>
                        {grado} Primaria
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Materia</InputLabel>
                  <Select name="materia" value={formData.materia || ""} onChange={handleInputChange} label="Materia">
                    <MenuItem value="Matemáticas">Matemáticas</MenuItem>
                    <MenuItem value="Lengua">Lengua</MenuItem>
                    <MenuItem value="Ciencias">Ciencias</MenuItem>
                    <MenuItem value="Inglés">Inglés</MenuItem>
                    <MenuItem value="Música">Música</MenuItem>
                    <MenuItem value="Plástica">Plástica</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          {dialogType === "contenido" && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="titulo"
                  label="Título del Contenido"
                  fullWidth
                  value={formData.titulo || ""}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="descripcion"
                  label="Descripción"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.descripcion || ""}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
            </Grid>
          )}

          {dialogType === "actividad" && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="titulo"
                  label="Título de la Actividad"
                  fullWidth
                  value={formData.titulo || ""}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="descripcion"
                  label="Descripción"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.descripcion || ""}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Tipo de Actividad</InputLabel>
                  <Select
                    name="tipo"
                    value={formData.tipo || ""}
                    onChange={handleInputChange}
                    label="Tipo de Actividad"
                  >
                    <MenuItem value="Lectura">Lectura</MenuItem>
                    <MenuItem value="Ejercicio">Ejercicio</MenuItem>
                    <MenuItem value="Cuestionario">Cuestionario</MenuItem>
                    <MenuItem value="Proyecto">Proyecto</MenuItem>
                    <MenuItem value="Juego">Juego</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained" disabled={submitLoading}>
            {submitLoading ? <CircularProgress size={24} /> : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default GestionContenido

