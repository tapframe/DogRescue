import React, { ReactNode, useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  GridLegacy as Grid, 
  Paper,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Badge,
  CssBaseline,
  alpha,
  Switch,
  Tooltip,
  Menu,
  MenuItem,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAdminTheme } from '../../hooks/useAdminTheme';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

interface AdminPageLayoutProps {
  children: ReactNode;
  title?: string;
  currentTab?: number;
  onTabChange?: (tabIndex: number) => void;
  actions?: ReactNode[];
}

// Drawer width
const drawerWidth = 280;

// Interface for Admin User
interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
}

const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({ 
  children, 
  title = 'Admin Dashboard',
  currentTab = 0,
  onTabChange,
  actions
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, toggleColorMode } = useAdminTheme();
  const isDarkMode = mode === 'dark';
  
  // Current admin user state
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Menu states
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState<null | HTMLElement>(null);
  
  const isNotificationMenuOpen = Boolean(notificationAnchorEl);
  const isUserMenuOpen = Boolean(userMenuAnchorEl);
  const isMoreMenuOpen = Boolean(moreMenuAnchorEl);

  // Fetch current admin user on component mount
  useEffect(() => {
    const fetchAdminUser = async () => {
      setIsLoading(true);
      try {
        // Get admin user from auth service
        const adminData = authService.getCurrentAdmin();
        
        if (adminData) {
          setCurrentAdmin(adminData);
        } else {
          // If no stored user, check if token is valid and get user details
          const isValid = await authService.verifyToken();
          if (!isValid) {
            // If token is invalid, redirect to login
            console.log('Invalid token, redirecting to login...');
            authService.logout();
            navigate('/admin-login-7a91b523e61');
          } else {
            // Token is valid, load the admin user data again (should be set by verifyToken)
            const refreshedAdmin = authService.getCurrentAdmin();
            if (refreshedAdmin) {
              setCurrentAdmin(refreshedAdmin);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching admin user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdminUser();
  }, [navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleNavClick = (index: number) => {
    if (onTabChange) {
      onTabChange(index);
    }
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleThemeToggle = () => {
    toggleColorMode();
  };
  
  // Handle menu opens
  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };
  
  const handleMoreMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMoreMenuAnchorEl(event.currentTarget);
  };
  
  // Handle menu closes
  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };
  
  const handleMoreMenuClose = () => {
    setMoreMenuAnchorEl(null);
  };
  
  // Handle logout
  const handleLogout = () => {
    authService.logout();
    navigate('/admin-login-7a91b523e61');
    handleUserMenuClose();
  };

  const menuItems = [
    { name: 'Dashboard', icon: <DashboardIcon />, index: -1 },
    { name: 'Dog Management', icon: <PetsIcon />, index: 0 },
    { name: 'Volunteer Management', icon: <VolunteerActivismIcon />, index: 1 },
    { name: 'Rescue Submissions', icon: <PetsIcon />, index: 2 },
    { name: 'Adoption Applications', icon: <PersonIcon />, index: 3 },
  ];

  const drawer = (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      {/* Brand Header */}
      <Box sx={{ 
        px: 3,
        py: 2.5,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-start',
      }}>
        <Avatar 
          sx={{ 
            bgcolor: alpha(theme.palette.primary.main, 0.9), 
            width: 40, 
            height: 40, 
            borderRadius: 2,
            mr: 1.5,
            boxShadow: '0 4px 12px rgba(63, 81, 181, 0.15)'
          }}
        >
          <PetsIcon sx={{ fontSize: 24 }} />
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="bold" color="primary.main">
          Dog Rescue
        </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            Admin Portal
        </Typography>
        </Box>
      </Box>
      
      <Divider sx={{ mt: 1, opacity: 0.6 }} />
      
      {/* Navigation */}
      <Box sx={{ flexGrow: 1, mt: 2, overflow: 'auto', px: 2 }}>
        <Typography variant="overline" sx={{ px: 1, color: 'text.secondary', fontWeight: 600, letterSpacing: 1 }}>
          MAIN MENU
        </Typography>
        
        <List component="nav" sx={{ mt: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.name} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={currentTab === item.index}
                onClick={() => handleNavClick(item.index)}
                sx={{ 
                  borderRadius: 2,
                  py: 1.2,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    }
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.light, 0.1),
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 40,
                  color: currentTab === item.index ? 'white' : theme.palette.primary.main,
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.name} 
                  primaryTypographyProps={{ 
                    fontWeight: currentTab === item.index ? 600 : 500,
                    fontSize: '0.95rem'
                  }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Typography variant="overline" sx={{ px: 1, mt: 4, pt: 2, display: 'block', color: 'text.secondary', fontWeight: 600, letterSpacing: 1 }}>
          SETTINGS
        </Typography>
        
        <List sx={{ mt: 1 }}>
          {/* Preferences button removed */}
        </List>

        {/* Theme Switcher */}
        <Box sx={{ px: 1, mt: 2 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {isDarkMode ? 
                    <Brightness4Icon color="primary" sx={{ fontSize: 20 }} /> : 
                    <Brightness7Icon color="primary" sx={{ fontSize: 20 }} />
                  }
              <Typography variant="body2" sx={{ ml: 1.5, fontWeight: 'medium' }}>
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </Typography>
            </Box>
            <Switch
              checked={isDarkMode}
              onChange={handleThemeToggle}
              size="small"
              color="primary"
            />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
      
      {/* User Section */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid', 
        borderColor: 'divider',
        mt: 'auto'
      }}>
        <Box sx={{ 
          p: 2, 
          borderRadius: 2, 
          bgcolor: isDarkMode ? alpha(theme.palette.background.paper, 0.4) : alpha(theme.palette.primary.main, 0.04),
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: isDarkMode ? alpha(theme.palette.background.paper, 0.6) : alpha(theme.palette.primary.main, 0.08),
          }
        }}
        onClick={handleUserMenuOpen}
        >
          <Avatar sx={{ 
            width: 40, 
            height: 40, 
            bgcolor: theme.palette.primary.main
          }}>
            {currentAdmin?.name ? currentAdmin.name.charAt(0).toUpperCase() : <PersonIcon />}
          </Avatar>
          <Box sx={{ ml: 1.5, overflow: 'hidden' }}>
            <Typography variant="subtitle2" fontWeight="medium" noWrap>
              {isLoading ? 'Loading...' : (currentAdmin?.name || currentAdmin?.username || 'Admin User')}
            </Typography>
            <Typography variant="caption" color="textSecondary" noWrap>
              {isLoading ? '' : (currentAdmin?.email || 'admin@example.com')}
            </Typography>
          </Box>
          <KeyboardArrowDownIcon sx={{ ml: 'auto', fontSize: 20, color: 'text.secondary' }} />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      
      {/* AppBar */}
      <AppBar 
        position="fixed" 
        color="default"
        elevation={0}
        sx={{ 
          width: { md: `calc(100% - ${drawerWidth}px)` }, 
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(8px)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ height: 70 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography variant="h6" noWrap component="div" sx={{ 
              color: 'text.primary',
              fontWeight: 600
            }}>
              {title}
            </Typography>
            
            {/* Render custom actions if provided */}
            {actions && actions.length > 0 && (
              <Stack direction="row" spacing={2} sx={{ ml: 'auto', mr: 2 }}>
                {actions.map((action, index) => (
                  <Box key={index}>{action}</Box>
                ))}
              </Stack>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Notifications button removed */}
            
            <IconButton 
              size="large"
              edge="end" 
              color="inherit" 
              onClick={handleUserMenuOpen}
              sx={{ 
                ml: 1, 
                display: { xs: 'none', md: 'flex' },
                bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.04),
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.1) : alpha(theme.palette.common.black, 0.08),
                }
              }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                {currentAdmin?.name ? currentAdmin.name.charAt(0).toUpperCase() : <PersonIcon sx={{ fontSize: 20 }} />}
              </Avatar>
            </IconButton>
            
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleMoreMenuOpen}
              sx={{ 
                ml: 1, 
                display: { xs: 'flex', md: 'none' },
                bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.04),
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.1) : alpha(theme.palette.common.black, 0.08),
                }
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Notification Menu removed */}
      
      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchorEl}
        open={isUserMenuOpen}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
          <Typography variant="subtitle2">
            {currentAdmin?.name || currentAdmin?.username || 'Admin User'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentAdmin?.email || 'admin@example.com'}
          </Typography>
        </Box>
        <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Logout</Typography>
        </MenuItem>
      </Menu>
      
      {/* Mobile Menu */}
      <Menu
        anchorEl={moreMenuAnchorEl}
        open={isMoreMenuOpen}
        onClose={handleMoreMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            borderRadius: 2,
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* My Profile menu item removed */}
        {/* Settings menu item removed */}
        <MenuItem onClick={handleThemeToggle} sx={{ py: 1.5 }}>
          <ListItemIcon>
            {isDarkMode ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
          </ListItemIcon>
          <Typography variant="body2">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Logout</Typography>
        </MenuItem>
      </Menu>
      
      {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
          keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
            borderRight: 'none',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
            },
          }}
        >
          {drawer}
        </Drawer>

      {/* Drawer - Desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
            boxShadow: 'none',
            border: 'none',
            backgroundImage: 'none',
              borderRight: '1px solid',
              borderColor: 'divider'
            },
          }}
          open
        >
          {drawer}
        </Drawer>

      {/* Main Content */}
      <Box sx={{
        flexGrow: 1,
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        p: 3,
        pt: { xs: 10, md: 11 },
        maxHeight: '100vh',
        overflow: 'auto',
        bgcolor: theme.palette.mode === 'dark' ? 'background.default' : alpha(theme.palette.primary.main, 0.02)
      }}>
        {children}
      </Box>
    </Box>
  );
};

export default AdminPageLayout;