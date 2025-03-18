import { Box, Container, Grid, Typography, Link, IconButton } from "@mui/material"
import FacebookIcon from "@mui/icons-material/Facebook"
import TwitterIcon from "@mui/icons-material/Twitter"
import InstagramIcon from "@mui/icons-material/Instagram"
import LinkedInIcon from "@mui/icons-material/LinkedIn"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PhoneIcon from "@mui/icons-material/Phone"
import EmailIcon from "@mui/icons-material/Email"
import SchoolIcon from "@mui/icons-material/School"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import "../styles/Footer.css"

function Footer() {
  return (
    <Box className="footer">
      <div className="footer-decoration-top"></div>

      <Container maxWidth="lg">
        <Box className="footer-logo">
          <SchoolIcon className="footer-logo-icon" />
          <Typography variant="h4" className="footer-logo-text">
            CurioCity
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={4} className="footer-section">
            <Typography variant="h6" className="footer-title">
              <MenuBookIcon className="footer-title-icon" />
              Sobre Nosotros
            </Typography>
            <Typography variant="body2" className="footer-content">
              ¡Somos un equipo de exploradores del conocimiento! Nuestra misión es hacer que aprender sea tan divertido
              como jugar en el recreo. ¡Únete a nuestra aventura educativa llena de sorpresas y descubrimientos!
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4} className="footer-section">
            <Typography variant="h6" className="footer-title">
              <EmojiEventsIcon className="footer-title-icon" />
              Enlaces Mágicos
            </Typography>
            <Box className="footer-links">
              <Link href="/" className="footer-link">
                <span className="footer-link-star">★</span> Inicio
              </Link>
              <Link href="/cursos" className="footer-link">
                <span className="footer-link-star">★</span> Cursos
              </Link>
              <Link href="/about" className="footer-link">
                <span className="footer-link-star">★</span> Sobre Nosotros
              </Link>
              <Link href="/contacto" className="footer-link">
                <span className="footer-link-star">★</span> Contacto
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4} className="footer-section">
            <Typography variant="h6" className="footer-title">
              <PhoneIcon className="footer-title-icon" />
              Contáctanos
            </Typography>
            <Box className="contact-item">
              <LocationOnIcon className="contact-icon" />
              <Typography variant="body2">123 Calle Educación, Ciudad</Typography>
            </Box>
            <Box className="contact-item">
              <PhoneIcon className="contact-icon" />
              <Typography variant="body2">+1 234 567 890</Typography>
            </Box>
            <Box className="contact-item">
              <EmailIcon className="contact-icon" />
              <Typography variant="body2">info@escuelavirtual.com</Typography>
            </Box>

            <Box className="social-icons">
              <IconButton className="social-icon facebook-icon">
                <FacebookIcon />
              </IconButton>
              <IconButton className="social-icon twitter-icon">
                <TwitterIcon />
              </IconButton>
              <IconButton className="social-icon instagram-icon">
                <InstagramIcon />
              </IconButton>
              <IconButton className="social-icon linkedin-icon">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Box className="footer-bottom">
          <Typography variant="body2">
            © {new Date().getFullYear()} CurioCity. Todos los derechos reservados.
          </Typography>
          <Typography variant="body2" className="footer-tagline">
            ¡Donde aprender es una aventura!
          </Typography>
        </Box>
      </Container>

      <div className="footer-bubbles">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="bubble"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 7}s`,
              animationDelay: `${Math.random() * 2}s`,
              width: `${20 + Math.random() * 30}px`,
              height: `${20 + Math.random() * 30}px`,
            }}
          ></div>
        ))}
      </div>
    </Box>
  )
}

export default Footer

