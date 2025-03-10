const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const progresoController = require('../controllers/progresoController');

// Iniciar una nueva actividad
router.post('/', auth, progresoController.iniciarActividad);

// Obtener progreso del usuario
router.get('/usuario', auth, progresoController.obtenerProgresoUsuario);

// Actualizar progreso de una actividad
router.put('/:id', auth, progresoController.actualizarProgreso);

// Eliminar progreso de una actividad
router.delete('/:id', auth, progresoController.eliminarProgreso);

module.exports = router; 