

import { useState, useEffect} from "react"
import { useNavigate, Link } from "react-router-dom"
import { Container, Paper, TextField, Button, Typography, Alert, Box } from "@mui/material"
import { useAuth } from "../context/AuthContext"
import "../styles/Login.css"
import Footer from "../components/Footer"

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.msg || "Error al iniciar sesión")
        return
      }

      await login(data.token)
      navigate("/perfil")
    } catch (error) {
      setError("Error al iniciar sesión. Por favor intente nuevamente.")
      console.error("Error al iniciar sesión:", error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  useEffect(() =>{
    window.scrollTo(0,0);// desplazamiento automatico hacia arriba
  }, []);

  return (
    <main>
      <Container className="login-container">
        <Paper className="login-paper">
          <Typography variant="h4" className="login-title">
            Iniciar Sesión
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <form onSubmit={handleSubmit} className="login-form">
            <TextField
              className="form-field"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              className="form-field"
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary" className="submit-button" fullWidth>
              Iniciar Sesión
            </Button>
          </form>
          <Box className="additional-links">
            <Typography variant="body2">
              ¿No tienes una cuenta?{" "}
              <Link to="/register" className="register-link">
                Regístrate aquí
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </main>
  )
}

export default Login

