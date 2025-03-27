const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Usuario = require("../models/Usuario")
const Perfil = require("../models/Perfil")

// Dominios de correo considerados como "de prueba"
const TEST_EMAIL_DOMAINS = ["test.com", "ejemplo.com", "prueba.com", "example.com", "test.local"]

// Función para verificar si es un correo de prueba
const isTestEmail = (email) => {
  if (!email) return false
  const domain = email.split("@")[1]
  return TEST_EMAIL_DOMAINS.includes(domain)
}

// Ruta para registro
router.post("/register", async (req, res) => {
  try {
    const { nombre, apellido, email, password, rol, grado, especialidad, experiencia, hijosRegistrados } = req.body

    // Verificar si el usuario ya existe
    let usuario = await Usuario.findOne({ email })
    if (usuario) {
      return res.status(400).json({
        success: false,
        msg: "El email ya está registrado",
      })
    }

    // Crear objeto de usuario con campos básicos
    const usuarioData = { nombre, apellido, email, password, rol }

    // Agregar campos específicos según el rol
    if (rol === "estudiante") {
      usuarioData.grado = grado
    } else if (rol === "profesor") {
      usuarioData.especialidad = especialidad
      usuarioData.experiencia = experiencia
    } else if (rol === "padre") {
      const hijoId = req.body.hijoId; // Asegúrate de que el ID del hijo se pase en la solicitud
      usuarioData.hijosRegistrados = [hijoId]; // Agregar el ID del hijo
    }

    // Crear nuevo usuario; el hook pre('save') del modelo se encarga de hashear la contraseña
    usuario = new Usuario(usuarioData)
    await usuario.save()

    // Crear payload para el JWT
    const payload = {
      usuario: {
        id: usuario.id,
        rol: usuario.rol,
      },
    }

    // Generar y retornar el token
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" }, async (err, token) => {
      if (err) {
        return res.status(500).json({
          success: false,
          msg: "Error al generar el token",
        })
      }

      // Ahora que tenemos el token, creamos el perfil
      try {
        const perfilExistente = await Perfil.findOne({ usuarioId: usuario.id })
        if (!perfilExistente) {
          const nuevoPerfil = new Perfil({ usuarioId: usuario.id })
          await nuevoPerfil.save()
          console.log("Perfil creado exitosamente")
        }
      } catch (perfilError) {
        console.error("Error al crear el perfil:", perfilError)
        // No devolvemos error al cliente, solo lo registramos
      }

      return res.json({
        success: true,
        msg: "Usuario registrado exitosamente",
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          rol: usuario.rol,
        },
      })
    })
  } catch (err) {
    console.error("Error en el registro:", err)
    // Nos aseguramos de enviar un JSON válido en caso de error
    res.status(500).json({
      success: false,
      msg: "Error del servidor",
      error: err.message,
    })
  }
})

// Ruta para login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
      return res.status(400).json({
        success: false,
        msg: "Credenciales inválidas",
      })
    }

    // Comparar contraseñas utilizando el método definido en el modelo
    const isMatch = await usuario.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        msg: "Credenciales inválidas",
      })
    }

    // Crear payload para el JWT
    const payload = {
      usuario: {
        id: usuario.id,
        rol: usuario.rol,
      },
    }

    // Generar y retornar el token
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" }, (err, token) => {
      if (err) {
        return res.status(500).json({
          success: false,
          msg: "Error al generar el token",
        })
      }
      return res.json({
        success: true,
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          rol: usuario.rol,
        },
      })
    })
  } catch (err) {
    console.error("Error en el login:", err)
    res.status(500).json({
      success: false,
      msg: "Error del servidor",
      error: err.message,
    })
  }
})

// Ruta para obtener el usuario autenticado
router.get("/usuario", async (req, res) => {
  try {
    const token = req.header("x-auth-token")
    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "No hay token, autorización denegada",
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const usuario = await Usuario.findById(decoded.usuario.id).select("-password")

    res.json({
      success: true,
      usuario,
    })
  } catch (err) {
    console.error("Error al obtener el usuario autenticado:", err)
    res.status(401).json({
      success: false,
      msg: "Token no válido",
    })
  }
})

