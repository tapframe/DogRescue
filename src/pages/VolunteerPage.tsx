import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  GridLegacy as Grid,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  alpha,
  useTheme,
  Avatar,
  Stack
} from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import PetsIcon from '@mui/icons-material/Pets';
import HomeIcon from '@mui/icons-material/Home';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { motion } from 'framer-motion';

import { volunteerApi } from '../services/api';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardVariant = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 15 
    } 
  }
};

const slideInUp = {
  hidden: { y: 60, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { 
      type: "spring", 
      stiffness: 100,
      damping: 15
    }
  }
};

const slideInRight = {
  hidden: { x: 60, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { 
      type: "spring", 
      stiffness: 100,
      damping: 15
    }
  }
};

const slideInLeft = {
  hidden: { x: -60, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { 
      type: "spring", 
      stiffness: 100,
      damping: 15
    }
  }
};

const VolunteerPage = () => {
  const theme = useTheme();
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [volunteerType, setVolunteerType] = useState('');
  const [availability, setAvailability] = useState('');
  const [experience, setExperience] = useState('');
  const [message, setMessage] = useState('');
  const [agreement, setAgreement] = useState(false);
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [activeSection, setActiveSection] = useState<number | null>(null);

  const handleVolunteerTypeChange = (event: SelectChangeEvent) => {
    setVolunteerType(event.target.value as string);
  };

  const handleAvailabilityChange = (event: SelectChangeEvent) => {
    setAvailability(event.target.value as string);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // Create volunteer data object
      const volunteerData = {
        name,
        email,
        phone,
        volunteerType,
        availability,
        experience,
        message,
        status: 'pending' as 'pending' | 'approved' | 'rejected',
        submittedAt: new Date().toISOString()
      };

      // Submit to API
      await volunteerApi.createVolunteer(volunteerData);
      setSubmitSuccess(true);
      
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setVolunteerType('');
      setAvailability('');
      setExperience('');
      setMessage('');
      setAgreement(false);
    } catch (error) {
      console.error('Error submitting volunteer application:', error);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSubmitSuccess(false);
    setSubmitError(false);
  };
  
  const handleVolunteerOptionClick = (index: number) => {
    setVolunteerType(volunteerOptions[index].title);
    // Scroll to application form
    const formElement = document.getElementById('application-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const volunteerOptions = [
    {
      title: 'Dog Walker',
      description: 'Take our dogs for walks, providing exercise and socialization.',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      icon: <TimelapseIcon />,
      color: '#FF6B6B',
    },
    {
      title: 'Foster Parent',
      description: 'Provide temporary care for dogs in your home until they find forever homes.',
      image: 'https://images.unsplash.com/photo-1541599468348-e96984315921?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      icon: <HomeIcon />,
      color: '#4ECDC4',
    },
    {
      title: 'Event Helper',
      description: 'Assist with adoption events, fundraisers, and community outreach.',
      image: 'https://images.unsplash.com/photo-1558236822-09a277b7b05f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      icon: <VolunteerActivismIcon />,
      color: '#FFD166',
    },
    {
      title: 'Kennel Assistant',
      description: 'Help with cleaning, feeding, and caring for dogs at our facility.',
      image: 'https://images.unsplash.com/photo-1551887373-3c5bd224f6e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      icon: <PetsIcon />,
      color: '#6A0572',
    },
  ];

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box 
        sx={{
          position: 'relative',
          height: { xs: '70vh', md: '85vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          mb: 6,
          overflow: 'hidden'
        }}
      >
        {/* Parallax Background */}
        <motion.div
          initial={{ scale: 1.2, y: 0 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <Box 
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'url(https://images.pexels.com/photos/15356250/pexels-photo-15356250/free-photo-of-puppy-dachshund-playing-on-green-grass.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              opacity: 0.9,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `linear-gradient(135deg, rgba(0,0,0,0.85) 0%, ${alpha(theme.palette.primary.main, 0.75)} 100%)`,
              }
            }}
          />
        </motion.div>
        
        {/* Animated particle effects */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, overflow: 'hidden' }}>
          {/* Paw icons */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`paw-${i}`}
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                opacity: 0.15 + Math.random() * 0.2,
                scale: 0.5 + Math.random() * 0.8
              }}
              animate={{ 
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth
                ],
                y: [
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight
                ],
                opacity: [0.1, 0.25, 0.1],
                scale: [0.5, 0.7, 0.5],
                rotate: [0, 180, 360],
                transition: { 
                  duration: 15 + Math.random() * 25, 
                  repeat: Infinity, 
                  ease: "linear"
                }
              }}
              style={{
                position: 'absolute',
                color: 'rgba(255,255,255,0.12)',
                filter: 'blur(1px)'
              }}
            >
              <PetsIcon style={{ fontSize: `${24 + Math.random() * 36}px` }} />
            </motion.div>
          ))}

          {/* Light particles */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                opacity: 0.1 + Math.random() * 0.15,
                scale: 0.2 + Math.random() * 0.6
              }}
              animate={{ 
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth
                ],
                y: [
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight
                ],
                opacity: [0.05, 0.15, 0.05],
                scale: [0.2, 0.4, 0.2],
                transition: { 
                  duration: 8 + Math.random() * 15, 
                  repeat: Infinity, 
                  ease: "linear"
                }
              }}
              style={{
                position: 'absolute',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.3)',
                boxShadow: '0 0 10px 2px rgba(255,255,255,0.1)',
                filter: 'blur(1px)'
              }}
            />
          ))}
        </Box>
        
        {/* Decorative Elements */}
        <Box 
          sx={{ 
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '15%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)',
            zIndex: 2
          }}
        />
        
        <Box 
          sx={{ 
            position: 'absolute',
            top: { xs: 40, md: 80 },
            right: { xs: 20, md: 40 },
            zIndex: 5,
            display: { xs: 'none', md: 'block' }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <Paper
              elevation={0}
              sx={{
                px: 2,
                py: 1,
                bgcolor: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: 'white',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <FavoriteIcon fontSize="small" sx={{ color: theme.palette.secondary.light, mr: 1 }} />
                Join volunteers like you making a real impact
        </Typography>
            </Paper>
          </motion.div>
        </Box>
        
        {/* Hero content */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 5 }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <motion.div 
                    variants={slideInLeft}
                    transition={{ duration: 0.7 }}
                  >
                    <Box 
                      sx={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        bgcolor: 'rgba(255,255,255,0.12)', 
                        backdropFilter: 'blur(8px)',
                        borderRadius: 8,
                        py: 1,
                        px: 2,
                        mb: 4,
                        border: '1px solid rgba(255,255,255,0.15)'
                      }}
                    >
                      <VolunteerActivismIcon sx={{ mr: 1, color: theme.palette.secondary.light }} />
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: 'white',
                          textTransform: 'uppercase',
                          letterSpacing: 1.2,
                          fontSize: '0.85rem'
                        }}
                      >
                        Make A Difference Today
        </Typography>
                    </Box>
                  </motion.div>

                  <motion.div 
                    variants={slideInLeft}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  >
                    <Typography 
                      variant="h1" 
                      component="h1"
                      sx={{ 
                        fontWeight: 900,
                        color: 'white',
                        fontSize: { xs: '2.75rem', sm: '3.75rem', md: '5rem' },
                        textShadow: '0 2px 15px rgba(0,0,0,0.3)',
                        mb: 2,
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em'
                      }}
                    >
                      Volunteer <Box 
                        component="span" 
                        sx={{ 
                          color: theme.palette.secondary.light,
                          position: 'relative',
                          display: 'inline-block'
                        }}
                      >
                        & 
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ delay: 1.2, duration: 0.8 }}
                          style={{
                            position: 'absolute',
                            height: '8px',
                            background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.secondary.main, 0.6)}, transparent)`,
                            bottom: 0,
                            left: 0,
                            borderRadius: '4px',
                          }}
                        />
                      </Box> <br />
                      <Box component="span" sx={{ 
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 12,
                          left: 0,
                          height: '40%',
                          width: '100%',
                          background: `linear-gradient(90deg, ${alpha(theme.palette.secondary.main, 0.7)}, ${alpha(theme.palette.secondary.light, 0.4)})`,
                          zIndex: -1,
                          borderRadius: '4px',
                          transform: 'skew(-5deg, -1deg)'
                        }
                      }}>
                        Foster
                      </Box>
                    </Typography>
                  </motion.div>

                  <motion.div 
                    variants={slideInLeft}
                    transition={{ duration: 0.7, delay: 0.2 }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'rgba(255,255,255,0.9)', 
                        maxWidth: 570, 
                        mb: 4, 
                        fontWeight: 400,
                        lineHeight: 1.6,
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        textShadow: '0 1px 3px rgba(0,0,0,0.2)'
                      }}
                    >
                      Join our compassionate community of volunteers and make a meaningful impact 
                      in the lives of rescue dogs. Your time, skills and love can transform their world 
                      and create lasting bonds that change lives forever.
                    </Typography>
                  </motion.div>

                  <motion.div 
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { 
                        opacity: 1, 
                        y: 0, 
                        transition: { 
                          delay: 0.3, 
                          type: "spring",
                          stiffness: 150
                        } 
                      }
                    }}
                  >
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Button 
                        variant="contained" 
                        size="large" 
                        color="secondary"
                        onClick={() => {
                          const formElement = document.getElementById('application-form');
                          if (formElement) {
                            formElement.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        sx={{ 
                          py: 1.5, 
                          px: 4, 
                          fontWeight: 700,
                          fontSize: '1rem',
                          boxShadow: '0 4px 14px 0 rgba(0,0,0,0.3)',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 6px 20px 0 rgba(0,0,0,0.35)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Apply Now
                      </Button>
                      <Button
                        variant="outlined"
                        color="inherit"
                        size="large"
                        onClick={() => {
                          const volunteerOptions = document.getElementById('volunteer-options');
                          if (volunteerOptions) {
                            volunteerOptions.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        startIcon={<PetsIcon />}
                        sx={{ 
                          py: 1.5,
                          border: '1px solid rgba(255,255,255,0.5)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            borderColor: 'white'
                          }
                        }}
                      >
                        Explore Ways to Help
                      </Button>
                    </Stack>
                  </motion.div>
                </Box>
              </Grid>
              <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
                <motion.div 
                  variants={slideInRight}
                  transition={{ duration: 0.8 }}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Box 
                    sx={{
                      position: 'relative',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                      transform: 'rotate(2deg)',
                      width: '85%',
                      maxWidth: '400px',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(to bottom, transparent 60%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
                        zIndex: 2
                      }
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Box
                        component="img"
                        src="https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=934&q=80"
                        alt="Volunteer with dog"
                        sx={{ 
                          width: '100%', 
                          height: 'auto', 
                          display: 'block',
                          transition: 'transform 0.5s ease',
                        }}
                      />
                    </motion.div>
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        bottom: 30, 
                        left: 30, 
                        zIndex: 3,
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: 'white', 
                          fontWeight: 700,
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                        }}
                      >
                        "The best therapy has fur and four legs"
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <Avatar 
                          src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                          alt="Sarah J."
                          sx={{ 
                            width: 36, 
                            height: 36, 
                            border: '2px solid white'
                          }}
                        />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            ml: 1.5, 
                            color: 'white',
                            textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                          }}
                        >
                          Sarah J. <Box component="span" sx={{ opacity: 0.8 }}>• Dog Walker</Box>
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Decorative elements */}
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.light, 0.8)}, ${alpha(theme.palette.secondary.main, 0.4)})`,
                        filter: 'blur(25px)',
                        opacity: 0.6,
                        zIndex: 1
                      }}
                    />
                    
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        bottom: -30,
                        left: -20,
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.6)}, ${alpha(theme.palette.primary.main, 0.3)})`,
                        filter: 'blur(30px)',
                        opacity: 0.5,
                        zIndex: 1
                      }}
                    />
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" id="volunteer-options">
        <Box sx={{ py: 4 }}>
        {/* Volunteer Options */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <Box sx={{ mb: 10 }}>
              <Typography 
                variant="h2" 
                component="h2" 
                align="center" 
                gutterBottom 
                sx={{ 
                  mb: 1.5, 
                  fontWeight: 800,
                  position: 'relative',
                  display: 'inline-block',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: { xs: '2rem', md: '2.75rem' }
                }}
              >
            Ways to Help
                <Box 
                  sx={{ 
                    position: 'absolute',
                    height: '12px',
                    width: '100px',
                    backgroundColor: alpha(theme.palette.secondary.main, 0.4),
                    bottom: 8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: -1,
                    borderRadius: 2
                  }}
                />
          </Typography>
              
              <Typography 
                variant="h6" 
                component="p" 
                align="center" 
                color="text.secondary" 
                sx={{ 
                  maxWidth: 700, 
                  mx: 'auto', 
                  mb: 6, 
                  fontWeight: 400
                }}
              >
                Choose the volunteer opportunity that matches your skills, interests, and availability.
                Every role makes a significant impact on the lives of our rescue dogs.
          </Typography>
              
              <motion.div variants={staggerContainer}>
                <Grid 
                  container 
                  spacing={4} 
                  alignItems="stretch"
                  sx={{ 
                    '& .MuiGrid-item': {
                      display: 'flex'
                    } 
                  }}
                >
            {volunteerOptions.map((option, index) => (
              <Grid item key={index} xs={12} sm={6} md={3}>
                      <motion.div
                        variants={cardVariant}
                        whileHover={{ 
                          y: -10,
                          transition: { type: "spring", stiffness: 300, damping: 10 }
                        }}
                        style={{ width: '100%', display: 'flex' }}
                      >
                <Card 
                  sx={{ 
                    height: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    position: 'relative',
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                      height="180"
                    image={option.image}
                    alt={option.title}
                      sx={{ 
                        height: 180,
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    />
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      width: '100%', 
                      height: '100%',
                      background: `linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7) 100%)`
                    }} />
                    <Avatar 
                      sx={{ 
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        bgcolor: option.color,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        width: 48,
                        height: 48
                      }}
                    >
                        {option.icon}
                    </Avatar>
                      </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3, height: 170, display: 'flex', flexDirection: 'column' }}>
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 700,
                        mb: 1
                      }}
                    >
                        {option.title}
                      </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ mb: 3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}
                    >
                      {option.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      onClick={() => handleVolunteerOptionClick(index)}
                      sx={{ 
                        mt: 'auto',
                        textTransform: 'none',
                        borderRadius: 2,
                        py: 1
                      }}
                    >
                      Apply as {option.title}
                    </Button>
                  </CardContent>
                </Card>
                      </motion.div>
              </Grid>
            ))}
          </Grid>
              </motion.div>
        </Box>
          </motion.div>

        {/* Volunteer Process */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 4, md: 6 }, 
                mb: 8, 
                borderRadius: 4, 
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.15)} 100%)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: -30, 
                  right: -30, 
                  opacity: 0.04, 
                  transform: 'rotate(-10deg)' 
                }}
              >
                <PetsIcon sx={{ fontSize: 280 }} />
              </Box>

              <Typography 
                variant="h2" 
                component="h2" 
                gutterBottom 
                sx={{ 
                  mb: 4, 
                  fontWeight: 800,
                  position: 'relative',
                  display: 'inline-block',
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
            Volunteer Process
                <Box 
                  sx={{ 
                    position: 'absolute',
                    height: '12px',
                    width: '30%',
                    backgroundColor: alpha(theme.palette.secondary.main, 0.4),
                    bottom: 5,
                    left: 0,
                    zIndex: -1,
                    borderRadius: 2
                  }}
                />
              </Typography>

              <Grid container spacing={3} sx={{ '& .MuiGrid-item': { display: 'flex' } }}>
                {[
                  {
                    step: 1,
                    title: 'Apply',
                    description: 'Fill out the volunteer application form below.',
                    icon: <EmailIcon />
                  },
                  {
                    step: 2,
                    title: 'Orientation',
                    description: 'Attend a volunteer orientation session to learn about our organization and procedures.',
                    icon: <VolunteerActivismIcon />
                  },
                  {
                    step: 3,
                    title: 'Training',
                    description: 'Receive role-specific training from our experienced staff.',
                    icon: <PetsIcon />
                  },
                  {
                    step: 4,
                    title: 'Start Volunteering',
                    description: 'Begin your volunteer role and make a difference in the lives of our dogs.',
                    icon: <FavoriteIcon />
                  }
                ].map((step, index) => (
                  <Grid item key={index} xs={12} sm={6} md={3}>
                    <motion.div 
                      variants={cardVariant}
                      onMouseEnter={() => setActiveSection(index)}
                      onMouseLeave={() => setActiveSection(null)}
                      style={{ width: '100%', display: 'flex' }}
                    >
                      <Paper
                        elevation={activeSection === index ? 8 : 0}
                        sx={{
                          p: 3,
                          height: 200,
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: activeSection === index 
                            ? 'secondary.main' 
                            : 'divider',
                          transition: 'all 0.3s ease',
                          transform: activeSection === index ? 'translateY(-8px)' : 'none',
                          '&:hover': { borderColor: 'secondary.main' }
                        }}
                      >
                        <Box 
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2
                          }}
                        >
                          <Avatar
                            sx={{ 
                              bgcolor: activeSection === index 
                                ? 'secondary.main' 
                                : alpha(theme.palette.primary.main, 0.1),
                              color: activeSection === index
                                ? 'white'
                                : 'primary.main',
                              mr: 2,
                              transform: activeSection === index ? 'scale(1.1)' : 'none',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            {step.icon}
                          </Avatar>
                          <Box
                            sx={{ 
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            <Typography 
                              variant="overline" 
                              component="span" 
                              sx={{ 
                                color: 'text.secondary',
                                fontWeight: 600
                              }}
                            >
                              Step {step.step}
                            </Typography>
                            <Typography 
                              variant="h6" 
                              component="h3" 
                              sx={{ 
                                fontWeight: 700,
                                color: activeSection === index ? 'secondary.main' : 'text.primary',
                                transition: 'color 0.3s ease'
                              }}
                            >
                              {step.title}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            display: '-webkit-box', 
                            WebkitLineClamp: 4, 
                            WebkitBoxOrient: 'vertical',
                            mt: 'auto' 
                          }}
                        >
                          {step.description}
                        </Typography>
        </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </motion.div>

        {/* Application Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 4, md: 6 }, 
                mb: 6, 
                borderRadius: 4,
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                background: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}
              id="application-form"
            >
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: -60, 
                  left: -60, 
                  opacity: 0.03, 
                  transform: 'rotate(10deg)' 
                }}
              >
                <VolunteerActivismIcon sx={{ fontSize: 350 }} />
              </Box>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={5}>
                  <motion.div variants={slideInLeft}>
                    <Box sx={{ pr: { xs: 0, md: 4 } }}>
                      <Typography 
                        variant="h2" 
                        component="h2" 
                        gutterBottom 
                        sx={{ 
                          mb: 2, 
                          fontWeight: 800,
                          position: 'relative',
                          display: 'inline-block',
                          fontSize: { xs: '2rem', md: '2.5rem' }
                        }}
                      >
                        Join Our Team
                        <Box 
                          sx={{ 
                            position: 'absolute',
                            height: '12px',
                            width: '50%',
                            backgroundColor: alpha(theme.palette.secondary.main, 0.4),
                            bottom: 5,
                            left: 0,
                            zIndex: -1,
                            borderRadius: 2
                          }}
                        />
                      </Typography>
                      
                      <Typography 
                        variant="body1" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 4,
                          fontSize: '1.05rem',
                          lineHeight: 1.6
                        }}
                      >
                        Volunteers are the heart of our rescue mission. By applying, you're taking 
                        the first step toward making a real difference in the lives of dogs in need.
                      </Typography>
                      
                      <Stack spacing={3} sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: 'primary.main',
                              mr: 2
                            }}
                          >
                            <CheckCircleIcon />
                          </Avatar>
                          <Typography variant="body1">Flexible scheduling to fit your lifestyle</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: 'primary.main',
                              mr: 2
                            }}
                          >
                            <CheckCircleIcon />
                          </Avatar>
                          <Typography variant="body1">Training and support for all volunteers</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: 'primary.main',
                              mr: 2
                            }}
                          >
                            <CheckCircleIcon />
                          </Avatar>
                          <Typography variant="body1">Make lasting memories and friendships</Typography>
                        </Box>
                      </Stack>
                      
                      <Box
                        component="img"
                        src="https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=934&q=80"
                        alt="Happy volunteer with dog"
                        sx={{
                          width: '100%',
                          height: 'auto',
                          borderRadius: 3,
                          display: { xs: 'none', md: 'block' },
                          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                          transform: 'rotate(-2deg)',
                          mb: 4
                        }}
                      />
                    </Box>
                  </motion.div>
                </Grid>
                
                <Grid item xs={12} md={7}>
                  <motion.div variants={slideInRight}>
                    <Typography 
                      variant="h4" 
                      component="h3" 
                      gutterBottom 
                      sx={{ 
                        mb: 4, 
                        fontWeight: 700,
                        fontSize: { xs: '1.5rem', md: '1.75rem' }
                      }}
                    >
            Volunteer Application
          </Typography>
                    
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                            variant="outlined"
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                              }
                            }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                            variant="outlined"
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                              }
                            }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                            variant="outlined"
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                              }
                            }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                          <FormControl 
                            fullWidth 
                            required
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                              }
                            }}
                          >
                  <InputLabel>Volunteer Type</InputLabel>
                  <Select
                    value={volunteerType}
                    onChange={handleVolunteerTypeChange}
                    label="Volunteer Type"
                  >
                    <MenuItem value="Dog Walker">Dog Walker</MenuItem>
                    <MenuItem value="Foster Parent">Foster Parent</MenuItem>
                    <MenuItem value="Event Helper">Event Helper</MenuItem>
                    <MenuItem value="Kennel Assistant">Kennel Assistant</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                          <FormControl 
                            fullWidth 
                            required
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                              }
                            }}
                          >
                  <InputLabel>Availability</InputLabel>
                  <Select
                    value={availability}
                    onChange={handleAvailabilityChange}
                    label="Availability"
                  >
                    <MenuItem value="Weekdays">Weekdays</MenuItem>
                    <MenuItem value="Weekends">Weekends</MenuItem>
                    <MenuItem value="Evenings">Evenings</MenuItem>
                    <MenuItem value="Flexible">Flexible</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Previous Experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Any previous volunteer or animal care experience"
                            variant="outlined"
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                              }
                            }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Why do you want to volunteer with us?"
                  multiline
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                            variant="outlined"
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                              }
                            }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreement}
                      onChange={(e) => setAgreement(e.target.checked)}
                      required
                                color="secondary"
                              />
                            }
                            label={
                              <Typography variant="body2">
                                I agree to follow all policies and procedures of Dog Rescue Mission.
                                I understand that volunteer opportunities are subject to availability and screening.
                              </Typography>
                            }
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large" 
                  fullWidth 
                  disabled={isSubmitting || !agreement}
                            sx={{ 
                              mt: 2,
                              py: 1.5,
                              borderRadius: 2,
                              fontSize: '1rem',
                              fontWeight: 600,
                              boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
                              '&:hover': {
                                boxShadow: '0 6px 20px 0 rgba(0,0,0,0.15)'
                              }
                            }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
                  </motion.div>
                </Grid>
              </Grid>
        </Paper>
          </motion.div>

        {/* Success/Error Notifications */}
        <Snackbar open={submitSuccess} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
              Your volunteer application has been submitted successfully! You will receive a confirmation email shortly.
            </Alert>
        </Snackbar>
        <Snackbar open={submitError} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <Alert 
              onClose={handleCloseSnackbar} 
              severity="error" 
              variant="filled"
              sx={{ width: '100%' }}
            >
            There was an error submitting your application. Please try again.
          </Alert>
        </Snackbar>
      </Box>
    </Container>
    </Box>
  );
};

export default VolunteerPage; 