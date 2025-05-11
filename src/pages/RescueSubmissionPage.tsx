import { useState } from 'react';
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
  styled
} from '@mui/material';
import { motion } from 'framer-motion';
import PetsIcon from '@mui/icons-material/Pets';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SendIcon from '@mui/icons-material/Send';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Helmet } from 'react-helmet-async';

// Import API service
import { rescueApi, RescueSubmissionData } from '../services/api';

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

// Styled components
const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${alpha(theme.palette.primary.main, 0.5)}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    borderColor: theme.palette.primary.main,
  }
}));

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
  const [formData, setFormData] = useState<RescueFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

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
        imageUrls: formData.images.length > 0 ? ['placeholder-image-url.jpg'] : []
      };
      
      // Submit to API
      const response = await rescueApi.submitRescueRequest(submissionData);
      
      setSnackbar({
        open: true,
        message: 'Your rescue dog submission has been received. We will contact you soon.',
        severity: 'success'
      });
      
      // Reset form after successful submission
      setFormData(initialFormData);
      setImagePreviewUrls([]);
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

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {/* Page title and SEO */}
        <Helmet>
          <title>Report a Dog in Need | Dog Rescue</title>
          <meta name="description" content="Help us save dogs in need by reporting stray or abandoned dogs that require rescue. Fill out our form and our team will respond quickly." />
        </Helmet>

        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          textAlign="center"
          sx={{ 
            fontWeight: 'bold',
            mb: 2,
            color: theme.palette.primary.main 
          }}
        >
          <PetsIcon sx={{ fontSize: 40, mr: 1, verticalAlign: 'middle' }} />
          Report a Dog in Need
        </Typography>

        <Typography 
          variant="h6" 
          component="h2"
          align="center" 
          gutterBottom
          sx={{ 
            mb: 5,
            maxWidth: 800,
            mx: 'auto',
            color: alpha(theme.palette.text.primary, 0.7)
          }}
        >
          Every rescue starts with awareness. Your report could save a life and give a dog a second chance at happiness.
        </Typography>
        
        <Box 
          sx={{ 
            maxWidth: 900, 
            mx: 'auto', 
            mb: 4 
          }}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mb: 3,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            }}
          >
            <Typography variant="body1" paragraph>
              If you've found a stray dog or know of a dog that needs rescue, please fill out this form.
              Our team will review your submission and get in touch with you soon to coordinate rescue efforts.
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Note:</strong> If the dog is injured or in immediate danger, please contact your local animal control
              or emergency services in addition to submitting this form.
            </Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Dog Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} md={6}>
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
                
                <Grid item xs={12} md={6}>
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
                
                <Grid item xs={12} md={4}>
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
                
                <Grid item xs={12} md={4}>
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
                
                <Grid item xs={12} md={4}>
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
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
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
                      <Typography variant="body1" gutterBottom>
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
                          <Box
                            sx={{
                              position: 'relative',
                              height: 120,
                              borderRadius: 1,
                              overflow: 'hidden',
                            }}
                          >
                            <img
                              src={url}
                              alt={`Preview ${index}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              onClick={() => handleRemoveImage(index)}
                              sx={{
                                position: 'absolute',
                                top: 5,
                                right: 5,
                                minWidth: 30,
                                width: 30,
                                height: 30,
                                p: 0
                              }}
                            >
                              ×
                            </Button>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                    Your Contact Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} md={6}>
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
                
                <Grid item xs={12} md={6}>
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
                        fontSize: '1.1rem'
                      }}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Rescue Request'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>

          <Box sx={{ mt: 4, p: 3, backgroundColor: alpha(theme.palette.info.main, 0.1), borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <HelpOutlineIcon sx={{ mr: 1 }} />
              What happens next?
            </Typography>
            <Typography variant="body1" paragraph>
              1. Our team will review your submission within 24-48 hours.
            </Typography>
            <Typography variant="body1" paragraph>
              2. A rescue coordinator will contact you to gather additional information if needed.
            </Typography>
            <Typography variant="body1" paragraph>
              3. We'll dispatch a rescue team to the location to safely retrieve the dog.
            </Typography>
            <Typography variant="body1">
              4. The dog will receive necessary medical care and be placed in a foster home until adoption.
            </Typography>
          </Box>
        </Box>
      </motion.div>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RescueSubmissionPage; 