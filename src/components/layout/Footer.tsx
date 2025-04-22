import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  GridLegacy as Grid,
  Typography,
  Link,
  IconButton,
  Divider
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PetsIcon from '@mui/icons-material/Pets';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo & Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PetsIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Dog Rescue Mission
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Dedicated to rescuing, rehabilitating, and rehoming dogs in need. We believe every dog deserves a loving forever home.
            </Typography>
            <Box sx={{ display: 'flex' }}>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="YouTube">
                <YouTubeIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
              Quick Links
            </Typography>
            <Link component={RouterLink} to="/about" color="inherit" sx={{ display: 'block', mb: 1 }}>
              About Us
            </Link>
            <Link component={RouterLink} to="/dogs" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Adoptable Dogs
            </Link>
            <Link component={RouterLink} to="/volunteer" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Volunteer
            </Link>
            <Link component={RouterLink} to="/donate" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Donate
            </Link>
            <Link component={RouterLink} to="/resources" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Resources
            </Link>
            <Link component={RouterLink} to="/contact" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Contact
            </Link>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              123 Rescue Avenue, Pet City, PC 12345
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Email: info@dogrescuemission.org
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Phone: (123) 456-7890
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Emergency: (123) 456-7999
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
        
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} Dog Rescue Mission. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 