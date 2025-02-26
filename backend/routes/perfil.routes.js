const express = require('express');
const router = express.Router();
const Perfil = require('../models/Perfil');
const authMiddleware = require('../middleware/auth');

// Obtener perfil del usuario autenticado
router.get('/', authMiddleware, async (req, res) => {
  try {
    const perfil = await Perfil.findOne({ usuarioId: req.usuario.id });
    if (!perfil) {
      return res.status(404).json({ success: false, msg: 'Perfil no encontrado' });
    }
    res.json({ success: true, perfil });
  } catch (err) {
    console.error('Error al obtener el perfil:', err);
    res.status(500).json({ success: false, msg: 'Error del servidor' });
  }
});

// Crear perfil al registrar usuario
router.post('/crear', authMiddleware, async (req, res) => {
  try {
    const perfilExistente = await Perfil.findOne({ usuarioId: req.usuario.id });
    if (perfilExistente) {
      return res.status(400).json({ success: false, msg: 'El perfil ya existe' });
    }

    const nuevoPerfil = new Perfil({ usuarioId: req.usuario.id });
    await nuevoPerfil.save();
    res.json({ success: true, perfil: nuevoPerfil });
  } catch (err) {
    console.error('Error al crear el perfil:', err);
    res.status(500).json({ success: false, msg: 'Error del servidor' });
  }
});

module.exports = router;