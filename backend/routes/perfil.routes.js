const express = require('express');
const router = express.Router();
const Perfil = require('../models/Perfil');
const auth = require('../middleware/auth');

// Obtener perfil del usuario autenticado
router.get('/', auth, async (req, res) => {
  try {
    console.log('Buscando perfil para usuario ID:', req.usuario.id);
    const perfil = await Perfil.findOne({ usuarioId: req.usuario.id });
    
    if (!perfil) {
      console.log('Perfil no encontrado, creando uno nuevo');
      // Si no existe el perfil, lo creamos automáticamente
      const nuevoPerfil = new Perfil({ 
        usuarioId: req.usuario.id,
        progreso: 0,
        tareas: []
      });
      await nuevoPerfil.save();
      return res.json({ success: true, perfil: nuevoPerfil });
    }
    
    res.json({ success: true, perfil });
  } catch (err) {
    console.error('Error al obtener el perfil:', err);
    res.status(500).json({ success: false, msg: 'Error del servidor' });
  }
});

// Crear perfil al registrar usuario
router.post('/crear', auth, async (req, res) => {
  try {
    console.log('Creando perfil para usuario ID:', req.usuario.id);
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