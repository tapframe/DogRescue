import { useContext } from 'react';
import { AdminThemeContext } from '../contexts/AdminThemeContext';

export const useAdminTheme = () => {
  const context = useContext(AdminThemeContext);
  
  if (context === undefined) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider');
  }
  
  return context;
}; 