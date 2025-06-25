import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Card,
  CardMedia,
  Alert,
  CircularProgress,
  GridLegacy as Grid,
  Divider,
  useTheme,
  alpha,
  Fade,
  Stepper,
  Step,
  StepLabel,
  Chip
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';
import { dogApi, applicationApi, DogData } from '../../services/api';
import { userAuthService } from '../../services/userAuthService';

const AdoptionApplicationForm = () => {
  const { dogId } = useParams<{ dogId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [dog, setDog] = useState<DogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [applicationNotes, setApplicationNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Review Dog', 'Application', 'Submit'];

  // Check if user is authenticated
  const user = userAuthService.getCurrentUser();
  const isAuthenticated = userAuthService.isAuthenticated();

  // Load dog data
  useEffect(() => {
    const fetchDog = async () => {
      if (!dogId) {
        setError('Dog ID is required');
        setLoading(false);
        return;
      }

      try {
        const dogData = await dogApi.getDogById(dogId);
        setDog(dogData);
      } catch (err) {
        console.error('Error fetching dog:', err);
        setError('Failed to load dog details');
      } finally {
        setLoading(false);
      }
    };

    fetchDog();
  }, [dogId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('You must be logged in to submit an application');
      return;
    }

    if (!dogId) {
      setError('Dog ID is missing');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await applicationApi.submitApplication(dogId, applicationNotes.trim());
      setSuccess(true);
      setActiveStep(2);
      
      // Redirect to user dashboard after 3 seconds
      setTimeout(() => {
        navigate('/user-dashboard');
      }, 3000);
    } catch (err: any) {
      console.error('Error submitting application:', err);
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  if (loading) {
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
            Loading application form...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error && !dog) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 8, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate('/dogs')}
            startIcon={<ArrowBackIcon />}
          >
            Back to Dogs
          </Button>
        </Box>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 8, textAlign: 'center' }}>
          <Alert severity="warning" sx={{ mb: 4 }}>
            You must be logged in to submit an adoption application.
          </Alert>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 8, textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CheckCircleIcon 
              sx={{ 
                fontSize: 80, 
                color: theme.palette.success.main,
                mb: 3
              }} 
            />
          </motion.div>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Application Submitted!
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4, color: 'text.secondary' }}>
            Thank you for your interest in adopting {dog?.name}. We'll review your application and get back to you soon.
            A confirmation email has been sent to your registered email address.
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
            Redirecting to your dashboard...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box 
      sx={{ 
        width: '100%',
        minHeight: '100vh',
        background: `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.light, 0.1)} 0%, 
          ${alpha(theme.palette.background.default, 0.9)} 40%, 
          ${alpha(theme.palette.secondary.light, 0.08)} 100%)`,
        pt: 4,
        pb: 8
      }}
    >
      <Container maxWidth="lg">
        <Button 
          onClick={() => navigate(`/dogs/${dogId}`)}
          sx={{ mb: 4, ml: 1 }}
          startIcon={<ArrowBackIcon />}
        >
          Back to {dog?.name}'s Profile
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: '16px',
            backgroundColor: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: `0 20px 40px -15px ${alpha(theme.palette.common.black, 0.1)}`
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              textAlign: 'center',
              mb: 4,
              backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              backgroundClip: 'text',
              color: 'transparent',
              WebkitBackgroundClip: 'text'
            }}
          >
            Adopt {dog?.name}
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <Fade in={true}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Review Dog Information
                </Typography>
                
                <Grid container spacing={4} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="300"
                        image={dog?.image}
                        alt={dog?.name}
                        sx={{ objectFit: 'cover' }}
                      />
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                        {dog?.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                        <Chip label={dog?.breed} variant="outlined" />
                        <Chip label={dog?.age} variant="outlined" />
                        <Chip label={dog?.size} variant="outlined" />
                        <Chip label={dog?.gender} variant="outlined" />
                      </Box>
                      
                      <Typography variant="body1" paragraph>
                        {dog?.description}
                      </Typography>
                      
                      {dog?.tags && dog.tags.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Characteristics:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {dog.tags.map((tag, index) => (
                              <Chip 
                                key={index}
                                label={tag}
                                size="small"
                                sx={{ 
                                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                  color: theme.palette.primary.main
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ px: 4, py: 1.5, borderRadius: '25px' }}
                  >
                    Continue to Application
                  </Button>
                </Box>
              </Box>
            </Fade>
          )}

          {activeStep === 1 && (
            <Fade in={true}>
              <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Application Details
                </Typography>
                
                <Alert severity="info" sx={{ mb: 3 }}>
                  Tell us why you'd like to adopt {dog?.name} and about your experience with pets.
                </Alert>

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Why do you want to adopt this dog?"
                  placeholder={`Tell us about your experience with pets, why you're interested in ${dog?.name}, and how you plan to care for them...`}
                  value={applicationNotes}
                  onChange={(e) => setApplicationNotes(e.target.value)}
                  sx={{ mb: 4 }}
                  required
                />

                <Divider sx={{ my: 3 }} />

                <Typography variant="body2" color="text.secondary" paragraph>
                  By submitting this application, you agree to our adoption terms and conditions. 
                  Our team will review your application and contact you within 2-3 business days.
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    onClick={handleBack}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting || !applicationNotes.trim()}
                    startIcon={submitting ? <CircularProgress size={20} /> : <SendIcon />}
                    sx={{ px: 4, py: 1.5, borderRadius: '25px' }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </Box>
              </Box>
            </Fade>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default AdoptionApplicationForm; 