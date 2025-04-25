import { useState } from 'react';
import {
  Box,
  Snackbar,
  Alert
} from '@mui/material';

// Components
import AdminPageLayout from '../components/admin/AdminPageLayout';
import DogManagementTab from '../components/admin/DogManagementTab';
import VolunteerManagementTab from '../components/admin/VolunteerManagementTab';
import { AdminThemeProvider } from '../contexts/AdminThemeContext';

// Tab Panel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminPage = () => {
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Handle tab change
  const handleTabChange = (newValue: number) => {
    setTabValue(newValue);
  };
  
  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Handle notification display
  const showNotification = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Get the current tab title
  const getTabTitle = () => {
    switch (tabValue) {
      case 0:
        return 'Dog Management';
      case 1:
        return 'Volunteer Management';
      default:
        return 'Dashboard';
    }
  };

  return (
    <AdminThemeProvider>
      <AdminPageLayout 
        title={getTabTitle()}
        currentTab={tabValue}
        onTabChange={handleTabChange}
      >
        {/* Dogs Tab */}
        <TabPanel value={tabValue} index={0}>
          <DogManagementTab showNotification={showNotification} />
        </TabPanel>
        
        {/* Volunteers Tab */}
        <TabPanel value={tabValue} index={1}>
          <VolunteerManagementTab showNotification={showNotification} />
        </TabPanel>
        
        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </AdminPageLayout>
    </AdminThemeProvider>
  );
};

export default AdminPage; 