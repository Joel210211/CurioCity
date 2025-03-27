const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config();

// Inicializar Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectado'))
.catch(err => {
  console.error('Error al conectar a MongoDB:', err.message);
  process.exit(1);
});

// Importar las rutas
const authRoutes = require('./routes/auth.routes');
const perfilRoutes = require('./routes/perfil.routes');
const cursosRoutes = require('./routes/cursos.routes');
const actividadesRoutes = require('./routes/actividades.routes');
const progresoRoutes = require('./routes/progreso.routes');
const cursosSeleccionadosRoutes = require('./routes/cursosSeleccionados.routes');
const usuariosRoutes = require('./routes/usuarios.routes')

// Configurar las rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/cursos', cursosRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/progreso', progresoRoutes);
app.use('/api/cursos-seleccionados', cursosSeleccionadosRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ msg: 'API funcionando correctamente' });
});

// Servir archivos estáticos en producción
if (process.env.NODE_ENV === 'production') {
  // Establecer carpeta estática
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Puerto del servidor
const PORT = process.env.PORT || 5000;

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));