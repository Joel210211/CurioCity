require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//importar rutas de cursos y perfil
const cursosRoutes = require('./routes/cursos.routes');
const authRoutes = require('./routes/auth.routes');
const perfilRoutes = require('./routes/perfil.routes');
const actividadesRoutes = require('./routes/actividades.routes');
const progresoRoutes = require('./routes/progreso.routes');

const app = express();
const jwtSecret = process.env.JWT_SECRET;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization']
}));
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// Middleware de autenticación
const authMiddleware = require('./middleware/auth');

// Rutas públicas
app.use('/api/auth', authRoutes);

// Ruta de prueba para verificar si el servidor funciona
app.get('/api/test', (req, res) => {
  res.json({ success: true, msg: 'API funcionando correctamente' });
});

// Rutas protegidas (con autenticación)
app.use('/api/cursos', authMiddleware, cursosRoutes);
app.use('/api/actividades', authMiddleware, actividadesRoutes);
app.use('/api/progreso', authMiddleware, progresoRoutes);
app.use('/api/perfil', authMiddleware, perfilRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});