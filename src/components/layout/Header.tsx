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
  Slide
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PetsIcon from '@mui/icons-material/Pets';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import HeartIcon from '@mui/icons-material/Favorite';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Dogs', path: '/dogs' },
  { name: 'Volunteer', path: '/volunteer' },
  { name: 'Resources', path: '/resources' },
  { name: 'Contact', path: '/contact' },
  { name: 'Admin', path: '/admin' }
];

const MotionBox = motion(Box);

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  
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
      
      <Box sx={{ px: 3 }}>
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
              sx={{ display: 'flex', alignItems: 'center' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {navItems.map((item, index) => (
                <Button
                  key={item.name}
                  component={RouterLink}
                  to={item.path}
                  sx={{ 
                    color: atTop ? 'white' : 'text.primary',
                    mx: 0.5,
                    px: 2,
                    py: 1,
                    fontWeight: location.pathname === item.path ? 700 : 500,
                    position: 'relative',
                    textTransform: 'none',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    textShadow: atTop ? '1px 1px 3px rgba(0,0,0,0.2)' : 'none',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: location.pathname === item.path ? '80%' : '0%',
                      height: '3px',
                      bottom: '5px',
                      left: '10%',
                      backgroundColor: theme.palette.secondary.main,
                      transition: 'width 0.3s ease',
                      borderRadius: '3px',
                    },
                    '&:hover': {
                      backgroundColor: 'transparent',
                      '&::after': {
                        width: '80%',
                      }
                    }
                  }}
                >
                  {item.name}
                </Button>
              ))}
              <Button 
                variant="contained" 
                color="secondary"
                component={RouterLink}
                to="/donate"
                startIcon={<HeartIcon />}
                sx={{ 
                  ml: 2,
                  px: 3,
                  py: 1,
                  borderRadius: 50,
                  textTransform: 'none',
                  fontWeight: 600,
                  backgroundColor: theme.palette.secondary.main,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.dark,
                    transform: 'translateY(-3px)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                  }
                }}
              >
                Donate Now
              </Button>
            </MotionBox>
          )}

          {/* Mobile Menu Icon */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ 
                color: atTop ? 'white' : 'text.primary',
                border: atTop ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(0,0,0,0.1)', 
                borderRadius: '12px',
                p: 1
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>

        {/* Mobile Navigation Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: '85%',
              maxWidth: 360,
              borderRadius: '0 20px 20px 0'
            },
          }}
        >
          {drawer}
        </Drawer>
      </AppBar>
    </Slide>
  );
};

export default Header; 