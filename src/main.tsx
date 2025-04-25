import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import App from './App';
import './style.css';

// Create a client for React Query
const queryClient = new QueryClient();

function ThemeApp() {
  // Create custom MUI theme with fixed light mode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'light',
          primary: {
            main: '#1976d2', // Blue
            light: '#4791db',
            dark: '#115293',
          },
          secondary: {
            main: '#f57c00', // Orange
            light: '#ff9d3f',
            dark: '#bb4d00',
          },
          background: {
            default: '#f5f5f5',
            paper: '#ffffff',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 700,
          },
          h2: {
            fontWeight: 600,
          },
        },
      }),
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeApp />
    </QueryClientProvider>
  </React.StrictMode>
); 