// backend/models/Actividad.js
const mongoose = require('mongoose');

const ActividadSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  cursoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',
    required: true
  },
  contenido: {
    type: String
  },
  tipo: {
    type: String,
    enum: ['lectura', 'ejercicio', 'quiz', 'proyecto'],
    default: 'lectura'
  },
  duracionEstimada: {
    type: Number, // en minutos
    default: 30
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Actividad', ActividadSchema);