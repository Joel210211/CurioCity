import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#ff6b00',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

export default theme;