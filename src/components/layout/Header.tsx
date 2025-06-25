import { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  alpha,
  Avatar,
  Divider,
  Slide,
  Menu,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PetsIcon from '@mui/icons-material/Pets';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import HeartIcon from '@mui/icons-material/Favorite';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { motion } from 'framer-motion';
import { userAuthService, User } from '../../services/userAuthService';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Dogs', path: '/dogs' },
  { name: 'Rescue', path: '/rescue' },
  { name: 'Volunteer', path: '/volunteer' },
  { name: 'Resources', path: '/resources' },
  { name: 'Contact', path: '/contact' }
];

const MotionBox = motion(Box);

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  
  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await userAuthService.verifyToken();
      if (isAuthenticated) {
        setCurrentUser(userAuthService.getCurrentUser());
      } else {
        setCurrentUser(null);
      }
    };
    
    checkAuth();
  }, [location.pathname]);
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setAtTop(currentScrollPos < 10);
      setVisible((prevScrollPos > currentScrollPos) || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Don't render header on admin page
  if (location.pathname === '/admin' || location.pathname.startsWith('/admin/')) {
    return null;
  }

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };
  
  const handleLogout = () => {
    userAuthService.logout();
    setCurrentUser(null);
    handleUserMenuClose();
    window.location.href = '/';
  };

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
      color: 'white',
      pt: 2,
      pb: 4
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        px: 3, 
        mb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            sx={{ 
              bgcolor: 'white', 
              color: theme.palette.primary.main, 
              mr: 1.5,
              width: 40,
              height: 40
            }}
          >
            <PetsIcon />
          </Avatar>
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/" 
            sx={{ 
              textDecoration: 'none', 
              color: 'white',
              fontWeight: 700
            }}
          >
            Dog Rescue
          </Typography>
        </Box>
        <IconButton 
          onClick={handleDrawerToggle} 
          size="large" 
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider sx={{ borderColor: alpha('#ffffff', 0.2), mb: 3 }} />
      
      <List sx={{ px: 1, flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding sx={{ mb: 1 }}>
            <ListItemButton 
              component={RouterLink} 
              to={item.path}
              sx={{ 
                borderRadius: 2,
                py: 1.5,
                px: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.1),
                },
                ...(location.pathname === item.path && {
                  backgroundColor: alpha('#ffffff', 0.15),
                  '&:hover': {
                    backgroundColor: alpha('#ffffff', 0.2),
                  }
                })
              }}
            >
              <ListItemText 
                primary={item.name} 
                primaryTypographyProps={{ 
                  fontWeight: location.pathname === item.path ? 700 : 500,
                  fontSize: '1.1rem'
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ px: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {currentUser ? (
          <>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              component={RouterLink}
              to="/user-dashboard"
              startIcon={<DashboardIcon />}
              sx={{
                borderRadius: 30,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                borderColor: 'rgba(255,255,255,0.5)',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              My Dashboard
            </Button>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{
                borderRadius: 30,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                borderColor: 'rgba(255,255,255,0.5)',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              component={RouterLink}
              to="/login"
              startIcon={<LoginIcon />}
              sx={{
                borderRadius: 30,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                borderColor: 'rgba(255,255,255,0.5)',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Sign In
            </Button>
            <Button
              fullWidth
              variant="contained"
              size="large"
              component={RouterLink}
              to="/register"
              startIcon={<PersonAddIcon />}
              sx={{
                borderRadius: 30,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                backgroundColor: 'white',
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)'
                }
              }}
            >
              Sign Up
            </Button>
          </>
        )}
        
        <Button
          fullWidth
          variant="contained"
          size="large"
          component={RouterLink}
          to="/donate"
          color="secondary"
          startIcon={<HeartIcon />}
          sx={{
            borderRadius: 30,
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
            background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
          }}
        >
          Donate Now
        </Button>
      </Box>
    </Box>
  );

  return (
    <Slide appear={false} direction="down" in={visible}>
      <Box sx={{ width: '100%' }}>
      <AppBar 
        position="fixed" 
        color="default" 
        elevation={atTop ? 0 : 4}
        sx={{
          width: '100%',
          transition: 'all 0.3s',
          bgcolor: atTop ? 'transparent' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: atTop ? 'none' : 'blur(10px)',
          borderBottom: atTop ? 'none' : `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          boxShadow: atTop ? 'none' : `0 4px 20px ${alpha('#000000', 0.1)}`,
          '& .MuiToolbar-root': {
            transition: 'all 0.3s',
            minHeight: atTop ? 80 : 64,
          },
        }}
      >
        <Toolbar sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          width: '100%',
          maxWidth: '1920px',
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4, lg: 5 }
        }}>
          {/* Logo */}
          <MotionBox 
            sx={{ display: 'flex', alignItems: 'center' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Avatar 
              sx={{ 
                bgcolor: atTop ? 'white' : alpha(theme.palette.primary.main, 0.1), 
                color: theme.palette.primary.main, 
                mr: 1.5,
                transition: 'all 0.3s',
                width: atTop ? 48 : 40,
                height: atTop ? 48 : 40
              }}
            >
              <PetsIcon />
            </Avatar>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 800,
                textDecoration: 'none',
                color: atTop ? 'white' : 'text.primary',
                fontSize: atTop ? '1.5rem' : '1.35rem',
                transition: 'all 0.3s',
                textShadow: atTop ? '1px 1px 3px rgba(0,0,0,0.3)' : 'none',
              }}
            >
              Dog Rescue Mission
            </Typography>
          </MotionBox>

          {/* Desktop Navigation */}
          {!isMobile && (
            <MotionBox 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                {navItems.map((item) => (
                <Button
                  key={item.name}
                  component={RouterLink}
                  to={item.path}
                  sx={{ 
                    color: atTop ? 'white' : 'text.primary',
                    fontWeight: location.pathname === item.path ? 700 : 500,
                    textTransform: 'none',
                    fontSize: '1rem',
                      px: 1.5,
                      py: 1,
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      position: 'relative',
                      textShadow: atTop ? '0px 1px 2px rgba(0,0,0,0.2)' : 'none',
                      '&::after': location.pathname === item.path ? {
                      content: '""',
                      position: 'absolute',
                        bottom: 6,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '20px',
                      height: '3px',
                        backgroundColor: atTop ? 'white' : theme.palette.primary.main,
                      borderRadius: '3px',
                      } : {},
                    '&:hover': {
                        backgroundColor: alpha(atTop ? '#ffffff' : theme.palette.primary.main, 0.1),
                      },
                  }}
                >
                  {item.name}
                </Button>
              ))}
              </MotionBox>
            )}

            {/* Right side buttons */}
            <MotionBox 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* User Authentication */}
              {!isMobile && (
                <>
                  {currentUser ? (
                    <>
                      <Button
                        aria-label="Account menu"
                        aria-controls="user-menu"
                        aria-haspopup="true"
                        onClick={handleUserMenuOpen}
                        startIcon={
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              bgcolor: atTop ? alpha(theme.palette.primary.main, 0.8) : alpha(theme.palette.primary.main, 0.1),
                              color: atTop ? 'white' : theme.palette.primary.main,
                            }}
                          >
                            {currentUser.name.charAt(0).toUpperCase()}
                          </Avatar>
                        }
                        endIcon={<KeyboardArrowDownIcon />}
                        sx={{
                          color: atTop ? 'white' : 'text.primary',
                          textTransform: 'none',
                          fontSize: '0.95rem',
                          fontWeight: 500,
                          textShadow: atTop ? '0px 1px 2px rgba(0,0,0,0.2)' : 'none',
                        }}
                      >
                        {currentUser.name}
                      </Button>
                      <Menu
                        id="user-menu"
                        anchorEl={userMenuAnchorEl}
                        open={Boolean(userMenuAnchorEl)}
                        onClose={handleUserMenuClose}
                        PaperProps={{
                          elevation: 3,
                          sx: { 
                            mt: 1.5, 
                            minWidth: 180,
                            borderRadius: 2,
                            overflow: 'visible',
                            '&:before': {
                              content: '""',
                              display: 'block',
                              position: 'absolute',
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: 'background.paper',
                              transform: 'translateY(-50%) rotate(45deg)',
                              zIndex: 0,
                            },
                          },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      >
                        <MenuItem 
                          component={RouterLink}
                          to="/user-dashboard"
                          onClick={handleUserMenuClose}
                          sx={{ py: 1.5, px: 2.5 }}
                        >
                          <DashboardIcon sx={{ mr: 1.5, fontSize: '1.25rem', color: theme.palette.text.secondary }} />
                          <Typography variant="body2">My Dashboard</Typography>
                        </MenuItem>
                        <MenuItem 
                          onClick={handleLogout}
                          sx={{ py: 1.5, px: 2.5 }}
                        >
                          <LogoutIcon sx={{ mr: 1.5, fontSize: '1.25rem', color: theme.palette.text.secondary }} />
                          <Typography variant="body2">Sign Out</Typography>
                        </MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <>
                      <Button
                        component={RouterLink}
                        to="/login"
                        startIcon={<LoginIcon />}
                        sx={{
                          color: atTop ? 'white' : 'text.primary',
                          textTransform: 'none',
                          fontSize: '0.95rem',
                          fontWeight: 500,
                          textShadow: atTop ? '0px 1px 2px rgba(0,0,0,0.2)' : 'none',
                        }}
                      >
                        Sign In
                      </Button>
                      <Button
                        component={RouterLink}
                        to="/register"
                        variant="outlined"
                        startIcon={<PersonAddIcon />}
                        sx={{
                          textTransform: 'none',
                          fontSize: '0.95rem',
                          fontWeight: 500,
                          borderColor: atTop ? 'white' : theme.palette.primary.main,
                          color: atTop ? 'white' : theme.palette.primary.main,
                          '&:hover': {
                            borderColor: atTop ? 'white' : theme.palette.primary.main,
                            backgroundColor: alpha(atTop ? '#ffffff' : theme.palette.primary.main, 0.1),
                          },
                          textShadow: atTop ? '0px 1px 2px rgba(0,0,0,0.2)' : 'none',
                        }}
                      >
                        Sign Up
                      </Button>
                    </>
                  )}
                </>
              )}

              {/* Donate Button */}
              {!isMobile && (
              <Button 
                variant="contained" 
                color="secondary"
                component={RouterLink}
                to="/donate"
                startIcon={<HeartIcon />}
                sx={{ 
                    ml: 1,
                    borderRadius: 30,
                    px: 2.5,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                    boxShadow: atTop ? '0 4px 10px rgba(0,0,0,0.2)' : '0 2px 5px rgba(0,0,0,0.1)',
                  '&:hover': {
                      boxShadow: atTop ? '0 6px 12px rgba(0,0,0,0.25)' : '0 4px 8px rgba(0,0,0,0.15)',
                  }
                }}
              >
                  Donate
              </Button>
          )}

              {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
                  edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                color: atTop ? 'white' : 'text.primary',
                    '&:hover': {
                      backgroundColor: alpha(atTop ? '#ffffff' : theme.palette.primary.main, 0.1),
                    }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
            </MotionBox>
        </Toolbar>
        </AppBar>

        {/* Mobile Navigation Drawer */}
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
              width: '85%',
              maxWidth: '320px'
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Slide>
  );
};

export default Header; 