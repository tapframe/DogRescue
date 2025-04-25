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
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Import the API service and DogData type
import { dogApi, DogData } from '../services/api';

const DogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [dog, setDog] = useState<DogData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
          <Button 
            variant="contained" 
            component={RouterLink} 
            to="/dogs"
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
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Alert severity="warning" sx={{ mb: 4 }}>
            Dog not found. The dog you're looking for may not exist or has been adopted.
          </Alert>
          <Button 
            variant="contained" 
            component={RouterLink} 
            to="/dogs"
          >
            View All Dogs
          </Button>
        </Box>
      </Container>
    );
  }

  // Render dog details
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {/* Back button */}
        <Button 
          component={RouterLink} 
          to="/dogs" 
          sx={{ mb: 4 }}
          startIcon={<PetsIcon />}
        >
          Back to All Dogs
        </Button>

        <Grid container spacing={4}>
          {/* Dog Image */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                height: '100%',
                maxHeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(0, 0, 0, 0.1)'
              }}
            >
              <Box
                component="img"
                src={dog.image || 'https://via.placeholder.com/500'} // Fallback image
                alt={dog.name}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Paper>
          </Grid>

          {/* Dog Details */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: 'transparent' }}>
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                {dog.name}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip label={dog.breed} color="primary" variant="outlined" />
                <Chip label={dog.gender} color="secondary" variant="outlined" />
                <Chip label={dog.size} variant="outlined" />
                <Chip label={dog.age} variant="outlined" />
              </Box>
              
              <Typography variant="body1" paragraph sx={{ mb: 3, lineHeight: 1.7 }}>
                {dog.description}
              </Typography>
              
              {/* Tags */}
              {dog.tags && dog.tags.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  {dog.tags.map((tag, index) => (
                    <Chip key={index} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                  ))}
                </Box>
              )}
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Key Details
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Vaccinated"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Spayed/Neutered"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Microchipped"
                  />
                </ListItem>
                {/* Add more details here if needed */}
              </List>
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  component={RouterLink}
                  to="/contact"
                  sx={{ flex: 1 }}
                  startIcon={<PetsIcon />}
                >
                  Adopt {dog.name}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={RouterLink}
                  to="/volunteer"
                  sx={{ flex: 1 }}
                  startIcon={<FavoriteIcon />}
                >
                  Foster {dog.name}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Additional Information Section */}
        <Paper sx={{ mt: 6, p: 4, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            Adoption Process
          </Typography>
          <Typography variant="body1" paragraph>
            Our adoption process is designed to ensure that our dogs find loving, suitable homes. Here's what to expect:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="1. Application" 
                secondary="Fill out our adoption application form to get started." 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="2. Meet and Greet" 
                secondary="Schedule a meeting with the dog to ensure it's a good match." 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="3. Home Visit" 
                secondary="We'll conduct a brief home check to ensure it's suitable for the dog." 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="4. Adoption Fee" 
                secondary="The adoption fee helps cover medical costs, food, and shelter while in our care." 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="5. Take Home" 
                secondary="Once approved, you can welcome your new family member home!" 
              />
            </ListItem>
          </List>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button 
              variant="contained" 
              size="large" 
              component={RouterLink} 
              to="/contact"
              sx={{ px: 4, py: 1.5 }}
            >
              Start Adoption Process
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default DogDetailPage; 