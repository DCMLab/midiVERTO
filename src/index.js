//React
import React from 'react';
import ReactDOM from 'react-dom';

//Import components
import App from './App';

//Import material UI components
import { createTheme, ThemeProvider } from '@mui/material/styles';

//Custom theme
const customTheme = createTheme({
  palette: {
    primary: {
      main: '#323232',
    },
    secondary: {
      main: '#fefefe',
    },
    background: {
      default: '#e0e0e0',
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={customTheme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
