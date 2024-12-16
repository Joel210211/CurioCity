import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  useTheme 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = user ? [
    { text: 'Cursos', path: '/cursos' },
    { text: 'Cerrar Sesión', action: logout }
  ] : [
    { text: 'Iniciar Sesión', path: '/login' },
    { text: 'Registrarse', path: '/register' }
  ];

  const drawer = (
    <List className="mobile-nav-list">
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
      <Toolbar className="toolbar">
        <Typography 
          component={Link} 
          to="/" 
          className="navbar-brand"
          variant="h4"
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
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;