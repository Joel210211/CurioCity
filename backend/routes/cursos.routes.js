const express = require('express');
const router = express.Router();
const Curso = require('../models/Curso');

// Obtener todos los cursos
router.get('/', async (req, res) => {
    try {
        const cursos = await Curso.find();
        res.json(cursos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// Obtener un curso específico
router.get('/:id', async (req, res) => {
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