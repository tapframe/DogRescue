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
  FormGroup,
  FormControlLabel,
  Tooltip
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
import { useAdminTheme } from '../../hooks/useAdminTheme';

interface AdminPageLayoutProps {
  children: ReactNode;
  title?: string;
  currentTab?: number;
  onTabChange?: (tabIndex: number) => void;
}

// Drawer width
const drawerWidth = 280;

const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({ 
  children, 
  title = 'Admin Dashboard',
  currentTab = 0,
  onTabChange
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, toggleColorMode } = useAdminTheme();
  const isDarkMode = mode === 'dark';

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

  const menuItems = [
    { name: 'Overview', icon: <DashboardIcon />, index: -1 },
    { name: 'Dog Management', icon: <PetsIcon />, index: 0 },
    { name: 'Volunteer Management', icon: <VolunteerActivismIcon />, index: 1 },
  ];

  const drawer = (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      {/* Brand Header */}
      <Box sx={{ 
        p: 3,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-start',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <PetsIcon sx={{ color: 'primary.main', fontSize: 32, mr: 1 }} />
        <Typography variant="h6" fontWeight="bold" color="primary">
          Dog Rescue
        </Typography>
        <Typography variant="subtitle2" sx={{ ml: 1, opacity: 0.7 }}>
          Admin
        </Typography>
      </Box>
      
      {/* Navigation */}
      <Box sx={{ flexGrow: 1, mt: 2, overflow: 'auto' }}>
        <List component="nav" sx={{ px: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.name} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={currentTab === item.index}
                onClick={() => handleNavClick(item.index)}
                sx={{ 
                  borderRadius: 2,
                  py: 1.2,
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    color: 'primary.main',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.18),
                    }
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.light, 0.08),
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.name} 
                  primaryTypographyProps={{ 
                    fontWeight: currentTab === item.index ? 'medium' : 'normal'
                  }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Theme Switcher */}
        <Box sx={{ px: 2, mt: 2 }}>
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isDarkMode ? <Brightness4Icon color="primary" /> : <Brightness7Icon color="primary" />}
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
          </Paper>
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
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          display: 'flex',
          alignItems: 'center'
        }}>
          <Avatar sx={{ 
            width: 40, 
            height: 40, 
            bgcolor: 'primary.main'
          }}>
            <PersonIcon />
          </Avatar>
          <Box sx={{ ml: 1.5 }}>
            <Typography variant="subtitle2" fontWeight="medium">Admin User</Typography>
            <Typography variant="caption" color="textSecondary">admin@example.com</Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <IconButton size="small">
              <SettingsIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" color="inherit" sx={{ ml: 0.5 }}>
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Box>
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
          <Typography variant="h6" noWrap component="div" sx={{ 
            flexGrow: 1,
            color: 'text.primary',
            fontWeight: 'medium'
          }}>
            {title}
          </Typography>
          
          {/* Mode toggle for mobile */}
          <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
            <IconButton
              onClick={handleThemeToggle}
              color="inherit"
              sx={{
                ml: 1,
                display: { xs: 'flex', sm: 'none' },
                borderRadius: 1.5,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                }
              }}
            >
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
          
          {/* Action buttons */}
          <IconButton 
            color="inherit" 
            sx={{ 
              ml: 1,
              borderRadius: 1.5, 
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
              }
            }}
          >
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <IconButton 
            edge="end" 
            color="inherit" 
            sx={{ 
              ml: 1, 
              borderRadius: 1.5,
              display: { xs: 'none', sm: 'flex' }, 
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
              }
            }}
          >
            <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.main' }}>
              <PersonIcon fontSize="small" />
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Side Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile version */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              boxShadow: 'rgb(100 116 139 / 12%) 0px 10px 15px'
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop version */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3 }, 
          width: { md: `calc(100% - ${drawerWidth}px)` },
          maxWidth: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary',
          transition: theme.transitions.create(['background-color', 'color'], {
            duration: theme.transitions.duration.standard,
          }),
        }}
      >
        <Toolbar sx={{ height: 70 }} /> {/* Spacer to push content below app bar */}
        <Box 
          sx={{ 
            flexGrow: 1, 
            overflowY: 'auto',
            pb: 3,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminPageLayout; 