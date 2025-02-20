import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Collapse,
  Box,
  Alert
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Register.css';

function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: '',
    grado: '',
    especialidad: '',
    experiencia: '',
    hijosRegistrados: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validación de campos según el rol
    if (formData.rol === 'estudiante' && !formData.grado) {
      setError('Por favor seleccione un grado');
      return;
    }

    if (formData.rol === 'profesor' && (!formData.especialidad || !formData.experiencia)) {
      setError('Por favor complete todos los campos para profesores');
      return;
    }

    if (formData.rol === 'padre' && !formData.hijosRegistrados) {
      setError('Por favor ingrese el email del estudiante');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al registrarse');
      }

      console.log('Usuario registrado exitosamente');
      navigate('/login');
    } catch (error) {
      setError(error.message || 'Error al registrarse. Por favor intente nuevamente.');
      console.error('Error al registrarse:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container className="register-container">
      <Paper className="register-paper" elevation={3}>
        <Typography variant="h4" className="register-title">
          Registro de Usuario
        </Typography>
        
        {error && (
          <Alert severity="error" className="error-alert">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <Grid container spacing={2}>
            {/* Campos básicos */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="form-field"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
                className="form-field"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-field"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-field"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirmar Contraseña"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="form-field"
              />
            </Grid>

            {/* Selección de rol */}
            <Grid item xs={12}>
              <FormControl fullWidth required className="form-field">
                <InputLabel>Tipo de Usuario</InputLabel>
                <Select
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  label="Tipo de Usuario"
                >
                  <MenuItem value="estudiante">Estudiante</MenuItem>
                  <MenuItem value="profesor">Profesor</MenuItem>
                  <MenuItem value="padre">Padre/Madre</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Campos específicos para estudiantes */}
            <Grid item xs={12}>
              <Collapse in={formData.rol === 'estudiante'}>
                <TextField
                  fullWidth
                  select
                  label="Grado"
                  name="grado"
                  value={formData.grado}
                  onChange={handleChange}
                  required={formData.rol === 'estudiante'}
                  className="form-field"
                >
                  {['1°', '2°', '3°', '4°', '5°', '6°'].map((grado) => (
                    <MenuItem key={grado} value={grado}>
                      {grado} Primaria
                    </MenuItem>
                  ))}
                </TextField>
              </Collapse>
            </Grid>

            {/* Campos específicos para profesores */}
            <Grid item xs={12}>
              <Collapse in={formData.rol === 'profesor'}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Especialidad"
                      name="especialidad"
                      value={formData.especialidad}
                      onChange={handleChange}
                      required={formData.rol === 'profesor'}
                      placeholder="Ej: Matemáticas, Lenguaje, Ciencias"
                      className="form-field"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Años de Experiencia"
                      name="experiencia"
                      type="number"
                      value={formData.experiencia}
                      onChange={handleChange}
                      required={formData.rol === 'profesor'}
                      className="form-field"
                    />
                  </Grid>
                </Grid>
              </Collapse>
            </Grid>

            {/* Campos específicos para padres */}
            <Grid item xs={12}>
              <Collapse in={formData.rol === 'padre'}>
                <TextField
                  fullWidth
                  label="Email del estudiante registrado"
                  name="hijosRegistrados"
                  value={formData.hijosRegistrados}
                  onChange={handleChange}
                  required={formData.rol === 'padre'}
                  helperText="Ingrese el correo electrónico de su hijo/a registrado en la plataforma"
                  className="form-field"
                />
              </Collapse>
            </Grid>

            {/* Botón de registro */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className="submit-button"
              >
                Registrarse
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Enlaces adicionales */}
        <Box className="additional-links">
          <Typography variant="body2">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="login-link">
              Inicia sesión aquí
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register;