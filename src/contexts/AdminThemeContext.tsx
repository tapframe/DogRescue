import React, { createContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { ThemeProvider, createTheme, PaletteMode, alpha } from '@mui/material';

// Create Admin Theme Context
interface AdminThemeContextType {
  toggleColorMode: () => void;
  mode: PaletteMode;
}

export const AdminThemeContext = createContext<AdminThemeContextType>({
  toggleColorMode: () => {},
  mode: 'light',
});

interface AdminThemeProviderProps {
  children: ReactNode;
}

export const AdminThemeProvider: React.FC<AdminThemeProviderProps> = ({ children }) => {
  // Get initial theme from localStorage or default to light
  const getInitialMode = (): PaletteMode => {
    const savedMode = localStorage.getItem('adminThemeMode');
    return (savedMode === 'dark' || savedMode === 'light') ? savedMode as PaletteMode : 'light';
  };

  const [mode, setMode] = useState<PaletteMode>(getInitialMode);

  // Save theme mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminThemeMode', mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          return newMode;
        });
      },
      mode,
    }),
    [mode]
  );

  // Create custom MUI theme for admin section
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#3f51b5', // Indigo
            light: '#757de8',
            dark: '#002984',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#ff6d00', // Orange
            light: '#ff9e40',
            dark: '#c43e00',
            contrastText: '#ffffff',
          },
          background: {
            default: mode === 'light' ? '#f7f9fc' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
          error: {
            main: '#f44336',
          },
          warning: {
            main: '#ff9800',
          },
          info: {
            main: '#29b6f6',
          },
          success: {
            main: '#4caf50',
          },
          text: {
            primary: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)',
            secondary: mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
          },
          h2: {
            fontWeight: 600,
            fontSize: '2rem',
          },
          h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
          },
          h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
          },
          h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
          },
          h6: {
            fontWeight: 600,
            fontSize: '1rem',
          },
          subtitle1: {
            fontSize: '1rem',
            fontWeight: 500,
          },
          subtitle2: {
            fontSize: '0.875rem',
            fontWeight: 500,
          },
          body1: {
            fontSize: '1rem',
          },
          body2: {
            fontSize: '0.875rem',
          },
          button: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
        shape: {
          borderRadius: 10,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: '8px',
                padding: '8px 16px',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 4px 8px 0 rgba(0,0,0,0.1)',
                },
              },
              contained: {
                '&:hover': {
                  boxShadow: '0 6px 12px 0 rgba(0,0,0,0.12)',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                boxShadow: mode === 'light' 
                  ? '0px 2px 8px rgba(0, 0, 0, 0.05)'
                  : '0px 2px 8px rgba(0, 0, 0, 0.2)',
                borderRadius: '12px',
              },
              outlined: {
                border: `1px solid ${mode === 'light' ? '#e0e0e0' : '#424242'}`,
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                borderBottom: `1px solid ${mode === 'light' ? '#f0f0f0' : '#333333'}`,
                padding: '16px 24px',
              },
              head: {
                color: mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                fontWeight: 600,
                background: mode === 'light' ? '#f8f9fa' : '#292929',
              },
            },
          },
          MuiTableRow: {
            styleOverrides: {
              root: {
                '&:hover': {
                  backgroundColor: mode === 'light' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.02)',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: '12px',
                padding: '12px',
              },
            },
          },
          MuiCardContent: {
            styleOverrides: {
              root: {
                padding: '24px',
                '&:last-child': {
                  paddingBottom: '24px',
                },
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                border: 'none',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: '6px',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <AdminThemeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </AdminThemeContext.Provider>
  );
}; 