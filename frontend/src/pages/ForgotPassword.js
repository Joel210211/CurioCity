"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Typography,
  Box,
} from "@mui/material"

// Dominios de correo considerados como "de prueba"
const TEST_EMAIL_DOMAINS = ["test.com", "ejemplo.com", "prueba.com", "example.com", "test.local"]

function ForgotPassword({ open, onClose }) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("idle") // idle, loading, success, error, direct_reset
  const [message, setMessage] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [resetError, setResetError] = useState("")
  const [resetSuccess, setResetSuccess] = useState(false)

  // Función para verificar si es un correo de prueba
  const isTestEmail = (email) => {
    if (!email) return false
    const domain = email.split("@")[1]
    return TEST_EMAIL_DOMAINS.includes(domain)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("loading")
    setMessage("")

    // Verificar si es un correo de prueba
    if (isTestEmail(email)) {
      // Verificar si el usuario existe
      try {
        const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        })

        const data = await response.json()

        if (!response.ok) {
          setStatus("error")
          setMessage(data.msg || "No existe un usuario con ese correo electrónico")
          return
        }

        // Si el usuario existe, mostrar formulario de cambio directo
        setStatus("direct_reset")
      } catch (error) {
        setStatus("error")
        setMessage("Error al conectar con el servidor. Por favor intenta nuevamente.")
        console.error("Error:", error)
      }
    } else {
      // Flujo normal para correos reales
      try {
        const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        })

        const text = await response.text() // Obtener la respuesta como texto
        console.log(text) // Verificar qué se está recibiendo

        const data = JSON.parse(text) // Intentar convertir a JSON

        if (!response.ok) {
          setStatus("error")
          setMessage(data.msg || "Error al solicitar recuperación de contraseña")
          return
        }

        setStatus("success")
        setMessage("Se ha enviado un enlace de recuperación a tu correo electrónico")
      } catch (error) {
        setStatus("error")
        setMessage("Error al conectar con el servidor. Por favor intenta nuevamente.")
        console.error("Error:", error)
      }
    }
  }

  const handleDirectReset = async (e) => {
    e.preventDefault()
    setResetError("")

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setResetError("Las contraseñas no coinciden")
      return
    }

    // Validar requisitos de contraseña
    if (password.length < 6) {
      setResetError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/direct-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setResetError(data.msg || "Error al cambiar la contraseña")
        return
      }

      setResetSuccess(true)
      setTimeout(() => {
        onClose()
      }, 3000)
    } catch (error) {
      setResetError("Error al conectar con el servidor. Por favor intenta nuevamente.")
      console.error("Error:", error)
    }
  }

  // Renderizar el contenido según el estado
  const renderContent = () => {
    switch (status) {
      case "success":
        return (
          <Alert severity="success" sx={{ mt: 2, fontFamily: '"Comic Sans MS", cursive, sans-serif' }}>
            {message}
          </Alert>
        )

      case "direct_reset":
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 2, fontFamily: '"Comic Sans MS", cursive, sans-serif' }}>
              Correo de prueba detectado. Puedes cambiar tu contraseña directamente.
            </Alert>

            {resetSuccess ? (
              <Alert severity="success" sx={{ fontFamily: '"Comic Sans MS", cursive, sans-serif' }}>
                ¡Contraseña actualizada correctamente! Redirigiendo...
              </Alert>
            ) : (
              <form onSubmit={handleDirectReset}>
                <TextField
                  fullWidth
                  label="Nueva contraseña"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  margin="normal"
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: "#00796b",
                      fontFamily: '"Comic Sans MS", cursive, sans-serif',
                    },
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "12px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#4caf50",
                        borderWidth: "2px",
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirmar contraseña"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  margin="normal"
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: "#00796b",
                      fontFamily: '"Comic Sans MS", cursive, sans-serif',
                    },
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "12px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#4caf50",
                        borderWidth: "2px",
                      },
                    },
                  }}
                />

                {resetError && (
                  <Alert severity="error" sx={{ mt: 2, mb: 2, fontFamily: '"Comic Sans MS", cursive, sans-serif' }}>
                    {resetError}
                  </Alert>
                )}

                <Button
                  type="submit"
                  fullWidth
                  sx={{
                    mt: 2,
                    backgroundColor: "#ffeb3b",
                    color: "#000",
                    fontFamily: '"Comic Sans MS", cursive, sans-serif',
                    borderRadius: "30px",
                    boxShadow: "0 4px 0 #ffc107",
                    "&:hover": {
                      backgroundColor: "#ffd600",
                      transform: "translateY(-3px)",
                      boxShadow: "0 7px 0 #ffc107",
                    },
                  }}
                >
                  Cambiar Contraseña
                </Button>
              </form>
            )}
          </Box>
        )

      case "error":
        return (
          <>
            <Alert severity="error" sx={{ mb: 2, fontFamily: '"Comic Sans MS", cursive, sans-serif' }}>
              {message}
            </Alert>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                margin="normal"
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#00796b",
                    fontFamily: '"Comic Sans MS", cursive, sans-serif',
                  },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: "12px",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#4caf50",
                      borderWidth: "2px",
                    },
                  },
                }}
              />
            </form>
          </>
        )

      default: // idle, loading
        return (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              margin="normal"
              disabled={status === "loading"}
              sx={{
                "& .MuiInputLabel-root": {
                  color: "#00796b",
                  fontFamily: '"Comic Sans MS", cursive, sans-serif',
                },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "12px",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4caf50",
                    borderWidth: "2px",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#2196f3",
                    borderWidth: "3px",
                  },
                },
              }}
            />
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                mb: 2,
                fontFamily: '"Comic Sans MS", cursive, sans-serif',
                color: "#666",
              }}
            >
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
              <br />
              <Box component="span" sx={{ fontStyle: "italic", mt: 1, display: "block" }}>
                Nota: Si usas un correo de prueba (@test.com, @ejemplo.com, etc.), podrás cambiar tu contraseña
                directamente.
              </Box>
            </Typography>
          </form>
        )
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          textAlign: "center",
          color: "#d32f2f",
          fontWeight: 600,
          fontFamily: '"Comic Sans MS", cursive, sans-serif',
          textShadow: "1px 1px 0px #ffeb3b",
        }}
      >
        Recuperar Contraseña
      </DialogTitle>

      <DialogContent>{renderContent()}</DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2, px: 3 }}>
        {status === "success" ? (
          <Button
            onClick={onClose}
            fullWidth
            sx={{
              backgroundColor: "#ffeb3b",
              color: "#000",
              fontFamily: '"Comic Sans MS", cursive, sans-serif',
              borderRadius: "30px",
              boxShadow: "0 4px 0 #ffc107",
              "&:hover": {
                backgroundColor: "#ffd600",
                transform: "translateY(-3px)",
                boxShadow: "0 7px 0 #ffc107",
              },
              "&:active": {
                transform: "translateY(2px)",
                boxShadow: "0 2px 0 #ffc107",
              },
            }}
          >
            Cerrar
          </Button>
        ) : status === "direct_reset" ? (
          resetSuccess ? (
            <Button
              onClick={onClose}
              fullWidth
              sx={{
                backgroundColor: "#ffeb3b",
                color: "#000",
                fontFamily: '"Comic Sans MS", cursive, sans-serif',
                borderRadius: "30px",
                boxShadow: "0 4px 0 #ffc107",
              }}
            >
              Cerrar
            </Button>
          ) : (
            <Button
              onClick={onClose}
              sx={{
                flex: 1,
                fontFamily: '"Comic Sans MS", cursive, sans-serif',
              }}
            >
              Cancelar
            </Button>
          )
        ) : (
          <>
            <Button
              onClick={onClose}
              sx={{
                flex: 1,
                fontFamily: '"Comic Sans MS", cursive, sans-serif',
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={status === "loading"}
              sx={{
                flex: 1,
                backgroundColor: "#ffeb3b",
                color: "#000",
                fontFamily: '"Comic Sans MS", cursive, sans-serif',
                borderRadius: "30px",
                boxShadow: "0 4px 0 #ffc107",
                "&:hover": {
                  backgroundColor: "#ffd600",
                  transform: "translateY(-3px)",
                  boxShadow: "0 7px 0 #ffc107",
                },
                "&:active": {
                  transform: "translateY(2px)",
                  boxShadow: "0 2px 0 #ffc107",
                },
              }}
            >
              {status === "loading" ? "Enviando..." : "Enviar enlace"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default ForgotPassword

