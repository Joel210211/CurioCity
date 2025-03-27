"use client"

import { useEffect, useState, useRef } from "react"
import { Container, Typography, Button, Box, Grid, Card, CardContent, IconButton, Snackbar, Alert } from "@mui/material"
import { Link } from "react-router-dom"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import SchoolIcon from "@mui/icons-material/School"
import GroupIcon from "@mui/icons-material/Group"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import SportsEsportsIcon from "@mui/icons-material/SportsEsports"
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions"
import PetsIcon from "@mui/icons-material/Pets"
import MusicNoteIcon from "@mui/icons-material/MusicNote"
import "../styles/Home.css"
import "../components/Footer"
import Footer from "../components/Footer"
import { useProgress } from "../context/ProgressContext"
import { useAuth } from "../context/AuthContext"

// Componente para animación al hacer scroll
function AnimateOnScroll({ children, threshold = 0.1 }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold },
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold])

  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${isVisible ? "visible" : ""}`}
      style={{ transitionDelay: `${Math.random() * 0.3}s` }}
    >
      {children}
    </div>
  )
}

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <IconButton
      onClick={scrollToTop}
      className="scroll-to-top"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        display: isVisible ? "flex" : "none",
        backgroundColor: "#ffeb3b",
        color: "#000",
        zIndex: 1000,
        borderRadius: "50%",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
      }}
      aria-label="Scroll to top"
    >
      <ArrowUpwardIcon />
    </IconButton>
  )
}

// Componente para las nubes decorativas
function CloudDecoration() {
  return (
    <div className="cloud-decoration">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="cloud"
          style={{
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${20 + Math.random() * 10}s`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: 0.7 + Math.random() * 0.3,
            transform: `scale(${0.5 + Math.random() * 0.5})`,
          }}
        />
      ))}
    </div>
  )
}

