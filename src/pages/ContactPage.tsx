import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
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
  SelectChangeEvent
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const ContactPage = () => {
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
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
          Contact Us
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
          Have questions about adoption, volunteering, or how you can help? We'd love to hear from you!
        </Typography>

        {/* Contact Information Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {contactInfo.map((info, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {info.icon}
                  </Box>
                  <Typography variant="h6" component="div" gutterBottom>
                    {info.title}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 'medium' }}>
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
            <Paper sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
                Send Us a Message
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
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Subject</InputLabel>
                      <Select
                        value={subject}
                        onChange={handleSubjectChange}
                        label="Subject"
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
                      sx={{ py: 1.5 }}
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
            <Paper sx={{ height: '100%', p: 0, borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Map (placeholder - in a real app, would be a Google Maps component) */}
              <Box
                sx={{
                  height: 250,
                  bgcolor: 'grey.200',
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Map Placeholder
                </Typography>
                {/* In a real app, embed Google Maps here */}
              </Box>
              
              <Divider />
              
              {/* Additional Info */}
              <Box sx={{ p: 3, flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Visit Our Shelter
                </Typography>
                <Typography variant="body2" paragraph>
                  If you'd like to meet our dogs in person, please schedule a visit.
                  We recommend making an appointment so we can provide you with the best experience.
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Emergency Contact
                </Typography>
                <Typography variant="body2" paragraph>
                  For dog-related emergencies, please call our emergency line at (123) 456-7999.
                  This line is monitored 24/7 for urgent situations only.
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Follow Us
                </Typography>
                <Typography variant="body2">
                  Stay updated with our latest rescues and success stories by following us on social media.
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" color="primary" href="/dogs" sx={{ mr: 2, mb: 1 }}>
                    See Available Dogs
                  </Button>
                  <Button variant="outlined" color="primary" href="/volunteer" sx={{ mb: 1 }}>
                    Volunteer With Us
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Success/Error Notifications */}
        <Snackbar open={submitSuccess} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            Your message has been sent! We'll get back to you soon.
          </Alert>
        </Snackbar>
        <Snackbar open={submitError} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            There was an error sending your message. Please try again.
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default ContactPage; 