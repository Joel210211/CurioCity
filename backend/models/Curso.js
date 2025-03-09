const mongoose = require('mongoose');

const actividadSchema = new mongoose.Schema({
  tipo: String,
  titulo: String,
  descripcion: String,
  problemas: [String],
  palabras: [String],
  preguntas: [String],
  texto: String,
  materiales: [String],
  partes: [String],
  ejemplos: [String],
  pasos: [String]
});

const contenidoSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  recursos: [String],
  actividades: [actividadSchema]
});

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
  contenido: [contenidoSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Curso', cursoSchema);