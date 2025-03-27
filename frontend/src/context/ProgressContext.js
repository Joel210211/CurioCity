"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { AuthContext } from "./AuthContext" // Importar el contexto de autenticación

// Crear el contexto
export const ProgressContext = createContext()

// Proveedor del contexto
export const ProgressProvider = ({ children }) => {
  // Estados para manejar el progreso, carga y errores
  const [progreso, setProgreso] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Obtener el estado de autenticación del contexto de Auth
  const { isAuthenticated } = useContext(AuthContext)

  // Cargar el progreso cuando el componente se monta o cuando cambia el estado de autenticación
  useEffect(() => {
    // Solo cargar el progreso si el usuario está autenticado
    if (isAuthenticated) {
      cargarProgreso()
    } else {
      setLoading(false)
      setProgreso(null)
    }
  }, [isAuthenticated])

  // Función para cargar el progreso del usuario
  const cargarProgreso = async () => {
    try {
      setLoading(true)
      setError(null)

      // Obtener el token del localStorage
      const token = localStorage.getItem("token")

      if (!token) {
        console.warn("No hay token disponible, usando datos de ejemplo")
        // Usar datos de ejemplo en desarrollo
        setProgreso({
          total: 0,
          actividades: [],
        })
        setLoading(false)
        return
      }

      console.log("Obteniendo progreso con token:", token)

      try {
        // Realizar la solicitud con el token en la cabecera correcta
        const response = await fetch("http://localhost:5000/api/progreso", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        })

        if (!response.ok) {
          const errorData = await response.text()
          console.error("Error de respuesta:", response.status, errorData)
          throw new Error(`Error al cargar el progreso: ${response.status} - ${errorData}`)
        }

        const data = await response.json()
        console.log("Datos de progreso recibidos:", data)

        if (data.success) {
          setProgreso(data.progreso)
        } else {
          throw new Error(data.msg || "Error al cargar el progreso")
        }
      } catch (fetchError) {
        console.error("Error detallado en la solicitud:", fetchError)
        // Usar datos de ejemplo en desarrollo
        console.warn("Usando datos de ejemplo debido al error")
        setProgreso({
          total: 0,
          actividades: [],
        })
      }
    } catch (error) {
      console.error("Error al cargar progreso:", error)
      setError(error.message)

      // Usar datos de ejemplo en desarrollo
      setProgreso({
        total: 0,
        actividades: [],
      })
    } finally {
      setLoading(false)
    }
  }

  // Función para obtener el progreso de un estudiante específico (para padres)
  const obtenerProgresoEstudiante = async (estudianteId) => {
    try {
      if (!estudianteId) {
        throw new Error("ID de estudiante no proporcionado")
      }

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No hay token disponible")
      }

      console.log("Obteniendo progreso del estudiante con ID:", estudianteId)

      const response = await fetch(`http://localhost:5000/api/progreso/estudiante/${estudianteId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error("Error de respuesta:", response.status, errorData)
        throw new Error(`Error al obtener el progreso del estudiante: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.msg || "Error al obtener el progreso del estudiante")
      }

      return data.progreso
    } catch (error) {
      console.error("Error al obtener progreso del estudiante:", error)
      throw error
    }
  }

  // Función para actualizar el progreso de una actividad específica
  const actualizarProgreso = async (actividadId, nuevoProgreso) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No hay token disponible")
      }

      console.log("Actualizando progreso para actividad:", actividadId, "Nuevo progreso:", nuevoProgreso)

      const response = await fetch(`http://localhost:5000/api/progreso/actividad/${actividadId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ progreso: nuevoProgreso }),
      })

      // Capturar y mostrar la respuesta completa para depuración
      const responseText = await response.text()
      console.log("Respuesta completa de actualización:", responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error("Error al parsear la respuesta JSON:", e)
        throw new Error(`Error en la respuesta del servidor: ${responseText}`)
      }

      if (!response.ok) {
        console.error("Error de respuesta:", response.status, data)
        throw new Error(data.msg || `Error al actualizar el progreso: ${response.status}`)
      }

      if (!data.success) {
        throw new Error(data.msg || "Error al actualizar el progreso")
      }

      // Actualizar el estado local
      setProgreso((prevProgreso) => {
        if (!prevProgreso) return data.progreso

        // Actualizar la actividad específica en el array de actividades
        const actividadesActualizadas = prevProgreso.actividades.map((act) =>
          act.actividadId === actividadId ? { ...act, progreso: nuevoProgreso } : act,
        )

        // Si la actividad no existe, la añadimos
        if (!prevProgreso.actividades.some((act) => act.actividadId === actividadId)) {
          actividadesActualizadas.push({
            actividadId,
            progreso: nuevoProgreso,
          })
        }

        // Calcular el nuevo progreso total
        const total =
          actividadesActualizadas.length > 0
            ? actividadesActualizadas.reduce((sum, act) => sum + act.progreso, 0) / actividadesActualizadas.length
            : 0

        return {
          ...prevProgreso,
          total,
          actividades: actividadesActualizadas,
        }
      })

      return data.progreso
    } catch (error) {
      console.error("Error al actualizar progreso:", error)
      throw error
    }
  }

  // Función para añadir una nueva actividad al progreso
  const agregarActividad = async (actividadId) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No hay token disponible")
      }

      console.log("Intentando agregar actividad con ID:", actividadId)

      const response = await fetch(`http://localhost:5000/api/progreso/actividad`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({
          actividadId,
          progreso: 0, // Inicialmente 0%
        }),
      })

      // Capturar y mostrar la respuesta completa para depuración
      const responseText = await response.text()
      console.log("Respuesta completa:", responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error("Error al parsear la respuesta JSON:", e)
        throw new Error(`Error en la respuesta del servidor: ${responseText}`)
      }

      if (!response.ok) {
        console.error("Error de respuesta:", response.status, data)
        throw new Error(data.msg || `Error al añadir la actividad: ${response.status}`)
      }

      if (!data.success) {
        throw new Error(data.msg || "Error al añadir la actividad")
      }

      // Actualizar el estado local
      setProgreso((prevProgreso) => {
        if (!prevProgreso) return data.progreso

        // Verificar si la actividad ya existe
        if (prevProgreso.actividades.some((act) => act.actividadId === actividadId)) {
          return prevProgreso // No hacer nada si ya existe
        }

        // Añadir la nueva actividad
        const actividadesActualizadas = [...prevProgreso.actividades, { actividadId, progreso: 0 }]

        // Calcular el progreso total
        const total =
          actividadesActualizadas.length > 0
            ? actividadesActualizadas.reduce((sum, act) => sum + act.progreso, 0) / actividadesActualizadas.length
            : 0

        return {
          ...prevProgreso,
          total,
          actividades: actividadesActualizadas,
        }
      })

      return data.progreso
    } catch (error) {
      console.error("Error al añadir actividad:", error)
      throw error
    }
  }

  // Función para eliminar una actividad del progreso
  const eliminarActividad = async (actividadId) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No hay token disponible")
      }

      console.log("Eliminando actividad con ID:", actividadId)

      const response = await fetch(`http://localhost:5000/api/progreso/actividad/${actividadId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      })

      // Capturar y mostrar la respuesta completa para depuración
      const responseText = await response.text()
      console.log("Respuesta completa de eliminación:", responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error("Error al parsear la respuesta JSON:", e)
        throw new Error(`Error en la respuesta del servidor: ${responseText}`)
      }

      if (!response.ok) {
        console.error("Error de respuesta:", response.status, data)
        throw new Error(data.msg || `Error al eliminar la actividad: ${response.status}`)
      }

      if (!data.success) {
        throw new Error(data.msg || "Error al eliminar la actividad")
      }

      // Actualizar el estado local
      setProgreso((prevProgreso) => {
        if (!prevProgreso) return data.progreso

        // Filtrar la actividad eliminada
        const actividadesActualizadas = prevProgreso.actividades.filter((act) => act.actividadId !== actividadId)

        // Recalcular el progreso total
        const total =
          actividadesActualizadas.length > 0
            ? actividadesActualizadas.reduce((sum, act) => sum + act.progreso, 0) / actividadesActualizadas.length
            : 0

        return {
          ...prevProgreso,
          total,
          actividades: actividadesActualizadas,
        }
      })

      return data.progreso
    } catch (error) {
      console.error("Error al eliminar actividad:", error)
      throw error
    }
  }

  // Función para obtener el progreso de una actividad específica
  const obtenerProgresoActividad = (actividadId) => {
    if (!progreso || !progreso.actividades) return 0

    const actividad = progreso.actividades.find((act) => act.actividadId === actividadId)
    return actividad ? actividad.progreso : 0
  }

  // Función para verificar si una actividad está en el progreso
  const tieneActividad = (actividadId) => {
    if (!progreso || !progreso.actividades) return false
    return progreso.actividades.some((act) => act.actividadId === actividadId)
  }

  // Función para obtener cursos con su progreso
  const obtenerCursos = async () => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        console.warn("No hay token disponible, usando datos de ejemplo")
        // Retornar datos de ejemplo en desarrollo con formato correcto
        return [
          {
            _id: "1",
            titulo: "Matemáticas",
            descripcion: "Curso de matemáticas básicas",
            grado: "1",
            materia: "Matemáticas",
          },
          { _id: "2", titulo: "Ciencias", descripcion: "Curso de ciencias naturales", grado: "1", materia: "Ciencias" },
          { _id: "3", titulo: "Historia", descripcion: "Curso de historia universal", grado: "1", materia: "Historia" },
        ]
      }

      try {
        const response = await fetch("http://localhost:5000/api/cursos", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        })

        if (!response.ok) {
          const errorData = await response.text()
          console.error("Error de respuesta:", response.status, errorData)
          throw new Error(`Error al obtener los cursos: ${response.status} - ${errorData}`)
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.msg || "Error al obtener los cursos")
        }

        return data.cursos
      } catch (fetchError) {
        console.error("Error detallado en la solicitud:", fetchError)
        // Retornar datos de ejemplo en desarrollo con formato correcto
        console.warn("Usando datos de ejemplo debido al error")
        return [
          {
            _id: "1",
            titulo: "Matemáticas",
            descripcion: "Curso de matemáticas básicas",
            grado: "1",
            materia: "Matemáticas",
          },
          { _id: "2", titulo: "Ciencias", descripcion: "Curso de ciencias naturales", grado: "1", materia: "Ciencias" },
          { _id: "3", titulo: "Historia", descripcion: "Curso de historia universal", grado: "1", materia: "Historia" },
        ]
      }
    } catch (error) {
      console.error("Error al obtener cursos:", error)
      // Retornar datos de ejemplo en desarrollo con formato correcto
      return [
        {
          _id: "1",
          titulo: "Matemáticas",
          descripcion: "Curso de matemáticas básicas",
          grado: "1",
          materia: "Matemáticas",
        },
        { _id: "2", titulo: "Ciencias", descripcion: "Curso de ciencias naturales", grado: "1", materia: "Ciencias" },
        { _id: "3", titulo: "Historia", descripcion: "Curso de historia universal", grado: "1", materia: "Historia" },
      ]
    }
  }

  // Función para obtener un curso específico por ID
  const obtenerCurso = async (id) => {
    try {
      setLoading(true)

      // Intentar obtener el curso de la API pública (no requiere autenticación)
      const response = await fetch(`http://localhost:5000/api/cursos/public/${id}`)

      if (!response.ok) {
        const errorData = await response.text()
        console.error("Error de respuesta:", response.status, errorData)
        throw new Error(`Error al obtener el curso: ${response.status} - ${errorData}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.msg || "Error al obtener el curso")
      }

      setLoading(false)
      return data.curso
    } catch (error) {
      console.error("Error al obtener el curso:", error)
      setLoading(false)

      // Si hay un error, intentar obtener el curso con autenticación
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          throw new Error("No hay token disponible")
        }

        const authResponse = await fetch(`http://localhost:5000/api/cursos/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        })

        if (!authResponse.ok) {
          throw new Error(`Error al obtener el curso: ${authResponse.status}`)
        }

        const authData = await authResponse.json()

        if (!authData.success) {
          throw new Error(authData.msg || "Error al obtener el curso")
        }

        return authData.curso
      } catch (authError) {
        console.error("Error al obtener el curso con autenticación:", authError)
        throw error // Lanzar el error original
      }
    }
  }

  // Función para obtener actividades de un curso
  const obtenerActividadesCurso = async (cursoId) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No hay token disponible")
      }

      const response = await fetch(`http://localhost:5000/api/actividades/curso/${cursoId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error("Error de respuesta:", response.status, errorData)
        throw new Error("Error al obtener las actividades")
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.msg || "Error al obtener las actividades")
      }

      return data.actividades
    } catch (error) {
      console.error("Error al obtener actividades:", error)
      throw error
    }
  }

  // Función para obtener los cursos seleccionados por el usuario
  const obtenerCursosSeleccionados = async () => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        console.warn("No hay token disponible, usando datos de ejemplo")
        return []
      }

      try {
        const response = await fetch("http://localhost:5000/api/cursos-seleccionados", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        })

        if (!response.ok) {
          const errorData = await response.text()
          console.error("Error de respuesta:", response.status, errorData)
          throw new Error(`Error al obtener los cursos seleccionados: ${response.status}`)
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.msg || "Error al obtener los cursos seleccionados")
        }

        return data.cursos
      } catch (fetchError) {
        console.error("Error detallado en la solicitud:", fetchError)
        console.warn("Usando datos de ejemplo debido al error")
        return []
      }
    } catch (error) {
      console.error("Error al obtener cursos seleccionados:", error)
      return []
    }
  }

  // Función para seleccionar un curso
  const seleccionarCurso = async (cursoId) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No hay token disponible")
      }

      const response = await fetch("http://localhost:5000/api/cursos-seleccionados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ cursoId }),
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error("Error de respuesta:", response.status, errorData)
        throw new Error("Error al seleccionar el curso")
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.msg || "Error al seleccionar el curso")
      }

      return data.cursosSeleccionados
    } catch (error) {
      console.error("Error al seleccionar curso:", error)
      throw error
    }
  }

  // Función para eliminar un curso seleccionado
  const eliminarCursoSeleccionado = async (cursoId) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No hay token disponible")
      }

      const response = await fetch(`http://localhost:5000/api/cursos-seleccionados/${cursoId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error("Error de respuesta:", response.status, errorData)
        throw new Error("Error al eliminar el curso seleccionado")
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.msg || "Error al eliminar el curso seleccionado")
      }

      return data.cursosSeleccionados
    } catch (error) {
      console.error("Error al eliminar curso seleccionado:", error)
      throw error
    }
  }

  // Función para actualizar el progreso de un curso seleccionado
  const actualizarProgresoCurso = async (cursoId, progreso) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No hay token disponible")
      }

      const response = await fetch(`http://localhost:5000/api/cursos-seleccionados/${cursoId}/progreso`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ progreso }),
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error("Error de respuesta:", response.status, errorData)
        throw new Error("Error al actualizar el progreso del curso")
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.msg || "Error al actualizar el progreso del curso")
      }

      return data.cursosSeleccionados
    } catch (error) {
      console.error("Error al actualizar progreso del curso:", error)
      throw error
    }
  }

  // Retornar el proveedor con todos los valores y funciones
  return (
    <ProgressContext.Provider
      value={{
        progreso,
        loading,
        error,
        cargarProgreso,
        actualizarProgreso,
        agregarActividad,
        eliminarActividad,
        obtenerProgresoActividad,
        tieneActividad,
        obtenerCursos,
        obtenerCurso,
        obtenerActividadesCurso,
        obtenerCursosSeleccionados,
        seleccionarCurso,
        eliminarCursoSeleccionado,
        actualizarProgresoCurso,
        obtenerProgresoEstudiante,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

// Hook personalizado para usar el contexto
export const useProgress = () => {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error("useProgress debe ser usado dentro de un ProgressProvider")
  }
  return context
}

export default ProgressProvider

