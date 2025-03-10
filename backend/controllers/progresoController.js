const Progreso = require('../models/Progreso');

// Iniciar una nueva actividad
exports.iniciarActividad = async (req, res) => {
    try {
        const { cursoId, actividadId, contenidoId, indiceActividad, titulo } = req.body;
        const usuarioId = req.usuario.id;

        if (!cursoId || !actividadId || !contenidoId || indiceActividad === undefined || !titulo) {
            return res.status(400).json({ 
                error: 'Faltan datos requeridos',
                detalles: { cursoId, actividadId, contenidoId, indiceActividad, titulo }
            });
        }

        // Verificar si ya existe un progreso para esta actividad
        let progreso = await Progreso.findOne({
            usuario: usuarioId,
            curso: cursoId,
            actividad: actividadId
        });

        if (progreso) {
            return res.status(400).json({ 
                error: 'Ya has iniciado esta actividad',
                progreso 
            });
        }

        // Crear nuevo progreso
        progreso = new Progreso({
            usuario: usuarioId,
            curso: cursoId,
            actividad: actividadId,
            contenidoId: contenidoId,
            indiceActividad: indiceActividad,
            titulo: titulo
        });

        await progreso.save();
        res.json(progreso);
    } catch (error) {
        console.error('Error al iniciar actividad:', error);
        res.status(500).json({ 
            error: 'Error del servidor',
            detalles: error.message 
        });
    }
};

// Obtener progreso de actividades del usuario
exports.obtenerProgresoUsuario = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const progreso = await Progreso.find({ usuario: usuarioId })
            .populate('curso', 'titulo');
        
        res.json(progreso);
    } catch (error) {
        console.error('Error al obtener progreso:', error);
        res.status(500).json({ 
            error: 'Error al obtener progreso',
            detalles: error.message 
        });
    }
};

// Actualizar progreso de una actividad
exports.actualizarProgreso = async (req, res) => {
    try {
        const { porcentaje, completada } = req.body;
        const progresoId = req.params.id;

        let progreso = await Progreso.findById(progresoId);

        if (!progreso) {
            return res.status(404).json({ error: 'Progreso no encontrado' });
        }

        // Verificar que el progreso pertenece al usuario
        if (progreso.usuario.toString() !== req.usuario.id) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        progreso.porcentaje = porcentaje;
        progreso.completada = completada;
        progreso.fechaActualizacion = Date.now();

        await progreso.save();
        res.json(progreso);
    } catch (error) {
        console.error('Error al actualizar progreso:', error);
        res.status(500).json({ 
            error: 'Error al actualizar progreso',
            detalles: error.message 
        });
    }
};

// Eliminar progreso de una actividad
exports.eliminarProgreso = async (req, res) => {
    try {
        const progresoId = req.params.id;
        const progreso = await Progreso.findById(progresoId);

        if (!progreso) {
            return res.status(404).json({ error: 'Progreso no encontrado' });
        }

        if (progreso.usuario.toString() !== req.usuario.id) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        await Progreso.findByIdAndDelete(progresoId);
        res.json({ mensaje: 'Progreso eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar progreso:', error);
        res.status(500).json({ 
            error: 'Error al eliminar progreso',
            detalles: error.message 
        });
    }
}; 