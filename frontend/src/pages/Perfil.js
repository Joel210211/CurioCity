import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Typography, List, ListItem, ListItemText, Button } from '@mui/material';

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
      <Typography variant="h4">Perfil de Usuario</Typography>
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
    </Container>
  );
}

export default Perfil;