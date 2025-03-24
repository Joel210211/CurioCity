const mongoose = require('mongoose');

const cursoSeleccionadoSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  cursos: [{
    cursoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Curso'
    },
    fechaSeleccion: {
      type: Date,
      default: Date.now
    },
    progreso: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('CursosSeleccionados', cursoSeleccionadoSchema);