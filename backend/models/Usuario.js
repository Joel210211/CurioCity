const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ['estudiante', 'profesor'],
    default: 'estudiante'
  },
  grado: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Usuario', usuarioSchema);