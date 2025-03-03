import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Typography, List, ListItem, ListItemText, Button, Avatar, Grid, LinearProgress } from '@mui/material';

function Perfil() {
  const { usuario, logout } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        // Simulación de datos de perfil con tareas
        const perfilData = {
          progreso: 50,
          tareas: [
            { titulo: 'Tarea 1', progreso: 20 },
            { titulo: 'Tarea 2', progreso: 50 },
            { titulo: 'Tarea 3', progreso: 80 },
          ],
        };
        setPerfil(perfilData);
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
              <Typography variant="h6">Progreso General: {perfil.progreso}%</Typography>
              <Typography variant="h6" gutterBottom>Tablero de Actividades</Typography>
              <List>
                {perfil.tareas.map((tarea, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={tarea.titulo}
                      secondary={`Progreso: ${tarea.progreso}%`}
                    />
                    <LinearProgress variant="determinate" value={tarea.progreso} />
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