import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Typography, List, ListItem, ListItemText, Button, Avatar, Grid } from '@mui/material';

function Perfil() {
  const { usuario, logout } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/perfil', {
          headers: {
            'x-auth-token': usuario.token
          }
        });
        const data = await response.json();
        if (data.success) {
          setPerfil(data.perfil);
        }
      } catch (error) {
        console.error('Error al obtener el perfil:', error);
      }
    };

    fetchPerfil();
  }, [usuario]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Perfil de Usuario</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Avatar
            alt="Foto de Perfil"
            src="/ruta/a/la/foto.jpg" // Cambia esta ruta a la ubicación de la foto de perfil
            sx={{ width: 128, height: 128 }}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          {perfil && (
            <>
              <Typography variant="h6">Progreso: {perfil.progreso}%</Typography>
              <Typography variant="h6">Tareas:</Typography>
              <List>
                {perfil.tareas.map((tarea, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={tarea.titulo}
                      secondary={tarea.descripcion}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Perfil;