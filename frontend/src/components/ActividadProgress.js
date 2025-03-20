import React, { useState } from 'react';
import { 
    Card, 
    CardContent, 
    Typography, 
    LinearProgress, 
    Box,
    Button,
    Alert,
    Snackbar
} from '@mui/material';
import { useProgress } from '../context/ProgressContext';

const ActividadProgress = ({ actividad, cursoId, contenidoId, indiceActividad }) => {
    const { progresoActividades, iniciarActividad, actualizarProgreso } = useProgress();
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // Verificar si los datos necesarios existen
    if (!progresoActividades) {
        return (
            <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        Cargando progreso...
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    // Si no se proporciona la información necesaria de la actividad
    if (!actividad || !cursoId || contenidoId === undefined || indiceActividad === undefined) {
        return (
            <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        Información de actividad no disponible
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    // Generar ID único para la actividad
    const actividadId = `${cursoId}-${contenidoId}-${indiceActividad}`;

    // Buscar si existe progreso para esta actividad
    const progresoActual = progresoActividades.find(
        p => p.actividad === actividadId
    );

    const handleComenzar = async () => {
        try {
            setError(null);
            console.log('Iniciando actividad con:', {
                cursoId,
                actividadId,
                contenidoId,
                indiceActividad,
                titulo: actividad.titulo
            });
            
            await iniciarActividad(
                cursoId, 
                actividadId, 
                contenidoId,
                indiceActividad,
                actividad.titulo
            );
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error detallado:', error);
            setError(error.message || 'Error al comenzar la actividad');
            setOpenSnackbar(true);
        }
    };

    const handleActualizar = async (nuevoPorcentaje) => {
        try {
            setError(null);
            await actualizarProgreso(
                progresoActual._id,
                nuevoPorcentaje,
                nuevoPorcentaje === 100
            );
            setOpenSnackbar(true);
        } catch (error) {
            setError(error.message || 'Error al actualizar el progreso');
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <>
            <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        {actividad.titulo}
                    </Typography>
                    
                    {progresoActual ? (
                        <Box sx={{ width: '100%', mt: 2 }}>
                            <LinearProgress 
                                variant="determinate" 
                                value={progresoActual.porcentaje} 
                                sx={{ mb: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                                Progreso: {progresoActual.porcentaje}%
                            </Typography>
                            {!progresoActual.completada && (
                                <Button 
                                    variant="contained" 
                                    color="primary"
                                    onClick={() => handleActualizar(progresoActual.porcentaje + 25)}
                                    sx={{ mt: 1 }}
                                >
                                    Actualizar Progreso
                                </Button>
                            )}
                        </Box>
                    ) : (
                        <Button 
                            variant="contained" 
                            color="primary"
                            onClick={handleComenzar}
                            sx={{ mt: 1 }}
                        >
                            Comenzar Actividad
                        </Button>
                    )}
                </CardContent>
            </Card>

            <Snackbar 
                open={openSnackbar} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={error ? "error" : "success"} 
                    sx={{ width: '100%' }}
                >
                    {error || "Operación realizada con éxito"}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ActividadProgress; 