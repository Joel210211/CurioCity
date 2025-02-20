const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

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

        // Crear nuevo usuario
        usuario = new Usuario({
            nombre,
            apellido,
            email,
            password,
            rol,
            ...(rol === 'estudiante' && { grado }),
            ...(rol === 'profesor' && { especialidad, experiencia }),
            ...(rol === 'padre' && { hijosRegistrados })
        });

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);

        // Guardar usuario
        await usuario.save();

        // Crear y retornar JWT
        const payload = {
            usuario: {
                id: usuario.id,
                rol: usuario.rol
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({
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
        console.error(err.message);
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

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) {
            return res.status(400).json({ 
                success: false,
                msg: 'Credenciales inválidas' 
            });
        }

        // Crear y retornar JWT
        const payload = {
            usuario: {
                id: usuario.id,
                rol: usuario.rol
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({
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
        console.error(err.message);
        res.status(500).json({
            success: false,
            msg: 'Error del servidor',
            error: err.message
        });
    }
});

// Ruta para obtener usuario autenticado
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
        res.status(401).json({
            success: false,
            msg: 'Token no válido'
        });
    }
});

module.exports = router;