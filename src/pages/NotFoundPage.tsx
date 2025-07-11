import { Box, Button, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          textAlign: 'center',
          py: 8,
        }}
      >
        <Typography variant="h1" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
          404
        </Typography>
        <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ mb: 6, maxWidth: '600px' }}>
          Oops! The page you're looking for doesn't exist or has been moved.
          Perhaps you clicked on a broken link or mistyped the URL.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={RouterLink} 
          to="/"
          size="large"
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage; 