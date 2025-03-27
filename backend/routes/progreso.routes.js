const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const progresoController = require('../controllers/progresoController');
const Progreso = require('../models/Progreso'); // Asegúrate de que el modelo esté importado

// Obtener el progreso del usuario autenticado
router.get('/', auth, progresoController.obtenerProgresoUsuario);

// Actualizar el progreso de una actividad
router.put('/actividad/:actividadId', auth, progresoController.actualizarProgresoActividad);

// Añadir una actividad al progreso
router.post('/actividad', auth, progresoController.agregarActividad);

// Eliminar una actividad del progreso
router.delete('/actividad/:actividadId', auth, progresoController.eliminarActividad);

// Obtener el progreso de un estudiante específico (para padres)
router.get('/estudiante/:id', auth, async (req, res) => {
  try {
    const progreso = await Progreso.findOne({ estudianteId: req.params.id });
    if (!progreso) {
      return res.status(404).json({ success: false, msg: 'Progreso no encontrado' });
    }
    res.json({ success: true, progreso });
  } catch (err) {
    console.error('Error al obtener progreso:', err);
    res.status(500).json({ success: false, msg: 'Error del servidor' });
  }
});

module.exports = router;