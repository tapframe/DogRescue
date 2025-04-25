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
  CircularProgress
} from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import PetsIcon from '@mui/icons-material/Pets';
import HomeIcon from '@mui/icons-material/Home';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { volunteerApi } from '../services/api';

const VolunteerPage = () => {
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

  const volunteerOptions = [
    {
      title: 'Dog Walker',
      description: 'Take our dogs for walks, providing exercise and socialization.',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      icon: <TimelapseIcon />,
    },
    {
      title: 'Foster Parent',
      description: 'Provide temporary care for dogs in your home until they find forever homes.',
      image: 'https://images.unsplash.com/photo-1541599468348-e96984315921?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      icon: <HomeIcon />,
    },
    {
      title: 'Event Helper',
      description: 'Assist with adoption events, fundraisers, and community outreach.',
      image: 'https://images.unsplash.com/photo-1558236822-09a277b7b05f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      icon: <VolunteerActivismIcon />,
    },
    {
      title: 'Kennel Assistant',
      description: 'Help with cleaning, feeding, and caring for dogs at our facility.',
      image: 'https://images.unsplash.com/photo-1551887373-3c5bd224f6e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      icon: <PetsIcon />,
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
          Volunteer & Foster
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
          Join our team of dedicated volunteers and make a difference in the lives of dogs in need.
          Whether you can spare a few hours a week or want to become a foster parent, we appreciate your support.
        </Typography>

        {/* Volunteer Options */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
            Ways to Help
          </Typography>
          <Grid container spacing={4}>
            {volunteerOptions.map((option, index) => (
              <Grid item key={index} xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6,
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image={option.image}
                    alt={option.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ mr: 1, color: 'primary.main' }}>
                        {option.icon}
                      </Box>
                      <Typography variant="h6" component="div">
                        {option.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      {option.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Volunteer Process */}
        <Paper sx={{ p: 4, mb: 8, borderRadius: 2 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
            Volunteer Process
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="1. Apply"
                secondary="Fill out the volunteer application form below."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="2. Orientation"
                secondary="Attend a volunteer orientation session to learn about our organization and procedures."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="3. Training"
                secondary="Receive role-specific training from our experienced staff."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="4. Start Volunteering"
                secondary="Begin your volunteer role and make a difference in the lives of our dogs."
              />
            </ListItem>
          </List>
        </Paper>

        {/* Application Form */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
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
                  required
                  fullWidth
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
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
                <FormControl fullWidth required>
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
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreement}
                      onChange={(e) => setAgreement(e.target.checked)}
                      required
                    />
                  }
                  label="I agree to follow all policies and procedures of Dog Rescue Mission. I understand that volunteer opportunities are subject to availability and screening."
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large" 
                  fullWidth 
                  disabled={isSubmitting || !agreement}
                  sx={{ mt: 2 }}
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
        </Paper>

        {/* Success/Error Notifications */}
        <Snackbar open={submitSuccess} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            Thank you for your application! We'll contact you soon.
          </Alert>
        </Snackbar>
        <Snackbar open={submitError} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            There was an error submitting your application. Please try again.
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default VolunteerPage; 