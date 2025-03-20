import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Navbar() {
  const { usuario, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  // Para las burbujas decorativas
  useEffect(() => {
    // Crear burbujas decorativas
    const createBubbles = () => {
      const bubbleContainer = document.querySelector('.navbar-bubbles');
      if (!bubbleContainer) return;
      
      bubbleContainer.innerHTML = '';
      
      const bubbleCount = 10;
      for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('navbar-bubble');
        
        // Propiedades aleatorias
        const size = Math.random() * 30 + 10;
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 5;
        const delay = Math.random() * 5;
        
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${left}%`;
        bubble.style.animationDuration = `${duration}s`;
        bubble.style.animationDelay = `${delay}s`;
        
        bubbleContainer.appendChild(bubble);
      }
    };
    
    createBubbles();
    
    // Limpiar burbujas al desmontar
    return () => {
      const bubbleContainer = document.querySelector('.navbar-bubbles');
      if (bubbleContainer) {
        bubbleContainer.innerHTML = '';
      }
    };
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const navItems = usuario ? [
    { text: 'Cerrar Sesión', action: handleLogout },
  ] : [
    { text: 'Iniciar Sesión', path: '/login' },
    { text: 'Registrarse', path: '/register' }
  ];

  const drawer = (
    <List className="mobile-nav-list">
      {usuario && (
        <>
          <ListItem onClick={handleDrawerToggle}>
            <ListItemText>
              <Link to="/perfil" className="mobile-nav-link">
                Perfil
              </Link>
            </ListItemText>
          </ListItem>
          <ListItem onClick={handleDrawerToggle}>
            <ListItemText>
              <Link to="/cursos" className="mobile-nav-link">
                Cursos
              </Link>
            </ListItemText>
          </ListItem>
        </>
      )}
      {navItems.map((item) => (
        <ListItem 
          key={item.text} 
          onClick={() => {
            if (item.action) {
              item.action();
            }
            handleDrawerToggle();
          }}
        >
          <ListItemText>
            {item.path ? (
              <Link to={item.path} className="mobile-nav-link">
                {item.text}
              </Link>
            ) : (
              <span className="mobile-nav-link">{item.text}</span>
            )}
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );

  return (
    <AppBar position="sticky" className="navbar">
      {/* Contenedor de burbujas decorativas */}
      <div className="navbar-bubbles"></div>
      
      <Toolbar className="toolbar">
        <IconButton edge="start" color="inherit" onClick={handleBack} aria-label="volver" className="back-button">
          <ArrowBackIcon />
        </IconButton>
        <Typography 
          component={Link} 
          to="/" 
          className="navbar-brand"
          variant="h4"
          sx={{ flexGrow: 1, marginLeft: 1 }}
        >
          <span className="curio">Curio</span>
          <span className="city">City</span>
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className="menu-button"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              variant="temporary"
              anchor="right"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: 'drawer-paper'
              }}
              ModalProps={{
                keepMounted: true // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </>
        ) : (
          <Box className="nav-links">
            {navItems.map((item) => (
              item.path ? (
                <Button 
                  key={item.text}
                  component={Link} 
                  to={item.path} 
                  className="nav-button"
                >
                  {item.text}
                </Button>
              ) : (
                <Button 
                  key={item.text}
                  onClick={item.action} 
                  className="nav-button"
                >
                  {item.text}
                </Button>
              )
            ))}
            {usuario && (
              <>
                <Button color="inherit" onClick={handleMenu} className="account-button">
                  Mi Cuenta
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  className="account-menu"
                  PaperProps={{
                    className: 'account-menu'
                  }}
                >
                  <MenuItem component={Link} to="/perfil" onClick={handleClose} className="menu-item">
                    Perfil
                  </MenuItem>
                  <MenuItem component={Link} to="/cursos" onClick={handleClose} className="menu-item">
                    Cursos
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;