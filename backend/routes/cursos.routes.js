// backend/routes/cursos.routes.js
const express = require('express');
const router = express.Router();
const Curso = require('../models/Curso');
const auth = require('../middleware/auth');

// Ruta pública para obtener todos los cursos (sin autenticación)
router.get('/public', async (req, res) => {
    try {
        const cursos = await Curso.find();
        res.json({ success: true, cursos });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'Error del servidor' });
    }
});

// Ruta protegida para obtener todos los cursos (con autenticación)
router.get('/', auth, async (req, res) => {
    try {
        console.log('Usuario autenticado:', req.usuario.id);
        const cursos = await Curso.find();
        res.json({ success: true, cursos });
    } catch (err) {
        console.error('Error al obtener cursos:', err);
        res.status(500).json({ success: false, msg: 'Error del servidor' });
    }
});

// Obtener un curso específico (ruta pública)
router.get('/curso/:id', async (req, res) => {
    try {
        const curso = await Curso.findById(req.params.id);
        if (!curso) {
            return res.status(404).json({ success: false, msg: 'Curso no encontrado' });
        }
        res.json({ success: true, curso });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'Error del servidor' });
    }
});

// Obtener cursos por grado (ruta pública)
router.get('/grado/:grado', async (req, res) => {
    try {
        const cursos = await Curso.find({ grado: req.params.grado });
        if (!cursos.length) {
            return res.status(404).json({ success: false, msg: 'No se encontraron cursos para este grado' });
        }
        res.json({ success: true, cursos });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'Error del servidor' });
    }
});

// Crear un nuevo curso
router.post('/', async (req, res) => {
    try {
        const nuevoCurso = new Curso(req.body);
        const curso = await nuevoCurso.save();
        res.json({ success: true, curso });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'Error del servidor' });
    }
});

module.exports = router;