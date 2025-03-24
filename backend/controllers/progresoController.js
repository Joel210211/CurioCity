const Progreso = require("../models/Progreso")
const mongoose = require("mongoose")

// Obtener el progreso de un usuario
exports.obtenerProgresoUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario.id
    console.log("Buscando progreso para usuario ID:", usuarioId)
    
    let progreso = await Progreso.findOne({ usuario: usuarioId })
    
    if (!progreso) {
      console.log("Progreso no encontrado, creando uno nuevo")
      
      // Crear un nuevo progreso con los campos mínimos requeridos
      progreso = new Progreso({
        usuario: usuarioId,
        total: 0,
        actividades: [],
      })
      
      await progreso.save()
      console.log("Nuevo progreso creado para el usuario")
    }
    
    return res.json({
      success: true,
      progreso,
    })
  } catch (error) {
    console.error("Error al obtener el progreso:", error)
    return res.status(500).json({
      success: false,
      msg: "Error del servidor",
    })
  }
}

// Actualizar el progreso de una actividad
exports.actualizarProgresoActividad = async (req, res) => {
  try {
    const { progreso } = req.body
    const actividadId = req.params.actividadId
    const usuarioId = req.usuario.id

    console.log("Actualizando progreso para actividad:", actividadId, "Nuevo progreso:", progreso)
    
    if (progreso < 0 || progreso > 100) {
      return res.status(400).json({
        success: false,
        msg: "El progreso debe estar entre 0 y 100",
      })
    }
    
    let progresoUsuario = await Progreso.findOne({ usuario: usuarioId })
    
    if (!progresoUsuario) {
      progresoUsuario = new Progreso({
        usuario: usuarioId,
        total: 0,
        actividades: [],
      })
    }
    
    // Buscar si la actividad ya existe en el progreso
    const actividadIndex = progresoUsuario.actividades.findIndex(
      (act) => act.actividadId && act.actividadId.toString() === actividadId,
    )
    
    if (actividadIndex === -1) {
      // Si no existe, añadirla
      progresoUsuario.actividades.push({
        actividadId,
        progreso,
        completado: progreso === 100,
        fechaInicio: new Date(),
        fechaCompletado: progreso === 100 ? new Date() : null,
      })
    } else {
      // Si existe, actualizarla
      progresoUsuario.actividades[actividadIndex].progreso = progreso
      progresoUsuario.actividades[actividadIndex].completado = progreso === 100
      
      if (progreso === 100 && !progresoUsuario.actividades[actividadIndex].fechaCompletado) {
        progresoUsuario.actividades[actividadIndex].fechaCompletado = new Date()
      }
    }
    
    // Calcular el progreso total
    if (progresoUsuario.actividades.length > 0) {
      const totalProgreso = progresoUsuario.actividades.reduce((sum, act) => sum + act.progreso, 0)
      progresoUsuario.total = totalProgreso / progresoUsuario.actividades.length
    }
    
    await progresoUsuario.save()
    
    return res.json({
      success: true,
      progreso: progresoUsuario,
    })
  } catch (error) {
    console.error("Error al actualizar el progreso:", error)
    return res.status(500).json({
      success: false,
      msg: "Error del servidor",
    })
  }
}

// Añadir una actividad al progreso
exports.agregarActividad = async (req, res) => {
  try {
    const { actividadId, progreso = 0 } = req.body
    const usuarioId = req.usuario.id

    console.log("Recibida solicitud para agregar actividad:", { actividadId, progreso })
    
    if (!actividadId) {
      return res.status(400).json({
        success: false,
        msg: "ID de actividad requerido",
      })
    }

    // Verificar si es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(actividadId)) {
      console.error("ID de actividad no válido:", actividadId)

      // Intentar buscar la actividad por otro identificador si no es un ObjectId
      // Por ahora, solo registramos el error y continuamos
      console.log("Continuando con el ID proporcionado aunque no sea un ObjectId válido")
    }

    let progresoUsuario = await Progreso.findOne({ usuario: usuarioId })
    
    if (!progresoUsuario) {
      progresoUsuario = new Progreso({
        usuario: usuarioId,
        total: 0,
        actividades: [],
      })
    }
    
    // Verificar si la actividad ya existe
    if (progresoUsuario.actividades.some((act) => act.actividadId && act.actividadId.toString() === actividadId)) {
      return res.status(400).json({
        success: false,
        msg: "La actividad ya existe en el progreso",
      })
    }
    
    // Añadir la actividad
    progresoUsuario.actividades.push({
      actividadId,
      progreso,
      completado: progreso === 100,
      fechaInicio: new Date(),
      fechaCompletado: progreso === 100 ? new Date() : null,
    })
    
    // Calcular el progreso total
    if (progresoUsuario.actividades.length > 0) {
      const totalProgreso = progresoUsuario.actividades.reduce((sum, act) => sum + act.progreso, 0)
      progresoUsuario.total = totalProgreso / progresoUsuario.actividades.length
    }
    
    await progresoUsuario.save()
    
    return res.json({
      success: true,
      progreso: progresoUsuario,
    })
  } catch (error) {
    console.error("Error al añadir actividad:", error)
    return res.status(500).json({
      success: false,
      msg: "Error del servidor",
    })
  }
}

// Eliminar una actividad del progreso
exports.eliminarActividad = async (req, res) => {
  try {
    const actividadId = req.params.actividadId
    const usuarioId = req.usuario.id
    
    const progresoUsuario = await Progreso.findOne({ usuario: usuarioId })
    
    if (!progresoUsuario) {
      return res.status(404).json({
        success: false,
        msg: "Progreso no encontrado",
      })
    }
    
    // Filtrar la actividad a eliminar
    const actividadIndex = progresoUsuario.actividades.findIndex(
      (act) => act.actividadId && act.actividadId.toString() === actividadId,
    )
    
    if (actividadIndex === -1) {
      return res.status(404).json({
        success: false,
        msg: "Actividad no encontrada en el progreso",
      })
    }
    
    progresoUsuario.actividades.splice(actividadIndex, 1)
    
    // Recalcular el progreso total
    if (progresoUsuario.actividades.length > 0) {
      const totalProgreso = progresoUsuario.actividades.reduce((sum, act) => sum + act.progreso, 0)
      progresoUsuario.total = totalProgreso / progresoUsuario.actividades.length
    } else {
      progresoUsuario.total = 0
    }
    
    await progresoUsuario.save()
    
    return res.json({
      success: true,
      progreso: progresoUsuario,
    })
  } catch (error) {
    console.error("Error al eliminar actividad:", error)
    return res.status(500).json({
      success: false,
      msg: "Error del servidor",
    })
  }
}

