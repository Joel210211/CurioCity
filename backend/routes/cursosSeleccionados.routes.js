const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const CursosSeleccionados = require('../models/CursosSeleccionados');
const Curso = require('../models/Curso');
const mongoose = require('mongoose'); // Necesario para validar ObjectId

// Obtener cursos seleccionados del usuario
router.get('/', auth, async (req, res) => {
  try {
    console.log('Buscando cursos seleccionados para usuario ID:', req.usuario.id);
    
    let cursosSeleccionados = await CursosSeleccionados.findOne({ usuarioId: req.usuario.id });
    
    if (!cursosSeleccionados) {
      console.log('No se encontraron cursos seleccionados, creando registro vacío');
      cursosSeleccionados = new CursosSeleccionados({
        usuarioId: req.usuario.id,
        cursos: []
      });
      await cursosSeleccionados.save();
    }
    
    // Obtener detalles completos de los cursos
    const cursosIds = cursosSeleccionados.cursos.map(curso => curso.cursoId);
    const cursos = await Curso.find({ _id: { $in: cursosIds } });
    
    console.log(`Se encontraron ${cursos.length} cursos seleccionados`);
    
    // Combinar información de cursos con progreso
    const cursosConProgreso = cursos.map(curso => {
      const cursoSeleccionado = cursosSeleccionados.cursos.find(
        c => c.cursoId.toString() === curso._id.toString()
      );
      
      return {
        ...curso.toObject(),
        progreso: cursoSeleccionado ? cursoSeleccionado.progreso : 0,
        fechaSeleccion: cursoSeleccionado ? cursoSeleccionado.fechaSeleccion : null
      };
    });
    
    res.json({ success: true, cursos: cursosConProgreso });
  } catch (err) {
    console.error('Error al obtener cursos seleccionados:', err);
    res.status(500).json({ success: false, msg: 'Error del servidor' });
  }
});

// Seleccionar un curso
router.post('/', auth, async (req, res) => {
  try {
    console.log('Seleccionando curso, datos recibidos:', req.body);
    const { cursoId } = req.body;
    
    if (!cursoId) {
      return res.status(400).json({ success: false, msg: 'ID de curso requerido' });
    }
    
    // Verificar que el ID del curso es válido
    if (!mongoose.Types.ObjectId.isValid(cursoId)) {
      return res.status(400).json({ success: false, msg: 'ID de curso inválido' });
    }
    
    // Verificar que el curso existe
    const cursoExiste = await Curso.findById(cursoId);
    if (!cursoExiste) {
      return res.status(404).json({ success: false, msg: 'Curso no encontrado' });
    }
    
    console.log('Curso encontrado:', cursoExiste.titulo);
    
    let cursosSeleccionados = await CursosSeleccionados.findOne({ usuarioId: req.usuario.id });
    
    if (!cursosSeleccionados) {
      console.log('Creando nuevo registro de cursos seleccionados');
      cursosSeleccionados = new CursosSeleccionados({
        usuarioId: req.usuario.id,
        cursos: []
      });
    }
    
    // Verificar si el curso ya está seleccionado
    if (cursosSeleccionados.cursos.some(curso => curso.cursoId.toString() === cursoId)) {
      return res.status(400).json({ success: false, msg: 'El curso ya está seleccionado' });
    }
    
    // Añadir el curso
    cursosSeleccionados.cursos.push({
      cursoId,
      fechaSeleccion: new Date(),
      progreso: 0
    });
    
    await cursosSeleccionados.save();
    console.log('Curso seleccionado correctamente');
    
    res.json({ success: true, cursosSeleccionados });
  } catch (err) {
    console.error('Error al seleccionar curso:', err);
    res.status(500).json({ success: false, msg: 'Error del servidor' });
  }
});

