import { useState, useEffect } from 'react';
import {
  Box,
  Snackbar,
  Alert,
  GridLegacy as Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  IconButton,
  Avatar,
  alpha,
  Chip,
  Stack,
  useTheme
} from '@mui/material';

// Icons
import PetsIcon from '@mui/icons-material/Pets';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ParkIcon from '@mui/icons-material/Park';
import LogoutIcon from '@mui/icons-material/Logout';

// Components
import AdminPageLayout from '../components/admin/AdminPageLayout';
import DogManagementTab from '../components/admin/DogManagementTab';
import VolunteerManagementTab from '../components/admin/VolunteerManagementTab';
import { AdminThemeProvider } from '../contexts/AdminThemeContext';

// Auth service
import authService from '../services/authService';

// Navigation
import { useNavigate } from 'react-router-dom';

// Mock data and API
import { dogApi, volunteerApi } from '../services/api';

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

// Dashboard component
const Dashboard = ({ showNotification }: { showNotification: (message: string, severity: 'success' | 'error') => void }) => {
  const theme = useTheme();
  const [stats, setStats] = useState({
    totalDogs: 0,
    adoptedDogs: 0,
    totalVolunteers: 0,
    pendingApplications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<Array<{
    id: number | string;
    action: string;
    subject: string;
    timestamp: string;
    icon: React.ReactNode;
  }>>([]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch dogs data
        const dogsData = await dogApi.getAllDogs();
        
        // Fetch volunteers data
        const volunteersData = await volunteerApi.getAllVolunteers();
        
        // Calculate statistics
        const adoptedDogs = dogsData.filter(dog => dog.status === 'adopted').length;
        const pendingApplications = volunteersData.filter(vol => vol.status === 'pending').length;
        
        setStats({
          totalDogs: dogsData.length,
          adoptedDogs,
          totalVolunteers: volunteersData.length,
          pendingApplications,
        });

        // Generate actual activity data from the API data
        const activityItems: Array<{
          id: number | string;
          action: string;
          subject: string;
          timestamp: string;
          icon: React.ReactNode;
        }> = [];
        
        // Add most recent dogs (up to 2)
        const sortedDogs = [...dogsData].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : Date.now();
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : Date.now();
          return dateB - dateA;
        }).slice(0, 2);
        
        sortedDogs.forEach((dog, index) => {
          activityItems.push({
            id: dog._id || dog.id || `dog-${index}`,
            action: dog.status === 'adopted' ? 'Dog Adopted' : 'Dog Added',
            subject: dog.name,
            timestamp: formatTimeAgo(dog.createdAt || new Date().toISOString()),
            icon: dog.status === 'adopted' ? <ParkIcon /> : <PetsIcon />
          });
        });
        
        // Add most recent volunteers (up to 2)
        const sortedVolunteers = [...volunteersData].sort((a, b) => {
          const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : Date.now();
          const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : Date.now();
          return dateB - dateA;
        }).slice(0, 2);
        
        sortedVolunteers.forEach((volunteer, index) => {
          activityItems.push({
            id: volunteer._id || volunteer.id || `volunteer-${index}`,
            action: volunteer.status === 'approved' ? 'Volunteer Approved' : 'Volunteer Application',
            subject: volunteer.name,
            timestamp: formatTimeAgo(volunteer.submittedAt || new Date().toISOString()),
            icon: <VolunteerActivismIcon />
          });
        });
        
        // Sort all activities by timestamp (most recent first)
        const sortedActivity = activityItems.sort((a, b) => {
          // Extract time information from the "X time ago" format
          const aTime = parseTimeAgo(a.timestamp);
          const bTime = parseTimeAgo(b.timestamp);
          return aTime - bTime;
        });
        
        setRecentActivity(sortedActivity);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        showNotification('Failed to load dashboard data', 'error');
        
        // Fallback to mock data if API fails
        setRecentActivity([
          { id: 1, action: 'Dog Added', subject: 'Buddy', timestamp: '2 hours ago', icon: <PetsIcon /> },
          { id: 2, action: 'Volunteer Approved', subject: 'John Doe', timestamp: '1 day ago', icon: <VolunteerActivismIcon /> },
          { id: 3, action: 'Dog Adopted', subject: 'Max', timestamp: '3 days ago', icon: <ParkIcon /> },
          { id: 4, action: 'Volunteer Application', subject: 'Sarah Wilson', timestamp: '5 days ago', icon: <PersonAddAltIcon /> },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [showNotification]);
  
  // Helper function to format timestamps as "X time ago"
  const formatTimeAgo = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    // Time intervals in seconds
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    if (seconds < intervals.minute) {
      return 'just now';
    }
    
    let counter;
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      counter = Math.floor(seconds / secondsInUnit);
      if (counter > 0) {
        return `${counter} ${unit}${counter === 1 ? '' : 's'} ago`;
      }
    }
    
    return 'just now';
  };
  
  // Helper function to parse "X time ago" format back to milliseconds (for sorting)
  const parseTimeAgo = (timeAgo: string): number => {
    if (timeAgo === 'just now') return 0;
    
    const matches = timeAgo.match(/^(\d+)\s+(\w+)s?\s+ago$/);
    if (!matches) return Number.MAX_SAFE_INTEGER;
    
    const amount = parseInt(matches[1], 10);
    const unit = matches[2];
    
    const unitToSeconds = {
      'minute': 60,
      'hour': 3600,
      'day': 86400,
      'week': 604800,
      'month': 2592000,
      'year': 31536000
    };
    
    return (unitToSeconds[unit as keyof typeof unitToSeconds] || 0) * amount;
  };

  // Recent activity data (actual data loaded from API)
  const displayedActivity = recentActivity.length > 0 ? recentActivity.slice(0, 4) : [
    { id: 1, action: 'Loading...', subject: '', timestamp: '', icon: <RefreshIcon /> }
  ];

  return (
    <Box>
      {/* Stats Overview */}
      <Grid container spacing={3}>
        {/* Total Dogs */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ height: '100%', borderRadius: 3, position: 'relative', overflow: 'visible' }}>
            <CardContent sx={{ p: 3, pb: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mb: 2 
              }}>
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.15), 
                    color: theme.palette.primary.main,
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                  }}
                >
                  <PetsIcon />
                </Avatar>
                <IconButton 
                  size="small" 
                  sx={{ 
                    position: 'absolute', 
                    top: 12, 
                    right: 12,
                    color: 'text.secondary',
                  }}
                >
                  <MoreHorizIcon fontSize="small" />
                </IconButton>
              </Box>
              
              <Typography variant="h3" component="div" fontWeight="bold" sx={{ mb: 0.5 }}>
                {loading ? '...' : stats.totalDogs}
              </Typography>
              
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Total Dogs
              </Typography>
              
              <Chip 
                size="small" 
                icon={<TrendingUpIcon fontSize="small" />} 
                label="12% Increase" 
                sx={{ 
                  mt: 1, 
                  bgcolor: alpha(theme.palette.success.main, 0.1), 
                  color: theme.palette.success.main,
                  fontWeight: 500,
                  borderRadius: 1,
                }} 
              />
            </CardContent>
          </Card>
        </Grid>
        
        {/* Adopted Dogs */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ height: '100%', borderRadius: 3, position: 'relative', overflow: 'visible' }}>
            <CardContent sx={{ p: 3, pb: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mb: 2 
              }}>
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(theme.palette.success.main, 0.15), 
                    color: theme.palette.success.main,
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                  }}
                >
                  <ParkIcon />
                </Avatar>
                <IconButton 
                  size="small" 
                  sx={{ 
                    position: 'absolute', 
                    top: 12, 
                    right: 12,
                    color: 'text.secondary',
                  }}
                >
                  <MoreHorizIcon fontSize="small" />
                </IconButton>
              </Box>
              
              <Typography variant="h3" component="div" fontWeight="bold" sx={{ mb: 0.5 }}>
                {loading ? '...' : stats.adoptedDogs}
              </Typography>
              
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Adopted Dogs
              </Typography>
              
              <Chip 
                size="small" 
                icon={<TrendingUpIcon fontSize="small" />} 
                label="8% Increase" 
                sx={{ 
                  mt: 1, 
                  bgcolor: alpha(theme.palette.success.main, 0.1), 
                  color: theme.palette.success.main,
                  fontWeight: 500,
                  borderRadius: 1,
                }} 
              />
            </CardContent>
          </Card>
        </Grid>
        
        {/* Total Volunteers */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ height: '100%', borderRadius: 3, position: 'relative', overflow: 'visible' }}>
            <CardContent sx={{ p: 3, pb: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mb: 2 
              }}>
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(theme.palette.info.main, 0.15), 
                    color: theme.palette.info.main,
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                  }}
                >
                  <VolunteerActivismIcon />
                </Avatar>
                <IconButton 
                  size="small" 
                  sx={{ 
                    position: 'absolute', 
                    top: 12, 
                    right: 12,
                    color: 'text.secondary',
                  }}
                >
                  <MoreHorizIcon fontSize="small" />
                </IconButton>
              </Box>
              
              <Typography variant="h3" component="div" fontWeight="bold" sx={{ mb: 0.5 }}>
                {loading ? '...' : stats.totalVolunteers}
              </Typography>
              
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Total Volunteers
              </Typography>
              
              <Chip 
                size="small" 
                icon={<TrendingUpIcon fontSize="small" />} 
                label="15% Increase" 
                sx={{ 
                  mt: 1, 
                  bgcolor: alpha(theme.palette.success.main, 0.1), 
                  color: theme.palette.success.main,
                  fontWeight: 500,
                  borderRadius: 1,
                }} 
              />
            </CardContent>
          </Card>
        </Grid>
        
        {/* Pending Applications */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ height: '100%', borderRadius: 3, position: 'relative', overflow: 'visible' }}>
            <CardContent sx={{ p: 3, pb: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mb: 2 
              }}>
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(theme.palette.warning.main, 0.15), 
                    color: theme.palette.warning.main,
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                  }}
                >
                  <PersonAddAltIcon />
                </Avatar>
                <IconButton 
                  size="small" 
                  sx={{ 
                    position: 'absolute', 
                    top: 12, 
                    right: 12,
                    color: 'text.secondary',
                  }}
                >
                  <MoreHorizIcon fontSize="small" />
                </IconButton>
              </Box>
              
              <Typography variant="h3" component="div" fontWeight="bold" sx={{ mb: 0.5 }}>
                {loading ? '...' : stats.pendingApplications}
              </Typography>
              
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Pending Applications
              </Typography>
              
              <Chip 
                size="small" 
                icon={<TrendingDownIcon fontSize="small" />} 
                label="3% Decrease" 
                sx={{ 
                  mt: 1, 
                  bgcolor: alpha(theme.palette.error.main, 0.1), 
                  color: theme.palette.error.main,
                  fontWeight: 500,
                  borderRadius: 1,
                }} 
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions and Recent Activity */}
      <Grid container spacing={3} sx={{ mt: 0.5 }}>
        {/* Quick Actions */}
        <Grid item xs={12} md={5}>
          <Card elevation={0} sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="600">
                  Quick Actions
                </Typography>
                <IconButton size="small">
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Stack spacing={2}>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />} 
                  fullWidth 
                  sx={{ 
                    py: 1.5, 
                    borderRadius: 2,
                    backgroundColor: theme.palette.primary.main,
                  }}
                >
                  Add New Dog
                </Button>
                
                <Button 
                  variant="outlined" 
                  startIcon={<PersonAddAltIcon />} 
                  fullWidth 
                  sx={{ 
                    py: 1.5, 
                    borderRadius: 2,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                  }}
                >
                  Add New Volunteer
                </Button>
                
                <Button 
                  variant="outlined" 
                  startIcon={<VolunteerActivismIcon />} 
                  fullWidth 
                  sx={{ 
                    py: 1.5, 
                    borderRadius: 2,
                    borderColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.main,
                  }}
                >
                  Review Applications
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Activity */}
        <Grid item xs={12} md={7}>
          <Card elevation={0} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="600">
                  Recent Activity
                </Typography>
                <Button 
                  variant="text" 
                  size="small" 
                  sx={{ 
                    color: theme.palette.primary.main,
                    fontWeight: 600
                  }}
                >
                  View All
                </Button>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Stack spacing={2} divider={<Divider />}>
                {displayedActivity.map((activity) => (
                  <Box key={activity.id} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        borderRadius: 2,
                      }}
                    >
                      {activity.icon}
                    </Avatar>
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {activity.action}: <Box component="span" sx={{ color: theme.palette.primary.main }}>{activity.subject}</Box>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.timestamp}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const AdminPage = () => {
  // Tab state
  const [tabValue, setTabValue] = useState(-1);
  const navigate = useNavigate();
  
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

  // Handle logout
  const handleLogout = () => {
    authService.logout();
    showNotification('Logged out successfully', 'success');
    
    // Redirect to login after a short delay
    setTimeout(() => {
      navigate('/admin-login-7a91b523e61');
    }, 1000);
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
        actions={[
          <Button
            key="logout"
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ borderRadius: 2 }}
          >
            Logout
          </Button>
        ]}
      >
        {/* Dashboard */}
        <TabPanel value={tabValue} index={-1}>
          <Dashboard showNotification={showNotification} />
        </TabPanel>
        
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
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbarSeverity}
            sx={{ 
              width: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              borderRadius: 2
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </AdminPageLayout>
    </AdminThemeProvider>
  );
};

export default AdminPage; 