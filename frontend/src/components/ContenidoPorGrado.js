// frontend/src/components/ContenidoPorGrado.js
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { 
    Container, 
    Typography, 
    Grid, 
    Paper,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,

} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BookIcon from '@mui/icons-material/Book';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import QuizIcon from '@mui/icons-material/Quiz';

const ContenidoPorGrado = () => {
    const { grado } = useParams();
    const location = useLocation();
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para obtener el nombre completo de la materia para el título
    const getNombreCompleto = (materiaCorta) => {
        switch (materiaCorta) {
            case 'Lengua':
                return 'Lengua y Literatura';
            case 'Ciencias':
                return 'Ciencias Naturales';
            case 'Música':
                return 'Música y Ritmo';
            case 'Plástica':
                return 'Arte y Creatividad';
            case 'Inglés':
                return 'Inglés Básico';
            default:
                return materiaCorta;
        }
    };

    // Determinar la materia basada en la URL
    const getMateria = (path) => {
        const pathSegments = path.split('/');
        const materiaSegment = pathSegments[1];
        
        const materiaMap = {
            'matematicas': 'Matemáticas',
            'lengua': 'Lengua',
            'ciencias': 'Ciencias',
            'musica': 'Música',
            'plastica': 'Plástica',
            'ingles': 'Inglés'
        };

        return materiaMap[materiaSegment] || '';
    };

    const materia = getMateria(location.pathname);

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                console.log('Iniciando fetchCursos con:', { grado, materia });
                const response = await fetch(`http://localhost:5000/api/cursos/grado/${grado.replace('-', ' ')}`);
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();
                console.log('Datos completos recibidos:', data);
                
                // Verificar la estructura de los datos
                if (!Array.isArray(data)) {
                    console.error('Los datos recibidos no son un array:', data);
                    return;
                }

                const cursosFiltrados = data.filter(curso => {
                    console.log('Analizando curso:', curso);
                    if (curso.contenido) {
                        curso.contenido.forEach((contenido, index) => {
                            console.log(`Contenido ${index}:`, contenido);
                            console.log(`Actividades del contenido ${index}:`, contenido.actividades);
                            if (contenido.actividades) {
                                console.log(`Número de actividades: ${contenido.actividades.length}`);
                                contenido.actividades.forEach((actividad, idx) => {
                                    console.log(`Actividad ${idx}:`, actividad);
                                });
                            }
                        });
                    }
                    
                    if (!curso.grado || !curso.materia) {
                        console.log('Curso sin grado o materia:', curso);
                        return false;
                    }

                    return curso.grado === grado.replace('-', ' ') && curso.materia === materia;
                });
                
                console.log('Cursos filtrados:', cursosFiltrados);
                
                if (cursosFiltrados.length > 0) {
                    console.log('Primer curso filtrado:', cursosFiltrados[0]);
                    console.log('Contenido del primer curso:', cursosFiltrados[0].contenido);
                    if (cursosFiltrados[0].contenido) {
                        cursosFiltrados[0].contenido.forEach((item, index) => {
                            console.log(`Contenido ${index}:`, item);
                            console.log(`Actividades del contenido ${index}:`, item.actividades);
                        });
                    }
                }
                
                setCursos(cursosFiltrados);
            } catch (error) {
                console.error('Error detallado en fetchCursos:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (materia) {
        fetchCursos();
        } else {
            console.log('No se encontró materia válida');
        }
    }, [grado, materia]);

    if (loading) return (
        <Container>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Typography>Cargando contenido...</Typography>
            </Box>
        </Container>
    );

    if (error) return (
        <Container>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Typography color="error">Error: {error}</Typography>
            </Box>
        </Container>
    );

    if (!materia) return (
        <Container>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Typography>Materia no válida</Typography>
            </Box>
        </Container>
    );

    if (cursos.length === 0) {
        return (
            <Container>
                <Box sx={{ py: 4 }}>
                    <Typography variant="h3" gutterBottom>{getNombreCompleto(materia)} - {grado.replace('-', ' ')}</Typography>
                    <Paper sx={{ p: 3, mt: 2 }}>
                        <Typography>No hay cursos disponibles para este grado en {getNombreCompleto(materia)}.</Typography>
                    </Paper>
                </Box>
            </Container>
        );
    }

    return (
        <Container>
            <Box sx={{ py: 4 }}>
                {/* Encabezado */}
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 3, 
                        mb: 4, 
                        backgroundColor: '#f5f5f5',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <Typography 
                        variant="h3" 
                        gutterBottom 
                        sx={{ 
                            color: '#2c3e50',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}
                    >
                        {getNombreCompleto(materia)} - {grado.replace('-', ' ')}
                    </Typography>
                    <Typography 
                        variant="subtitle1" 
                        color="text.secondary"
                        sx={{
                            fontSize: '1.1rem',
                            maxWidth: '800px',
                            lineHeight: 1.6
                        }}
                    >
                        Explora el contenido y recursos disponibles para este nivel
                    </Typography>
                </Paper>

                {/* Contenido Principal */}
            <Grid container spacing={4}>
                    {cursos && cursos.map((curso) => (
                    <Grid item xs={12} key={curso._id}>
                            <Card 
                                elevation={3}
                                sx={{
                                    borderRadius: '10px',
                                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Typography 
                                        variant="h5" 
                                        gutterBottom 
                                        color="primary"
                                        sx={{
                                            fontWeight: 'bold',
                                            mb: 2
                                        }}
                                    >
                                        {curso.titulo}
                                    </Typography>
                                    <Typography 
                                        variant="body1" 
                                        paragraph
                                        sx={{
                                            color: '#666',
                                            fontSize: '1.1rem',
                                            lineHeight: 1.6
                                        }}
                                    >
                                        {curso.descripcion}
                                    </Typography>

                                    <Divider sx={{ my: 3 }} />

                                    {/* Sección de Contenido */}
                                    {curso.contenido && curso.contenido.map((item, index) => (
                                        <Accordion 
                                            key={index} 
                                            sx={{ 
                                                mt: 2,
                                                borderRadius: '8px',
                                                '&:before': {
                                                    display: 'none',
                                                },
                                                boxShadow: 'none',
                                                border: '1px solid #e0e0e0'
                                            }}
                                        >
                                            <AccordionSummary 
                                                expandIcon={<ExpandMoreIcon />}
                                                sx={{
                                                    backgroundColor: '#f8f9fa',
                                                    borderRadius: '8px 8px 0 0'
                                                }}
                                            >
                                                <Typography 
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 500,
                                                        color: '#2c3e50'
                                                    }}
                                                >
                                                    {item.titulo}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails sx={{ p: 3 }}>
                                                <Typography 
                                                    paragraph
                                                    sx={{
                                                        color: '#666',
                                                        mb: 3
                                                    }}
                                                >
                                                    {item.descripcion}
                                                </Typography>

                                                {/* Lista de Recursos */}
                                                {item.recursos && item.recursos.length > 0 && (
                                                    <List>
                                                        {item.recursos.map((recurso, idx) => (
                                                            <ListItem key={idx}>
                                                                <ListItemIcon>
                                                                    {idx % 3 === 0 ? <BookIcon color="primary" /> :
                                                                     idx % 3 === 1 ? <VideoLibraryIcon color="secondary" /> :
                                                                     <AssignmentIcon color="action" />}
                                                                </ListItemIcon>
                                                                <ListItemText 
                                                                    primary={`Recurso ${idx + 1}`}
                                                                    secondary={recurso}
                                                                    sx={{
                                                                        '& .MuiListItemText-primary': {
                                                                            fontWeight: 'bold',
                                                                            color: '#2c3e50'
                                                                        }
                                                                    }}
                                                                />
                                                                <Button 
                                                                    variant="outlined" 
                                                                    size="small" 
                                                                    href={recurso} 
                                                                    target="_blank"
                                                                    sx={{
                                                                        borderRadius: '20px',
                                                                        ml: 2
                                                                    }}
                                                                >
                                                                    Ver Recurso
                                                                </Button>
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                )}

                                                <Divider sx={{ my: 3 }} />

                                                {/* Actividades */}
                                                <Box sx={{ mt: 3 }}>
                                                    <Typography variant="h6" gutterBottom>
                                                        Actividades
                                                    </Typography>
                                                    <Grid container spacing={3}>
                                                        {item.actividades && Array.isArray(item.actividades) && item.actividades.length > 0 ? (
                                                            item.actividades.map((actividad, idx) => (
                                                                <Grid item xs={12} md={6} key={idx}>
                                                                    <Card variant="outlined">
                                                                        <CardContent>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                                                {actividad.tipo === 'ejercicio' && <AssignmentIcon color="primary" />}
                                                                                {actividad.tipo === 'juego' && <SportsEsportsIcon color="secondary" />}
                                                                                {actividad.tipo === 'problema' && <QuizIcon color="warning" />}
                                                                                {actividad.tipo === 'lectura' && <BookIcon color="success" />}
                                                                                <Typography variant="h6" sx={{ ml: 1 }}>
                                                                                    {actividad.titulo}
                                                                                </Typography>
                                                                            </Box>
                                                                            
                                                                            <Typography color="textSecondary" paragraph>
                                                                                {actividad.descripcion}
                                                                            </Typography>

                                                                            {/* Problemas */}
                                                                            {actividad.problemas && Array.isArray(actividad.problemas) && actividad.problemas.length > 0 && (
                                                                                <List>
                                                                                    {actividad.problemas.map((problema, pIdx) => (
                                                                                        <ListItem key={pIdx}>
                                                                                            <ListItemIcon>
                                                                                                <AssignmentIcon />
                                                                                            </ListItemIcon>
                                                                                            <ListItemText primary={problema} />
                                                                                        </ListItem>
                                                                                    ))}
                                                                                </List>
                                                                            )}

                                                                            {/* Palabras */}
                                                                            {actividad.palabras && Array.isArray(actividad.palabras) && actividad.palabras.length > 0 && (
                                                                                <List>
                                                                                    {actividad.palabras.map((palabra, pIdx) => (
                                                                                        <ListItem key={pIdx}>
                                                                                            <ListItemIcon>
                                                                                                <BookIcon />
                                                                                            </ListItemIcon>
                                                                                            <ListItemText primary={palabra} />
                                                                                        </ListItem>
                                                                                    ))}
                                                                                </List>
                                                                            )}

                                                                            <Button 
                                                                                variant="contained" 
                                                                                color="primary"
                                                                                fullWidth
                                                                                sx={{ mt: 2 }}
                                                                                startIcon={<SchoolIcon />}
                                                                            >
                                                                                Comenzar Actividad
                                                                            </Button>
                                                                        </CardContent>
                                                                    </Card>
                                                                </Grid>
                                                            ))
                                                        ) : (
                                                            <Grid item xs={12}>
                                                                <Typography color="textSecondary">
                                                                    No hay actividades disponibles para este contenido.
                                                                </Typography>
                                                            </Grid>
                                                        )}
                                                    </Grid>
                                                </Box>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}

                                    {/* Botones de Acción */}
                                    <Box 
                                        sx={{ 
                                            mt: 4, 
                                            display: 'flex', 
                                            gap: 2,
                                            justifyContent: 'flex-start'
                                        }}
                                    >
                                        <Button 
                                            variant="contained" 
                                            startIcon={<SchoolIcon />}
                                            color="primary"
                                            sx={{
                                                borderRadius: '25px',
                                                padding: '10px 24px',
                                                textTransform: 'none',
                                                fontSize: '1rem',
                                                fontWeight: 'bold',
                                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)'
                                                }
                                            }}
                                        >
                                            Comenzar Curso
                                        </Button>
                                        <Button 
                                            variant="outlined"
                                            color="secondary"
                                            sx={{
                                                borderRadius: '25px',
                                                padding: '10px 24px',
                                                textTransform: 'none',
                                                fontSize: '1rem',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(156, 39, 176, 0.04)'
                                                }
                                            }}
                                        >
                                            Ver Detalles
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                    </Grid>
                ))}
            </Grid>
            </Box>
        </Container>
    );
};

export default ContenidoPorGrado;