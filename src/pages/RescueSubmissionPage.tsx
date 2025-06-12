import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  GridLegacy as Grid, 
  TextField, 
  Button, 
  Paper, 
  Alert, 
  Snackbar,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Divider,
  alpha,
  useTheme,
  styled,
  Card,
  CardContent,
  Stack,
  Chip,
  IconButton,
  Avatar,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PetsIcon from '@mui/icons-material/Pets';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SendIcon from '@mui/icons-material/Send';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Helmet } from 'react-helmet-async';

// Import API service
import { rescueApi, RescueSubmissionData } from '../services/api';
import { userAuthService } from '../services/userAuthService';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const slideUp = {
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Styled components
const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${alpha(theme.palette.primary.main, 0.5)}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-2px)'
  }
}));

const StepHeading = styled(Typography)(({ theme }) => ({
  position: 'relative',
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 50,
    height: 3,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 3
  }
}));

const GradientHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  textAlign: 'center',
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  marginBottom: theme.spacing(1),
  position: 'relative',
  display: 'inline-block'
}));

const RootBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
  backgroundAttachment: 'fixed',
  minHeight: '100vh',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url(https://images.unsplash.com/photo-1518155317743-a8ff43ea6a5f?q=80&w=2070)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.05,
    zIndex: -1
  }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 3,
  overflow: 'hidden',
  boxShadow: `0 20px 60px -12px ${alpha(theme.palette.common.black, 0.15)}`,
  transition: 'all 0.3s ease',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  backdropFilter: 'blur(10px)',
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 5,
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
  }
}));

const ImagePreviewWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 150,
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  boxShadow: `0 10px 30px -10px ${alpha(theme.palette.common.black, 0.2)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.03)',
    '& .delete-button': {
      opacity: 1
    }
  }
}));

// Add animated paws and floating particles
const AnimatedPaw = ({ size, delay, duration }: { size: number, delay: number, duration: number }) => {
  return (
    <motion.div
      initial={{ 
        x: Math.random() * window.innerWidth, 
        y: Math.random() * window.innerHeight,
        opacity: 0.1,
        scale: 0.5
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
        opacity: [0.1, 0.2, 0.1],
        scale: [0.5, 0.6, 0.5],
        rotate: [0, 180, 360]
      }}
      transition={{ 
        duration, 
        repeat: Infinity, 
        delay, 
        ease: "linear"
      }}
      style={{
        position: 'absolute',
        color: 'rgba(0,0,0,0.07)',
        zIndex: -1
      }}
    >
      <PetsIcon style={{ fontSize: size }} />
    </motion.div>
  );
};

// Define interface for form data
interface RescueFormData {
  name?: string;
  breed?: string;
  gender: string;
  age: string;
  size: string;
  location: string;
  description: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  images: File[];
}

// Define initial form values
const initialFormData: RescueFormData = {
  name: '',
  breed: '',
  gender: '',
  age: '',
  size: '',
  location: '',
  description: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  images: []
};

const RescueSubmissionPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [formData, setFormData] = useState<RescueFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle select field changes
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...filesArray]
      }));

      // Create preview URLs for the images
      const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  // Handle removing an image
  const handleRemoveImage = (index: number) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });

    // Also remove the preview URL
    setImagePreviewUrls(prev => {
      const newUrls = [...prev];
      URL.revokeObjectURL(newUrls[index]); // Clean up the URL object
      newUrls.splice(index, 1);
      return newUrls;
    });
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.gender) newErrors.gender = "Please select the dog's gender";
    if (!formData.age) newErrors.age = "Please select an approximate age";
    if (!formData.size) newErrors.size = "Please select the dog's size";
    if (!formData.location) newErrors.location = "Please provide location where the dog was found";
    if (!formData.description) newErrors.description = "Please provide a description";
    if (!formData.contactName) newErrors.contactName = "Please provide your name";
    if (!formData.contactEmail) {
      newErrors.contactEmail = "Please provide your email";
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Please provide a valid email address";
    }
    if (!formData.contactPhone) newErrors.contactPhone = "Please provide your phone number";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get current user information
      const currentUser = userAuthService.getCurrentUser();
      
      // Convert form data to API submission format
      const submissionData: RescueSubmissionData = {
        name: formData.name,
        breed: formData.breed,
        gender: formData.gender,
        age: formData.age,
        size: formData.size,
        location: formData.location,
        description: formData.description,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        // In a real application, you would upload images and get URLs
        imageUrls: formData.images.length > 0 ? ['placeholder-image-url.jpg'] : [],
        // Include user information if logged in
        user: currentUser?.id?.toString() || currentUser?._id,
        userName: currentUser?.name,
        userEmail: currentUser?.email
      };
      
      // Submit to API
      const response = await rescueApi.submitRescueRequest(submissionData);
      
      setSnackbar({
        open: true,
        message: 'Your rescue dog submission has been received successfully! We will contact you soon.',
        severity: 'success'
      });
      
      // Show success screen
      setSubmitted(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData(initialFormData);
        setImagePreviewUrls([]);
      }, 500);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSnackbar({
        open: true,
        message: 'There was an error submitting your form. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle closing the snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  // Reset submission state to allow new submission
  const handleNewSubmission = () => {
    setSubmitted(false);
  };
  
  // Scroll to form
  const scrollToForm = () => {
    const formElement = document.getElementById('rescue-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
              backgroundImage: 'url(https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1649&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
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
                Every report saves a dog in need
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
                      <PetsIcon sx={{ mr: 1, color: theme.palette.secondary.light }} />
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
                        Help Save A Life
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
                      Report a <Box 
                        component="span" 
                        sx={{ 
                          color: theme.palette.secondary.light,
                          position: 'relative',
                          display: 'inline-block'
                        }}
                      >
                        Dog 
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
                        In Need
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
                      Every report you submit helps us locate and rescue dogs in need. 
                      Provide details about stray or abandoned dogs, and our rescue teams will respond quickly.
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
                        onClick={scrollToForm}
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
                        Report Now
                      </Button>
                      <Button
                        variant="outlined"
                        color="inherit"
                        size="large"
                        onClick={scrollToForm}
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
                        Learn More
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
                      transform: 'rotate(-2deg)',
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
                        src="https://images.unsplash.com/photo-1546975490-e8b92a360b24?ixlib=rb-4.0.3&auto=format&fit=crop&w=934&q=80"
                        alt="Stray dog needing help"
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
                        "Every rescue starts with a report"
                      </Typography>
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
        
        {/* Scroll indicator */}
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: 20, 
            left: '50%', 
            transform: 'translateX(-50%)', 
            zIndex: 5,
            textAlign: 'center',
            cursor: 'pointer'
          }}
          onClick={scrollToForm}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <Typography 
              variant="button" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                textTransform: 'uppercase',
                fontWeight: 500,
                letterSpacing: 1.2,
                fontSize: '0.8rem',
                display: 'block',
                mb: 1
              }}
            >
              Scroll Down
            </Typography>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <KeyboardArrowDownIcon 
                sx={{ 
                  color: 'white', 
                  fontSize: '2rem',
                  opacity: 0.7,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                }} 
              />
            </motion.div>
          </motion.div>
        </Box>
      </Box>

      {/* Main Content with Form */}
      <RootBox>
        <Helmet>
          <title>Report a Dog in Need | Dog Rescue</title>
          <meta name="description" content="Help us save dogs in need by reporting stray or abandoned dogs that require rescue. Fill out our form and our team will respond quickly." />
        </Helmet>

        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }} id="rescue-form">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            {/* Background animations */}
            {[...Array(12)].map((_, i) => (
              <AnimatedPaw 
                key={`paw-${i}`}
                size={24 + Math.random() * 36}
                delay={i * 0.5}
                duration={15 + Math.random() * 25}
              />
            ))}

            <Grid container justifyContent="center" sx={{ mb: 6 }}>
              <Grid item xs={12} md={10} textAlign="center">
                <motion.div variants={slideUp}>
                  <Chip 
                    icon={<PetsIcon />} 
                    label="Rescue Program" 
                    color="secondary" 
                    sx={{ 
                      mb: 2, 
                      px: 2, 
                      py: 1, 
                      fontWeight: 600, 
                      fontSize: '0.9rem',
                      boxShadow: `0 8px 16px -4px ${alpha(theme.palette.secondary.main, 0.3)}`
                    }} 
                  />
                  <GradientHeading variant="h2">
                    Report a Dog in Need
                  </GradientHeading>

                  <Typography 
                    variant="subtitle1" 
                    component="h2"
                    sx={{ 
                      mb: 4,
                      maxWidth: 700,
                      mx: 'auto',
                      color: alpha(theme.palette.text.primary, 0.7)
                    }}
                  >
                    Every rescue starts with awareness. Your report could save a life and give a dog a second chance at happiness.
                  </Typography>
                </motion.div>
              </Grid>
            </Grid>
            
            <AnimatePresence mode="wait">
              {submitted ? (
                /* Success Screen */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      textAlign: 'center',
                      py: 8,
                      px: 3
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 120, 
                        height: 120, 
                        borderRadius: '50%', 
                        backgroundColor: alpha(theme.palette.success.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 4,
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: -10,
                          left: -10,
                          right: -10,
                          bottom: -10,
                          borderRadius: '50%',
                          border: `2px solid ${alpha(theme.palette.success.main, 0.2)}`,
                          animation: 'pulse 2s infinite'
                        }
                      }}
                    >
                      <CheckCircleIcon 
                        color="success" 
                        sx={{ 
                          fontSize: 70,
                          filter: `drop-shadow(0 4px 12px ${alpha(theme.palette.success.main, 0.4)})`
                        }} 
                      />
                    </Box>
                    <Typography variant="h3" fontWeight={700} gutterBottom>
                      Thank You!
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>
                      Your rescue submission has been received. Our team will review your information and contact you within 24-48 hours to coordinate the rescue.
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      onClick={handleNewSubmission}
                      sx={{ 
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        boxShadow: `0 8px 16px -4px ${alpha(theme.palette.primary.main, 0.2)}`,
                        fontSize: '1rem'
                      }}
                    >
                      Submit Another Rescue
                    </Button>
                  </Box>
                </motion.div>
              ) : (
                /* Main Form Content */
                <Grid container spacing={4}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ position: 'sticky', top: 24 }}>
                      <Card elevation={3} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
                        <Box sx={{ 
                          backgroundColor: theme.palette.primary.main, 
                          py: 2, 
                          px: 3,
                          borderBottom: `1px solid ${alpha(theme.palette.primary.dark, 0.2)}`
                        }}>
                          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                            Important Information
                          </Typography>
                        </Box>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="body1" paragraph>
                            If you've found a stray dog or know of a dog that needs rescue, please fill out this form.
                            Our team will review your submission and get in touch with you soon.
                          </Typography>
                          <Alert 
                            severity="warning" 
                          sx={{ 
                            mt: 2, 
                            borderRadius: 1.5,
                            backgroundColor: alpha(theme.palette.warning.main, 0.1)
                          }}
                        >
                          <Typography variant="body2" fontWeight={500}>
                            If the dog is injured or in immediate danger, please contact your local animal control
                            or emergency services in addition to submitting this form.
                          </Typography>
                        </Alert>
                      </CardContent>
                    </Card>

                    <Card elevation={3} sx={{ borderRadius: 2 }}>
                      <Box sx={{ 
                        backgroundColor: theme.palette.info.light, 
                        py: 2, 
                        px: 3,
                        borderBottom: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                      }}>
                        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                          <HelpOutlineIcon sx={{ mr: 1 }} />
                          What happens next?
                        </Typography>
                      </Box>
                      <CardContent sx={{ p: 3 }}>
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                            <Box sx={{ 
                              bgcolor: alpha(theme.palette.info.main, 0.1), 
                              color: theme.palette.info.main,
                              borderRadius: '50%',
                              width: 24,
                              height: 24,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              flexShrink: 0
                            }}>
                              1
                            </Box>
                            <Typography variant="body2">
                              Our team will review your submission within 24-48 hours.
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                            <Box sx={{ 
                              bgcolor: alpha(theme.palette.info.main, 0.1), 
                              color: theme.palette.info.main,
                              borderRadius: '50%',
                              width: 24,
                              height: 24,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              flexShrink: 0
                            }}>
                              2
                            </Box>
                            <Typography variant="body2">
                              A rescue coordinator will contact you to gather additional information if needed.
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                            <Box sx={{ 
                              bgcolor: alpha(theme.palette.info.main, 0.1), 
                              color: theme.palette.info.main,
                              borderRadius: '50%',
                              width: 24,
                              height: 24,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              flexShrink: 0
                            }}>
                              3
                            </Box>
                            <Typography variant="body2">
                              We'll dispatch a rescue team to the location to safely retrieve the dog.
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                            <Box sx={{ 
                              bgcolor: alpha(theme.palette.info.main, 0.1), 
                              color: theme.palette.info.main,
                              borderRadius: '50%',
                              width: 24,
                              height: 24,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              flexShrink: 0
                            }}>
                              4
                            </Box>
                            <Typography variant="body2">
                              The dog will receive necessary medical care and be placed in a foster home until adoption.
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <motion.div variants={slideUp}>
                    <StyledCard elevation={10}>
                      <Box sx={{ 
                        py: 3.5,
                        px: 4,
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        position: 'relative',
                        overflow: 'hidden',
                        background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: 5,
                          height: '100%',
                          background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                        }
                      }}>
                        <Typography variant="h5" fontWeight={700} sx={{ pl: 1 }}>
                          Rescue Submission Form
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>
                          Please provide as much information as possible about the dog in need
                        </Typography>
                      </Box>
                      
                      <CardContent sx={{ p: 4 }}>
                        <form onSubmit={handleSubmit}>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <StepHeading variant="h6">
                                <PetsIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                                Dog Information
                              </StepHeading>
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Dog's Name (if known)"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                variant="outlined"
                                helperText="Leave blank if unknown"
                              />
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Breed (if known)"
                                name="breed"
                                value={formData.breed}
                                onChange={handleChange}
                                variant="outlined"
                                helperText="Leave blank if unknown"
                              />
                            </Grid>
                            
                            <Grid item xs={12} sm={4}>
                              <FormControl fullWidth error={!!errors.gender}>
                                <InputLabel id="gender-label">Gender</InputLabel>
                                <Select
                                  labelId="gender-label"
                                  name="gender"
                                  value={formData.gender}
                                  onChange={handleSelectChange}
                                  label="Gender"
                                >
                                  <MenuItem value="Male">Male</MenuItem>
                                  <MenuItem value="Female">Female</MenuItem>
                                  <MenuItem value="Unknown">Unknown</MenuItem>
                                </Select>
                                {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
                              </FormControl>
                            </Grid>
                            
                            <Grid item xs={12} sm={4}>
                              <FormControl fullWidth error={!!errors.age}>
                                <InputLabel id="age-label">Approximate Age</InputLabel>
                                <Select
                                  labelId="age-label"
                                  name="age"
                                  value={formData.age}
                                  onChange={handleSelectChange}
                                  label="Approximate Age"
                                >
                                  <MenuItem value="Puppy (Under 1 year)">Puppy (Under 1 year)</MenuItem>
                                  <MenuItem value="Young (1-3 years)">Young (1-3 years)</MenuItem>
                                  <MenuItem value="Adult (3-8 years)">Adult (3-8 years)</MenuItem>
                                  <MenuItem value="Senior (8+ years)">Senior (8+ years)</MenuItem>
                                  <MenuItem value="Unknown">Unknown</MenuItem>
                                </Select>
                                {errors.age && <FormHelperText>{errors.age}</FormHelperText>}
                              </FormControl>
                            </Grid>
                            
                            <Grid item xs={12} sm={4}>
                              <FormControl fullWidth error={!!errors.size}>
                                <InputLabel id="size-label">Size</InputLabel>
                                <Select
                                  labelId="size-label"
                                  name="size"
                                  value={formData.size}
                                  onChange={handleSelectChange}
                                  label="Size"
                                >
                                  <MenuItem value="Small">Small (Under 20 lbs)</MenuItem>
                                  <MenuItem value="Medium">Medium (20-50 lbs)</MenuItem>
                                  <MenuItem value="Large">Large (50-90 lbs)</MenuItem>
                                  <MenuItem value="Extra Large">Extra Large (90+ lbs)</MenuItem>
                                </Select>
                                {errors.size && <FormHelperText>{errors.size}</FormHelperText>}
                              </FormControl>
                            </Grid>
                            
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Location Where Found"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                variant="outlined"
                                required
                                error={!!errors.location}
                                helperText={errors.location || "Please be as specific as possible (address, landmarks, etc.)"}
                                InputProps={{
                                  startAdornment: <LocationOnIcon color="action" sx={{ mr: 1 }} />,
                                }}
                              />
                            </Grid>
                            
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                variant="outlined"
                                multiline
                                rows={4}
                                required
                                error={!!errors.description}
                                helperText={errors.description || "Please describe the dog's condition, behavior, and any other relevant details"}
                              />
                            </Grid>
                            
                            <Grid item xs={12}>
                              <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1, mt: 1, display: 'flex', alignItems: 'center' }}>
                                <ImageIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                                Upload Photos (optional)
                              </Typography>
                              <input
                                accept="image/*"
                                id="image-upload"
                                type="file"
                                multiple
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                              />
                              <label htmlFor="image-upload">
                                <UploadBox>
                                  <PhotoCameraIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                                  <Typography variant="body1" gutterBottom fontWeight={500}>
                                    Click to upload photos
                                  </Typography>
                                  <Typography variant="body2" color="textSecondary">
                                    Photos help us identify the dog and assess its condition
                                  </Typography>
                                </UploadBox>
                              </label>

                              {imagePreviewUrls.length > 0 && (
                                <Grid container spacing={2} sx={{ mt: 2 }}>
                                  {imagePreviewUrls.map((url, index) => (
                                    <Grid item xs={6} sm={4} md={3} key={index}>
                                      <ImagePreviewWrapper>
                                        <img
                                          src={url}
                                          alt={`Preview ${index}`}
                                          style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                          }}
                                        />
                                        <IconButton
                                          size="small"
                                          onClick={() => handleRemoveImage(index)}
                                          sx={{
                                            position: 'absolute',
                                            top: 5,
                                            right: 5,
                                            bgcolor: alpha(theme.palette.error.main, 0.9),
                                            color: '#fff',
                                            '&:hover': {
                                              bgcolor: theme.palette.error.main
                                            }
                                          }}
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      </ImagePreviewWrapper>
                                    </Grid>
                                  ))}
                                </Grid>
                              )}
                            </Grid>
                            
                            <Grid item xs={12}>
                              <StepHeading variant="h6" sx={{ mt: 3 }}>
                                <InfoIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                                Your Contact Information
                              </StepHeading>
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Your Name"
                                name="contactName"
                                value={formData.contactName}
                                onChange={handleChange}
                                variant="outlined"
                                required
                                error={!!errors.contactName}
                                helperText={errors.contactName}
                              />
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Your Phone Number"
                                name="contactPhone"
                                value={formData.contactPhone}
                                onChange={handleChange}
                                variant="outlined"
                                required
                                error={!!errors.contactPhone}
                                helperText={errors.contactPhone}
                              />
                            </Grid>
                            
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Your Email"
                                name="contactEmail"
                                type="email"
                                value={formData.contactEmail}
                                onChange={handleChange}
                                variant="outlined"
                                required
                                error={!!errors.contactEmail}
                                helperText={errors.contactEmail}
                              />
                            </Grid>
                            
                            <Grid item xs={12}>
                              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                <Button
                                  type="submit"
                                  variant="contained"
                                  color="primary"
                                  size="large"
                                  disabled={isSubmitting}
                                  endIcon={<SendIcon />}
                                  sx={{ 
                                    py: 1.5, 
                                    px: 4,
                                    fontSize: '1.1rem',
                                    borderRadius: 2,
                                    boxShadow: 4
                                  }}
                                >
                                  {isSubmitting ? 'Submitting...' : 'Submit Rescue Request'}
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                        </form>
                      </CardContent>
                    </StyledCard>
                  </motion.div>
                </Grid>
              </Grid>
            )}
          </AnimatePresence>
        </motion.div>

        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            sx={{ 
              width: '100%', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)', 
              borderRadius: 3,
              backdropFilter: 'blur(10px)'
            }}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </RootBox>
  </Box>
);
};

export default RescueSubmissionPage; 