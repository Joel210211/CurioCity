// backend/routes/actividades.routes.js
const express = require('express');
const router = express.Router();
const Actividad = require('../models/Actividad');
const auth = require('../middleware/auth');

// Obtener todas las actividades
router.get('/', auth, async (req, res) => {
    try {
        const actividades = await Actividad.find();
        res.json({ success: true, actividades });
    } catch (err) {
        console.error('Error al obtener actividades:', err);
        res.status(500).json({ success: false, msg: 'Error del servidor' });
    }
});

// Obtener actividades por curso
router.get('/curso/:cursoId', auth, async (req, res) => {
    try {
        const { cursoId } = req.params;
        const actividades = await Actividad.find({ cursoId });
        res.json({ success: true, actividades });
    } catch (err) {
        console.error('Error al obtener actividades del curso:', err);
        res.status(500).json({ success: false, msg: 'Error del servidor' });
    }
});

// Obtener una actividad específica
router.get('/:id', auth, async (req, res) => {
    try {
        const actividad = await Actividad.findById(req.params.id);
        if (!actividad) {
            return res.status(404).json({ success: false, msg: 'Actividad no encontrada' });
        }
        res.json({ success: true, actividad });
    } catch (err) {
        console.error('Error al obtener actividad:', err);
        res.status(500).json({ success: false, msg: 'Error del servidor' });
    }
});

module.exports = router;