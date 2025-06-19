import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  GridLegacy as Grid,
  Paper,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardMedia,
  Avatar,
  useTheme,
  alpha,
  Fade,
  Grow,
  lighten,
  Zoom,
  Slide
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CakeIcon from '@mui/icons-material/Cake';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PsychologyIcon from '@mui/icons-material/Psychology';
import PinDropIcon from '@mui/icons-material/PinDrop';
import { motion } from 'framer-motion';

// Import the API service and DogData type
import { dogApi, DogData } from '../services/api';

// Animation variants for framer-motion
const fadeInUp = {
  hidden: { y: 40, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.99] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const DogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [dog, setDog] = useState<DogData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  
  useEffect(() => {
    const fetchDog = async () => {
      if (!id) return; // Don't fetch if ID is missing
      setIsLoading(true);
      setError(null);
      try {
        const fetchedDog = await dogApi.getDogById(id);
        setDog(fetchedDog);
      } catch (err) {
        console.error(`Error fetching dog with ID ${id}:`, err);
        setError("Failed to load dog details. The dog may not exist or the service is unavailable.");
        setDog(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDog();
  }, [id]); // Refetch if ID changes

  // Loading state
  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '70vh' 
        }}>
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 2,
              ease: "easeInOut",
              times: [0, 0.5, 1],
              repeat: Infinity,
              repeatDelay: 0.5
            }}
          >
            <CircularProgress size={60} thickness={4} />
          </motion.div>
          <Fade in={true} timeout={1000}>
            <Typography variant="h6" sx={{ mt: 3, fontWeight: 500, opacity: 0.8 }}>
              Fetching details...
            </Typography>
          </Fade>
        </Box>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ 
          my: 8, 
          textAlign: 'center', 
          p: 4, 
          borderRadius: 2, 
          backgroundColor: alpha(theme.palette.error.light, 0.1) 
        }}>
          <Alert 
            severity="error" 
            variant="filled"
            sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}
          >
            {error}
          </Alert>
          <Button 
            variant="contained" 
            component={RouterLink} 
            to="/dogs"
            size="large"
            startIcon={<ArrowBackIcon />}
            sx={{ 
              px: 3, 
              py: 1.2, 
              borderRadius: 2,
              boxShadow: 2,
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4,
              }
            }}
          >
            Back to All Dogs
          </Button>
        </Box>
      </Container>
    );
  }

  // Dog not found (after fetch attempt)
  if (!dog) {
    return (
      <Container maxWidth="md">
        <Box sx={{ 
          my: 8, 
          textAlign: 'center',
          p: 4, 
          borderRadius: 2, 
          backgroundColor: alpha(theme.palette.warning.light, 0.1) 
        }}>
          <Alert 
            severity="warning" 
            variant="filled"
            sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}
          >
            Dog not found. The dog you're looking for may not exist or has been adopted.
          </Alert>
          <Button 
            variant="contained" 
            component={RouterLink} 
            to="/dogs"
            size="large"
            startIcon={<ArrowBackIcon />}
            sx={{ 
              px: 3, 
              py: 1.2, 
              borderRadius: 2,
              boxShadow: 2,
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4,
              }
            }}
          >
            View All Dogs
          </Button>
        </Box>
      </Container>
    );
  }

  // Helper function to get gender icon
  const getGenderIcon = () => {
    return dog.gender?.toLowerCase() === 'female' 
      ? <FemaleIcon sx={{ color: theme.palette.secondary.main }} />
      : <MaleIcon sx={{ color: theme.palette.primary.main }} />;
  };

  // Render dog details
  return (
    <Box 
      sx={{ 
        width: '100%',
        minHeight: '100vh',
        background: `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.light, 0.15)} 0%, 
          ${alpha(theme.palette.background.default, 0.9)} 40%, 
          ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        pt: 2,
        pb: 10
      }}
    >
      {/* Background decorative elements */}
      <Box 
        sx={{ 
          position: 'absolute',
          top: '5%',
          right: '5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.3)}, transparent 70%)`,
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />
      
      <Box 
        sx={{ 
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.light, 0.25)}, transparent 70%)`,
          filter: 'blur(50px)',
          zIndex: 0
        }}
      />
      
      <Box 
        sx={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.08)}, transparent 60%)`,
          filter: 'blur(60px)',
          transform: 'translate(-50%, -50%)',
          zIndex: 0
        }}
      />
    
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ my: { xs: 3, md: 5 } }}>
          {/* Back button */}
          <Slide direction="right" in={true} timeout={600} mountOnEnter>
            <Button 
              component={RouterLink} 
              to="/dogs" 
              sx={{ 
                mb: { xs: 3, md: 5 },
                ml: 1,
                color: theme.palette.text.primary,
                fontWeight: 500,
                fontSize: '0.95rem',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  transform: 'translateX(-4px)',
                }
              }}
              startIcon={<ArrowBackIcon />}
            >
              Back to All Dogs
            </Button>
          </Slide>

          <Fade in={true} timeout={800}>
            <Grid container spacing={{ xs: 4, md: 6 }} alignItems="stretch">
              {/* Dog Image Card */}
              <Grid item xs={12} md={6}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    height: '100%',
                    maxHeight: 550,
                    position: 'relative',
                    transition: 'all 0.4s ease-in-out',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    '&:hover': {
                      transform: 'scale(1.02) translateY(-5px)',
                      boxShadow: `0 20px 40px -10px ${alpha(theme.palette.common.black, 0.2)}`
                    },
                    boxShadow: `0 15px 35px -5px ${alpha(theme.palette.common.black, 0.15)}`
                  }}
                >
                  <CardMedia
                    component="img"
                    image={dog.image || 'https://via.placeholder.com/500'} // Fallback image
                    alt={dog.name}
                    sx={{
                      height: '100%',
                      width: '100%',
                      objectFit: 'cover',
                      transition: 'transform 1.5s ease',
                      '&:hover': {
                        transform: 'scale(1.08)',
                      }
                    }}
                  />
                  {/* Status Badge */}
                  <Chip
                    label="Available for Adoption"
                    color="success"
                    sx={{
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      fontWeight: 'bold',
                      px: 1.5,
                      py: 2.5,
                      fontSize: '0.85rem',
                      letterSpacing: '0.03em',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      backdropFilter: 'blur(4px)',
                      backgroundColor: alpha(theme.palette.success.main, 0.85),
                      border: `1px solid ${alpha(theme.palette.success.light, 0.5)}`,
                    }}
                  />
                </Card>
              </Grid>

              {/* Dog Details */}
              <Grid item xs={12} md={6}>
                <Box sx={{ height: '100%' }}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: { xs: 3, md: 4 }, 
                      borderRadius: '16px', 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: alpha(theme.palette.background.paper, 0.7),
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                      backgroundImage: `linear-gradient(135deg, 
                        ${alpha(theme.palette.background.paper, 0.95)} 0%, 
                        ${alpha(theme.palette.background.paper, 0.85)} 100%)`,
                      boxShadow: `0 15px 35px -10px ${alpha(theme.palette.common.black, 0.1)}`
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          backgroundColor: theme.palette.primary.main, 
                          width: 56, 
                          height: 56,
                          mr: 2,
                          boxShadow: 2
                        }}
                      >
                        <PetsIcon sx={{ fontSize: 30 }} />
                      </Avatar>
                      <Box>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            delay: 0.2,
                            duration: 0.6,
                            ease: [0.6, 0.05, 0.01, 0.99]
                          }}
                        >
                          <Typography 
                            variant="h3" 
                            component="h1" 
                            sx={{ 
                              fontWeight: 800,
                              backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark} 50%, ${theme.palette.primary.main} 100%)`,
                              backgroundClip: 'text',
                              color: 'transparent',
                              WebkitBackgroundClip: 'text',
                              display: 'inline-block',
                              letterSpacing: '-0.5px',
                              marginBottom: '4px',
                              fontSize: { xs: '2.2rem', md: '2.8rem' }
                            }}
                          >
                            {dog.name}
                          </Typography>
                        </motion.div>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getGenderIcon()}
                          <Typography 
                            variant="subtitle1" 
                            sx={{ ml: 1, fontWeight: 500, opacity: 0.8 }}
                          >
                            {dog.gender}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6} sm={4}>
                          <motion.div variants={fadeInUp}>
                            <Card 
                              elevation={0} 
                              sx={{ 
                                p: 1.5, 
                                textAlign: 'center',
                                borderRadius: 2,
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CakeIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {dog.age}
                                </Typography>
                              </Box>
                              <Typography variant="caption" sx={{ opacity: 0.7 }}>Age</Typography>
                            </Card>
                          </motion.div>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <motion.div variants={fadeInUp}>
                            <Card 
                              elevation={0} 
                              sx={{ 
                                p: 1.5, 
                                textAlign: 'center',
                                borderRadius: 2,
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FitnessCenterIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {dog.size}
                                </Typography>
                              </Box>
                              <Typography variant="caption" sx={{ opacity: 0.7 }}>Size</Typography>
                            </Card>
                          </motion.div>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <motion.div variants={fadeInUp}>
                            <Card 
                              elevation={0} 
                              sx={{ 
                                p: 1.5, 
                                textAlign: 'center',
                                borderRadius: 2,
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600} noWrap>
                                {dog.breed}
                              </Typography>
                              <Typography variant="caption" sx={{ opacity: 0.7 }}>Breed</Typography>
                            </Card>
                          </motion.div>
                        </Grid>
                      </Grid>
                    </motion.div>
                    
                    <Typography 
                      variant="body1" 
                      paragraph 
                      sx={{ 
                        mb: 3, 
                        lineHeight: 1.9,
                        color: alpha(theme.palette.text.primary, 0.9),
                        fontSize: '1.05rem',
                        fontWeight: 400,
                        letterSpacing: '0.015em',
                        textAlign: 'justify',
                        '&::first-letter': {
                          fontSize: '1.5em',
                          fontWeight: 500,
                          color: theme.palette.primary.main,
                        }
                      }}
                    >
                      {dog.description}
                    </Typography>
                    
                    {/* Tags */}
                    {dog.tags && dog.tags.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Characteristics:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {dog.tags.map((tag, index) => (
                            <Grow in={true} key={index} timeout={(index + 1) * 200}>
                              <Chip 
                                label={tag}
                                size="medium"
                                sx={{ 
                                  borderRadius: '16px',
                                  fontWeight: 500,
                                  backgroundColor: index % 3 === 0 
                                    ? alpha(theme.palette.primary.main, 0.1)
                                    : index % 3 === 1
                                    ? alpha(theme.palette.secondary.main, 0.1)
                                    : alpha(theme.palette.success.main, 0.1),
                                  color: index % 3 === 0 
                                    ? theme.palette.primary.main
                                    : index % 3 === 1
                                    ? theme.palette.secondary.main
                                    : theme.palette.success.main,
                                  '&:hover': {
                                    backgroundColor: index % 3 === 0 
                                      ? alpha(theme.palette.primary.main, 0.2)
                                      : index % 3 === 1
                                      ? alpha(theme.palette.secondary.main, 0.2)
                                      : alpha(theme.palette.success.main, 0.2),
                                  }
                                }}
                              />
                            </Grow>
                          ))}
                        </Box>
                      </Box>
                    )}
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            mb: 2
                          }}
                        >
                          <Avatar 
                            sx={{ 
                              bgcolor: alpha(theme.palette.success.main, 0.1), 
                              color: theme.palette.success.main,
                              width: 36,
                              height: 36,
                              mr: 2
                            }}
                          >
                            <LocalHospitalIcon fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Medical
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Vaccinated, Neutered
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            mb: 2
                          }}
                        >
                          <Avatar 
                            sx={{ 
                              bgcolor: alpha(theme.palette.info.main, 0.1), 
                              color: theme.palette.info.main,
                              width: 36,
                              height: 36,
                              mr: 2
                            }}
                          >
                            <PsychologyIcon fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Temperament
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Kid-friendly, Good with other dogs
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center'
                          }}
                        >
                          <Avatar 
                            sx={{ 
                              bgcolor: alpha(theme.palette.warning.main, 0.1), 
                              color: theme.palette.warning.main,
                              width: 36,
                              height: 36,
                              mr: 2
                            }}
                          >
                            <PinDropIcon fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Location
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Currently at our main shelter
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 'auto', pt: 3 }}>
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="contained"
                            size="large"
                            color="primary"
                            component={RouterLink}
                            to="/contact"
                            sx={{ 
                              flex: 1,
                              py: 1.5,
                              px: 3,
                              borderRadius: '30px',
                              fontWeight: 700,
                              letterSpacing: '0.03em',
                              textTransform: 'none',
                              boxShadow: `0 8px 25px -5px ${alpha(theme.palette.primary.main, 0.35)}`,
                              transition: 'all 0.3s',
                              backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                              '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: `0 12px 30px -5px ${alpha(theme.palette.primary.main, 0.5)}`,
                              }
                            }}
                            startIcon={<PetsIcon />}
                          >
                            Adopt {dog.name}
                          </Button>
                        </motion.div>
                        <Button
                          variant="outlined"
                          size="large"
                          component={RouterLink}
                          to="/volunteer"
                          sx={{ 
                            flex: 1,
                            py: 1.5,
                            px: 3,
                            borderRadius: '30px',
                            borderWidth: 2,
                            fontWeight: 700,
                            textTransform: 'none',
                            letterSpacing: '0.03em',
                            color: theme.palette.primary.main,
                            borderColor: alpha(theme.palette.primary.main, 0.5),
                            transition: 'all 0.3s',
                            '&:hover': {
                              borderWidth: 2,
                              transform: 'translateY(-5px)',
                              boxShadow: `0 10px 25px -5px ${alpha(theme.palette.primary.main, 0.2)}`,
                              borderColor: theme.palette.primary.main,
                              backgroundColor: alpha(theme.palette.primary.main, 0.05),
                            }
                          }}
                          startIcon={<FavoriteIcon />}
                        >
                          Foster {dog.name}
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Fade>

          {/* Additional Information Section */}
          <Fade in={true} timeout={1000}>
            <Card 
              sx={{ 
                mt: { xs: 6, md: 8 }, 
                borderRadius: '16px',
                overflow: 'hidden',
                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                boxShadow: `0 15px 50px -12px ${alpha(theme.palette.common.black, 0.15)}`
              }}
            >
              <Box 
                sx={{ 
                  backgroundImage: `linear-gradient(135deg, 
                    ${lighten(theme.palette.primary.light, 0.85)} 0%, 
                    ${lighten(theme.palette.secondary.light, 0.85)} 100%)`,
                  py: 2,
                  px: 4,
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100px',
                    height: '100%',
                    backgroundImage: `linear-gradient(90deg, 
                      transparent, 
                      ${alpha(theme.palette.primary.light, 0.15)})`,
                    filter: 'blur(15px)',
                  }
                }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    position: 'relative',
                    display: 'inline-block',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: '40%',
                      height: 3,
                      borderRadius: 3,
                      backgroundColor: theme.palette.primary.main,
                    }
                  }}
                >
                  Adoption Process
                </Typography>
              </Box>
              
              <Box sx={{ p: { xs: 3, md: 4.5 } }}>
                <Typography 
                  variant="body1" 
                  paragraph
                  sx={{ 
                    mb: 4,
                    maxWidth: 900,
                    color: alpha(theme.palette.text.primary, 0.8),
                    lineHeight: 1.8,
                    fontSize: '1.02rem',
                  }}
                >
                  Our adoption process is designed to ensure that our dogs find loving, suitable homes. 
                  Here's what to expect:
                </Typography>
                
                <Grid container spacing={3}>
                  {[
                    {
                      title: "Application",
                      description: "Fill out our adoption application form to get started."
                    },
                    {
                      title: "Meet and Greet",
                      description: "Schedule a meeting with the dog to ensure it's a good match."
                    },
                    {
                      title: "Home Visit",
                      description: "We'll conduct a brief home check to ensure it's suitable for the dog."
                    },
                    {
                      title: "Adoption Fee",
                      description: "The adoption fee helps cover medical costs, food, and shelter while in our care."
                    },
                    {
                      title: "Take Home",
                      description: "Once approved, you can welcome your new family member home!"
                    }
                  ].map((step, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                      <Grow 
                        in={true} 
                        timeout={(index + 1) * 300}
                        style={{ transformOrigin: '0 0 0' }}
                      >
                        <Card 
                          elevation={0}
                          sx={{ 
                            p: 3,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: '12px',
                            transition: 'all 0.3s',
                            backgroundColor: alpha(theme.palette.primary.main, 0.04),
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.08),
                              transform: 'translateY(-8px)',
                              boxShadow: `0 10px 30px -5px ${alpha(theme.palette.primary.main, 0.15)}`,
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar
                              sx={{
                                bgcolor: theme.palette.primary.main,
                                mr: 1.5,
                                width: 34,
                                height: 34,
                                fontWeight: 'bold'
                              }}
                            >
                              {index + 1}
                            </Avatar>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 700,
                              color: theme.palette.primary.dark,
                              fontSize: '1.1rem',
                            }}>
                              {step.title}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ 
                            color: alpha(theme.palette.text.primary, 0.7),
                            lineHeight: 1.6,
                            fontSize: '0.95rem',
                          }}>
                            {step.description}
                          </Typography>
                        </Card>
                      </Grow>
                    </Grid>
                  ))}
                </Grid>
                
                <Box sx={{ mt: 6, textAlign: 'center' }}>
                  <Button 
                    variant="contained" 
                    size="large" 
                    component={RouterLink} 
                    to="/contact"
                    sx={{ 
                      px: 5, 
                      py: 1.8,
                      borderRadius: '30px',
                      fontWeight: 700,
                      textTransform: 'none',
                      letterSpacing: '0.03em',
                      boxShadow: `0 8px 25px -5px ${alpha(theme.palette.success.main, 0.35)}`,
                      transition: 'all 0.3s',
                      backgroundImage: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                      '&:hover': {
                        transform: 'translateY(-5px) scale(1.03)',
                        boxShadow: `0 12px 30px -5px ${alpha(theme.palette.success.main, 0.5)}`,
                      }
                    }}
                  >
                    Start Adoption Process
                  </Button>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 2,
                      fontStyle: 'italic',
                      color: alpha(theme.palette.text.primary, 0.6),
                      fontSize: '0.92rem',
                      letterSpacing: '0.01em',
                      maxWidth: 500,
                      mx: 'auto'
                    }}
                  >
                    Typically takes 5-7 days from application to bringing your new friend home
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Fade>

          {/* Dog features section - Add a new section with the dog's features */}
          <Fade in={true} timeout={1200}>
            <Box 
              sx={{ 
                mt: { xs: 4, md: 6 }, 
                p: { xs: 3, md: 4 },
                borderRadius: '16px',
                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                backgroundColor: alpha(theme.palette.background.paper, 0.7),
                backdropFilter: 'blur(10px)',
                boxShadow: `0 15px 35px -10px ${alpha(theme.palette.common.black, 0.1)}`
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    position: 'relative',
                    display: 'inline-block',
                    mb: 4,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: '40%',
                      height: 3,
                      borderRadius: 3,
                      backgroundColor: theme.palette.secondary.main,
                    }
                  }}
                >
                  {dog.name}'s Features
                </Typography>
              </motion.div>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        mr: 2
                      }}
                    >
                      <CakeIcon color="primary" />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Age</Typography>
                      <Typography variant="subtitle1" fontWeight={600}>{dog.age}</Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                        mr: 2
                      }}
                    >
                      <FitnessCenterIcon color="secondary" />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Size</Typography>
                      <Typography variant="subtitle1" fontWeight={600}>{dog.size}</Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        mr: 2
                      }}
                    >
                      {getGenderIcon()}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Gender</Typography>
                      <Typography variant="subtitle1" fontWeight={600}>{dog.gender}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" fontWeight={600} mb={2} mt={1}>
                    Characteristics
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {dog.tags && dog.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        variant="outlined"
                        sx={{
                          borderRadius: '20px',
                          borderColor: alpha(theme.palette.primary.main, 0.4),
                          color: theme.palette.primary.main,
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        </Box>
      </Container>
    </Box>
  );
};

export default DogDetailPage; 