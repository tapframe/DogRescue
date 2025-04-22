import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
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

// Import the dogs data (in a real app this would come from an API)
import { dogsData } from './DogsPage';

const DogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  
  // Find the dog with the matching ID
  const dog = dogsData.find(dog => dog.id === Number(id));

  // Loading state (simulated)
  const isLoading = false;

  // If dog not found
  if (!dog && !isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 4 }}>
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

  // Loading state
  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

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
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                height: '100%',
                maxHeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src={dog?.image}
                alt={dog?.name}
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
            <Box>
              <Typography variant="h3" component="h1" gutterBottom>
                {dog?.name}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip label={dog?.breed} color="primary" variant="outlined" />
                <Chip label={dog?.gender} color="secondary" variant="outlined" />
                <Chip label={dog?.size} variant="outlined" />
                <Chip label={dog?.age} variant="outlined" />
              </Box>
              
              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                {dog?.description}
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Details
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Vaccinated" 
                    secondary="All vaccinations up to date" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Spayed/Neutered" 
                    secondary="Already spayed/neutered" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Microchipped" 
                    secondary="For identification and safety" 
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  component={RouterLink}
                  to="/contact"
                  sx={{ flex: 1 }}
                  startIcon={<PetsIcon />}
                >
                  Adopt {dog?.name}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={RouterLink}
                  to="/volunteer"
                  sx={{ flex: 1 }}
                  startIcon={<FavoriteIcon />}
                >
                  Foster {dog?.name}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Additional Information */}
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