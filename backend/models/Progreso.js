const mongoose = require('mongoose');

const actividadProgresoSchema = new mongoose.Schema({
  actividadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Actividad'
  },
  progreso: {
    type: Number,
    default: 0
  },
  completado: {
    type: Boolean,
    default: false
  },
  fechaInicio: {
    type: Date,
    default: Date.now
  },
  fechaCompletado: Date
});

const progresoSchema = new mongoose.Schema({
  estudianteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  total: {
    type: Number,
    default: 0
  },
  actividades: [actividadProgresoSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Progreso', progresoSchema);