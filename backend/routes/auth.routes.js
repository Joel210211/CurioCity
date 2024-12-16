const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

// Ruta para registro
router.post('/register', async (req, res) => {
    try {
        const { nombre, email, password, rol, grado } = req.body;

        // Verificar si el usuario ya existe
        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        // Crear nuevo usuario
        usuario = new Usuario({
            nombre,
            email,
            password,
            rol,
            grado
        });

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);

        // Guardar usuario
        await usuario.save();

        // Crear y retornar JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// Ruta para login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el usuario existe
        let usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        // Crear y retornar JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;