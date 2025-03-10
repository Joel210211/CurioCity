const mongoose = require('mongoose');

const progresoSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    curso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Curso',
        required: true
    },
    actividad: {
        type: String,
        required: true
    },
    contenidoId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    indiceActividad: {
        type: Number,
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    porcentaje: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    completada: {
        type: Boolean,
        default: false
    },
    fechaInicio: {
        type: Date,
        default: Date.now
    },
    fechaActualizacion: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Progreso', progresoSchema); 