const mongoose = require('mongoose');

const perfilSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
    unique: true
  },
  progreso: {
    type: Number,
    default: 0
  },
  tareas: [{
    titulo: String,
    descripcion: String,
    progreso: {
      type: Number,
      default: 0
    },
    completada: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Perfil', perfilSchema);