const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  grado: {
    type: String,
    required: true
  },
  materia: {
    type: String,
    required: true
  },
  contenido: [{
    titulo: String,
    descripcion: String,
    recursos: [String]
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Curso', cursoSchema);