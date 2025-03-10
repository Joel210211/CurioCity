require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cursosRoutes = require('./routes/cursos.routes');

const app = express();
const jwtSecret = process.env.JWT_SECRET;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// Middleware de autenticación
const authMiddleware = require('./middleware/auth');

// Rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/cursos', cursosRoutes);
app.use('/api/actividades', require('./routes/actividades.routes'));
app.use('/api/progreso', require('./routes/progreso.routes'));

// Rutas protegidas
app.use('/api/cursos', authMiddleware, require('./routes/cursos.routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});