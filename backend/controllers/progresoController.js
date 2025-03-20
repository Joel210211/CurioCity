// backend/controllers/progresoController.js
const Progreso = require('../models/Progreso');

// Obtener progreso del usuario
exports.obtenerProgresoUsuario = async (req, res) => {
  try {
    console.log('Buscando progreso para usuario ID:', req.usuario.id);
    const progreso = await Progreso.findOne({ usuario: req.usuario.id });

    if (!progreso) {
      console.log('Progreso no encontrado, creando uno nuevo');
      // Si no existe el progreso, lo creamos automáticamente
      const nuevoProgreso = new Progreso({
        usuario: req.usuario.id,
        total: 0,
        actividades: []
      });
      await nuevoProgreso.save();
      return res.json({ success: true, progreso: nuevoProgreso });
    }

    res.json({ success: true, progreso });
  } catch (err) {
    console.error('Error al obtener el progreso:', err);
    res.status(500).json({ success: false, msg: 'Error del servidor' });
  }
};

// Iniciar una nueva actividad
exports.iniciarActividad = async (req, res) => {
  try {
    const { actividadId } = req.body;
    
    if (!actividadId) {
      return res.status(400).json({ success: false, msg: 'ID de actividad requerido' });
    }
    
    let progreso = await Progreso.findOne({ usuarioId: req.usuario.id });
    
    if (!progreso) {
      progreso = new Progreso({
        usuarioId: req.usuario.id,
        total: 0,
        actividades: []
      });
    }
    
    // Verificar si la actividad ya existe
    const actividadExistente = progreso.actividades.find(
      act => act.actividadId.toString() === actividadId
    );
    
    if (actividadExistente) {
      return res.status(400).json({ 
        success: false, 
        msg: 'La actividad ya está en el progreso del usuario' 
      });
    }
    
    // Añadir la actividad
    progreso.actividades.push({
      actividadId,
      progreso: 0
    });
    
    // Recalcular el progreso total
    if (progreso.actividades.length > 0) {
      progreso.total = progreso.actividades.reduce((sum, act) => sum + act.progreso, 0) / 
                       progreso.actividades.length;
    }
    
    await progreso.save();
    
    res.json({ success: true, progreso });
  } catch (err) {
    console.error('Error al iniciar actividad:', err);
    res.status(500).json({ success: false, msg: 'Error del servidor' });
  }
};

// Actualizar progreso de una actividad
exports.actualizarProgreso = async (req, res) => {
  try {
    const { id } = req.params;
    const { progreso: nuevoProgreso } = req.body;
    
    if (nuevoProgreso < 0 || nuevoProgreso > 100) {
      return res.status(400).json({ success: false, msg: 'El progreso debe estar entre 0 y 100' });
    }
    
    const progreso = await Progreso.findOne({ usuarioId: req.usuario.id });
    
    if (!progreso) {
      return res.status(404).json({ success: false, msg: 'Progreso no encontrado' });
    }
    
    // Buscar la actividad
    const actividadIndex = progreso.actividades.findIndex(
      act => act.actividadId.toString() === id
    );
    
    if (actividadIndex === -1) {
      return res.status(404).json({ success: false, msg: 'Actividad no encontrada' });
    }
    
    // Actualizar el progreso de la actividad
    progreso.actividades[actividadIndex].progreso = nuevoProgreso;
    
    // Recalcular el progreso total
    progreso.total = progreso.actividades.reduce((sum, act) => sum + act.progreso, 0) / 
                     progreso.actividades.length;
    
    await progreso.save();
    
    res.json({ success: true, progreso });
  } catch (err) {
    console.error('Error al actualizar progreso:', err);
    res.status(500).json({ success: false, msg: 'Error del servidor' });
  }
};

// Eliminar progreso de una actividad
exports.eliminarProgreso = async (req, res) => {
  try {
    const { id } = req.params;
    
    const progreso = await Progreso.findOne({ usuarioId: req.usuario.id });
    
    if (!progreso) {
      return res.status(404).json({ success: false, msg: 'Progreso no encontrado' });
    }
    
    // Filtrar la actividad a eliminar
    const actividadesActualizadas = progreso.actividades.filter(
      act => act.actividadId.toString() !== id
    );
    
    if (actividadesActualizadas.length === progreso.actividades.length) {
      return res.status(404).json({ success: false, msg: 'Actividad no encontrada' });
    }
    
    progreso.actividades = actividadesActualizadas;
    
    // Recalcular el progreso total
    if (progreso.actividades.length > 0) {
      progreso.total = progreso.actividades.reduce((sum, act) => sum + act.progreso, 0) / 
                       progreso.actividades.length;
    } else {
      progreso.total = 0;
    }
    
    await progreso.save();
    
    res.json({ success: true, progreso });
  } catch (err) {
    console.error('Error al eliminar progreso:', err);
    res.status(500).json({ success: false, msg: 'Error del servidor' });
  }
};