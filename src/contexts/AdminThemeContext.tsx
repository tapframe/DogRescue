import React, { createContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { ThemeProvider, createTheme, PaletteMode } from '@mui/material';

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
            default: mode === 'light' ? '#f5f5f5' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
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