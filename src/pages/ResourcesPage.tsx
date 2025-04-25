import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  GridLegacy as Grid,
  Card,
  CardContent,
  CardMedia,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Paper,
  alpha,
  useTheme,
  Avatar,
  Divider,
  Chip,
  Stack,
  Link
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ArrowForward as ArrowForwardIcon,
  Warning as WarningIcon,
  PetsOutlined as PetsIcon,
  Info as InfoIcon,
  Phone as PhoneIcon,
  LocalHospital as LocalHospitalIcon,
  Favorite as FavoriteIcon,
  School as SchoolIcon,
  Pets as PetsFilledIcon,
  Article as ArticleIcon,
  Store as StoreIcon,
  Place as PlaceIcon,
  Build as BuildIcon,
  LibraryBooks as LibraryBooksIcon,
  EventNote as EventNoteIcon,
  AllInclusive as AllInclusiveIcon,
  Healing as HealingIcon,
  PersonPin as PersonPinIcon,
  Construction as ConstructionIcon,
  Badge as BadgeIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

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

const ResourcesPage = () => {
  const theme = useTheme();

  const resourceCategories = [
    {
      title: 'Dog Training',
      icon: <SchoolIcon fontSize="large" />,
      image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Resources for training your new dog, from basic commands to behavioral issues.',
    },
    {
      title: 'Healthcare',
      icon: <LocalHospitalIcon fontSize="large" />,
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Information on routine care, vaccinations, and common health issues.',
    },
    {
      title: 'Nutrition',
      icon: <StoreIcon fontSize="large" />,
      image: 'https://images.unsplash.com/photo-1551730459-8ad3f829611a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Guidance on proper feeding, diet requirements, and healthy treats.',
    },
    {
      title: 'Behavior',
      icon: <HealingIcon fontSize="large" />,
      image: 'https://images.unsplash.com/photo-1504595403659-9088ce801e29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Understanding dog behavior, body language, and addressing common issues.',
    },
  ];

  const faqs = [
    {
      question: 'How do I introduce my new dog to my existing pets?',
      answer: 'Introduce pets gradually in a neutral environment. Start with scent introduction, then visual contact with a barrier, and finally supervised direct interaction. Keep the first meetings short and positive. Always monitor interactions until you\'re confident they get along well. Consider consulting a professional trainer if you encounter difficulties.'
    },
    {
      question: 'What should I feed my dog?',
      answer: 'Feed a high-quality commercial dog food appropriate for your dog\'s age, size, and health needs. Look for products that list a specific meat as the first ingredient and avoid those with excessive fillers or by-products. Consult your vet for specific recommendations, especially for dogs with health issues or special dietary needs.'
    },
    {
      question: 'How often should my dog see a veterinarian?',
      answer: 'Adult dogs should have a wellness check-up at least once a year. Puppies require more frequent visits for vaccinations and monitoring development. Senior dogs (typically over 7 years) benefit from twice-yearly check-ups. Always see a vet promptly if your dog shows signs of illness or injury.'
    },
    {
      question: 'How can I help my dog adjust to a new home?',
      answer: 'Create a consistent routine for feeding, walks, and bedtime. Provide a quiet space with their bed and toys. Be patient as they learn house rules. Use positive reinforcement for desired behaviors. Limit introductions to new people and pets initially. Give your dog time to decompress and adjust to their new environment - this can take weeks or even months.'
    },
    {
      question: 'What are signs that my dog needs immediate veterinary attention?',
      answer: 'Seek emergency care if your dog shows: difficulty breathing, prolonged seizures, suspected poisoning, severe injury or bleeding, inability to urinate, persistent vomiting or diarrhea, extreme lethargy, collapse, or signs of severe pain. When in doubt, call your vet or an emergency animal hospital for guidance.'
    },
  ];

  const emergencyContacts = [
    {
      name: 'Pet Poison Helpline',
      phone: '(855) 764-7661',
      description: '24/7 animal poison control service (fee may apply)',
      hours: '24/7',
      website: 'https://www.petpoisonhelpline.com'
    },
    {
      name: 'ASPCA Animal Poison Control',
      phone: '(888) 426-4435',
      description: '24/7 poison control hotline (fee may apply)',
      hours: '24/7',
      website: 'https://www.aspca.org/pet-care/animal-poison-control'
    },
    {
      name: 'City Animal Emergency Hospital',
      phone: '(123) 456-7890',
      description: '24-hour emergency veterinary care',
      hours: 'Open 24 hours',
      website: 'https://example.com/city-animal-emergency'
    },
    {
      name: 'Dog Rescue Mission Helpline',
      phone: '(123) 456-7000',
      description: 'For questions about your adopted dog',
      hours: 'Mon-Fri: 9am-5pm, Sat: 10am-2pm',
      website: 'https://example.com/dog-rescue-helpline'
    },
  ];

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box 
        sx={{
          position: 'relative',
          height: { xs: '60vh', md: '75vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          mb: 8,
          overflow: 'hidden'
        }}
      >
        {/* Parallax Background */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <Box 
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'url(https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center 40%',
              opacity: 1,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `linear-gradient(145deg, rgba(0,0,0,0.92) 0%, ${alpha(theme.palette.primary.dark, 0.85)} 50%, ${alpha(theme.palette.primary.main, 0.75)} 100%)`,
              }
            }}
          />
        </motion.div>
        
        {/* Enhanced animated particles */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, overflow: 'hidden' }}>
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={`paw-${i}`}
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                opacity: 0.1 + Math.random() * 0.15,
                scale: 0.4 + Math.random() * 0.6
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
                opacity: [0.05, 0.15, 0.05],
                scale: [0.4, 0.6, 0.4],
                rotate: [0, 180, 360],
                transition: { 
                  duration: 15 + Math.random() * 25, 
                  repeat: Infinity, 
                  ease: "linear"
                }
              }}
              style={{
                position: 'absolute',
                color: 'rgba(255,255,255,0.1)',
                filter: 'blur(1px)'
              }}
            >
              <PetsIcon style={{ fontSize: `${24 + Math.random() * 40}px` }} />
            </motion.div>
          ))}
        </Box>
        
        {/* Light rays effect */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `radial-gradient(circle at 30% 70%, ${alpha(theme.palette.primary.light, 0.2)} 0%, transparent 45%)`,
            zIndex: 2
          }}
        />
        
        {/* Hero content */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 5 }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <Box sx={{ textAlign: 'center' }}>
              <motion.div 
                variants={slideInUp}
                transition={{ delay: 0.1 }}
              >
                <Chip
                  icon={<InfoIcon />}
                  label="EXPERT CARE GUIDANCE"
                  color="secondary"
                  sx={{ 
                    mb: 3, 
                    py: 3, 
                    px: 2.5, 
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    letterSpacing: '1px',
                    borderRadius: 6,
                    backgroundColor: alpha(theme.palette.secondary.main, 0.9),
                    border: `1px solid ${alpha('#fff', 0.1)}`,
                    boxShadow: `0 10px 15px -3px ${alpha(theme.palette.secondary.dark, 0.3)}`,
                    '& .MuiChip-icon': { 
                      fontSize: '1.2rem',
                      marginLeft: '8px',
                      marginRight: '-4px'
                    }
                  }}
                />
              </motion.div>
              
              <motion.div 
                variants={slideInUp}
                transition={{ delay: 0.2 }}
              >
                <Typography 
                  variant="h1" 
                  component="h1"
                  sx={{ 
                    fontWeight: 900,
                    color: 'white',
                    fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
                    textShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    mb: 3,
                    lineHeight: 1.1,
                    position: 'relative',
                    display: 'inline-block',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '90px',
                      height: '6px',
                      borderRadius: '3px',
                      backgroundColor: theme.palette.secondary.main,
                      bottom: '-16px',
                      left: '50%',
                      transform: 'translateX(-50%)'
                    }
                  }}
                >
                  Dog Care Resources
                </Typography>
              </motion.div>

              <motion.div 
                variants={slideInUp}
                transition={{ delay: 0.3 }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    maxWidth: 750, 
                    mx: 'auto',
                    mt: 5,
                    mb: 5, 
                    fontWeight: 400,
                    lineHeight: 1.7,
                    letterSpacing: '0.3px',
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                  }}
                >
                  Everything you need to ensure your dog lives a happy, healthy life.
                  From training guides to nutrition essentials and emergency care information.
                </Typography>
              </motion.div>

              <motion.div 
                variants={slideInUp}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="contained" 
                  size="large" 
                  endIcon={
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <ArrowForwardIcon />
                    </motion.div>
                  }
                  color="secondary"
                  onClick={() => {
                    const section = document.getElementById('resource-categories');
                    if (section) {
                      section.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  sx={{ 
                    py: 2, 
                    px: 6, 
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    textTransform: 'none',
                    borderRadius: '50px',
                    boxShadow: `0 10px 20px -5px ${alpha(theme.palette.secondary.main, 0.5)}`,
                    background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                    border: `2px solid ${alpha('#fff', 0.15)}`,
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: `0 14px 28px -7px ${alpha(theme.palette.secondary.main, 0.65)}`
                    },
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                >
                  Explore All Resources
                </Button>
              </motion.div>
              
              {/* Visual decoration - decorative paw prints */}
              <Box sx={{ 
                position: 'absolute', 
                bottom: '-80px', 
                left: '5%', 
                opacity: 0.15,
                transform: 'rotate(-15deg)'
              }}>
                <PetsFilledIcon sx={{ fontSize: 160 }} />
              </Box>
              
              <Box sx={{ 
                position: 'absolute', 
                top: '10%', 
                right: '5%', 
                opacity: 0.1,
                transform: 'rotate(15deg)'
              }}>
                <PetsFilledIcon sx={{ fontSize: 120 }} />
              </Box>
            </Box>
          </motion.div>
        </Container>
        
        {/* Bottom wave decoration */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -2,
            left: 0,
            width: '100%',
            height: '120px',
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M0,288L60,261.3C120,235,240,181,360,181.3C480,181,600,235,720,245.3C840,256,960,224,1080,202.7C1200,181,1320,171,1380,165.3L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 3
          }}
        />
      </Box>

      <Container maxWidth="lg">
        <Box sx={{ my: 4 }} id="resource-categories">
          {/* Resource Categories */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <Box sx={{ mb: 10 }}>
              <Typography 
                variant="h2" 
                component="h2" 
                align="center" 
                gutterBottom 
                sx={{ 
                  mb: 1.5, 
                  fontWeight: 800,
                  position: 'relative',
                  display: 'inline-block',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: { xs: '2rem', md: '2.75rem' }
                }}
              >
                Pet Care Topics
                <Box 
                  sx={{ 
                    position: 'absolute',
                    height: '12px',
                    width: '100px',
                    backgroundColor: alpha(theme.palette.secondary.main, 0.4),
                    bottom: 8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: -1,
                    borderRadius: 2
                  }}
                />
              </Typography>
              
              <Typography 
                variant="h6" 
                component="p" 
                align="center" 
                color="text.secondary" 
                sx={{ 
                  maxWidth: 700, 
                  mx: 'auto', 
                  mb: 6, 
                  fontWeight: 400
                }}
              >
                Explore our curated resources to help you provide the best care for your canine companion, 
                from training and behavior to healthcare and nutrition.
              </Typography>
              
              <motion.div variants={staggerContainer}>
                <Grid 
                  container 
                  spacing={4} 
                  alignItems="stretch"
                  sx={{ 
                    '& .MuiGrid-item': {
                      display: 'flex'
                    } 
                  }}
                >
                  {resourceCategories.map((category, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <motion.div
                        variants={cardVariant}
                        whileHover={{ 
                          y: -10,
                          transition: { type: "spring", stiffness: 300, damping: 10 }
                        }}
                        style={{ width: '100%', display: 'flex' }}
                      >
                        <Card 
                          sx={{ 
                            width: '100%',
                            height: 360,
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 4,
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                            position: 'relative',
                          }}
                        >
                          <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                              height="180"
                    image={category.image}
                    alt={category.title}
                              sx={{ 
                                height: 180,
                                objectFit: 'cover',
                                transition: 'transform 0.5s ease',
                                '&:hover': {
                                  transform: 'scale(1.05)'
                                }
                              }}
                            />
                            <Box sx={{ 
                              position: 'absolute', 
                              top: 0, 
                              left: 0, 
                              width: '100%', 
                              height: '100%',
                              background: `linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7) 100%)`
                            }} />
                            <Avatar 
                              sx={{ 
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                bgcolor: theme.palette.secondary.main,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                width: 48,
                                height: 48
                              }}
                            >
                        {category.icon}
                            </Avatar>
                            <Box 
                              sx={{ 
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                p: 2,
                                zIndex: 2
                              }}
                            >
                              <Typography 
                                variant="h6" 
                                component="h3"
                                sx={{ 
                                  color: 'white',
                                  fontWeight: 700,
                                  textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                }}
                              >
                        {category.title}
                      </Typography>
                    </Box>
                          </Box>
                          <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <Typography 
                              variant="body1" 
                              color="text.secondary"
                              sx={{ mb: 3 }}
                            >
                      {category.description}
                    </Typography>
                            <Button
                              variant="outlined"
                              color="primary"
                              fullWidth
                              endIcon={<ArrowForwardIcon />}
                              sx={{ 
                                mt: 'auto',
                                textTransform: 'none',
                                borderRadius: 2,
                                py: 1
                              }}
                            >
                              Learn More
                            </Button>
                  </CardContent>
                </Card>
                      </motion.div>
              </Grid>
            ))}
          </Grid>
              </motion.div>
        </Box>
          </motion.div>

        {/* FAQs */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 4, md: 6 }, 
                mb: 10, 
                borderRadius: 4, 
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.15)} 100%)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: -30, 
                  right: -30, 
                  opacity: 0.04, 
                  transform: 'rotate(-10deg)' 
                }}
              >
                <LibraryBooksIcon sx={{ fontSize: 280 }} />
              </Box>

              <Typography 
                variant="h2" 
                component="h2" 
                gutterBottom 
                sx={{ 
                  mb: 4, 
                  fontWeight: 800,
                  position: 'relative',
                  display: 'inline-block',
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
            Frequently Asked Questions
                <Box 
                  sx={{ 
                    position: 'absolute',
                    height: '12px',
                    width: '30%',
                    backgroundColor: alpha(theme.palette.secondary.main, 0.4),
                    bottom: 5,
                    left: 0,
                    zIndex: -1,
                    borderRadius: 2
                  }}
                />
          </Typography>

              <motion.div variants={staggerContainer}>
          {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariant}
                    custom={index}
                  >
                    <Accordion 
                      sx={{ 
                        mb: 2,
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px !important',
                        overflow: 'hidden',
                        '&::before': {
                          display: 'none'
                        },
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                      }}
                    >
              <AccordionSummary
                        expandIcon={
                          <ExpandMoreIcon 
                            sx={{ 
                              color: theme.palette.primary.main,
                              fontSize: 28
                            }} 
                          />
                        }
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
                        sx={{
                          borderRadius: 3,
                          minHeight: 64,
                          px: 3,
                          '& .MuiAccordionSummary-content': {
                            margin: '12px 0'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{ 
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              mr: 2,
                              width: 36,
                              height: 36,
                            }}
                          >
                            <Typography variant="body2" fontWeight="bold">
                              Q{index + 1}
                            </Typography>
                          </Avatar>
                          <Typography 
                            variant="h6" 
                            fontWeight="600"
                            color="text.primary"
                          >
                  {faq.question}
                </Typography>
                        </Box>
              </AccordionSummary>
                      <AccordionDetails sx={{ px: 3, pt: 0, pb: 3 }}>
                        <Box
                          sx={{
                            borderLeft: `4px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                            pl: 3,
                            ml: 2
                          }}
                        >
                          <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  {faq.answer}
                </Typography>
                        </Box>
              </AccordionDetails>
            </Accordion>
                  </motion.div>
                ))}
              </motion.div>
            </Paper>
          </motion.div>

          {/* Emergency Contacts */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <Box 
              sx={{ 
                mb: 8, 
                mt: 12,
                position: 'relative',
                background: `linear-gradient(120deg, ${alpha(theme.palette.error.light, 0.05)}, ${alpha(theme.palette.error.main, 0.2)})`,
                borderRadius: 8,
                p: { xs: 3, md: 5 },
                overflow: 'hidden'
              }}
            >
              {/* Decorative elements */}
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: -100, 
                  right: -100, 
                  opacity: 0.06, 
                  zIndex: 0
                }}
              >
                <WarningIcon sx={{ fontSize: 380 }} />
        </Box>

              <motion.div
                variants={slideInRight}
                style={{ position: 'relative', zIndex: 1 }}
              >
                <Stack 
                  direction="row" 
                  alignItems="center" 
                  spacing={2} 
                  sx={{ mb: 4 }}
                >
                  <Chip 
                    icon={<LocalHospitalIcon />} 
                    label="EMERGENCY" 
                    color="error" 
                    sx={{ 
                      py: 2.5, 
                      px: 2, 
                      fontSize: '1rem',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      borderRadius: 2,
                      backgroundColor: theme.palette.error.main,
                      '& .MuiChip-icon': { fontSize: '1.4rem' }
                    }} 
                  />
                </Stack>

                <Typography 
                  variant="h2" 
                  component="h2" 
                  gutterBottom 
                  sx={{ 
                    mb: 2, 
                    fontWeight: 800,
                    position: 'relative',
                    display: 'inline-block',
                    fontSize: { xs: '2rem', md: '2.75rem' },
                    color: theme.palette.error.dark
                  }}
                >
            Emergency Contacts
          </Typography>

                <Typography 
                  variant="h6" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 5,
                    maxWidth: 700
                  }}
                >
                  If your pet is experiencing a medical emergency, please contact one of 
                  these emergency veterinary services immediately.
          </Typography>

                <motion.div
                  variants={staggerContainer}
                >
          <Grid container spacing={3}>
                    {emergencyContacts.map((contact, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <motion.div
                          variants={cardVariant}
                          whileHover={{ 
                            y: -8,
                            transition: { type: "spring", stiffness: 300, damping: 20 }
                          }}
                          style={{ height: '100%' }}
                        >
                          <Paper
                            elevation={5}
                            sx={{
                              p: 3,
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              borderRadius: 4,
                              background: 'white',
                              overflow: 'hidden',
                              position: 'relative',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                              border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
                              '&:before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '8px',
                                background: theme.palette.error.main,
                                opacity: 0.8
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                              <Avatar
                                sx={{
                                  bgcolor: alpha(theme.palette.error.main, 0.1),
                                  color: theme.palette.error.main,
                                  mr: 2,
                                  width: 54,
                                  height: 54
                                }}
                              >
                                <PhoneIcon fontSize="large" />
                              </Avatar>
                              <Box>
                                <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                                  {contact.name}
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                  {contact.description}
                    </Typography>
                  </Box>
                            </Box>
                            
                            <Divider sx={{ my: 2 }} />
                            
                            <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ 
                                  bgcolor: alpha(theme.palette.error.main, 0.1), 
                                  borderRadius: '50%',
                                  p: 0.75,
                                  mr: 1.5
                                }}>
                                  <InfoIcon fontSize="small" color="error" />
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Hours:</strong> {contact.hours}
                    </Typography>
                  </Box>
                              
                              <Typography 
                                variant="h6" 
                                component="a" 
                                href={`tel:${contact.phone.replace(/\D/g,'')}`}
                                sx={{
                                  textDecoration: 'none',
                                  color: theme.palette.error.main,
                                  fontWeight: 'bold',
                                  display: 'flex',
                                  alignItems: 'center',
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    transform: 'scale(1.03)'
                                  }
                                }}
                              >
                                <PhoneIcon sx={{ mr: 1.5, fontSize: '1.2rem' }} />
                          {contact.phone}
                        </Typography>
                            </Box>

                            <Box
                              sx={{
                                mt: 'auto',
                                pt: 2,
                                display: 'flex',
                                justifyContent: 'flex-end'
                              }}
                            >
                              <Button
                                variant="contained"
                                color="error"
                                endIcon={<ArrowForwardIcon />}
                                component="a"
                                href={contact.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  textTransform: 'none',
                                  borderRadius: 2,
                                  px: 3,
                                  boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)',
                                  '&:hover': {
                                    boxShadow: '0 6px 16px rgba(211, 47, 47, 0.3)',
                                  }
                                }}
                              >
                                Visit Website
                              </Button>
                            </Box>
                          </Paper>
                        </motion.div>
                      </Grid>
                    ))}
            </Grid>
                </motion.div>
              </motion.div>
        </Box>
          </motion.div>

        {/* Additional Resources */}
        <Box>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
            Recommended Resources
          </Typography>
          <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LibraryBooksIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" component="div">
                      Books & Publications
                    </Typography>
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="The Art of Raising a Puppy" 
                        secondary="by Monks of New Skete"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="How to Be Your Dog's Best Friend" 
                        secondary="by Monks of New Skete"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Inside of a Dog" 
                        secondary="by Alexandra Horowitz"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Don't Shoot the Dog" 
                        secondary="by Karen Pryor"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
              <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AllInclusiveIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" component="div">
                      Online Resources
                    </Typography>
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="American Kennel Club (AKC)" 
                        secondary="Training resources, breed information, and health articles"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="ASPCA Pet Care" 
                        secondary="Comprehensive guides on dog care, behavior, and training"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Whole Dog Journal" 
                        secondary="In-depth articles on natural dog care, training, and nutrition"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Fear Free Happy Homes" 
                        secondary="Resources for reducing fear, anxiety, and stress in pets"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button variant="contained" color="primary" size="large" href="/contact">
              Contact Us for More Resources
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
    </Box>
  );
};

export default ResourcesPage; 