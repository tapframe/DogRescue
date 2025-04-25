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

// Import the API service and DogData type
import { dogApi, DogData } from '../services/api';

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
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 3, fontWeight: 500, opacity: 0.8 }}>
            Fetching details...
          </Typography>
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
    <Container maxWidth="lg" sx={{ pt: 4, pb: 10 }}>
      {/* Hero Section with Gradient Background */}
      <Box 
        sx={{ 
          position: 'relative',
          mb: 6,
          pt: 2,
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        {/* Back button */}
        <Button 
          component={RouterLink} 
          to="/dogs" 
          sx={{ 
            mb: 2,
            ml: 1,
            color: theme.palette.text.primary,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            }
          }}
          startIcon={<ArrowBackIcon />}
        >
          Back to All Dogs
        </Button>

        <Fade in={true} timeout={800}>
          <Grid container spacing={4}>
            {/* Dog Image Card */}
            <Grid item xs={12} md={6}>
              <Card
                elevation={4}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  height: '100%',
                  maxHeight: 550,
                  position: 'relative',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                  boxShadow: `0 10px 30px -5px ${alpha(theme.palette.common.black, 0.15)}`
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
                  }}
                />
                {/* Status Badge */}
                <Chip
                  label="Available for Adoption"
                  color="success"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    fontWeight: 'bold',
                    px: 1,
                    boxShadow: 2,
                  }}
                />
              </Card>
            </Grid>

            {/* Dog Details */}
            <Grid item xs={12} md={6}>
              <Box sx={{ height: '100%' }}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 4, 
                    borderRadius: 3, 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? alpha(theme.palette.background.paper, 0.8) 
                      : alpha(theme.palette.background.paper, 0.9),
                    backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                    boxShadow: `0 10px 30px -5px ${alpha(theme.palette.common.black, 0.1)}`
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
                      <Typography 
                        variant="h3" 
                        component="h1" 
                        sx={{ 
                          fontWeight: 800,
                          backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          backgroundClip: 'text',
                          color: 'transparent',
                          WebkitBackgroundClip: 'text',
                          display: 'inline-block'
                        }}
                      >
                        {dog.name}
                      </Typography>
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
                  
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6} sm={4}>
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
                    </Grid>
                    <Grid item xs={6} sm={4}>
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
                    </Grid>
                    <Grid item xs={12} sm={4}>
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
                    </Grid>
                  </Grid>
                  
                  <Typography 
                    variant="body1" 
                    paragraph 
                    sx={{ 
                      mb: 3, 
                      lineHeight: 1.8,
                      color: alpha(theme.palette.text.primary, 0.9),
                      fontSize: '1.05rem',
                      fontWeight: 400
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
                          borderRadius: 2,
                          fontWeight: 600,
                          boxShadow: 4,
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 6,
                          }
                        }}
                        startIcon={<PetsIcon />}
                      >
                        Adopt {dog.name}
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        component={RouterLink}
                        to="/volunteer"
                        sx={{ 
                          flex: 1,
                          py: 1.5,
                          px: 3,
                          borderRadius: 2,
                          borderWidth: 2,
                          fontWeight: 600,
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderWidth: 2,
                            transform: 'translateY(-2px)',
                            boxShadow: 2,
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
              mt: 6, 
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: `0 10px 40px -10px ${alpha(theme.palette.common.black, 0.2)}`
            }}
          >
            <Box 
              sx={{ 
                backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                py: 1.5,
                px: 4,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  color: theme.palette.text.primary
                }}
              >
                Adoption Process
              </Typography>
            </Box>
            
            <Box sx={{ p: { xs: 3, md: 4 } }}>
              <Typography 
                variant="body1" 
                paragraph
                sx={{ 
                  mb: 4,
                  maxWidth: 900,
                  color: alpha(theme.palette.text.primary, 0.8)
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
                    <Grow in={true} timeout={(index + 1) * 200}>
                      <Card 
                        elevation={0}
                        sx={{ 
                          p: 3,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: 2,
                          transition: 'all 0.2s',
                          backgroundColor: alpha(theme.palette.primary.main, 0.04),
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                            transform: 'translateY(-4px)',
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
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {step.title}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: alpha(theme.palette.text.primary, 0.7) }}>
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
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    boxShadow: 4,
                    transition: 'all 0.2s',
                    backgroundColor: theme.palette.success.main,
                    '&:hover': {
                      backgroundColor: theme.palette.success.dark,
                      transform: 'translateY(-2px)',
                      boxShadow: 6,
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
                    color: alpha(theme.palette.text.primary, 0.6)
                  }}
                >
                  Typically takes 5-7 days from application to bringing your new friend home
                </Typography>
              </Box>
            </Box>
          </Card>
        </Fade>
      </Box>
    </Container>
  );
};

export default DogDetailPage; 