// RUTAS PARA RECUPERACIÓN DE CONTRASEÑA

// Ruta para verificar si existe un email (usado para correos de prueba)
router.post("/check-email", async (req, res) => {
  try {
    const { email } = req.body

    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
      return res.status(404).json({
        success: false,
        msg: "No existe un usuario con ese correo electrónico",
      })
    }

    // Si el usuario existe, devolver éxito
    res.json({
      success: true,
      msg: "Usuario encontrado",
    })
  } catch (err) {
    console.error("Error al verificar email:", err)
    res.status(500).json({
      success: false,
      msg: "Error del servidor",
    })
  }
})

// Ruta para cambio directo de contraseña (para correos de prueba)
router.post("/direct-reset", async (req, res) => {
  try {
    const { email, password } = req.body

    // Verificar si es un correo de prueba
    if (!isTestEmail(email)) {
      return res.status(400).json({
        success: false,
        msg: "Esta ruta solo está disponible para correos de prueba",
      })
    }

    // Buscar el usuario
    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
      return res.status(404).json({
        success: false,
        msg: "No existe un usuario con ese correo electrónico",
      })
    }

    // Actualizar la contraseña
    usuario.password = password
    await usuario.save() // El hook pre-save se encargará de hashear la contraseña

    res.json({
      success: true,
      msg: "Contraseña actualizada correctamente",
    })
  } catch (err) {
    console.error("Error al cambiar contraseña directamente:", err)
    res.status(500).json({
      success: false,
      msg: "Error del servidor",
    })
  }
})

// Ruta para solicitar restablecimiento de contraseña (para correos reales)
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body

    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
      return res.status(404).json({
        success: false,
        msg: "No existe un usuario con ese correo electrónico",
      })
    }

    // Generar token único (expira en 1 hora)
    const resetToken = jwt.sign({ id: usuario._id }, process.env.JWT_RESET_SECRET || process.env.JWT_SECRET, {
      expiresIn: "1h",
    })

    // Aquí implementarías el envío de correo con el enlace
    // El enlace sería algo como: http://tudominio.com/reset-password/${resetToken}
    console.log(`Token de restablecimiento para ${email}: ${resetToken}`)

    // En un entorno real, enviarías un correo electrónico con el enlace
    // Por ahora, solo simulamos que se envió correctamente

    res.json({
      success: true,
      msg: "Se ha enviado un enlace de recuperación a tu correo electrónico",
    })
  } catch (err) {
    console.error("Error al solicitar restablecimiento:", err)
    res.status(500).json({
      success: false,
      msg: "Error del servidor",
    })
  }
})

// Ruta para validar token de restablecimiento
router.get("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params

    // Verificar que el token sea válido
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET || process.env.JWT_SECRET)

    // Verificar que el usuario existe
    const usuario = await Usuario.findById(decoded.id)
    if (!usuario) {
      return res.status(400).json({
        success: false,
        msg: "Token inválido",
      })
    }

    res.json({
      success: true,
      userId: usuario._id,
    })
  } catch (err) {
    console.error("Error al validar token:", err)
    res.status(400).json({
      success: false,
      msg: "Token inválido o expirado",
    })
  }
})

// Ruta para cambiar la contraseña con token
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body

    // Verificar que el token sea válido
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET || process.env.JWT_SECRET)

    // Buscar el usuario
    const usuario = await Usuario.findById(decoded.id)
    if (!usuario) {
      return res.status(400).json({
        success: false,
        msg: "Token inválido",
      })
    }

    // Actualizar la contraseña
    usuario.password = password
    await usuario.save() // El hook pre-save se encargará de hashear la contraseña

    res.json({
      success: true,
      msg: "Contraseña actualizada correctamente",
    })
  } catch (err) {
    console.error("Error al cambiar contraseña:", err)
    res.status(400).json({
      success: false,
      msg: err.name === "TokenExpiredError" ? "El enlace ha expirado" : "Token inválido",
    })
  }
})

module.exports = router

