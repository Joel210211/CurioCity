const express = require('express');
const router = express.Router();
const Curso = require('../models/Curso');
const auth = require('../middleware/auth'); // Asegúrate de tener este middleware

// Ruta pública para obtener todos los cursos (sin autenticación)
router.get('/public', async (req, res) => {
    try {
        const cursos = await Curso.find();
        res.json(cursos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// Ruta protegida para obtener todos los cursos (con autenticación)
router.get('/', auth, async (req, res) => {
    try {
        const cursos = await Curso.find();
        res.json(cursos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// Obtener un curso específico (ruta pública)
router.get('/curso/:id', async (req, res) => {
    try {
        const curso = await Curso.findById(req.params.id);
        if (!curso) {
            return res.status(404).json({ msg: 'Curso no encontrado' });
        }
        res.json(curso);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// Obtener cursos por grado (ruta pública)
router.get('/grado/:grado', async (req, res) => {
    try {
        const cursos = await Curso.find({ grado: req.params.grado });
        if (!cursos.length) {
            return res.status(404).json({ msg: 'No se encontraron cursos para este grado' });
        }
        res.json(cursos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// Crear un nuevo curso
router.post('/', async (req, res) => {
    try {
        const nuevoCurso = new Curso(req.body);
        const curso = await nuevoCurso.save();
        res.json(curso);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;