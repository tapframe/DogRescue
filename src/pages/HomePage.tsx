import { Button, Typography, Box, Card, CardMedia, CardContent, CardActions, Divider, Paper, TextField, Avatar, Chip, Stack, useTheme, alpha, Container, Alert } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PetsIcon from '@mui/icons-material/Pets';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import HomeIcon from '@mui/icons-material/Home';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import SendIcon from '@mui/icons-material/Send';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PawsIcon from '@mui/icons-material/Pets';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HeartIcon from '@mui/icons-material/Favorite';
import { dogApi, DogData } from '../services/api';

// Placeholder data for featured dogs
const featuredDogs = [
  {
    id: 1,
    name: 'Max',
    breed: 'Labrador Retriever',
    age: '3 years',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    description: 'Max is a friendly and energetic Labrador who loves to play fetch and go for long walks.',
    tags: ['Friendly', 'Active', 'Good with kids']
  },
  {
    id: 2,
    name: 'Bella',
    breed: 'German Shepherd',
    age: '2 years',
    image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    description: 'Bella is a loyal and intelligent German Shepherd looking for an active family.',
    tags: ['Intelligent', 'Loyal', 'Protective']
  },
  {
    id: 3,
    name: 'Charlie',
    breed: 'Beagle',
    age: '1 year',
    image: 'https://images.unsplash.com/photo-1612078894368-231c9ef06a8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    description: 'Charlie is a curious and playful Beagle who gets along well with children and other pets.',
    tags: ['Playful', 'Good with pets', 'Curious']
  },
];

// Success stories
const successStories = [
  {
    id: 1,
    name: "Sarah & Rocky",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    quote: "Adopting Rocky changed my life. He's been my loyal companion through thick and thin. The staff at Dog Rescue Mission made the adoption process so easy!"
  },
  {
    id: 2,
    name: "Mike & Luna",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    quote: "Luna was very shy when we first met, but with patience and love, she's now the most confident dog. Thank you for matching us with the perfect companion!"
  },
  {
    id: 3,
    name: "Emily & Cooper",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    image: "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    quote: "The adoption process was straightforward, and the team really cared about finding the right home for Cooper. He's been such a joy to our family!"
  }
];

// Quick stats (labels only, no dummy numbers)
const stats = [
  { icon: <PetsIcon fontSize="large" />, count: '', label: 'Rescues' },
  { icon: <HomeIcon fontSize="large" />, count: '', label: 'Adoptions' },
  { icon: <VolunteerActivismIcon fontSize="large" />, count: '', label: 'Volunteers' },
  { icon: <FavoriteIcon fontSize="large" />, count: '', label: 'Supporters' },
];

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

