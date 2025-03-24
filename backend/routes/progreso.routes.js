const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const progresoController = require('../controllers/progresoController');

// Obtener el progreso del usuario autenticado
router.get('/', auth, progresoController.obtenerProgresoUsuario);

// Actualizar el progreso de una actividad
router.put('/actividad/:actividadId', auth, progresoController.actualizarProgresoActividad);

// Añadir una actividad al progreso
router.post('/actividad', auth, progresoController.agregarActividad);

// Eliminar una actividad del progreso
router.delete('/actividad/:actividadId', auth, progresoController.eliminarActividad);

module.exports = router;