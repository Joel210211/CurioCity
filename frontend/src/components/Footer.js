import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import '../styles/Footer.css';

function Footer() {
  return (
    <Box className="footer">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4} className="footer-section">
            <Typography variant="h6" className="footer-title">
              Sobre Nosotros
            </Typography>
            <Typography variant="body2" className="footer-content">
              Somos una plataforma educativa dedicada a proporcionar educación de calidad
              a estudiantes de nivel primario, facilitando el aprendizaje a través de
              tecnología innovadora y contenido interactivo.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4} className="footer-section">
            <Typography variant="h6" className="footer-title">
              Enlaces Rápidos
            </Typography>
            <Box className="footer-links">
              <Link href="/">Inicio</Link>
              <Link href="/cursos">Cursos</Link>
              <Link href="/about">Sobre Nosotros</Link>
              <Link href="/contacto">Contacto</Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4} className="footer-section">
            <Typography variant="h6" className="footer-title">
              Contacto
            </Typography>
            <Box className="contact-item">
              <LocationOnIcon />
              <Typography variant="body2">123 Calle Educación, Ciudad</Typography>
            </Box>
            <Box className="contact-item">
              <PhoneIcon />
              <Typography variant="body2">+1 234 567 890</Typography>
            </Box>
            <Box className="contact-item">
              <EmailIcon />
              <Typography variant="body2">info@escuelavirtual.com</Typography>
            </Box>

            <Box className="social-icons">
              <IconButton className="social-icon"><FacebookIcon /></IconButton>
              <IconButton className="social-icon"><TwitterIcon /></IconButton>
              <IconButton className="social-icon"><InstagramIcon /></IconButton>
              <IconButton className="social-icon"><LinkedInIcon /></IconButton>
            </Box>
          </Grid>
        </Grid>

        <Box className="footer-bottom">
          <Typography variant="body2">
            © {new Date().getFullYear()} CurioCity. Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;