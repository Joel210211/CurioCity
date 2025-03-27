"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Container, Paper, TextField, Button, Typography, Alert, Box, CircularProgress } from "@mui/material"
import "../styles/Login.css" // Reutilizamos los estilos del login
import Footer from "../components/Footer"

function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [status, setStatus] = useState("validating") // validating, invalid, ready, loading, success, error
  const [message, setMessage] = useState("")
  const { token } = useParams()
  const navigate = useNavigate()

  // Validar el token al cargar la página
  useEffect(() => {
    async function validateToken() {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`)
        const data = await response.json()

        if (!response.ok) {
          setStatus("invalid")
          setMessage(data.msg || "El enlace no es válido o ha expirado")
          return
        }

        setStatus("ready")
      } catch (error) {
        setStatus("invalid")
        setMessage("Error al validar el enlace. Por favor solicita un nuevo enlace.")
        console.error("Error:", error)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    // Validar requisitos de contraseña
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setStatus("loading")

    try {
      const response = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setStatus("error")
        setError(data.msg || "Error al cambiar la contraseña")
        return
      }

      setStatus("success")
      setMessage("¡Tu contraseña ha sido cambiada exitosamente!")

      // Redirigir al login después de un breve retraso
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (error) {
      setStatus("error")
      setError("Error al conectar con el servidor. Por favor intenta nuevamente.")
      console.error("Error:", error)
    }
  }

  // Renderizar según el estado
  const renderContent = () => {
    switch (status) {
      case "validating":
        return (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )

      case "invalid":
        return (
          <Alert severity="error" sx={{ my: 2 }}>
            {message}
            <Button onClick={() => navigate("/login")} fullWidth sx={{ mt: 2 }} className="submit-button">
              Volver al inicio de sesión
            </Button>
          </Alert>
        )

      case "success":
        return (
          <Alert severity="success" sx={{ my: 2 }}>
            {message}
            <Typography variant="body2" sx={{ mt: 1 }}>
              Serás redirigido a la página de inicio de sesión en unos segundos...
            </Typography>
          </Alert>
        )

      default: // ready, loading, error
        return (
          <form onSubmit={handleSubmit}>
            <TextField
              className="form-field"
              label="Nueva contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              className="form-field"
              label="Confirmar contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
              margin="normal"
            />

            {error && (
              <Alert severity="error" sx={{ my: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="submit-button"
              fullWidth
              disabled={status === "loading"}
            >
              {status === "loading" ? "Cambiando contraseña..." : "Cambiar contraseña"}
            </Button>
          </form>
        )
    }
  }

  return (
    <main>
      <Container className="login-container">
        <Paper className="login-paper">
          <Typography variant="h4" className="login-title">
            Restablecer Contraseña
          </Typography>

          {renderContent()}
        </Paper>
      </Container>
      <Footer />
    </main>
  )
}

export default ResetPassword

