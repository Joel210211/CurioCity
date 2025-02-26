const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Ruta para registro
router.post('/register', async (req, res) => {
  try {
    const { 
      nombre, 
      apellido, 
      email, 
      password, 
      rol, 
      grado, 
      especialidad, 
      experiencia, 
      hijosRegistrados 
    } = req.body;

    // Verificar si el usuario ya existe
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({
        success: false,
        msg: 'El email ya está registrado'
      });
    }

    // Crear objeto de usuario con campos básicos
    const usuarioData = { nombre, apellido, email, password, rol };

    // Agregar campos específicos según el rol
    if (rol === 'estudiante') {
      usuarioData.grado = grado;
    } else if (rol === 'profesor') {
      usuarioData.especialidad = especialidad;
      usuarioData.experiencia = experiencia;
    } else if (rol === 'padre') {
      usuarioData.hijosRegistrados = hijosRegistrados;
    }

    // Crear nuevo usuario; el hook pre('save') del modelo se encarga de hashear la contraseña
    usuario = new Usuario(usuarioData);
    await usuario.save();

    // Crear perfil para el nuevo usuario
    await fetch('http://localhost:5000/api/perfil/crear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    });

    // Crear payload para el JWT
    const payload = {
      usuario: {
        id: usuario.id,
        rol: usuario.rol
      }
    };

    // Generar y retornar el token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) {
          return res.status(500).json({
            success: false,
            msg: 'Error al generar el token'
          });
        }
        return res.json({
          success: true,
          msg: 'Usuario registrado exitosamente',
          token,
          usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            rol: usuario.rol
          }
        });
      }
    );
  } catch (err) {
    console.error('Error en el registro:', err);
    // Nos aseguramos de enviar un JSON válido en caso de error
    res.status(500).json({
      success: false,
      msg: 'Error del servidor',
      error: err.message
    });
  }
});

// Ruta para login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    let usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        success: false,
        msg: 'Credenciales inválidas'
      });
    }

    // Comparar contraseñas utilizando el método definido en el modelo
    const isMatch = await usuario.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        msg: 'Credenciales inválidas'
      });
    }

    // Crear payload para el JWT
    const payload = {
      usuario: {
        id: usuario.id,
        rol: usuario.rol
      }
    };

    // Generar y retornar el token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) {
          return res.status(500).json({
            success: false,
            msg: 'Error al generar el token'
          });
        }
        return res.json({
          success: true,
          token,
          usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            rol: usuario.rol
          }
        });
      }
    );
  } catch (err) {
    console.error('Error en el login:', err);
    res.status(500).json({
      success: false,
      msg: 'Error del servidor',
      error: err.message
    });
  }
});

// Ruta para obtener el usuario autenticado
router.get('/usuario', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({
        success: false,
        msg: 'No hay token, autorización denegada'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.usuario.id).select('-password');

    res.json({
      success: true,
      usuario
    });
  } catch (err) {
    console.error('Error al obtener el usuario autenticado:', err);
    res.status(401).json({
      success: false,
      msg: 'Token no válido'
    });
  }
});

module.exports = router;
