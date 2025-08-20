import { Box, Typography, Container, GridLegacy as Grid, Paper, useTheme, alpha, keyframes, Button, Avatar, Divider, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GroupsIcon from '@mui/icons-material/Groups';
import VerifiedIcon from '@mui/icons-material/Verified';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Define animations
  const rotate = keyframes`
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  `;

  const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  `;
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      } 
    }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        type: "spring", 
        stiffness: 80, 
        damping: 12 
      } 
    }
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

  // Placeholder team data
  const team = [
    {
      name: 'Aliya Fathima',
      role: 'Founder & Executive Director',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      bio: 'Aliya has been rescuing dogs for over 15 years and founded Dog Rescue Mission in 2010. Her passion for animal welfare has transformed the lives of hundreds of dogs in need.',
      socialLinks: {
        email: 'aliya@example.com',
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      name: 'Sandra Suresh',
      role: 'Adoption Coordinator',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      bio: 'Sandra works tirelessly to match dogs with their perfect forever families. Her intuition for pairing dogs with the right homes has led to hundreds of successful adoptions.',
      socialLinks: {
        email: 'sandra@example.com',
        linkedin: '#',
        instagram: '#'
      }
    },
    {
      name: 'Alan Jose',
      role: 'Veterinary Director',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      bio: 'Alan has 20 years of veterinary experience and oversees all medical care for our dogs. His expertise ensures that every rescue receives the highest quality treatment and rehabilitation.',
      socialLinks: {
        email: 'alan@example.com',
        linkedin: '#',
        twitter: '#'
      }
    },
  ];

  // Our values with icons
  const values = [
    {
      title: 'Compassion',
      description: 'We treat all animals with kindness, respect, and dignity. We believe in the intrinsic value of each life and strive to provide the best care possible.',
      icon: <FavoriteIcon sx={{ fontSize: 40 }} />,
      gradient: `linear-gradient(135deg, #FF9A8B, #FF6A88)`
    },
    {
      title: 'Integrity',
      description: 'We operate with transparency and honesty in all aspects of our work. We are accountable to our supporters, adopters, and most importantly, the animals in our care.',
      icon: <VerifiedIcon sx={{ fontSize: 40 }} />,
      gradient: `linear-gradient(135deg, #4158D0, #C850C0)`
    },
    {
      title: 'Community',
      description: 'We believe in the power of community and collaboration. By working together with volunteers, supporters, and other organizations, we can make a greater impact for animals in need.',
      icon: <GroupsIcon sx={{ fontSize: 40 }} />,
      gradient: `linear-gradient(135deg, #0093E9, #80D0C7)`
    }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      style={{ width: '100%', overflow: 'hidden' }}
    >
      {/* Hero Section - Full Width with Background Image */}
      <Box 
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '80vh', md: '90vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Background Image with Overlay */}
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url(https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            opacity: 0.6,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, rgba(0,0,0,0.8) 0%, ${alpha('#FF8C00', 0.7)} 100%)`,
            }
          }}
        />
        
        {/* Hero Content */}
        <Box 
          sx={{ 
            width: '100%',
            position: 'relative', 
            zIndex: 2, 
            px: { xs: 3, md: 0 } 
          }}
        >
          <Container maxWidth="xl">
            <motion.div 
              variants={fadeInUp}
              className="hero-content"
            >
              <Box 
                sx={{ 
                  maxWidth: { xs: '100%', md: '70%' },
                  mx: 'auto',
                  textAlign: 'center',
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mb: 4,
                    animation: `${float} 6s ease-in-out infinite`
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: { xs: 100, md: 130 },
                      height: { xs: 100, md: 130 },
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, #FF8C00, #FF5F1F)`,
                      boxShadow: '0 15px 35px rgba(255, 140, 0, 0.5), 0 0 0 15px rgba(255, 140, 0, 0.1)',
                    }}
                  >
                    <PetsIcon sx={{ fontSize: { xs: 50, md: 70 }, color: 'white' }} />
                  </Box>
                </Box>
                
                <Typography 
                  variant="h1" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 800, 
                    mb: 3,
                    fontSize: { xs: '2.8rem', sm: '3.8rem', md: '5rem' },
                    color: 'white',
                    textShadow: '2px 2px 20px rgba(0,0,0,0.7), 0 0 30px rgba(255, 140, 0, 0.5)',
                    lineHeight: 1.1
                  }}
                >
                  Our Story & Mission
                </Typography>
                
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'white', 
                    opacity: 0.9,
                    maxWidth: 850, 
                    mx: 'auto',
                    lineHeight: 1.6,
                    fontWeight: 400,
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    mb: 5,
                    textShadow: '1px 1px 5px rgba(0,0,0,0.5)'
                  }}
                >
                  Discover the journey, mission, and passionate team behind Dog Rescue Mission
        </Typography>

                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    borderRadius: '50px',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(90deg, #FF8C00, #FF5F1F)',
                    boxShadow: '0 10px 20px rgba(255, 140, 0, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #FF5F1F, #FF8C00)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 15px 30px rgba(255, 140, 0, 0.4)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => navigate('/volunteer#join-applications-section')}
                >
                  Join Our Mission
                </Button>
              </Box>
            </motion.div>
          </Container>
        </Box>
        
        {/* Bottom wave overlay */}
        <Box 
          sx={{
            position: 'absolute',
            bottom: -5,
            left: 0,
            width: '100%',
            height: '150px',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M0,96L48,112C96,128,192,160,288,170.7C384,181,480,171,576,144C672,117,768,75,864,74.7C960,75,1056,117,1152,122.7C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 4
          }}
        />
      </Box>

      {/* Mission Section - Full Width with Background Pattern */}
      <Box 
        sx={{ 
          width: '100%', 
          py: { xs: 10, md: 16 },
          position: 'relative',
          overflow: 'hidden',
          background: `
            radial-gradient(circle at 20% 30%, ${alpha('#FF8C00', 0.07)} 0%, transparent 12%),
            radial-gradient(circle at 75% 80%, ${alpha('#FF8C00', 0.05)} 0%, transparent 15%),
            radial-gradient(circle at 95% 15%, ${alpha('#FF8C00', 0.07)} 0%, transparent 10%),
            white
          `
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 5 }}>
          <Grid container spacing={8} alignItems="center">
            <Grid key="mission-content" item xs={12} md={6}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.div variants={fadeInRight}>
                  <Typography 
                    variant="h6" 
                    component="p"
                    sx={{ 
                      color: '#FF8C00',
                      fontWeight: 600,
                      mb: 1,
                      textTransform: 'uppercase',
                      letterSpacing: 2,
                      fontSize: '0.95rem'
                    }}
                  >
            Our Mission
          </Typography>
                  
                  <Typography 
                    variant="h2" 
                    component="h2" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 800, 
                      mb: 3,
                      fontSize: { xs: '2.4rem', md: '3rem' },
                      color: '#333',
                      lineHeight: 1.1,
                      position: 'relative',
                      '&:after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -12,
                        left: 0,
                        width: 80,
                        height: 5,
                        borderRadius: 10,
                        backgroundColor: '#FF8C00'
                      }
                    }}
                  >
                    Giving Dogs a Second Chance at Life
          </Typography>
                  
                  <Typography 
                    variant="body1" 
                    paragraph
                    sx={{ 
                      fontSize: '1.1rem', 
                      lineHeight: 1.8,
                      color: alpha(theme.palette.text.primary, 0.9),
                      mb: 3
                    }}
                  >
            Founded in 2010, our organization has rescued and rehomed over 300 dogs from high-kill shelters, abusive situations, and abandonment. We work tirelessly to provide medical care, training, and socialization to help each dog become ready for their forever home.
          </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 42,
                      height: 42,
                      borderRadius: '50%',
                      bgcolor: alpha('#FF8C00', 0.1),
                      mr: 2,
                      color: '#FF8C00'
                    }}>
                      <KeyboardArrowRightIcon />
                    </Box>
                    <Typography fontWeight={500}>
                      Rescued 350+ dogs from high-kill shelters
          </Typography>
        </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: alpha('#FF8C00', 0.1),
                      mr: 2,
                      color: '#FF8C00'
                    }}>
                      <KeyboardArrowRightIcon />
                    </Box>
                    <Typography fontWeight={500}>
                      Provided essential medical care to all rescued dogs
          </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center'
                  }}>
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: alpha('#FF8C00', 0.1),
                      mr: 2,
                      color: '#FF8C00'
                    }}>
                      <KeyboardArrowRightIcon />
                    </Box>
                    <Typography fontWeight={500}>
                      Facilitated 300+ successful adoptions since 2010
                    </Typography>
                  </Box>
                </motion.div>
              </motion.div>
            </Grid>
            
            <Grid key="mission-image" item xs={12} md={6}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <Box sx={{ position: 'relative' }}>
                  <Box
                    component={Paper}
                    elevation={16}
                    sx={{
                      borderRadius: '20px',
                      overflow: 'hidden',
                      transform: { xs: 'none', md: 'rotate(2deg)' },
                      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                      position: 'relative',
                      zIndex: 1,
                      height: { xs: '300px', md: '450px' }
                    }}
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1604068549290-dea0e4a305a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                      alt="Rescued dog"
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        display: 'block' 
                      }}
                    />
                  </Box>
                  
                  <Box
                    component={Paper}
                    elevation={16}
                    sx={{
                      position: 'absolute',
                      bottom: { xs: -40, md: -50 },
                      right: { xs: 20, md: -30 },
                      width: { xs: 120, md: 180 },
                      height: { xs: 120, md: 180 },
                      borderRadius: '20px',
                      background: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      color: 'white',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                      zIndex: 2
                    }}
                  >
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 800, 
                        mb: 1,
                        fontSize: { xs: '2rem', md: '3rem' }
                      }}
                    >
                      12+
                    </Typography>
                    <Typography 
                      variant="body2"
                      align="center"
                      sx={{ 
                        fontWeight: 500,
                        px: 1
                      }}
                    >
                      Years of Rescue
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
              </Grid>
          </Grid>
        </Container>
        </Box>

      {/* Team Section - Full Bleed with Gradient Background */}
      <Box 
        sx={{ 
          width: '100%',
          py: { xs: 8, md: 12 },
          position: 'relative',
          background: `linear-gradient(135deg, ${alpha('#FF8C00', 0.03)} 0%, ${alpha('#FF8C00', 0.08)} 100%)`,
          overflow: 'hidden'
        }}
      >
        {/* Decorative Elements */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: '15%',
            left: '5%',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha('#FF8C00', 0.1)}, transparent 70%)`,
            filter: 'blur(50px)',
            zIndex: 0
          }}
        />
        
        <Box 
          sx={{ 
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha('#FF8C00', 0.08)}, transparent 70%)`,
            filter: 'blur(60px)',
            zIndex: 0
          }}
        />
        
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
              <motion.div variants={fadeInUp}>
                <Typography 
                  variant="h6" 
                  component="p"
                  sx={{ 
                    color: '#FF8C00',
                    fontWeight: 600,
                    mb: 1,
                    textTransform: 'uppercase',
                    letterSpacing: 2,
                    fontSize: '0.95rem'
                  }}
                >
                  Our Team
                </Typography>
                
                <Typography 
                  variant="h2" 
                  component="h2" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 800, 
                    mb: 2,
                    fontSize: { xs: '2.2rem', md: '3rem' },
                    color: '#333',
                    lineHeight: 1.2,
                    marginX: 'auto',
                    position: 'relative',
                    display: 'inline-block',
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 100,
                      height: 5,
                      borderRadius: 10,
                      backgroundColor: '#FF8C00'
                    }
                  }}
                >
                  Meet Our Dedicated Team
                </Typography>
                
                <Typography 
                  variant="h5" 
                  sx={{ 
                    maxWidth: 700, 
                    mx: 'auto', 
                    mb: 5,
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    color: alpha(theme.palette.text.primary, 0.8),
                    lineHeight: 1.6
                  }}
                >
                  Our team brings diverse expertise but shares one common passion: helping dogs find their forever homes.
                </Typography>
              </motion.div>
            </Box>
            
            {/* Team members grid using MUI Grid */}
            <Grid container spacing={4} justifyContent="center">
              {team.map((member, index) => (
                <Grid key={index} item xs={12} sm={6} md={4}>
                  <motion.div 
                    variants={fadeInUp}
                    whileHover={{ 
                      y: -10,
                      transition: { type: "spring", stiffness: 400, damping: 10 }
                    }}
                  >
                    <Card
                      sx={{ 
                        borderRadius: 4,
                        overflow: 'hidden',
                        height: '100%',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        '&:hover': {
                          boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                        },
                        position: 'relative',
                        transform: 'perspective(1000px)',
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      {/* Top color bar */}
                      <Box 
                        sx={{ 
                          height: 8, 
                          width: '100%', 
                          background: 'linear-gradient(90deg, #FF8C00, #FF5F1F)' 
                        }} 
                      />
                      

                      
                      {/* Content section */}
                      <CardContent sx={{ p: 3, position: 'relative' }}>
                        {/* Role badge */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -22,
                            right: 20,
                            py: 1,
                            px: 2,
                            borderRadius: '30px',
                            background: 'linear-gradient(90deg, #FF8C00, #FF5F1F)',
                            boxShadow: '0 4px 10px rgba(255, 140, 0, 0.3)',
                            zIndex: 5
                          }}
                        >
                          <Typography 
                            sx={{ 
                              color: 'white', 
                              fontWeight: 600, 
                              fontSize: '0.75rem',
                              lineHeight: 1.2
                            }}
                          >
                            {member.role}
          </Typography>
                        </Box>
                        
                        <Typography 
                          variant="h5" 
                          component="h3" 
                          gutterBottom
                          sx={{ 
                            fontWeight: 700, 
                            fontSize: '1.5rem', 
                            mb: 1,
                            color: '#333'
                          }}
                        >
                          {member.name}
                  </Typography>
                        
                        <Divider sx={{ mb: 2, borderColor: alpha('#FF8C00', 0.1) }} />
                        
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            lineHeight: 1.6,
                            color: alpha(theme.palette.text.primary, 0.8),
                            fontSize: '0.9rem',
                            mb: 2
                          }}
                        >
                          {member.bio}
                  </Typography>
                        
                        {/* Social links */}
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            gap: 1,
                            mt: 2
                          }}
                        >
                          {member.socialLinks.email && (
                            <IconButton 
                              size="small" 
                              sx={{ 
                                color: '#FF8C00',
                                '&:hover': {
                                  color: '#FF5F1F',
                                  background: alpha('#FF8C00', 0.1)
                                }
                              }}
                            >
                              <EmailIcon fontSize="small" />
                            </IconButton>
                          )}
                          
                          {member.socialLinks.linkedin && (
                            <IconButton 
                              size="small" 
                              sx={{ 
                                color: '#FF8C00',
                                '&:hover': {
                                  color: '#FF5F1F',
                                  background: alpha('#FF8C00', 0.1)
                                }
                              }}
                            >
                              <LinkedInIcon fontSize="small" />
                            </IconButton>
                          )}
                          
                          {member.socialLinks.twitter && (
                            <IconButton 
                              size="small" 
                              sx={{ 
                                color: '#FF8C00',
                                '&:hover': {
                                  color: '#FF5F1F',
                                  background: alpha('#FF8C00', 0.1)
                                }
                              }}
                            >
                              <TwitterIcon fontSize="small" />
                            </IconButton>
                          )}
                          
                          {member.socialLinks.instagram && (
                            <IconButton 
                              size="small" 
                              sx={{ 
                                color: '#FF8C00',
                                '&:hover': {
                                  color: '#FF5F1F',
                                  background: alpha('#FF8C00', 0.1)
                                }
                              }}
                            >
                              <InstagramIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                </CardContent>
              </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ textAlign: 'center', mt: 8 }}>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderRadius: '50px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderColor: '#FF8C00',
                  color: '#FF8C00',
                  '&:hover': {
                    borderColor: '#FF5F1F',
                    background: alpha('#FF8C00', 0.05),
                  },
                  transition: 'all 0.3s ease'
                }}
                onClick={() => navigate('/volunteer#join-applications-section')}
              >
                Join Our Team
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Values Section - Alternating Full Width Layout */}
      <Box sx={{ width: '100%', py: { xs: 12, md: 16 } }}>
        <Container maxWidth="xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 10 } }}>
              <motion.div variants={fadeInUp}>
                <Typography 
                  variant="h6" 
                  component="p"
                  sx={{ 
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    mb: 2,
                    textTransform: 'uppercase',
                    letterSpacing: 1
                  }}
                >
                  What Guides Us
                </Typography>
                
                <Typography 
                  variant="h2" 
                  component="h2" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 800, 
                    mb: 3,
                    fontSize: { xs: '2.2rem', md: '3rem' },
                    color: theme.palette.primary.dark,
                    lineHeight: 1.2
                  }}
                >
                  Our Core Values
                </Typography>
                
                <Typography 
                  variant="h5" 
                  sx={{ 
                    maxWidth: 850, 
                    mx: 'auto', 
                    mb: 6,
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    color: alpha(theme.palette.text.primary, 0.8),
                    lineHeight: 1.6
                  }}
                >
                  These values shape everything we do at Dog Rescue Mission, from our daily operations to our long-term vision.
                </Typography>
              </motion.div>
            </Box>
            
            {values.map((value, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                whileInView="visible"
                viewport={{ once: true }}
                initial="hidden"
              >
                <Box
                  sx={{ 
                    mb: 5,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: index % 2 === 0 ? 'row' : 'row-reverse' },
                    alignItems: 'center',
                    gap: 6,
                    py: 5
                  }}
                >
                  <Box 
                    sx={{ 
                      width: { xs: '100%', md: '40%' },
                      display: 'flex',
                      justifyContent: { xs: 'center', md: index % 2 === 0 ? 'flex-end' : 'flex-start' }
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 180, md: 220 },
                        height: { xs: 180, md: 220 },
                        borderRadius: '50%',
                        background: value.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: '-50%',
                          left: '-50%',
                          width: '200%',
                          height: '200%',
                          background: `conic-gradient(transparent, ${alpha('#ffffff', 0.2)}, transparent 30%)`,
                          animation: `${rotate} 4s linear infinite`
                        }
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 160, md: 200 },
                          height: { xs: 160, md: 200 },
                          borderRadius: '50%',
                          background: value.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 1,
                          position: 'relative'
                        }}
                      >
                        <Box sx={{ color: 'white', transform: 'scale(1.3)' }}>
                          {value.icon}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box sx={{ width: { xs: '100%', md: '60%' } }}>
                    <Typography 
                      variant="h3" 
                      component="h3" 
                      sx={{ 
                        mb: 3, 
                        fontWeight: 700,
                        color: theme.palette.primary.dark,
                        fontSize: { xs: '1.8rem', md: '2.2rem' }
                      }}
                    >
                      {value.title}
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 3,
                        fontSize: '1.1rem',
                        lineHeight: 1.8,
                        color: alpha(theme.palette.text.primary, 0.8)
                      }}
                    >
                      {value.description}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Box>

      {/* Animated Stats Section */}
      <Box
        sx={{
          width: '100%',
          py: { xs: 10, md: 14 },
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated shapes */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha('#ffffff', 0.1)}, transparent 70%)`,
            filter: 'blur(30px)',
            zIndex: 0
          }}
        />
        
        <Box 
          sx={{ 
            position: 'absolute',
            bottom: '5%',
            right: '15%',
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha('#ffffff', 0.08)}, transparent 70%)`,
            filter: 'blur(40px)',
            zIndex: 0
          }}
        />
        
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Typography 
                variant="h2" 
                component="h2" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 3,
                  fontSize: { xs: '2.2rem', md: '3rem' },
                  color: 'white',
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  lineHeight: 1.2
                }}
              >
                Our Impact By The Numbers
                  </Typography>
              
              <Typography 
                variant="h5" 
                sx={{ 
                  maxWidth: 850, 
                  mx: 'auto', 
                  mb: 6,
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  color: alpha('#ffffff', 0.9),
                  lineHeight: 1.6
                }}
              >
                Since our founding in 2010, we've made a measurable difference in the lives of dogs and communities.
                  </Typography>
            </motion.div>
          </Box>
          
          <Grid container spacing={4} justifyContent="center">
            {[
              { number: '350+', label: 'Dogs Rescued' },
              { number: '300+', label: 'Successful Adoptions' },
              { number: '50+', label: 'Active Volunteers' },
              { number: '5000+', label: 'Donors & Supporters' }
            ].map((stat, index) => (
              <Grid key={index} item xs={6} md={3}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { 
                      opacity: 1, 
                      y: 0, 
                      transition: { 
                        type: "spring", 
                        stiffness: 100, 
                        damping: 15,
                        delay: index * 0.1 
                      } 
                    }
                  }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 4,
                      backgroundColor: alpha('#ffffff', 0.05),
                      backdropFilter: 'blur(10px)',
                      borderRadius: 4,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      border: `1px solid ${alpha('#ffffff', 0.1)}`,
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-10px)'
                      }
                    }}
                  >
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        fontWeight: 800, 
                        mb: 1,
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                        color: 'white',
                        textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                      }}
                    >
                      {stat.number}
                  </Typography>
                    <Typography 
                      variant="h6"
                      sx={{ 
                        color: alpha('#ffffff', 0.9)
                      }}
                    >
                      {stat.label}
                  </Typography>
                  </Box>
                </motion.div>
            </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </motion.div>
  );
};

export default AboutPage; 