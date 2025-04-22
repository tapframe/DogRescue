import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Stack,
  SelectChangeEvent
} from '@mui/material';

// Placeholder data for dogs
export const dogsData = [
  {
    id: 1,
    name: 'Max',
    breed: 'Labrador Retriever',
    age: '3 years',
    size: 'Large',
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    description: 'Max is a friendly and energetic Labrador who loves to play fetch and go for long walks.',
  },
  {
    id: 2,
    name: 'Bella',
    breed: 'German Shepherd',
    age: '2 years',
    size: 'Large',
    gender: 'Female',
    image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    description: 'Bella is a loyal and intelligent German Shepherd looking for an active family.',
  },
  {
    id: 3,
    name: 'Charlie',
    breed: 'Beagle',
    age: '1 year',
    size: 'Medium',
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1612078894368-231c9ef06a8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    description: 'Charlie is a curious and playful Beagle who gets along well with children and other pets.',
  },
  {
    id: 4,
    name: 'Luna',
    breed: 'Siberian Husky',
    age: '4 years',
    size: 'Large',
    gender: 'Female',
    image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    description: 'Luna is a beautiful Husky with striking blue eyes. She\'s energetic and needs an experienced owner.',
  },
  {
    id: 5,
    name: 'Cooper',
    breed: 'Golden Retriever',
    age: '5 years',
    size: 'Large',
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1633722715036-967df0865c1c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    description: 'Cooper is a gentle and friendly Golden Retriever who loves everyone he meets. Great with kids!',
  },
  {
    id: 6,
    name: 'Lucy',
    breed: 'Dachshund',
    age: '2 years',
    size: 'Small',
    gender: 'Female',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    description: 'Lucy is a spunky Dachshund with lots of personality. She\'s house-trained and knows several tricks.',
  },
];

const DogsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [breed, setBreed] = useState('');
  const [size, setSize] = useState('');
  const [gender, setGender] = useState('');
  const [page, setPage] = useState(1);
  const dogsPerPage = 6;

  // Get unique breed options
  const breedOptions = [...new Set(dogsData.map(dog => dog.breed))];
  
  // Filter dogs based on search and filter criteria
  const filteredDogs = dogsData.filter(dog => {
    return (
      dog.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (breed === '' || dog.breed === breed) &&
      (size === '' || dog.size === size) &&
      (gender === '' || dog.gender === gender)
    );
  });

  // Paginate dogs
  const indexOfLastDog = page * dogsPerPage;
  const indexOfFirstDog = indexOfLastDog - dogsPerPage;
  const currentDogs = filteredDogs.slice(indexOfFirstDog, indexOfLastDog);
  const pageCount = Math.ceil(filteredDogs.length / dogsPerPage);

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleBreedChange = (event: SelectChangeEvent) => {
    setBreed(event.target.value as string);
    setPage(1);
  };

  const handleSizeChange = (event: SelectChangeEvent) => {
    setSize(event.target.value as string);
    setPage(1);
  };

  const handleGenderChange = (event: SelectChangeEvent) => {
    setGender(event.target.value as string);
    setPage(1);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
          Dogs Available for Adoption
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 6 }}>
          Find your perfect companion and give them a forever home
        </Typography>

        {/* Search and Filters */}
        <Box sx={{ mb: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search by name"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Breed</InputLabel>
                <Select
                  value={breed}
                  onChange={handleBreedChange}
                  label="Breed"
                >
                  <MenuItem value="">All Breeds</MenuItem>
                  {breedOptions.map((breedOption) => (
                    <MenuItem key={breedOption} value={breedOption}>
                      {breedOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Size</InputLabel>
                <Select
                  value={size}
                  onChange={handleSizeChange}
                  label="Size"
                >
                  <MenuItem value="">All Sizes</MenuItem>
                  <MenuItem value="Small">Small</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Large">Large</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Gender</InputLabel>
                <Select
                  value={gender}
                  onChange={handleGenderChange}
                  label="Gender"
                >
                  <MenuItem value="">All Genders</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Dogs Gallery */}
        {currentDogs.length > 0 ? (
          <>
            <Grid container spacing={4}>
              {currentDogs.map((dog) => (
                <Grid item key={dog.id} xs={12} sm={6} md={4}>
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
                      height="220"
                      image={dog.image}
                      alt={dog.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="div" gutterBottom>
                        {dog.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {dog.breed} • {dog.age} • {dog.gender}
                      </Typography>
                      <Typography variant="body2">
                        {dog.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        component={RouterLink} 
                        to={`/dogs/${dog.id}`}
                      >
                        Learn More
                      </Button>
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="primary"
                        component={RouterLink} 
                        to="/contact"
                        sx={{ ml: 'auto' }}
                      >
                        Adopt Me
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {pageCount > 1 && (
              <Stack spacing={2} sx={{ mt: 4 }} alignItems="center">
                <Pagination 
                  count={pageCount} 
                  page={page} 
                  onChange={handleChangePage} 
                  color="primary" 
                />
              </Stack>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6">
              No dogs found matching your search criteria.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }}
              onClick={() => {
                setSearchTerm('');
                setBreed('');
                setSize('');
                setGender('');
                setPage(1);
              }}
            >
              Reset Filters
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default DogsPage; 