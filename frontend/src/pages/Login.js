import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate('/');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container className="login-container">
      <Paper className="login-paper">
        <Typography variant="h4" className="login-title">
          Iniciar Sesión
        </Typography>
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="submit-button"
            fullWidth
          >
            Iniciar Sesión
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default Login;