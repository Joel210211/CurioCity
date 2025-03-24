const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Curso = require('../models/Curso');

// Ruta pública para obtener todos los cursos (sin autenticación)
router.get('/public', async (req, res) => {
  try {
    const cursos = await Curso.find();
    res.json({ success: true, cursos });
  } catch (err) {
    console.error('Error al obtener cursos:', err);
    res.status(500).json({ success: false, msg: 'Error del servidor' });
  }
});

// Ruta pública para obtener un curso específico por ID (sin autenticación)
router.get('/public/:id', async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id);
    
    if (!curso) {
      return res.status(404).json({ success: false, msg: 'Curso no encontrado' });
    }
    
    res.json({ success: true, curso });
  } catch (err) {
    console.error('Error al obtener curso:', err);
    res.status(500).json({ success: false, msg: 'Error del servidor' });
  }
});

// Rutas protegidas (requieren autenticación)
router.get('/', auth, async (req, res) => {
  try {
    const cursos = await Curso.find();
    res.json({ success: true, cursos });
  } catch (err) {
    console.error('Error al obtener cursos:', err);
    res.status(500).json({ success: false, msg: 'Error del servidor' });
  }
});

// Obtener un curso específico por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id);
    
    if (!curso) {
      return res.status(404).json({ success: false, msg: 'Curso no encontrado' });
    }
    
    res.json({ success: true, curso });
  } catch (err) {
    console.error('Error al obtener curso:', err);
    res.status(500).json({ success: false, msg: 'Error del servidor' });
  }
});

// Crear un nuevo curso (solo para administradores)
router.post('/', auth, async (req, res) => {
  try {
    // Verificar si el usuario es administrador
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ success: false, msg: 'Acceso denegado' });
    }
    
    const { titulo, descripcion, grado, materia, contenido } = req.body;
    
    // Validar campos requeridos
    if (!titulo || !descripcion || !grado || !materia) {
      return res.status(400).json({ success: false, msg: 'Todos los campos son requeridos' });
    }
    
    // Crear el nuevo curso
    const nuevoCurso = new Curso({
      titulo,
      descripcion,
      grado,
      materia,
      contenido: contenido || []
    });
    
    await nuevoCurso.save();
    
    res.status(201).json({ success: true, curso: nuevoCurso });
  } catch (err) {
    console.error('Error al crear curso:', err);
    res.status(500).json({ success: false, msg: 'Error del servidor' });
  }
});

// Actualizar un curso existente (solo para administradores)
router.put('/:id', auth, async (req, res) => {
  try {
    // Verificar si el usuario es administrador
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ success: false, msg: 'Acceso denegado' });
    }
    
    const { titulo, descripcion, grado, materia, contenido } = req.body;
    
    // Construir el objeto de actualización
    const cursoActualizado = {};
    if (titulo) cursoActualizado.titulo = titulo;
    if (descripcion) cursoActualizado.descripcion = descripcion;
    if (grado) cursoActualizado.grado = grado;
    if (materia) cursoActualizado.materia = materia;
    if (contenido) cursoActualizado.contenido = contenido;
    
    // Actualizar el curso
    const curso = await Curso.findByIdAndUpdate(
      req.params.id,
      { $set: cursoActualizado },
      { new: true }
    );
    
    if (!curso) {
      return res.status(404).json({ success: false, msg: 'Curso no encontrado' });
    }
    
    res.json({ success: true, curso });
  } catch (err) {
    console.error('Error al actualizar curso:', err);
    res.status(500).json({ success: false, msg: 'Error del servidor' });
  }
});

// Eliminar un curso (solo para administradores)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Verificar si el usuario es administrador
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ success: false, msg: 'Acceso denegado' });
    }
    
    // Eliminar el curso
    const curso = await Curso.findByIdAndRemove(req.params.id);
    
    if (!curso) {
      return res.status(404).json({ success: false, msg: 'Curso no encontrado' });
    }
    
    res.json({ success: true, msg: 'Curso eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar curso:', err);
    res.status(500).json({ success: false, msg: 'Error del servidor' });
  }
});

// Obtener cursos por materia
router.get('/materia/:materia', auth, async (req, res) => {
  try {
    const cursos = await Curso.find({ materia: req.params.materia });
    res.json({ success: true, cursos });
  } catch (err) {
    console.error('Error al obtener cursos por materia:', err);
    res.status(500).json({ success: false, msg: 'Error del servidor' });
  }
});

// Obtener cursos por grado
router.get('/grado/:grado', auth, async (req, res) => {
  try {
    const cursos = await Curso.find({ grado: req.params.grado });
    res.json({ success: true, cursos });
  } catch (err) {
    console.error('Error al obtener cursos por grado:', err);
    res.status(500).json({ success: false, msg: 'Error del servidor' });
  }
});

module.exports = router;