const HomePage = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [dogs, setDogs] = useState<DogData[]>([]);
  const [isLoadingDogs, setIsLoadingDogs] = useState(true);
  const [dogsError, setDogsError] = useState<string | null>(null);
  
  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStoryIndex((prevIndex) => 
        prevIndex === successStories.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Fetch dogs for the featured section
  useEffect(() => {
    const fetchDogs = async () => {
      setIsLoadingDogs(true);
      setDogsError(null);
      try {
        const fetchedDogs = await dogApi.getAllDogs();
        console.log('Fetched dogs:', fetchedDogs);
        
        // Show up to 3 dogs regardless of status (or prioritize available ones)
        const availableDogs = fetchedDogs.filter(dog => dog.status === 'available');
        const dogsToShow = availableDogs.length > 0 
          ? availableDogs.slice(0, 3) 
          : fetchedDogs.slice(0, 3);
        
        console.log('Dogs to show:', dogsToShow);
        setDogs(dogsToShow);
      } catch (err) {
        console.error('Error fetching dogs:', err);
        setDogsError('Failed to load dogs from the server');
      } finally {
        setIsLoadingDogs(false);
      }
    };

    fetchDogs();
  }, []);
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail('');
    // In a real app, you would submit this to your backend
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', margin: 0, padding: 0 }}>
      {/* Modern Hero Section with animated elements */}
      <Box 
        sx={{
          position: 'relative',
          height: { xs: '100vh', md: '100vh' },
          marginTop: 0,
          paddingTop: 0,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* Enhanced background with overlay gradient */}
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url(https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            opacity: 0.7,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(25,118,210,0.5) 100%)`,
            }
          }}
        />
        
        {/* Hero content with enhanced layout */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 5, mt: 0, pt: 0 }}>
          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4
          }}>
            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={slideInLeft}
              >
                <Typography 
                  variant="h1" 
                  component="h1"
                  sx={{ 
                    fontWeight: 800,
                    color: 'white',
                    fontSize: { xs: '2.8rem', sm: '3.8rem', md: '4.5rem' },
                    textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
                    mb: 3,
                    lineHeight: 1.1,
                    textTransform: 'uppercase',
                    position: 'relative'
                  }}
                >
                  Every Paw Deserves 
                  <Box component="span" sx={{ 
                    display: 'block',
                    textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
                    mt: 1,
                    color: theme.palette.secondary.light
                  }}>
                    A Loving Home
                  </Box>
                </Typography>

                <Typography 
                  variant="h5" 
                  component="div" 
                  sx={{ 
                    color: 'white',
                    maxWidth: '650px',
                    mb: 5,
                    textShadow: '1px 1px 5px rgba(0,0,0,0.7)',
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    fontWeight: 400,
                    letterSpacing: 0.5,
                    lineHeight: 1.6,
                    position: 'relative'
                  }}
                >
                  We're on a mission to rescue, rehabilitate, and rehome dogs in need. 
                  Join us in giving every tail a chance to wag with joy.
                </Typography>

                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={3} 
                  sx={{ mb: 5 }}
                >
                  <Button 
                    variant="contained" 
                    size="large" 
                    component={RouterLink} 
                    to="/dogs"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ 
                      px: 4, 
                      py: 1.8,
                      fontSize: '1.1rem',
                      borderRadius: '50px',
                      backgroundColor: theme.palette.secondary.main,
                      fontWeight: 600,
                      boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.5)',
                      '&:hover': {
                        backgroundColor: theme.palette.secondary.dark,
                        transform: 'translateY(-3px)',
                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.6)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Meet Our Dogs
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large" 
                    component={RouterLink} 
                    to="/rescue"
                    sx={{ 
                      borderColor: 'white', 
                      color: 'white',
                      px: 4, 
                      py: 1.8,
                      fontSize: '1.1rem',
                      borderRadius: '50px',
                      borderWidth: 2,
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Report a Rescue
                  </Button>
                </Stack>
              </motion.div>
            </Box>
            
            <Box sx={{ width: { xs: '100%', md: '45%' }, display: { xs: 'none', md: 'block' } }}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={slideInRight}
              >
                <Box
                  component={Paper}
                  elevation={24}
                  sx={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    transform: 'rotate(2deg)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'rotate(0deg) scale(1.02)',
                    },
                    position: 'relative',
                    zIndex: 6
                  }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Happy rescued dog"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </Box>
              </motion.div>
            </Box>
          </Box>
        </Container>
        
        {/* Bottom wave overlay with enhanced appearance */}
        <Box 
          sx={{
            position: 'absolute',
            bottom: -2,
            left: 0,
            width: '100%',
            height: '150px',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M0,96L48,112C96,128,192,160,288,170.7C384,181,480,171,576,144C672,117,768,75,864,74.7C960,75,1056,117,1152,122.7C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 4
          }}
        />
      </Box>

      {/* Enhanced Mission Statement with icon */}
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                  boxShadow: '0 8px 20px rgba(25, 118, 210, 0.3)',
                  mb: 3
                }}
              >
                <PawsIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
            </Box>
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontWeight: 700, 
                mb: 3,
                background: `-webkit-linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2rem', md: '2.8rem' }
              }}
            >
              Our Mission
            </Typography>
            <Typography 
              variant="h6" 
              component="p" 
              sx={{ 
                maxWidth: 900, 
                mx: 'auto', 
                mb: 5, 
                color: 'text.secondary',
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                lineHeight: 1.8
              }}
            >
              We believe that every dog deserves a second chance at happiness. Our mission is to rescue dogs in need, 
              provide them with essential care and rehabilitation, and find them loving forever homes where they can thrive.
            </Typography>
            <Divider sx={{ 
              maxWidth: '200px', 
              mx: 'auto', 
              borderColor: theme.palette.primary.main, 
              borderWidth: 2,
              opacity: 0.7 
            }} />
          </motion.div>
        </Box>
      </Container>

      {/* Modernized Impact Stats Section */}
      <Box sx={{ 
        backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.08)}, ${alpha(theme.palette.primary.dark, 0.04)})`,
        py: { xs: 8, md: 12 },
        width: '100%',
        borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <Typography 
                variant="h3" 
                component="h2" 
                align="center" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  mb: { xs: 6, md: 8 },
                  color: theme.palette.primary.main,
                  fontSize: { xs: '2rem', md: '2.8rem' }
                }}
              >
                Our Impact
              </Typography>
            </motion.div>

            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: 4
              }}
            >
              {stats.map((stat, _) => (
                <motion.div variants={cardVariant} key={stat.label}>
                  <Paper 
                    elevation={3}
                    sx={{ 
                      height: '100%',
                      p: 4,
                      textAlign: 'center',
                      borderRadius: 4,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: 6
                      },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'white',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
                    }}
                  >
                    <Box 
                      sx={{ 
                        color: 'white',
                        background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        boxShadow: '0 8px 20px rgba(25, 118, 210, 0.3)'
                      }}
                    >
                      {stat.icon}
                    </Box>
                    {stat.count && (
                      <Typography 
                        variant="h3" 
                        component="div"
                        sx={{ 
                          fontWeight: 700,
                          mb: 1,
                          color: theme.palette.primary.main,
                          fontSize: { xs: '2.5rem', md: '3rem' }
                        }}
                      >
                        {stat.count}
                      </Typography>
                    )}
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        color: 'text.secondary',
                        fontWeight: 500,
                        fontSize: '1.1rem'
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Paper>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Modernized Featured Dogs Section */}
      <Box 
        sx={{ 
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(180deg, #fff 0%, #f8f9fa 100%)'
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <Box sx={{ textAlign: 'center', mb: 8 }}>
                <Typography 
                  variant="h6" 
                  component="p"
                  sx={{ 
                    color: theme.palette.secondary.main,
                    fontWeight: 600,
                    mb: 2,
                    textTransform: 'uppercase',
                    letterSpacing: 1
                  }}
                >
                  Find Your New Best Friend
                </Typography>
                <Typography 
                  variant="h3" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 800,
                    mb: 3,
                    color: theme.palette.primary.dark,
                    fontSize: { xs: '2.2rem', md: '3rem' }
                  }}
                >
                  Meet Our Adorable Dogs
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    maxWidth: 700, 
                    mx: 'auto', 
                    color: 'text.secondary',
                    fontSize: { xs: '1rem', md: '1.15rem' },
                    lineHeight: 1.6
                  }}
                >
                  These furry friends are waiting for their forever homes. 
                  Each has their own unique personality and story to share.
                </Typography>
              </Box>
            </motion.div>

            {isLoadingDogs && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  minHeight: '300px' 
                }}
              >
                <motion.div
                  animate={{ 
                    rotate: 360,
                    transition: { 
                      duration: 2, 
                      ease: "linear", 
                      repeat: Infinity 
                    } 
                  }}
                >
                  <PetsIcon 
                    sx={{ 
                      fontSize: 60, 
                      color: theme.palette.primary.main,
                      opacity: 0.7
                    }} 
                  />
                </motion.div>
              </Box>
            )}

            {!isLoadingDogs && dogsError && (
              <Box sx={{ textAlign: 'center', mb: 8 }}>
                <Alert 
                  severity="info" 
                  sx={{ 
                    maxWidth: 700, 
                    mx: 'auto', 
                    mb: 3 
                  }}
                >
                  {dogsError} - Showing sample dogs instead
                </Alert>
                <Box 
                  sx={{ 
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                    gap: 5,
                    mb: 8
                  }}
                >
                  {featuredDogs.map((dog) => (
                    <motion.div 
                      key={dog.id} 
                      variants={cardVariant}
                      whileHover={{ 
                        y: -15,
                        transition: { duration: 0.3 } 
                      }}
                    >
                      {/* Dog card (existing code) */}
                      <Card 
                        sx={{ 
                          borderRadius: 5,
                          overflow: 'hidden',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'all 0.4s ease',
                          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                          background: 'linear-gradient(to bottom, #ffffff, #f9f9f9)',
                          border: '1px solid rgba(0,0,0,0.05)',
                          opacity: 0.7,
                          '&:hover': {
                            boxShadow: '0 15px 50px rgba(0,0,0,0.15)',
                            transform: 'translateY(-8px)',
                          }
                        }}
                      >
                        {/* Rest of dog card content (unchanged) */}
                        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                          <CardMedia
                            component="img"
                            image={dog.image}
                            alt={dog.name}
                            height={280}
                            sx={{ 
                              objectFit: 'cover',
                              filter: 'grayscale(40%)',
                              transition: 'transform 0.8s ease',
                              '&:hover': {
                                transform: 'scale(1.05)'
                              }
                            }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 16,
                              right: 16,
                              background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.light, 0.9)}, ${alpha(theme.palette.secondary.main, 0.85)})`,
                              color: 'white',
                              py: 0.7,
                              px: 2,
                              borderRadius: 30,
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              backdropFilter: 'blur(4px)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                          >
                            Sample
                          </Box>
                        </Box>
                        <CardContent sx={{ flexGrow: 1, p: 3.5 }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            mb: 1.5
                          }}>
                            <Typography 
                              variant="h5" 
                              component="div" 
                              sx={{ 
                                fontWeight: 700,
                                color: theme.palette.primary.dark,
                                fontSize: '1.5rem'
                              }}
                            >
                              {dog.name}
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)}, ${alpha(theme.palette.primary.main, 0.1)})`,
                              }}
                            >
                              <PetsIcon 
                                sx={{ 
                                  fontSize: '1.4rem', 
                                  color: theme.palette.primary.main 
                                }} 
                              />
                            </Box>
                          </Box>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 500, 
                              mb: 2.5,
                              color: alpha(theme.palette.text.primary, 0.7),
                              fontSize: '1.05rem'
                            }}
                          >
                            {dog.breed}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            paragraph 
                            sx={{ 
                              mb: 3,
                              color: theme.palette.text.secondary,
                              lineHeight: 1.6
                            }}
                          >
                            {dog.description}
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 'auto', mb: 2 }}>
                            {dog.tags.map((tag, idx) => (
                              <Chip
                                key={idx}
                                icon={<LocalOfferIcon sx={{ fontSize: '0.85rem' }} />}
                                label={tag}
                                size="small"
                                sx={{ 
                                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                                  color: theme.palette.primary.dark,
                                  fontWeight: 500,
                                  borderRadius: '25px',
                                  px: 0.5,
                                  '& .MuiChip-icon': {
                                    color: theme.palette.primary.main
                                  }
                                }}
                              />
                            ))}
                          </Box>
                        </CardContent>
                        <CardActions sx={{ p: 3.5, pt: 0 }}>
                          <Button 
                            variant="contained" 
                            fullWidth
                            disabled
                            sx={{ 
                              borderRadius: 30,
                              py: 1.2,
                              background: `linear-gradient(90deg, ${theme.palette.grey[500]}, ${theme.palette.grey[700]})`,
                              fontWeight: 600,
                              textTransform: 'none',
                              fontSize: '1rem',
                            }}
                          >
                            Coming Soon
                          </Button>
                        </CardActions>
                      </Card>
                    </motion.div>
                  ))}
                </Box>
              </Box>
            )}

            {!isLoadingDogs && !dogsError && dogs.length > 0 && (
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                  gap: 5,
                  mb: 8
                }}
              >
                {dogs.map((dog) => (
                  <motion.div 
                    key={dog._id || dog.id} 
                    variants={cardVariant}
                    whileHover={{ 
                      y: -15,
                      transition: { duration: 0.3 } 
                    }}
                  >
                    <Card 
                      sx={{ 
                        borderRadius: 5,
                        overflow: 'hidden',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.4s ease',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                        background: 'linear-gradient(to bottom, #ffffff, #f9f9f9)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        '&:hover': {
                          boxShadow: '0 15px 50px rgba(0,0,0,0.15)',
                          transform: 'translateY(-8px)',
                        }
                      }}
                    >
                      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                        <CardMedia
                          component="img"
                          image={dog.image}
                          alt={dog.name}
                          height={280}
                          sx={{ 
                            objectFit: 'cover',
                            transition: 'transform 0.8s ease',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.light, 0.9)}, ${alpha(theme.palette.secondary.main, 0.85)})`,
                            color: 'white',
                            py: 0.7,
                            px: 2,
                            borderRadius: 30,
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            backdropFilter: 'blur(4px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}
                        >
                          {dog.age}
                        </Box>
                      </Box>
                      <CardContent sx={{ flexGrow: 1, p: 3.5 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          mb: 1.5
                        }}>
                          <Typography 
                            variant="h5" 
                            component="div" 
                            sx={{ 
                              fontWeight: 700,
                              color: theme.palette.primary.dark,
                              fontSize: '1.5rem'
                            }}
                          >
                            {dog.name}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)}, ${alpha(theme.palette.primary.main, 0.1)})`,
                            }}
                          >
                            <PetsIcon 
                              sx={{ 
                                fontSize: '1.4rem', 
                                color: theme.palette.primary.main 
                              }} 
                            />
                          </Box>
                        </Box>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 500, 
                            mb: 2.5,
                            color: alpha(theme.palette.text.primary, 0.7),
                            fontSize: '1.05rem'
                          }}
                        >
                          {dog.breed}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          paragraph 
                          sx={{ 
                            mb: 3,
                            color: theme.palette.text.secondary,
                            lineHeight: 1.6
                          }}
                        >
                          {dog.description}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 'auto', mb: 2 }}>
                          {dog.tags.map((tag, idx) => (
                            <Chip
                              key={idx}
                              icon={<LocalOfferIcon sx={{ fontSize: '0.85rem' }} />}
                              label={tag}
                              size="small"
                              sx={{ 
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                                color: theme.palette.primary.dark,
                                fontWeight: 500,
                                borderRadius: '25px',
                                px: 0.5,
                                '& .MuiChip-icon': {
                                  color: theme.palette.primary.main
                                }
                              }}
                            />
                          ))}
                        </Box>
                      </CardContent>
                      <CardActions sx={{ p: 3.5, pt: 0 }}>
                        <Button 
                          variant="contained" 
                          fullWidth
                          component={RouterLink}
                          to={`/dogs/${dog._id || dog.id}`}
                          endIcon={<ArrowForwardIcon />}
                          sx={{ 
                            borderRadius: 30,
                            py: 1.2,
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                            boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '1rem',
                            '&:hover': {
                              background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                              boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                            }
                          }}
                        >
                          Meet {dog.name}
                        </Button>
                      </CardActions>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            )}

            <Box sx={{ textAlign: 'center' }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  variant="outlined"
                  size="large"
                  component={RouterLink}
                  to="/dogs"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ 
                    borderRadius: 50, 
                    px: 5, 
                    py: 1.5,
                    borderWidth: 2,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.dark,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                    '&:hover': {
                      borderWidth: 2,
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      boxShadow: '0 6px 15px rgba(0,0,0,0.08)',
                    }
                  }}
                >
                  See All Available Dogs
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Enhanced Success Stories Section */}
      <Box 
        sx={{ 
          bgcolor: 'background.default',
          backgroundImage: `linear-gradient(180deg, ${alpha(theme.palette.secondary.light, 0.05)}, ${alpha(theme.palette.secondary.light, 0.0)})`,
          py: { xs: 8, md: 12 },
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Typography 
              variant="h3" 
              component="h2" 
              align="center" 
              sx={{ 
                fontWeight: 700,
                mb: 2,
                color: theme.palette.secondary.dark,
                fontSize: { xs: '2rem', md: '2.8rem' }
              }}
            >
              Success Stories
            </Typography>
            <Typography 
              variant="h6" 
              align="center" 
              sx={{ 
                maxWidth: 700, 
                mx: 'auto', 
                mb: 8, 
                color: 'text.secondary',
                fontSize: { xs: '1rem', md: '1.15rem' }
              }}
            >
              Hear from families who found their perfect companions through our rescue mission
            </Typography>
          </motion.div>

          <Paper
            elevation={5}
            sx={{
              p: { xs: 2, sm: 4, md: 6 },
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative',
              backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.secondary.light, 0.2)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
              boxShadow: `0 20px 60px ${alpha(theme.palette.secondary.main, 0.15)}`,
              minHeight: { xs: 'auto', md: '500px' }
            }}
          >
            <FormatQuoteIcon 
              sx={{ 
                position: 'absolute', 
                top: 20, 
                left: 20, 
                fontSize: 60, 
                color: alpha(theme.palette.secondary.main, 0.2)
              }} 
            />
            <FormatQuoteIcon 
              sx={{ 
                position: 'absolute', 
                bottom: 20, 
                right: 20, 
                fontSize: 60, 
                transform: 'rotate(180deg)', 
                color: alpha(theme.palette.secondary.main, 0.2)
              }} 
            />

            <Box 
              sx={{ 
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                gap: 6
              }}
            >
              <Box 
                sx={{ 
                  width: { xs: '100%', md: '50%' },
                  position: 'relative',
                  height: { xs: '300px', md: '400px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  key={activeStoryIndex}
                  style={{ width: '100%', height: '100%', position: 'relative' }}
                >
                  <Box
                    component={Paper}
                    elevation={10}
                    sx={{
                      borderRadius: 4,
                      overflow: 'hidden',
                      transform: 'rotate(-2deg)',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                      border: '10px solid white',
                      width: '100%',
                      height: '100%',
                      position: 'relative'
                    }}
                  >
                    <img 
                      src={successStories[activeStoryIndex].image} 
                      alt={`${successStories[activeStoryIndex].name} Story`}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'block',
                        objectFit: 'cover',
                        objectPosition: 'center'
                      }}
                    />
                  </Box>
                </motion.div>
              </Box>

              <Box sx={{ 
                width: { xs: '100%', md: '50%' },
                minHeight: { xs: 'auto', md: '300px' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  key={`text-${activeStoryIndex}`}
                >
                  <Typography 
                    variant="h6" 
                    component="blockquote" 
                    sx={{ 
                      fontStyle: 'italic',
                      mb: 4,
                      lineHeight: 1.6,
                      fontSize: { xs: '1.1rem', md: '1.25rem' },
                      minHeight: '120px'
                    }}
                  >
                    "{successStories[activeStoryIndex].quote}"
                  </Typography>
                </motion.div>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    src={successStories[activeStoryIndex].avatar}
                    alt={successStories[activeStoryIndex].name}
                    sx={{ 
                      width: 60, 
                      height: 60,
                      border: `3px solid ${theme.palette.secondary.main}`,
                      boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h6" component="div" fontWeight={600}>
                      {successStories[activeStoryIndex].name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Happy Pet Family
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                  {successStories.map((_, index) => (
                    <Box
                      key={index}
                      onClick={() => setActiveStoryIndex(index)}
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        mx: 0.75,
                        bgcolor: index === activeStoryIndex ? 'secondary.main' : alpha(theme.palette.secondary.main, 0.3),
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.secondary.main, 0.7)
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Enhanced Newsletter Subscribe Section */}
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 8, md: 12 } }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <Paper 
              elevation={6} 
              sx={{ 
                p: { xs: 4, md: 8 }, 
                borderRadius: 8,
                backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.3)}, ${alpha(theme.palette.primary.main, 0.2)})`,
                boxShadow: `0 25px 50px ${alpha(theme.palette.primary.main, 0.15)}`,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: '-15%',
                  right: '-5%',
                  width: '300px',
                  height: '300px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.4)}, transparent 70%)`,
                  zIndex: 0
                }}
              />
              
              <Box 
                sx={{ 
                  position: 'absolute',
                  bottom: '-20%',
                  left: '-10%',
                  width: '400px',
                  height: '400px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.3)}, transparent 70%)`,
                  zIndex: 0
                }}
              />

              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                alignItems: 'center', 
                gap: 6,
                position: 'relative',
                zIndex: 1
              }}>
                <Box sx={{ width: { xs: '100%', md: '55%' } }}>
                  <motion.div variants={fadeIn}>
                    <Typography 
                      variant="h3" 
                      component="h2" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 700,
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        color: 'primary.dark'
                      }}
                    >
                      Get Our Updates
                    </Typography>
                    <Typography 
                      variant="h6" 
                      paragraph
                      sx={{ 
                        fontSize: { xs: '1.1rem', md: '1.25rem' },
                        mb: 4
                      }}
                    >
                      Subscribe to our newsletter for updates on adoptable dogs, success stories, and upcoming events. Be the first to know when new dogs arrive!
                    </Typography>

                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      mb: 3
                    }}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        mr: 2
                      }}>
                        <PetsIcon sx={{ color: theme.palette.primary.main }} />
                      </Box>
                      <Typography variant="body1" fontWeight={500}>
                        New dogs available for adoption
                      </Typography>
                    </Box>

                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      mb: 3
                    }}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        mr: 2
                      }}>
                        <FavoriteIcon sx={{ color: theme.palette.primary.main }} />
                      </Box>
                      <Typography variant="body1" fontWeight={500}>
                        Inspiring adoption success stories
                      </Typography>
                    </Box>

                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center'
                    }}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        mr: 2
                      }}>
                        <VolunteerActivismIcon sx={{ color: theme.palette.primary.main }} />
                      </Box>
                      <Typography variant="body1" fontWeight={500}>
                        Volunteer opportunities and events
                      </Typography>
                    </Box>
                  </motion.div>
                </Box>

                <Box sx={{ width: { xs: '100%', md: '45%' } }}>
                  <motion.div variants={fadeIn}>
                    {!subscribed ? (
                      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, bgcolor: 'white' }}>
                        <Typography 
                          variant="h6" 
                          gutterBottom 
                          sx={{ fontWeight: 600, mb: 3 }}
                        >
                          Join Our Community
                        </Typography>
                        
                        <Box component="form" onSubmit={handleSubscribe}>
                          <TextField
                            fullWidth
                            label="Your Email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            sx={{ 
                              mb: 3,
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                              }
                            }}
                          />
                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            endIcon={<SendIcon />}
                            sx={{ 
                              py: 1.5,
                              borderRadius: 2,
                              boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                              fontWeight: 600
                            }}
                          >
                            Subscribe
                          </Button>
                        </Box>
                      </Paper>
                    ) : (
                      <Paper 
                        elevation={4}
                        sx={{ 
                          p: 4, 
                          textAlign: 'center',
                          backgroundColor: alpha(theme.palette.success.light, 0.2),
                          borderRadius: 4,
                          boxShadow: `0 8px 32px ${alpha(theme.palette.success.main, 0.2)}`
                        }}
                      >
                        <Box sx={{ 
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          backgroundColor: alpha(theme.palette.success.main, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 3
                        }}>
                          <CheckCircleIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />
                        </Box>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.success.dark }}>
                          Thank You!
                        </Typography>
                        <Typography variant="body1" paragraph>
                          You're now subscribed to our newsletter.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          You'll receive our updates and news in your inbox.
                        </Typography>
                      </Paper>
                    )}
                  </motion.div>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Box>
      </Container>

      {/* Call to Action Section */}
      <Box 
        sx={{
          position: 'relative',
          py: { xs: 10, md: 16 },
          backgroundImage: 'url(https://images.unsplash.com/photo-1594067598377-478c61d59f3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(135deg, rgba(0,0,0,0.8) 0%, ${alpha(theme.palette.primary.dark, 0.85)} 100%)`,
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ 
              textAlign: 'center', 
              maxWidth: 900, 
              mx: 'auto',
              position: 'relative'
            }}>
              {/* Decorative elements */}
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: '-80px',
                  left: { xs: '-20px', md: '-80px' },
                  width: { xs: '100px', md: '180px' },
                  height: { xs: '100px', md: '180px' },
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${alpha(theme.palette.secondary.light, 0.4)}, transparent 70%)`,
                  filter: 'blur(25px)',
                  zIndex: 0
                }}
              />
              
              <Box 
                sx={{ 
                  position: 'absolute',
                  bottom: '-60px',
                  right: { xs: '-20px', md: '-100px' },
                  width: { xs: '120px', md: '200px' },
                  height: { xs: '120px', md: '200px' },
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.3)}, transparent 70%)`,
                  filter: 'blur(25px)',
                  zIndex: 0
                }}
              />
            
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Typography 
                  variant="h6" 
                  component="p"
                  sx={{ 
                    color: theme.palette.secondary.light,
                    fontWeight: 600,
                    mb: 2,
                    textTransform: 'uppercase',
                    letterSpacing: 2
                  }}
                >
                  Join Our Mission
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Typography 
                  variant="h2" 
                  component="h2" 
                  sx={{ 
                    color: 'white',
                    fontWeight: 800,
                    mb: 3,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    textShadow: '0 2px 15px rgba(0,0,0,0.3)',
                    position: 'relative'
                  }}
                >
                  Make a Difference Today
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'white',
                    opacity: 0.9,
                    mb: 6,
                    fontWeight: 400,
                    fontSize: { xs: '1.2rem', md: '1.4rem' },
                    lineHeight: 1.6,
                    maxWidth: 700,
                    mx: 'auto'
                  }}
                >
                  Whether you adopt, donate, or volunteer, your support helps us save more dogs in need and give them the loving homes they deserve.
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={3}
                  justifyContent="center"
                >
                  <Button 
                    variant="contained" 
                    size="large" 
                    component={RouterLink} 
                    to="/donate"
                    startIcon={<HeartIcon />}
                    sx={{ 
                      px: 6, 
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: '50px',
                      background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
                      textTransform: 'none',
                      '&:hover': {
                        background: `linear-gradient(90deg, ${theme.palette.secondary.dark}, ${theme.palette.secondary.main})`,
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 25px rgba(0, 0, 0, 0.4)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Donate Now
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large" 
                    component={RouterLink} 
                    to="/volunteer"
                    startIcon={<VolunteerActivismIcon />}
                    sx={{ 
                      px: 6, 
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: '50px',
                      borderColor: 'white',
                      borderWidth: 2,
                      color: 'white',
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 25px rgba(0, 0, 0, 0.2)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Volunteer With Us
                  </Button>
                </Stack>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 