function Home() {
  const { isAuthenticated } = useAuth()
  const { seleccionarCurso } = useProgress()
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })

  const handleSeleccionarCurso = async (subject) => {
    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: "Debes iniciar sesión para seleccionar cursos",
        severity: "warning",
      })
      return
    }

    try {
      await seleccionarCurso(subject._id)
      setSnackbar({
        open: true,
        message: `¡Has seleccionado el curso de ${subject.title}!`,
        severity: "success",
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Error al seleccionar el curso",
        severity: "error",
      })
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const features = [
    {
      icon: <MenuBookIcon fontSize="large" />,
      title: "Contenido Interactivo",
      description: "¡Aprende jugando con lecciones divertidas y ejercicios que parecen juegos!",
      path: "/interactive-content",
    },
    {
      icon: <SchoolIcon fontSize="large" />,
      title: "Profesores Amigos",
      description: "Nuestros profes son súper divertidos y te ayudarán en toda tu aventura de aprendizaje.",
      path: "/profesores-expertos",
    },
    {
      icon: <GroupIcon fontSize="large" />,
      title: "Aprende con Amigos",
      description: "¡Haz equipo con tus compañeros y resuelvan desafíos juntos como verdaderos héroes!",
    },
    {
      icon: <EmojiEventsIcon fontSize="large" />,
      title: "¡Gana Premios!",
      description: "Colecciona medallas, trofeos y sorpresas mientras aprendes y superas niveles.",
    },
  ]

  const subjects = [
    {
      _id: "1",
      title: "Matemáticas",
      description: "¡Conviértete en un mago de los números y resuelve problemas como un superhéroe!",
      path: "/matematicas",
      icon: <SportsEsportsIcon fontSize="large" style={{ color: "#d32f2f" }} />,
    },
    {
      _id: "2",
      title: "Lengua",
      description: "¡Aprende a contar historias increíbles y ser el mejor narrador de aventuras!",
      path: "/lengua",
      icon: <EmojiEmotionsIcon fontSize="large" style={{ color: "#9c27b0" }} />,
    },
    {
      _id: "3",
      title: "Ciencias",
      description: "¡Explora el mundo como un científico y descubre todos sus secretos!",
      path: "/ciencias",
      icon: <PetsIcon fontSize="large" style={{ color: "#4caf50" }} />,
    },
    {
      _id: "4",
      title: "Inglés",
      description: "¡Aprende un idioma mágico que te permitirá hablar con amigos de todo el mundo!",
      path: "/ingles",
      icon: <SportsEsportsIcon fontSize="large" style={{ color: "#2196f3" }} />,
    },
    {
      _id: "5",
      title: "Música",
      description: "¡Crea melodías increíbles y conviértete en una estrella musical!",
      path: "/musica",
      icon: <MusicNoteIcon fontSize="large" style={{ color: "#ff9800" }} />,
    },
    {
      _id: "6",
      title: "Plástica",
      description: "¡Libera tu imaginación y crea obras de arte tan geniales como tú!",
      path: "/plastica",
      icon: <EmojiEmotionsIcon fontSize="large" style={{ color: "#e91e63" }} />,
    },
  ]

  return (
    <div className="home-page">
      {/* Sección Hero */}
      <Box className="hero-section">
        <Container>
          <div className="hero-content">
            <Typography variant="h2" className="hero-title">
              ¡Bienvenido a Tu Patio de Juegos!
            </Typography>
            <Typography variant="h5" className="hero-subtitle">
              ¡Aprende, crece y diviértete en esta increíble aventura educativa hecha especialmente para ti!
            </Typography>
            <Button component={Link} to="/register" variant="contained" size="large" className="hero-button">
              ¡Comienza Tu Aventura!
            </Button>
          </div>
        </Container>
      </Box>

      {/* Sección de Características */}
      <Container className="features-section">
        <Typography variant="h3" className="section-title">
          ¿Por qué te va a encantar?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <AnimateOnScroll>
                <Card className="feature-card">
                  <Box
                    component={feature.path ? Link : "div"}
                    to={feature.path}
                    style={{ textDecoration: "none", width: "100%", height: "100%" }}
                  >
                    <CardContent>
                      <Box className="feature-icon">{feature.icon}</Box>
                      <Typography variant="h5" className="feature-title">
                        {feature.title}
                      </Typography>
                      <Typography className="feature-description">{feature.description}</Typography>
                    </CardContent>
                  </Box>
                </Card>
              </AnimateOnScroll>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Sección de Materias */}
      <Container className="subjects-section">
        <Typography variant="h3" className="section-title">
          Nuestras Aventuras de Aprendizaje
        </Typography>
        <Grid container spacing={4}>
          {subjects.map((subject, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <AnimateOnScroll>
                <Card className="subject-card">
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      {subject.icon}
                      <Typography variant="h5" className="subject-title" ml={1}>
                        {subject.title}
                      </Typography>
                    </Box>
                    <Typography className="subject-description">{subject.description}</Typography>
                    <Box display="flex" mt={2}>
                      <Button
                        component={Link}
                        to={subject.path}
                        variant="contained"
                        state={{
                          subjectId: index + 1,
                          subjectTitle: subject.title,
                        }}
                        fullWidth
                      >
                        ¡Explorar!
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </AnimateOnScroll>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Sección CTA */}
      <Box className="cta-section">
        <Container>
          <Typography variant="h3" className="cta-title">
            ¿Listo para comenzar tu gran aventura?
          </Typography>
          <Typography variant="h6" className="cta-subtitle">
            ¡Únete a nuestra comunidad de exploradores del conocimiento y comienza a descubrir un mundo lleno de
            diversión!
          </Typography>
          <Button component={Link} to="/register" variant="contained" size="large" className="cta-button">
            ¡Quiero Unirme Ahora!
          </Button>
        </Container>
      </Box>
      <ScrollToTopButton />
      <Footer />

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Home

