// frontend/src/components/Nivel.js
import React from 'react';
import { Typography, Box, Paper, Grid } from '@mui/material';
import '../styles/Nivel.css';
import { Link } from 'react-router-dom';

const Nivel = ({ grado, cursos }) => {
    return (
        <Grid item xs={12} sm={6} md={4}>
            <Paper className="grado-paper" elevation={3}>
                <Box className="grado-content">
                    <Link to={`/matematicas/${grado}`}>
                        <Typography variant="h5">{grado}</Typography>
                    </Link>
                    {cursos.length > 0 ? (
                        <ul>
                            {cursos.map((contenido, idx) => (
                                <li key={idx}>
                                    <Typography variant="subtitle1">{contenido.titulo}</Typography>
                                    <Typography variant="body2">{contenido.descripcion}</Typography>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <Typography>No hay contenido disponible para este grado.</Typography>
                    )}
                </Box>
            </Paper>
        </Grid>
    );
};

export default Nivel;