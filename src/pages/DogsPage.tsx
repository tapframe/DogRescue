import { useState, useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  GridLegacy as Grid,
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
  SelectChangeEvent,
  Paper,
  Chip,
  alpha,
  useTheme,
  Divider,
  InputAdornment,
  IconButton,
  Avatar,
  Badge,
  Tooltip,
  useMediaQuery,
  Backdrop,
  Skeleton
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FilterListIcon from '@mui/icons-material/FilterList';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ClearIcon from '@mui/icons-material/Clear';
import SortIcon from '@mui/icons-material/Sort';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import PaletteIcon from '@mui/icons-material/Palette';
import HeartIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardVariant = {
  hidden: { y: 20, opacity: 0 },
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

// New animation variants
const slideInUp = {
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

const slideInRight = {
  hidden: { x: 60, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { 
      type: "spring", 
      stiffness: 100,
      damping: 15
    }
  }
};

const slideInLeft = {
  hidden: { x: -60, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { 
      type: "spring", 
      stiffness: 100,
      damping: 15
    }
  }
};

const zoomIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15
    }
  }
};

const popIn = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      delay: 0.2
    }
  }
};

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
    tags: ['Friendly', 'Active', 'Good with kids']
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
    tags: ['Intelligent', 'Loyal', 'Protective']
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
    tags: ['Playful', 'Good with pets', 'Curious']
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
    tags: ['Energetic', 'Intelligent', 'Experienced owner']
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
    tags: ['Gentle', 'Friendly', 'Good with kids']
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
    tags: ['Playful', 'Trained', 'Small size']
  },
];

// Define sorting options
type SortOption = 'newest' | 'oldest' | 'nameAZ' | 'nameZA';

const DogsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Refs for scroll animations
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"]
  });
  
  // Transform values for parallax effects
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  
  // State variables
  const [searchTerm, setSearchTerm] = useState('');
  const [breed, setBreed] = useState('');
  const [size, setSize] = useState('');
  const [gender, setGender] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [favorited, setFavorited] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDog, setSelectedDog] = useState<typeof dogsData[0] | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  
  const dogsPerPage = 6;

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Update filter count when filters change
  useEffect(() => {
    let count = 0;
    if (breed) count++;
    if (size) count++;
    if (gender) count++;
    setActiveFiltersCount(count);
  }, [breed, size, gender]);

  // Add tags to existing dog data if they don't exist
  useEffect(() => {
    dogsData.forEach(dog => {
      if (!dog.tags) {
        dog.tags = ['Loving', 'Adorable', 'Friendly'];
      }
    });
  }, []);

  // Get unique breed options
  const breedOptions = [...new Set(dogsData.map(dog => dog.breed))];
  
  // Handle favoriting
  const toggleFavorite = (id: number) => {
    if (favorited.includes(id)) {
      setFavorited(favorited.filter(favId => favId !== id));
    } else {
      setFavorited([...favorited, id]);
    }
  };
  
  // Handle quick view
  const openQuickView = (dog: typeof dogsData[0]) => {
    setSelectedDog(dog);
    setQuickViewOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeQuickView = () => {
    setQuickViewOpen(false);
    document.body.style.overflow = 'unset';
  };
  
  // Filter dogs based on search and filter criteria
  const filteredDogs = dogsData.filter(dog => {
    return (
      dog.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (breed === '' || dog.breed === breed) &&
      (size === '' || dog.size === size) &&
      (gender === '' || dog.gender === gender)
    );
  });

  // Sort dogs based on selected sort option
  const sortedDogs = [...filteredDogs].sort((a, b) => {
    switch (sortBy) {
      case 'nameAZ':
        return a.name.localeCompare(b.name);
      case 'nameZA':
        return b.name.localeCompare(a.name);
      case 'oldest':
        return parseInt(a.age) - parseInt(b.age);
      case 'newest':
      default:
        return parseInt(b.age) - parseInt(a.age);
    }
  });

  // Paginate dogs
  const indexOfLastDog = page * dogsPerPage;
  const indexOfFirstDog = indexOfLastDog - dogsPerPage;
  const currentDogs = sortedDogs.slice(indexOfFirstDog, indexOfLastDog);
  const pageCount = Math.ceil(sortedDogs.length / dogsPerPage);

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  
  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as SortOption);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setBreed('');
    setSize('');
    setGender('');
    setPage(1);
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }} ref={scrollRef}>
      {/* Modern Hero Section with Parallax Effect */}
      <Box 
        sx={{
          position: 'relative',
          height: { xs: '70vh', md: '80vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          mb: 0,
          overflow: 'hidden'
        }}
      >
        {/* Enhanced Background with Parallax effect */}
        <motion.div
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: heroOpacity,
            y: heroY
          }}
        >
          <Box 
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'url(https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.85,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `linear-gradient(135deg, rgba(0,0,0,0.9) 0%, ${alpha(theme.palette.primary.main, 0.75)} 100%)`,
              }
            }}
          />
          
          {/* Animated particles background effect */}
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, overflow: 'hidden' }}>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: Math.random() * window.innerHeight,
                  opacity: 0.3 + Math.random() * 0.4
                }}
                animate={{ 
                  x: [
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerWidth
                  ],
                  y: [
                    Math.random() * window.innerHeight,
                    Math.random() * window.innerHeight,
                    Math.random() * window.innerHeight
                  ],
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.2, 1],
                  transition: { 
                    duration: 10 + Math.random() * 20, 
                    repeat: Infinity, 
                    ease: "linear"
                  }
                }}
                style={{
                  position: 'absolute',
                  color: 'rgba(255,255,255,0.15)',
                  fontSize: `${Math.random() * 20 + 15}px`,
                  filter: 'blur(1px)'
                }}
              >
                <PetsIcon fontSize="inherit" />
              </motion.div>
            ))}
          </Box>
        </motion.div>
        
        {/* Hero content with staggered animations */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 5 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.15
                    }
                  }
                }}
              >
                <motion.div variants={slideInLeft}>
                  <Box 
                    sx={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      bgcolor: 'rgba(255,255,255,0.1)', 
                      backdropFilter: 'blur(8px)',
                      borderRadius: 5,
                      py: 1,
                      px: 2,
                      mb: 3,
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    <PetsIcon sx={{ mr: 1, color: theme.palette.secondary.light }} />
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: 'white',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        fontSize: '0.8rem'
                      }}
                    >
                      Rescue · Rehabilitate · Rehome
                    </Typography>
                  </Box>
                </motion.div>

                <motion.div variants={slideInLeft}>
                  <Typography 
                    variant="h1" 
                    component="h1"
                    sx={{ 
                      fontWeight: 900,
                      color: 'white',
                      fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                      textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                      mb: 2,
                      lineHeight: 1,
                      letterSpacing: '-0.02em'
                    }}
                  >
                    Adopt a <br />
                    <Box component="span" sx={{ 
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 15,
                        left: 0,
                        height: '40%',
                        width: '100%',
                        background: `linear-gradient(90deg, ${alpha(theme.palette.secondary.main, 0.7)}, ${alpha(theme.palette.secondary.light, 0.4)})`,
                        zIndex: -1,
                        borderRadius: '4px',
                        transform: 'skew(-5deg, -1deg)'
                      }
                    }}>
                      Loving
                    </Box>{' '}
                    <Box 
                      component="span" 
                      sx={{ 
                        background: `-webkit-linear-gradient(45deg, ${theme.palette.secondary.light}, ${theme.palette.secondary.main})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Companion
                    </Box>
                  </Typography>
                </motion.div>

                <motion.div variants={slideInLeft}>
                  <Typography 
                    variant="h5" 
                    component="div" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.85)',
                      maxWidth: { xs: '100%', md: '90%' },
                      mb: 4,
                      fontSize: { xs: '1.1rem', md: '1.25rem' },
                      fontWeight: 400,
                      lineHeight: 1.5
                    }}
                  >
                    Our rescue dogs are waiting for a second chance at happiness. 
                    Find your perfect match and bring home a lifetime of love and loyalty.
                  </Typography>
                </motion.div>
                
                <motion.div variants={slideInLeft}>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      component={RouterLink}
                      to="#available-dogs"
                      sx={{
                        borderRadius: 3,
                        py: 1.5,
                        px: 4,
                        fontWeight: 700,
                        fontSize: '1rem',
                        textTransform: 'none',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                        background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                        border: 'none',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
                          background: `linear-gradient(90deg, ${theme.palette.secondary.dark}, ${theme.palette.secondary.main})`,
                        }
                      }}
                    >
                      Find Your Dog
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      component={RouterLink}
                      to="/about"
                      sx={{
                        borderRadius: 3,
                        py: 1.5,
                        px: 4,
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1rem',
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.5)',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.15)',
                          borderColor: 'white',
                          transform: 'translateY(-3px)',
                        }
                      }}
                    >
                      Our Mission
                    </Button>
                  </Box>
                </motion.div>
                
                {/* Stats row with more modern design */}
                <motion.div variants={slideInLeft}>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: { xs: 2, md: 4 },
                      mt: 2
                    }}
                  >
                    {[
                      { count: '50+', label: 'Dogs Adopted', icon: <HeartIcon sx={{ fontSize: 20 }} /> },
                      { count: '100%', label: 'Love Guaranteed', icon: <ThumbUpAltIcon sx={{ fontSize: 20 }} /> },
                      { count: '24/7', label: 'Support', icon: <PetsIcon sx={{ fontSize: 20 }} /> }
                    ].map((stat, index) => (
                      <Box 
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5
                        }}
                      >
                        <Box 
                          sx={{ 
                            width: 45, 
                            height: 45, 
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: theme.palette.secondary.light
                          }}
                        >
                          {stat.icon}
                        </Box>
                        <Box>
                          <Typography 
                            variant="h4" 
                            sx={{ 
                              color: 'white',
                              fontWeight: 800,
                              lineHeight: 1,
                              fontSize: { xs: '1.5rem', md: '1.75rem' }
                            }}
                          >
                            {stat.count}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'rgba(255,255,255,0.7)',
                              fontSize: '0.8rem',
                              fontWeight: 500
                            }}
                          >
                            {stat.label}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </motion.div>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    height: 450,
                    width: '100%',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      backdropFilter: 'blur(5px)',
                      zIndex: 1
                    }
                  }}
                >
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 3,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                      zIndex: 2
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                      Meet Our Rescues
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Our dogs come from various backgrounds but all deserve loving homes
                    </Typography>
                  </Box>
                  
                  {/* Floating elements */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      bgcolor: 'rgba(255,255,255,0.9)',
                      borderRadius: '12px',
                      p: 1.5,
                      zIndex: 2,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <FavoriteIcon sx={{ color: theme.palette.secondary.main, fontSize: 28 }} />
                  </Box>
                  
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 100,
                      left: -20,
                      bgcolor: 'rgba(255,255,255,0.9)',
                      borderRadius: '12px',
                      p: 1.5,
                      zIndex: 2,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                      transform: 'rotate(-15deg)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <PetsIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
        
        {/* Modern wave overlay */}
        <Box 
          sx={{
            position: 'absolute',
            bottom: -2,
            left: 0,
            width: '100%',
            height: '150px',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 4
          }}
        />
      </Box>

    <Container maxWidth="lg">
        <Box sx={{ py: { xs: 4, md: 6 } }}>
          {/* Modernized Search and Filters with Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Paper
              elevation={0}
              sx={{ 
                mb: 6, 
                p: { xs: 3, md: 4 }, 
                borderRadius: 4,
                backdropFilter: 'blur(20px)',
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.paper, 0.7)})`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                boxShadow: `0 10px 40px ${alpha(theme.palette.common.black, 0.1)}`,
                transform: 'translateY(-70px)',
                position: 'relative',
                zIndex: 10,
                overflow: 'hidden'
              }}
            >
              {/* Decorative elements */}
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: -80, 
                  right: -80, 
                  width: 200, 
                  height: 200, 
                  borderRadius: '50%', 
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)}, ${alpha(theme.palette.primary.main, 0.1)})`,
                  zIndex: -1
                }} 
              />
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: -60, 
                  left: -60, 
                  width: 150, 
                  height: 150, 
                  borderRadius: '50%', 
                  background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.light, 0.15)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
                  zIndex: -1
                }} 
              />
            
              <Box sx={{ mb: 3 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 1,
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <PetsIcon sx={{ fontSize: 28 }} /> Find A Rescue Dog
        </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Filter by breed, size, and gender to discover your perfect match
        </Typography>
                  <Divider sx={{ mb: 3, opacity: 0.6 }} />
                </motion.div>
              </Box>

              <Grid container spacing={3}>
                {/* Search field with enhanced styling */}
            <Grid item xs={12} md={6}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
              <TextField
                fullWidth
                      placeholder="Search by name..."
                variant="outlined"
                value={searchTerm}
                      InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: theme.palette.primary.main }} />,
                        endAdornment: searchTerm && (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setSearchTerm('')}
                              edge="end"
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: { 
                          borderRadius: 3,
                          py: 0.5,
                          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
                          backdropFilter: 'blur(8px)',
                          background: alpha(theme.palette.background.paper, 0.8),
                          borderColor: alpha(theme.palette.primary.main, 0.2),
                          '&:hover': {
                            boxShadow: `0 6px 25px ${alpha(theme.palette.common.black, 0.08)}`,
                          },
                          '& fieldset': {
                            borderColor: alpha(theme.palette.primary.main, 0.2),
                            transition: 'border-color 0.3s ease'
                          },
                          '&:hover fieldset': {
                            borderColor: alpha(theme.palette.primary.main, 0.5),
                          },
                          '&.Mui-focused fieldset': {
                            borderWidth: '1px',
                          }
                        }
                      }}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
                  </motion.div>
            </Grid>
                
                {/* Sort and filter controls */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}
                  >
                    {/* Sort dropdown */}
                    <FormControl 
                      variant="outlined" 
                      size="small"
                      sx={{ 
                        minWidth: 150,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
                          backdropFilter: 'blur(8px)',
                          background: alpha(theme.palette.background.paper, 0.8),
                          borderColor: alpha(theme.palette.primary.main, 0.2),
                          '&:hover': {
                            boxShadow: `0 6px 25px ${alpha(theme.palette.common.black, 0.08)}`,
                          },
                          '& fieldset': {
                            borderColor: alpha(theme.palette.primary.main, 0.2),
                          },
                          '&:hover fieldset': {
                            borderColor: alpha(theme.palette.primary.main, 0.5),
                          }
                        }
                      }}
                    >
                      <InputLabel id="sort-select-label">Sort By</InputLabel>
                      <Select
                        labelId="sort-select-label"
                        value={sortBy}
                        onChange={handleSortChange}
                        label="Sort By"
                        startAdornment={<SortIcon sx={{ ml: 1, mr: 1, color: theme.palette.primary.main, fontSize: 20 }} />}
                      >
                        <MenuItem value="newest">Newest First</MenuItem>
                        <MenuItem value="oldest">Oldest First</MenuItem>
                        <MenuItem value="nameAZ">Name (A-Z)</MenuItem>
                        <MenuItem value="nameZA">Name (Z-A)</MenuItem>
                      </Select>
                    </FormControl>
                    
                    {/* Filter button */}
                    <Button 
                      variant="outlined" 
                      color="primary"
                      startIcon={<FilterAltIcon />}
                      endIcon={activeFiltersCount > 0 ? (
                        <Badge 
                          badgeContent={activeFiltersCount} 
                          color="secondary"
                          sx={{ '.MuiBadge-badge': { fontWeight: 'bold' } }}
                        >
                          <Box sx={{ width: 16 }} />
                        </Badge>
                      ) : null}
                      onClick={() => setShowFilters(!showFilters)}
                      sx={{ 
                        borderRadius: 3,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        px: 2,
                        py: 1,
                        boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
                        backdropFilter: 'blur(8px)',
                        background: showFilters 
                          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.15)}, ${alpha(theme.palette.primary.main, 0.1)})`
                          : alpha(theme.palette.background.paper, 0.8),
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          borderColor: theme.palette.primary.main,
                          boxShadow: `0 6px 25px ${alpha(theme.palette.common.black, 0.08)}`,
                        }
                      }}
                    >
                      {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                    
                    {/* Reset filters button */}
                    {(searchTerm || breed || size || gender) && (
                      <Button 
                        variant="text" 
                        color="secondary"
                        onClick={resetFilters}
                        startIcon={<CloseIcon />}
                        sx={{ 
                          borderRadius: 3,
                          px: 2,
                          fontWeight: 500,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.secondary.main, 0.08)
                          }
                        }}
                      >
                        Reset All
                      </Button>
                    )}
                  </motion.div>
                </Grid>
                
                {/* Expandable filters */}
                <AnimatePresence>
                  {showFilters && (
                    <Grid item xs={12}>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box sx={{ pt: 2 }}>
                          <Divider sx={{ mb: 3, opacity: 0.6 }} />
                          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.secondary }}>
                            Refine Your Search
                          </Typography>
                          <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Breed</InputLabel>
                <Select
                  value={breed}
                  onChange={handleBreedChange}
                  label="Breed"
                                  sx={{ 
                                    borderRadius: 3,
                                    boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
                                    backdropFilter: 'blur(8px)',
                                    background: alpha(theme.palette.background.paper, 0.8),
                                    '& fieldset': {
                                      borderColor: alpha(theme.palette.primary.main, 0.2),
                                    },
                                    '&:hover fieldset': {
                                      borderColor: alpha(theme.palette.primary.main, 0.5),
                                    }
                                  }}
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
                            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Size</InputLabel>
                <Select
                  value={size}
                  onChange={handleSizeChange}
                  label="Size"
                                  sx={{ 
                                    borderRadius: 3,
                                    boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
                                    backdropFilter: 'blur(8px)',
                                    background: alpha(theme.palette.background.paper, 0.8),
                                    '& fieldset': {
                                      borderColor: alpha(theme.palette.primary.main, 0.2),
                                    },
                                    '&:hover fieldset': {
                                      borderColor: alpha(theme.palette.primary.main, 0.5),
                                    }
                                  }}
                >
                  <MenuItem value="">All Sizes</MenuItem>
                  <MenuItem value="Small">Small</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Large">Large</MenuItem>
                </Select>
              </FormControl>
            </Grid>
                            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Gender</InputLabel>
                <Select
                  value={gender}
                  onChange={handleGenderChange}
                  label="Gender"
                                  sx={{ 
                                    borderRadius: 3,
                                    boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
                                    backdropFilter: 'blur(8px)',
                                    background: alpha(theme.palette.background.paper, 0.8),
                                    '& fieldset': {
                                      borderColor: alpha(theme.palette.primary.main, 0.2),
                                    },
                                    '&:hover fieldset': {
                                      borderColor: alpha(theme.palette.primary.main, 0.5),
                                    }
                                  }}
                >
                  <MenuItem value="">All Genders</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
                      </motion.div>
                    </Grid>
                  )}
                </AnimatePresence>
              </Grid>
            </Paper>
          </motion.div>

          {/* Active filter chips with enhanced styling */}
          <AnimatePresence>
            {(breed || size || gender) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="body1" color="text.secondary" sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                    <FilterListIcon sx={{ mr: 0.5, fontSize: 18 }} /> Active filters:
                  </Typography>
                  {breed && (
                    <Chip 
                      label={`Breed: ${breed}`} 
                      onDelete={() => setBreed('')}
                      sx={{ 
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        borderRadius: 6,
                        fontWeight: 500,
                        py: 2.5,
                        '& .MuiChip-deleteIcon': {
                          color: theme.palette.primary.main
                        }
                      }}
                    />
                  )}
                  {size && (
                    <Chip 
                      label={`Size: ${size}`} 
                      onDelete={() => setSize('')}
                      sx={{ 
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        borderRadius: 6,
                        fontWeight: 500,
                        py: 2.5,
                        '& .MuiChip-deleteIcon': {
                          color: theme.palette.primary.main
                        }
                      }}
                    />
                  )}
                  {gender && (
                    <Chip 
                      label={`Gender: ${gender}`} 
                      onDelete={() => setGender('')}
                      sx={{ 
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        borderRadius: 6,
                        fontWeight: 500,
                        py: 2.5,
                        '& .MuiChip-deleteIcon': {
                          color: theme.palette.primary.main
                        }
                      }}
                    />
                  )}
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modern section title with animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ mb: 5, textAlign: 'center' }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  borderRadius: '20px',
                  px: 2,
                  py: 0.5
                }}
              >
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    letterSpacing: 0.5
                  }}
                >
                  {isLoading ? 'Loading dogs...' : filteredDogs.length > 0 
                    ? `${filteredDogs.length} dogs found` 
                    : 'No dogs found'}
                </Typography>
              </Box>
              
              <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom 
                sx={{ 
                  fontWeight: 800, 
                  color: theme.palette.primary.dark,
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80px',
                    height: '4px',
                    background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`,
                    borderRadius: '2px'
                  }
                }}
              >
                {filteredDogs.length > 0 ? 'Ready For A Home' : 'No Dogs Found'}
              </Typography>
              
              {filteredDogs.length > 0 && !isLoading && (
                <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 3 }}>
                  Meet our amazing rescues — each with their own story, waiting to become part of yours
                </Typography>
              )}
            </Box>
          </motion.div>

          {/* Dogs Grid with Modern Cards and Animations */}
          {isLoading ? (
            // Skeleton loading state
            <Grid container spacing={4}>
              {[...Array(6)].map((_, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Paper
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      overflow: 'hidden',
                      boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
                    }}
                  >
                    <Skeleton variant="rectangular" height={240} width="100%" 
                      sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }} 
                    />
                    <Box sx={{ p: 3 }}>
                      <Skeleton variant="text" height={40} width="70%" 
                        sx={{ bgcolor: alpha(theme.palette.primary.main, 0.07) }} 
                      />
                      <Skeleton variant="text" height={20} width="50%" 
                        sx={{ mb: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }} 
                      />
                      <Skeleton variant="text" height={20} width="95%" 
                        sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }} 
                      />
                      <Skeleton variant="text" height={20} width="90%" 
                        sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }} 
                      />
                      <Skeleton variant="text" height={20} width="60%" 
                        sx={{ mb: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }} 
                      />
                      <Box sx={{ display: 'flex', gap: 1, mt: 2, mb: 2 }}>
                        <Skeleton variant="rounded" height={32} width={80} 
                          sx={{ borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.05) }} 
                        />
                        <Skeleton variant="rounded" height={32} width={70} 
                          sx={{ borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.05) }} 
                        />
                      </Box>
                      <Box sx={{ display: 'flex', mt: 2 }}>
                        <Skeleton variant="rounded" height={36} width={100} 
                          sx={{ borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.07) }} 
                        />
                        <Skeleton variant="rounded" height={36} width={120} 
                          sx={{ ml: 'auto', borderRadius: 4, bgcolor: alpha(theme.palette.secondary.main, 0.1) }} 
                        />
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : currentDogs.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
            <Grid container spacing={4}>
              {currentDogs.map((dog) => (
                <Grid item key={dog.id} xs={12} sm={6} md={4}>
                    <motion.div 
                      variants={cardVariant}
                      whileHover={{ y: -10 }}
                      transition={{ duration: 0.4 }}
                    >
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                          borderRadius: 4,
                          overflow: 'hidden',
                          background: 'white',
                          boxShadow: '0 15px 50px rgba(0,0,0,0.08)',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                      '&:hover': {
                            boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                          }
                        }}
                      >
                        {/* Quick actions on hover */}
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            width: '100%', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            p: 2, 
                            zIndex: 10 
                          }}
                        >
                          <Tooltip title="Quick view">
                            <IconButton 
                              onClick={() => openQuickView(dog)}
                              sx={{ 
                                bgcolor: 'rgba(255,255,255,0.85)', 
                                backdropFilter: 'blur(5px)',
                                '&:hover': { 
                                  bgcolor: 'white',
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <SearchIcon />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title={favorited.includes(dog.id) ? "Remove from favorites" : "Add to favorites"}>
                            <IconButton 
                              onClick={() => toggleFavorite(dog.id)}
                              sx={{ 
                                bgcolor: favorited.includes(dog.id) 
                                  ? alpha(theme.palette.secondary.main, 0.85)
                                  : 'rgba(255,255,255,0.85)', 
                                color: favorited.includes(dog.id) ? 'white' : 'inherit',
                                backdropFilter: 'blur(5px)',
                                '&:hover': { 
                                  bgcolor: favorited.includes(dog.id) 
                                    ? theme.palette.secondary.main 
                                    : 'white',
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {favorited.includes(dog.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                            </IconButton>
                          </Tooltip>
                        </Box>
                        
                        {/* Image section with enhanced styling */}
                        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                            height={260}
                      image={dog.image}
                      alt={dog.name}
                            sx={{ 
                              transition: 'transform 0.7s ease',
                              '&:hover': {
                                transform: 'scale(1.05)'
                              }
                            }}
                          />
                          
                          {/* Age badge with improved styling */}
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 16,
                              right: 16,
                              background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.light, 0.9)}, ${alpha(theme.palette.secondary.main, 0.85)})`,
                              color: 'white',
                              py: 0.7,
                              px: 2,
                              borderRadius: 30,
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              backdropFilter: 'blur(4px)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5
                            }}
                          >
                            <PetsIcon sx={{ fontSize: 16 }} /> {dog.age}
                          </Box>
                          
                          {/* Gender icon */}
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 16,
                              left: 16,
                              background: 'rgba(255,255,255,0.85)',
                              color: dog.gender === 'Male' ? theme.palette.primary.main : theme.palette.secondary.main,
                              width: 40,
                              height: 40,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '50%',
                              backdropFilter: 'blur(4px)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              zIndex: 1,
                              fontSize: '1.2rem'
                            }}
                          >
                            {dog.gender === 'Male' ? '♂' : '♀'}
                          </Box>
                        </Box>
                        
                        {/* Content section with improved styling */}
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            mb: 1.5
                          }}>
                            <Typography 
                              variant="h5" 
                              component="div" 
                              sx={{ 
                                fontWeight: 800,
                                color: theme.palette.primary.dark,
                                fontSize: '1.5rem'
                              }}
                            >
                        {dog.name}
                      </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 38,
                                height: 38,
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)}, ${alpha(theme.palette.primary.main, 0.1)})`,
                              }}
                            >
                              <PetsIcon 
                                sx={{ 
                                  fontSize: '1.3rem', 
                                  color: theme.palette.primary.main 
                                }} 
                              />
                            </Box>
                          </Box>
                          
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              mb: 2,
                              color: alpha(theme.palette.text.primary, 0.7),
                              fontWeight: 500,
                              pb: 2,
                              borderBottom: `1px dashed ${alpha(theme.palette.divider, 0.5)}`,
                            }}
                          >
                            <span style={{ fontWeight: 600 }}>{dog.breed}</span> 
                            <Box component="span" sx={{ mx: 0.7, color: alpha(theme.palette.text.primary, 0.3) }}>•</Box> 
                            <span>{dog.size}</span>
                      </Typography>
                          
                          <Typography variant="body2" sx={{ mb: 2.5, lineHeight: 1.6 }}>
                        {dog.description}
                      </Typography>
                          
                          {/* Tags with improved design */}
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 'auto', mb: 2 }}>
                            {dog.tags && dog.tags.map((tag, idx) => (
                              <Chip
                                key={idx}
                                icon={<LocalOfferIcon sx={{ fontSize: '0.85rem' }} />}
                                label={tag}
                                size="small"
                                sx={{ 
                                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                                  color: theme.palette.primary.dark,
                                  fontWeight: 500,
                                  borderRadius: '25px',
                                  px: 0.5,
                                  '& .MuiChip-icon': {
                                    color: theme.palette.primary.main
                                  }
                                }}
                              />
                            ))}
                          </Box>
                    </CardContent>
                        
                        {/* Actions with improved styling */}
                        <CardActions sx={{ p: 3, pt: 0 }}>
                      <Button 
                        size="small" 
                        component={RouterLink} 
                        to={`/dogs/${dog.id}`}
                            sx={{ 
                              color: theme.palette.primary.main,
                              fontWeight: 600,
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.1)
                              }
                            }}
                      >
                        Learn More
                      </Button>
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="primary"
                        component={RouterLink} 
                        to="/contact"
                            endIcon={<ArrowForwardIcon />}
                            sx={{ 
                              ml: 'auto',
                              borderRadius: 30,
                              px: 2.5,
                              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                              boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                              fontWeight: 600,
                              textTransform: 'none',
                              '&:hover': {
                                background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                                boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.4)}`,
                                transform: 'translateY(-2px)'
                              },
                              transition: 'all 0.3s ease'
                            }}
                      >
                        Adopt Me
                      </Button>
                    </CardActions>
                  </Card>
                    </motion.div>
                </Grid>
              ))}
            </Grid>

              {/* Modernized Pagination */}
            {pageCount > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, mb: 4 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <Paper 
                      elevation={3} 
                      sx={{ 
                        borderRadius: 4, 
                        overflow: 'hidden',
                        boxShadow: `0 10px 40px ${alpha(theme.palette.common.black, 0.08)}`,
                        padding: '8px 16px',
                        backdropFilter: 'blur(10px)',
                        background: alpha(theme.palette.background.paper, 0.9)
                      }}
                    >
                <Pagination 
                  count={pageCount} 
                  page={page} 
                  onChange={handleChangePage} 
                  color="primary" 
                        size="large"
                        showFirstButton
                        showLastButton
                        sx={{
                          '& .MuiPaginationItem-root': {
                            borderRadius: 2,
                            mx: 0.5,
                            fontWeight: 600,
                            transition: 'all 0.2s ease'
                          },
                          '& .Mui-selected': {
                            backgroundColor: theme.palette.primary.main,
                            color: 'white',
                            boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.25)}`,
                            '&:hover': {
                              backgroundColor: theme.palette.primary.dark
                            }
                          }
                        }}
                      />
                    </Paper>
                  </motion.div>
                </Box>
              )}
            </motion.div>
          ) : (
            // No results state with improved styling
          <Box sx={{ textAlign: 'center', py: 8 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: alpha(theme.palette.secondary.light, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 3
                  }}
                >
                  <SearchIcon sx={{ fontSize: 48, color: alpha(theme.palette.secondary.main, 0.5) }} />
                </Box>
                <Typography variant="h5" sx={{ mb: 2, color: theme.palette.text.secondary }}>
                  No matches found yet
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, color: alpha(theme.palette.text.secondary, 0.7) }}>
                  Try adjusting your filters — your perfect companion is waiting to be discovered
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
                  sx={{ 
                    mt: 2,
                    px: 4,
                    py: 1.5,
                    borderRadius: 50,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.25)}`,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  }}
                  onClick={resetFilters}
                >
                  Reset All Filters
            </Button>
              </motion.div>
          </Box>
        )}
      </Box>
    </Container>

      {/* Quick View Modal */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(5px)'
        }}
        open={quickViewOpen}
        onClick={closeQuickView}
      >
        <AnimatePresence>
          {quickViewOpen && selectedDog && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}
            >
              <Paper 
                elevation={10}
                sx={{ 
                  borderRadius: 4, 
                  overflow: 'hidden',
                  boxShadow: '0 25px 80px rgba(0,0,0,0.3)',
                  maxHeight: '85vh',
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' }
                }}
              >
                {/* Image section */}
                <Box 
                  sx={{ 
                    width: { xs: '100%', md: '50%' },
                    height: { xs: '300px', md: 'auto' },
                    position: 'relative'
                  }}
                >
                  <img 
                    src={selectedDog.image} 
                    alt={selectedDog.name}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      right: 16,
                      display: 'flex',
                      gap: 1
                    }}
                  >
                    <Tooltip title="View details">
                      <IconButton 
                        component={RouterLink}
                        to={`/dogs/${selectedDog.id}`}
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.85)', 
                          backdropFilter: 'blur(5px)',
                          '&:hover': { 
                            bgcolor: 'white',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title={favorited.includes(selectedDog.id) ? "Remove from favorites" : "Add to favorites"}>
                      <IconButton 
                        onClick={() => toggleFavorite(selectedDog.id)}
                        sx={{ 
                          bgcolor: favorited.includes(selectedDog.id) 
                            ? alpha(theme.palette.secondary.main, 0.85)
                            : 'rgba(255,255,255,0.85)', 
                          color: favorited.includes(selectedDog.id) ? 'white' : 'inherit',
                          backdropFilter: 'blur(5px)',
                          '&:hover': { 
                            bgcolor: favorited.includes(selectedDog.id) 
                              ? theme.palette.secondary.main 
                              : 'white',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {favorited.includes(selectedDog.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Backdrop>
    </Box>
  );
};

export default DogsPage; 