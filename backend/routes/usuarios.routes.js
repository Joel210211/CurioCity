// backend/routes/usuarios.routes.js
const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario'); // Asegúrate de que la ruta al modelo sea correcta

// Ruta para obtener un usuario por email
router.get('/email/:email', async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ email: req.params.email });
    if (!usuario) {
      return res.status(404).json({ success: false, msg: 'Usuario no encontrado' });
    }
    res.json({ success: true, usuario });
  } catch (err) {
    console.error('Error al obtener usuario:', err);
    res.status(500).json({ success: false, msg: 'Error del servidor' });
  }
});

module.exports = router;