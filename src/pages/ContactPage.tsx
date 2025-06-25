import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  GridLegacy as Grid,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  SelectChangeEvent,
  useTheme,
  alpha,
  Avatar
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import PetsIcon from '@mui/icons-material/Pets';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

const ContactPage = () => {
  const theme = useTheme();
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleSubjectChange = (event: SelectChangeEvent) => {
    setSubject(event.target.value as string);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission with timeout
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    }, 1500);
  };

  const handleCloseSnackbar = () => {
    setSubmitSuccess(false);
    setSubmitError(false);
  };

  // Contact information
  const contactInfo = [
    {
      icon: <EmailIcon fontSize="large" />,
      title: 'Email',
      content: 'info@dogrescuemission.org',
      description: 'We aim to respond within 24-48 hours'
    },
    {
      icon: <PhoneIcon fontSize="large" />,
      title: 'Phone',
      content: '(123) 456-7890',
      description: 'Monday-Friday, 9am-5pm'
    },
    {
      icon: <LocationOnIcon fontSize="large" />,
      title: 'Location',
      content: '123 Rescue Avenue, Pet City, PC 12345',
      description: 'Visits by appointment only'
    },
    {
      icon: <AccessTimeIcon fontSize="large" />,
      title: 'Hours',
      content: 'Mon-Fri: 9am-5pm, Sat: 10am-3pm',
      description: 'Closed on Sundays and holidays'
    }
  ];

  return (
    <Box 
      sx={{ 
        position: 'relative',
        pt: { xs: 8, sm: 9, md: 10 },
        pb: 8,
        backgroundColor: alpha(theme.palette.primary.light, 0.05),
        backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(0,0,0,0.1) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(0,0,0,0.05) 2%, transparent 0%)',
        backgroundSize: '100px 100px',
        background: `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.light, 0.15)} 0%, 
          ${alpha(theme.palette.background.default, 0.9)} 40%, 
          ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
      }}
    >
      {/* Decorative elements similar to DogDetails page */}
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
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ my: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            align="center" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 1.5,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Contact Us
          </Typography>
          
          <Typography 
            variant="subtitle1" 
            align="center" 
            sx={{ 
              mb: 7, 
              maxWidth: 700, 
              mx: 'auto',
              fontSize: '1.1rem',
              color: alpha(theme.palette.text.primary, 0.8)
            }}
          >
            Have questions about adoption, volunteering, or how you can help? 
            We'd love to hear from you and help find the perfect furry companion for your family!
          </Typography>

          {/* Contact Information Cards */}
          <Grid container spacing={3} sx={{ mb: 8 }}>
            {contactInfo.map((info, index) => (
              <Grid item key={index} xs={12} sm={6} md={3}>
                <Card 
                  elevation={2}
                  sx={{ 
                    height: '100%', 
                    textAlign: 'center',
                    borderRadius: 3,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[8],
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Avatar 
                      sx={{ 
                        width: 56, 
                        height: 56, 
                        mb: 2, 
                        mx: 'auto',
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                      }}
                    >
                      {info.icon}
                    </Avatar>
                    <Typography variant="h6" component="div" gutterBottom fontWeight={600}>
                      {info.title}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1.5, fontWeight: 'medium' }}>
                      {info.content}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {info.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Contact Form & Map */}
          <Grid container spacing={4}>
            {/* Contact Form */}
            <Grid item xs={12} md={7}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: { xs: 3, md: 5 }, 
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
                }}
              >
                <Typography 
                  variant="h4" 
                  component="h2" 
                  gutterBottom 
                  sx={{ 
                    mb: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    fontWeight: 600,
                    color: theme.palette.primary.main
                  }}
                >
                  <SendIcon /> Send Us a Message
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
                        InputProps={{ sx: { borderRadius: 2 } }}
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
                        InputProps={{ sx: { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        variant="outlined"
                        InputProps={{ sx: { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Subject</InputLabel>
                        <Select
                          value={subject}
                          onChange={handleSubjectChange}
                          label="Subject"
                          sx={{ borderRadius: 2 }}
                        >
                          <MenuItem value="Adoption Inquiry">Adoption Inquiry</MenuItem>
                          <MenuItem value="Volunteer Information">Volunteer Information</MenuItem>
                          <MenuItem value="Donation Question">Donation Question</MenuItem>
                          <MenuItem value="General Question">General Question</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Message"
                        multiline
                        rows={6}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        variant="outlined"
                        InputProps={{ sx: { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        disabled={isSubmitting}
                        sx={{ 
                          py: 1.5, 
                          borderRadius: 2,
                          textTransform: 'none',
                          fontSize: '1rem',
                          fontWeight: 600,
                          boxShadow: theme.shadows[4],
                          '&:hover': {
                            boxShadow: theme.shadows[8],
                          }
                        }}
                        endIcon={<SendIcon />}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>

            {/* Map and Additional Info */}
            <Grid item xs={12} md={5}>
              <Paper 
                elevation={3} 
                sx={{ 
                  height: '100%', 
                  p: 0, 
                  borderRadius: 3, 
                  overflow: 'hidden', 
                  display: 'flex', 
                  flexDirection: 'column',
                  background: theme.palette.background.paper,
                }}
              >
                {/* Map (placeholder - in a real app, would be a Google Maps component) */}
                <Box
                  sx={{
                    height: 250,
                    bgcolor: alpha(theme.palette.primary.light, 0.1),
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundImage: 'url("https://via.placeholder.com/600x250?text=Map+Placeholder")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <Paper 
                    elevation={4} 
                    sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      backgroundColor: alpha(theme.palette.background.paper, 0.85),
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    <Typography variant="body1" fontWeight={500}>
                      Dog Rescue Mission
                    </Typography>
                  </Paper>
                </Box>
                
                <Divider />
                
                {/* Additional Info */}
                <Box sx={{ p: 3.5, flexGrow: 1 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      color: theme.palette.primary.main,
                      fontWeight: 600
                    }}
                  >
                    <LocationOnIcon /> Visit Our Shelter
                  </Typography>
                  <Typography variant="body2" paragraph sx={{ ml: 4 }}>
                    If you'd like to meet our dogs in person, please schedule a visit.
                    We recommend making an appointment so we can provide you with the best experience.
                  </Typography>
                  
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      mt: 3, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      color: theme.palette.error.main,
                      fontWeight: 600
                    }}
                  >
                    <PhoneIcon /> Emergency Contact
                  </Typography>
                  <Typography variant="body2" paragraph sx={{ ml: 4 }}>
                    For dog-related emergencies, please call our emergency line at <b>(123) 456-7999</b>.
                    This line is monitored 24/7 for urgent situations only.
                  </Typography>
                  
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      mt: 3, 
                      color: theme.palette.secondary.main,
                      fontWeight: 600 
                    }}
                  >
                    Follow Us
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3 }}>
                    Stay updated with our latest rescues and success stories by following us on social media.
                  </Typography>
                  
                  <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      href="/dogs" 
                      startIcon={<PetsIcon />}
                      sx={{ 
                        borderRadius: 6,
                        px: 2.5,
                        textTransform: 'none',
                        fontWeight: 500,
                        boxShadow: theme.shadows[2],
                        '&:hover': { boxShadow: theme.shadows[6] }
                      }}
                    >
                      See Available Dogs
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="secondary" 
                      href="/volunteer" 
                      startIcon={<VolunteerActivismIcon />}
                      sx={{ 
                        borderRadius: 6,
                        px: 2.5,
                        textTransform: 'none',
                        fontWeight: 500,
                        borderWidth: 2,
                        '&:hover': { borderWidth: 2 }
                      }}
                    >
                      Volunteer With Us
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Success/Error Notifications */}
          <Snackbar open={submitSuccess} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <Alert 
              onClose={handleCloseSnackbar} 
              severity="success" 
              sx={{ width: '100%', borderRadius: 2 }}
              variant="filled"
            >
              Your message has been sent! We'll get back to you soon.
            </Alert>
          </Snackbar>
          <Snackbar open={submitError} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <Alert 
              onClose={handleCloseSnackbar} 
              severity="error" 
              sx={{ width: '100%', borderRadius: 2 }}
              variant="filled"
            >
              There was an error sending your message. Please try again.
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactPage; 