// Eliminar un curso seleccionado
router.delete('/:cursoId', auth, async (req, res) => {
  try {
    const { cursoId } = req.params;
    console.log('Eliminando curso seleccionado:', cursoId);
    
    // Verificar que el ID del curso es válido
    if (!mongoose.Types.ObjectId.isValid(cursoId)) {
      return res.status(400).json({ success: false, msg: 'ID de curso inválido' });
    }
    
    let cursosSeleccionados = await CursosSeleccionados.findOne({ usuarioId: req.usuario.id });
    
    if (!cursosSeleccionados) {
      return res.status(404).json({ success: false, msg: 'No hay cursos seleccionados' });
    }
    
    // Filtrar el curso a eliminar
    const cursoIndex = cursosSeleccionados.cursos.findIndex(
      curso => curso.cursoId.toString() === cursoId
    );
    
    if (cursoIndex === -1) {
      return res.status(404).json({ success: false, msg: 'Curso no encontrado en seleccionados' });
    }
    
    cursosSeleccionados.cursos.splice(cursoIndex, 1);
    await cursosSeleccionados.save();
    
    console.log('Curso eliminado correctamente de seleccionados');
    
    res.json({ success: true, cursosSeleccionados });
  } catch (err) {
    console.error('Error al eliminar curso seleccionado:', err);
    res.status(500).json({ success: false, msg: 'Error del servidor' });
  }
});

// Actualizar progreso de un curso seleccionado
router.put('/:cursoId/progreso', auth, async (req, res) => {
  try {
    const { cursoId } = req.params;
    const { progreso } = req.body;
    
    console.log(`Actualizando progreso del curso ${cursoId} a ${progreso}%`);
    
    // Verificar que el ID del curso es válido
    if (!mongoose.Types.ObjectId.isValid(cursoId)) {
      return res.status(400).json({ success: false, msg: 'ID de curso inválido' });
    }
    
    if (progreso < 0 || progreso > 100) {
      return res.status(400).json({ success: false, msg: 'El progreso debe estar entre 0 y 100' });
    }
    
    let cursosSeleccionados = await CursosSeleccionados.findOne({ usuarioId: req.usuario.id });
    
    if (!cursosSeleccionados) {
      return res.status(404).json({ success: false, msg: 'No hay cursos seleccionados' });
    }
    
    // Buscar el curso
    const cursoIndex = cursosSeleccionados.cursos.findIndex(
      curso => curso.cursoId.toString() === cursoId
    );
    
    if (cursoIndex === -1) {
      return res.status(404).json({ success: false, msg: 'Curso no encontrado en seleccionados' });
    }
    
    // Actualizar el progreso
    cursosSeleccionados.cursos[cursoIndex].progreso = progreso;
    await cursosSeleccionados.save();
    
    console.log('Progreso del curso actualizado correctamente');
    
    res.json({ success: true, cursosSeleccionados });
  } catch (err) {
    console.error('Error al actualizar progreso del curso:', err);
    res.status(500).json({ success: false, msg: 'Error del servidor' });
  }
});

// Obtener un curso seleccionado específico
router.get('/:cursoId', auth, async (req, res) => {
  try {
    const { cursoId } = req.params;
    
    // Verificar que el ID del curso es válido
    if (!mongoose.Types.ObjectId.isValid(cursoId)) {
      return res.status(400).json({ success: false, msg: 'ID de curso inválido' });
    }
    
    const cursosSeleccionados = await CursosSeleccionados.findOne({ usuarioId: req.usuario.id });
    
    if (!cursosSeleccionados) {
      return res.status(404).json({ success: false, msg: 'No hay cursos seleccionados' });
    }
    
    // Buscar el curso seleccionado
    const cursoSeleccionado = cursosSeleccionados.cursos.find(
      curso => curso.cursoId.toString() === cursoId
    );
    
    if (!cursoSeleccionado) {
      return res.status(404).json({ success: false, msg: 'Curso no encontrado en seleccionados' });
    }
    
    // Obtener los detalles completos del curso
    const curso = await Curso.findById(cursoId);
    
    if (!curso) {
      return res.status(404).json({ success: false, msg: 'Curso no encontrado en la base de datos' });
    }
    
    // Combinar información del curso con el progreso
    const cursoConProgreso = {
      ...curso.toObject(),
      progreso: cursoSeleccionado.progreso,
      fechaSeleccion: cursoSeleccionado.fechaSeleccion
    };
    
    res.json({ success: true, curso: cursoConProgreso });
  } catch (err) {
    console.error('Error al obtener curso seleccionado:', err);
    res.status(500).json({ success: false, msg: 'Error del servidor' });
  }
});

module.exports = router;