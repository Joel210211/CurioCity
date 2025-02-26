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
import Courses from './pages/Cursos';
import Perfil from './pages/Perfil';

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
            <Route 
              path="/cursos" 
              element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              } 
            />
            {/* Rutas para el contenido interactivo */}
            <Route path="/quizzes" element={<InteractiveContent />} />
            <Route path="/games" element={<InteractiveContent />} />
            <Route path="/readings" element={<InteractiveContent />} />
            <Route path="/experiments" element={<InteractiveContent />} />
            <Route path="/perfil" element={<Perfil />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;