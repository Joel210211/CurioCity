import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';

// Componentes
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import InteractiveContent from './pages/InteractiveContent';
import ProfesoresExpertos from './pages/ProfesoresExpertos';
import ProtectedRoute from './components/ProtectedRoute';
import Cursos from './pages/Cursos';
import Perfil from './pages/Perfil';
import Matematicas from './components/Matematicas';
import Lengua from './components/Lengua';
import Plastica from './components/Plastica';
import Musica from './components/Musica';
import Ingles from './components/Ingles';
import Ciencias from './components/Ciencias';
import ContenidoPorGrado from './components/ContenidoPorGrado';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/interactive-content" element={<InteractiveContent />} />
            <Route path="/profesores-expertos" element={<ProfesoresExpertos />} />
            <Route path="/cursos" element={<Cursos />} />
            {/* Rutas para el contenido interactivo */}
            <Route path="/quizzes" element={<InteractiveContent />} />
            <Route path="/games" element={<InteractiveContent />} />
            <Route path="/readings" element={<InteractiveContent />} />
            <Route path="/experiments" element={<InteractiveContent />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/matematicas" element={<Matematicas />} />
            <Route path="/lengua" element={<Lengua />} />
            <Route path="/plastica" element={<Plastica />} />
            <Route path="/musica" element={<Musica />} />
            <Route path="/ingles" element={<Ingles />} />
            <Route path="/ciencias" element={<Ciencias />} />
            <Route path="/matematicas/:grado" element={<ContenidoPorGrado />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;