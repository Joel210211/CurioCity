const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  apellido: {
    type: String,
    required: [true, 'El apellido es requerido'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un email válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  rol: {
    type: String,
    enum: ['estudiante', 'profesor', 'padre'],
    required: [true, 'El rol es requerido']
  },
  // Campos condicionales sin valor por defecto
  grado: {
    type: String,
    required: function() {
      return this.rol === 'estudiante';
    }
  },
  especialidad: {
    type: String,
    required: function() {
      return this.rol === 'profesor';
    }
  },
  experiencia: {
    type: Number,
    required: function() {
      return this.rol === 'profesor';
    }
  },
  hijosRegistrados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }]
}, {
  timestamps: true
});

// Encriptar la contraseña antes de guardar
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
usuarioSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Usuario', usuarioSchema);
