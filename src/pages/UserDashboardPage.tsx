import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  GridLegacy as Grid, 
  Button, 
  Chip, 
  Divider, 
  CircularProgress, 
  Alert,
  Card,
  CardContent,
  CardActions,
  useTheme,
  alpha,
  Stack,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import SettingsIcon from '@mui/icons-material/Settings';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import { motion } from 'framer-motion';

import { rescueApi, RescueSubmissionData, applicationApi, ApplicationData } from '../services/api';
import { userAuthService } from '../services/userAuthService';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const slideUp = {
  hidden: { y: 30, opacity: 0 },
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const UserDashboardPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [userRescues, setUserRescues] = useState<RescueSubmissionData[]>([]);
  const [userApplications, setUserApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [applicationLoading, setApplicationLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicationError, setApplicationError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState(userAuthService.getCurrentUser());

  useEffect(() => {
    const fetchUserRescues = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        // Get all rescue submissions
        const allRescues = await rescueApi.getAllRescueSubmissions();
        
        // Filter for submissions by this user
        // Match by user ID if available, otherwise by email
        const userSubmissions = allRescues.filter(rescue => 
          (rescue.user && rescue.user === currentUser.id) || 
          (rescue.user && rescue.user === currentUser._id) ||
          (rescue.userEmail && rescue.userEmail === currentUser.email) ||
          (rescue.contactEmail && rescue.contactEmail === currentUser.email)
        );
        
        setUserRescues(userSubmissions);
      } catch (err) {
        console.error('Error fetching user rescue submissions:', err);
        setError('Failed to load your rescue submissions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRescues();
  }, [currentUser, navigate]);

  // Fetch user applications
  useEffect(() => {
    const fetchUserApplications = async () => {
      if (!currentUser) {
        return;
      }

      setApplicationLoading(true);
      try {
        const applications = await applicationApi.getUserApplications();
        setUserApplications(applications);
      } catch (err) {
        console.error('Error fetching user applications:', err);
        setApplicationError('Failed to load your adoption applications. Please try again later.');
      } finally {
        setApplicationLoading(false);
      }
    };

    fetchUserApplications();
  }, [currentUser]);

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Get status chip
  const getStatusChip = (status?: string) => {
    switch (status) {
      case 'processing':
        return (
          <Chip 
            icon={<SettingsIcon />}
            label="Processing" 
            color="warning" 
            variant="filled"
            sx={{ fontWeight: 500, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
        );
      case 'rescued':
        return (
          <Chip 
            icon={<CheckCircleIcon />}
            label="Rescued" 
            color="success" 
            variant="filled"
            sx={{ fontWeight: 500, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
        );
      case 'closed':
        return (
          <Chip 
            icon={<CancelIcon />}
            label="Closed" 
            color="error" 
            variant="filled"
            sx={{ fontWeight: 500, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
        );
      case 'pending':
      default:
        return (
          <Chip 
            icon={<PendingIcon />}
            label="Pending" 
            color="info" 
            variant="filled"
            sx={{ fontWeight: 500, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
        );
    }
  };

  // Get status timeline
  const getStatusTimeline = (status?: string) => {
    const statusOrder = ['pending', 'processing', 'rescued', 'closed'];
    const currentStatusIndex = statusOrder.indexOf(status || 'pending');

    return (
      <Timeline position="alternate" sx={{ p: 0, m: 0 }}>
        {statusOrder.map((statusStep, index) => {
          const isActive = index <= currentStatusIndex;
          const isCurrentStatus = index === currentStatusIndex;
          
          return (
            <TimelineItem key={statusStep}>
              <TimelineOppositeContent sx={{ flex: 0.2 }}>
                <Typography 
                  variant="caption" 
                  color={isActive ? 'text.primary' : 'text.disabled'}
                  fontWeight={isCurrentStatus ? 600 : 400}
                >
                  {statusStep.charAt(0).toUpperCase() + statusStep.slice(1)}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot 
                  color={
                    isCurrentStatus 
                      ? statusStep === 'rescued' 
                        ? 'success' 
                        : statusStep === 'processing' 
                          ? 'warning' 
                          : statusStep === 'closed'
                            ? 'error'
                            : 'info'
                      : 'grey'
                  }
                  variant={isActive && !isCurrentStatus ? "outlined" : "filled"}
                  sx={{ boxShadow: isCurrentStatus ? '0 0 10px rgba(0,0,0,0.2)' : 'none' }}
                />
                {index < statusOrder.length - 1 && (
                  <TimelineConnector sx={{ 
                    bgcolor: isActive && index < currentStatusIndex ? 
                      theme.palette.primary.main : undefined 
                  }} />
                )}
              </TimelineSeparator>
              <TimelineContent sx={{ flex: 0.8 }}>
                <Typography 
                  variant="body2" 
                  color={isActive ? 'text.primary' : 'text.disabled'}
                  fontWeight={isCurrentStatus ? 600 : 400}
                >
                  {statusStep === 'pending' && 'Submission received'}
                  {statusStep === 'processing' && 'Team is responding'}
                  {statusStep === 'rescued' && 'Dog has been rescued'}
                  {statusStep === 'closed' && 'Case closed'}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    );
  };

  // Get application status chip
  const getApplicationStatusChip = (status?: string) => {
    switch (status) {
      case 'Under Review':
        return (
          <Chip 
            icon={<SettingsIcon />}
            label="Under Review" 
            color="warning" 
            variant="filled"
            sx={{ fontWeight: 500, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
        );
      case 'Approved':
        return (
          <Chip 
            icon={<CheckCircleIcon />}
            label="Approved" 
            color="success" 
            variant="filled"
            sx={{ fontWeight: 500, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
        );
      case 'Rejected':
        return (
          <Chip 
            icon={<CancelIcon />}
            label="Rejected" 
            color="error" 
            variant="filled"
            sx={{ fontWeight: 500, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
        );
      case 'Withdrawn':
        return (
          <Chip 
            icon={<CancelIcon />}
            label="Withdrawn" 
            color="default" 
            variant="filled"
            sx={{ fontWeight: 500, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
        );
      case 'Pending':
      default:
        return (
          <Chip 
            icon={<PendingIcon />}
            label="Pending" 
            color="info" 
            variant="filled"
            sx={{ fontWeight: 500, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
        );
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: `linear-gradient(to bottom, ${alpha(theme.palette.background.default, 0.8)}, ${alpha(theme.palette.background.paper, 0.9)})`,
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} thickness={4} />
          <Typography sx={{ mt: 2, fontWeight: 500 }}>Loading your rescue submissions...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      pt: { xs: 10, md: 12 },
      pb: 8,
      background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
      backgroundAttachment: 'fixed',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.05,
        zIndex: -1
      }
    }}>
      <Container maxWidth="lg">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <Box sx={{ 
            mb: 5,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' }
          }}>
            <Box>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/')}
                sx={{ 
                  mb: 2,
                  color: theme.palette.text.primary,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  }
                }}
              >
                Back to Home
              </Button>
              <Typography 
                variant="h3" 
                component="h1" 
                fontWeight={800} 
                gutterBottom
                sx={{
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  letterSpacing: '-0.5px'
                }}
              >
                My Rescue Dashboard
              </Typography>
              <Typography variant="h6" color="text.secondary" fontWeight={400}>
                Track the status of your rescue submissions
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/rescue')}
              startIcon={<AddIcon />}
              sx={{ 
                mt: { xs: 3, sm: 0 },
                borderRadius: 2,
                px: 3,
                py: 1.2,
                boxShadow: `0 8px 16px -4px ${alpha(theme.palette.primary.main, 0.2)}`,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                fontWeight: 600,
                '&:hover': {
                  boxShadow: `0 10px 20px -6px ${alpha(theme.palette.primary.main, 0.4)}`,
                }
              }}
            >
              New Rescue Request
            </Button>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 4, 
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            >
              {error}
            </Alert>
          )}

          {userRescues.length === 0 ? (
            <motion.div variants={slideUp}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 6, 
                  textAlign: 'center',
                  borderRadius: 4,
                  bgcolor: alpha(theme.palette.background.paper, 0.7),
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
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
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.2)}, transparent 70%)`,
                    zIndex: 0
                  }}
                />
                
                <Box 
                  sx={{ 
                    position: 'absolute',
                    bottom: -40,
                    left: -40,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(theme.palette.secondary.light, 0.15)}, transparent 70%)`,
                    zIndex: 0
                  }}
                />
                
                <Avatar 
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    bgcolor: alpha(theme.palette.primary.main, 0.1), 
                    color: theme.palette.primary.main,
                    margin: '0 auto 24px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
                  }}
                >
                  <PetsIcon sx={{ fontSize: 60 }} />
                </Avatar>
                
                <Typography variant="h4" gutterBottom fontWeight={700}>
                  No Rescue Submissions Yet
                </Typography>
                
                <Typography variant="body1" paragraph color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}>
                  You haven't submitted any dog rescue requests yet. Help us save dogs in need by reporting stray or abandoned dogs.
                </Typography>
                
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  onClick={() => navigate('/rescue')}
                  startIcon={<PetsIcon />}
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    boxShadow: `0 8px 16px -4px ${alpha(theme.palette.primary.main, 0.2)}`,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    '&:hover': {
                      boxShadow: `0 12px 24px -8px ${alpha(theme.palette.primary.main, 0.4)}`,
                    }
                  }}
                >
                  Submit a Rescue Request
                </Button>
              </Paper>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <Grid container spacing={3}>
                {userRescues.map((rescue, index) => (
                  <Grid item xs={12} key={rescue._id || rescue.id}>
                    <motion.div variants={slideUp}>
                      <Card 
                        sx={{ 
                          borderRadius: 4, 
                          overflow: 'hidden',
                          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 15px 50px rgba(0,0,0,0.12)'
                          },
                          position: 'relative',
                          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                          bgcolor: alpha(theme.palette.background.paper, 0.7),
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <Box sx={{ 
                          p: 3, 
                          bgcolor: alpha(theme.palette.primary.main, 0.03),
                          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                          position: 'relative'
                        }}>
                          <Stack 
                            direction={{ xs: 'column', sm: 'row' }} 
                            justifyContent="space-between" 
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                            spacing={2}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                sx={{ 
                                  bgcolor: alpha(theme.palette.primary.main, 0.1), 
                                  color: theme.palette.primary.main,
                                  mr: 2,
                                  width: 54,
                                  height: 54,
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                }}
                              >
                                <PetsIcon sx={{ fontSize: 30 }} />
                              </Avatar>
                              <Box>
                                <Typography variant="h5" fontWeight={700}>
                                  {rescue.name || 'Unnamed Dog'} 
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {rescue.gender}, {rescue.age}, {rescue.size}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  display: { xs: 'none', md: 'block' },
                                  color: 'text.secondary',
                                  fontWeight: 500
                                }}
                              >
                                Status:
                              </Typography>
                              {getStatusChip(rescue.status)}
                            </Box>
                          </Stack>
                          
                          {/* Status indicator line */}
                          <Box 
                            sx={{ 
                              position: 'absolute', 
                              top: 0, 
                              left: 0, 
                              width: '100%', 
                              height: 4,
                              background: rescue.status === 'rescued' 
                                ? `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`
                                : rescue.status === 'processing'
                                ? `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`
                                : rescue.status === 'closed'
                                ? `linear-gradient(90deg, ${theme.palette.error.main}, ${theme.palette.error.light})`
                                : `linear-gradient(90deg, ${theme.palette.info.main}, ${theme.palette.info.light})`
                            }} 
                          />
                        </Box>
                        
                        <CardContent sx={{ p: 0 }}>
                          <Grid container>
                            <Grid item xs={12} md={5} sx={{ p: 3 }}>
                              <Stack spacing={2.5}>
                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Location
                                  </Typography>
                                  <Typography 
                                    variant="body1" 
                                    sx={{ 
                                      display: 'flex', 
                                      alignItems: 'center',
                                      fontWeight: 500
                                    }}
                                  >
                                    <LocationOnIcon 
                                      fontSize="small" 
                                      sx={{ 
                                        mr: 1, 
                                        color: theme.palette.error.main,
                                        filter: `drop-shadow(0 2px 4px ${alpha(theme.palette.error.main, 0.4)})`
                                      }} 
                                    />
                                    {rescue.location}
                                  </Typography>
                                </Box>
                                
                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Submitted On
                                  </Typography>
                                  <Typography 
                                    variant="body1" 
                                    sx={{ 
                                      display: 'flex', 
                                      alignItems: 'center',
                                      fontWeight: 500
                                    }}
                                  >
                                    <AccessTimeIcon 
                                      fontSize="small" 
                                      sx={{ 
                                        mr: 1, 
                                        color: theme.palette.info.main,
                                        filter: `drop-shadow(0 2px 4px ${alpha(theme.palette.info.main, 0.4)})`
                                      }} 
                                    />
                                    {formatDate(rescue.submittedAt)}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                  <Tooltip title="View rescue details">
                                    <IconButton 
                                      color="primary" 
                                      sx={{ 
                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                                        '&:hover': {
                                          bgcolor: alpha(theme.palette.primary.main, 0.1)
                                        }
                                      }}
                                      onClick={() => navigate('/contact')}
                                    >
                                      <InfoOutlinedIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Contact about this rescue">
                                    <IconButton 
                                      color="secondary" 
                                      sx={{ 
                                        border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
                                        '&:hover': {
                                          bgcolor: alpha(theme.palette.secondary.main, 0.1)
                                        }
                                      }}
                                      onClick={() => navigate('/contact')}
                                    >
                                      <CallOutlinedIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Stack>
                            </Grid>
                            
                            <Grid item xs={12} md={7} sx={{ 
                              bgcolor: alpha(theme.palette.background.default, 0.4),
                              p: 3,
                              borderLeft: { xs: 'none', md: `1px solid ${alpha(theme.palette.divider, 0.1)}` },
                              borderTop: { xs: `1px solid ${alpha(theme.palette.divider, 0.1)}`, md: 'none' }
                            }}>
                              <Typography variant="subtitle1" color="text.secondary" gutterBottom fontWeight={600}>
                                Rescue Progress
                              </Typography>
                              {getStatusTimeline(rescue.status)}
                              
                              {rescue.statusNotes && (
                                <Box sx={{ mt: 2 }}>
                                  <Divider sx={{ my: 2 }} />
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight={600}>
                                    Notes from our team
                                  </Typography>
                                  <Paper 
                                    variant="outlined" 
                                    sx={{ 
                                      p: 2, 
                                      bgcolor: alpha(theme.palette.info.main, 0.03),
                                      borderRadius: 2,
                                      borderColor: alpha(theme.palette.info.main, 0.2)
                                    }}
                                  >
                                    <Typography variant="body2">
                                      {rescue.statusNotes}
                                    </Typography>
                                  </Paper>
                                </Box>
                              )}
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}

          {/* Adoption Applications Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            style={{ marginTop: '3rem' }}
          >
            <Typography 
              variant="h4" 
              component="h2" 
              fontWeight={700} 
              gutterBottom
              sx={{
                background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                letterSpacing: '-0.5px',
                mb: 3
              }}
            >
              My Adoption Applications
            </Typography>

            {applicationError && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 4, 
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                {applicationError}
              </Alert>
            )}

            {applicationLoading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress size={40} />
                <Typography sx={{ mt: 2 }}>Loading applications...</Typography>
              </Box>
            ) : userApplications.length === 0 ? (
              <motion.div variants={slideUp}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 6, 
                    textAlign: 'center',
                    borderRadius: 4,
                    bgcolor: alpha(theme.palette.background.paper, 0.7),
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                  }}
                >
                  <PetsIcon 
                    sx={{ 
                      fontSize: 80, 
                      color: alpha(theme.palette.secondary.main, 0.5),
                      mb: 2
                    }} 
                  />
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    No adoption applications yet
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    You haven't submitted any adoption applications. Browse our available dogs and find your perfect companion!
                  </Typography>
                  <Button 
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={() => navigate('/dogs')}
                    startIcon={<PetsIcon />}
                    sx={{ 
                      mt: 2,
                      borderRadius: 2,
                      px: 3,
                      py: 1.2,
                      fontWeight: 600
                    }}
                  >
                    Browse Dogs
                  </Button>
                </Paper>
              </motion.div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <Grid container spacing={3}>
                  {userApplications.map((application, index) => (
                    <Grid item xs={12} key={application._id || index}>
                      <motion.div variants={slideUp}>
                        <Card 
                          elevation={0}
                          sx={{ 
                            overflow: 'hidden',
                            borderRadius: 3,
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            bgcolor: alpha(theme.palette.background.paper, 0.9),
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                            transition: 'all 0.3s',
                            '&:hover': {
                              boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                              transform: 'translateY(-4px)'
                            }
                          }}
                        >
                          <Box sx={{ 
                            p: 3,
                            bgcolor: alpha(theme.palette.secondary.main, 0.03),
                            borderBottom: `1px solid ${alpha(theme.palette.secondary.main, 0.08)}`,
                            position: 'relative'
                          }}>
                            <Stack 
                              direction={{ xs: 'column', sm: 'row' }} 
                              justifyContent="space-between" 
                              alignItems={{ xs: 'flex-start', sm: 'center' }}
                              spacing={2}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar 
                                  src={application.dog?.image}
                                  sx={{ 
                                    mr: 2,
                                    width: 54,
                                    height: 54,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                  }}
                                >
                                  <PetsIcon />
                                </Avatar>
                                <Box>
                                  <Typography variant="h5" fontWeight={700}>
                                    {application.dog?.name || 'Unknown Dog'} 
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {application.dog?.breed}, {application.dog?.age}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    display: { xs: 'none', md: 'block' },
                                    color: 'text.secondary',
                                    fontWeight: 500
                                  }}
                                >
                                  Status:
                                </Typography>
                                {getApplicationStatusChip(application.status)}
                              </Box>
                            </Stack>
                            
                            {/* Status indicator line */}
                            <Box 
                              sx={{ 
                                position: 'absolute', 
                                top: 0, 
                                left: 0, 
                                width: '100%', 
                                height: 4,
                                background: application.status === 'Approved' 
                                  ? `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`
                                  : application.status === 'Under Review'
                                  ? `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`
                                  : application.status === 'Rejected'
                                  ? `linear-gradient(90deg, ${theme.palette.error.main}, ${theme.palette.error.light})`
                                  : `linear-gradient(90deg, ${theme.palette.info.main}, ${theme.palette.info.light})`
                              }} 
                            />
                          </Box>
                          
                          <CardContent sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={2}>
                                  <Box>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                      Application Notes
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 400 }}>
                                      {application.applicationNotes || 'No notes provided'}
                                    </Typography>
                                  </Box>
                                  
                                  <Box>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                      Submitted On
                                    </Typography>
                                    <Typography 
                                      variant="body1" 
                                      sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        fontWeight: 500
                                      }}
                                    >
                                      <AccessTimeIcon 
                                        fontSize="small" 
                                        sx={{ 
                                          mr: 1, 
                                          color: theme.palette.info.main,
                                        }} 
                                      />
                                      {formatDate(application.submittedAt)}
                                    </Typography>
                                  </Box>
                                </Stack>
                              </Grid>
                              
                              <Grid item xs={12} md={6}>
                                {application.adminNotes && (
                                  <Box>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight={600}>
                                      Notes from our team
                                    </Typography>
                                    <Paper 
                                      variant="outlined" 
                                      sx={{ 
                                        p: 2, 
                                        bgcolor: alpha(theme.palette.info.main, 0.03),
                                        borderRadius: 2,
                                        borderColor: alpha(theme.palette.info.main, 0.2)
                                      }}
                                    >
                                      <Typography variant="body2">
                                        {application.adminNotes}
                                      </Typography>
                                    </Paper>
                                  </Box>
                                )}
                                
                                <Box sx={{ mt: application.adminNotes ? 2 : 0, display: 'flex', gap: 1 }}>
                                  <Tooltip title="View dog details">
                                    <IconButton 
                                      color="secondary" 
                                      sx={{ 
                                        border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
                                        '&:hover': {
                                          bgcolor: alpha(theme.palette.secondary.main, 0.1)
                                        }
                                      }}
                                      onClick={() => navigate(`/dogs/${application.dog?._id}`)}
                                    >
                                      <InfoOutlinedIcon />
                                    </IconButton>
                                  </Tooltip>
                                  {(application.status === 'Pending' || application.status === 'Under Review') && (
                                    <Tooltip title="Withdraw application">
                                      <IconButton 
                                        color="error" 
                                        sx={{ 
                                          border: `1px solid ${alpha(theme.palette.error.main, 0.5)}`,
                                          '&:hover': {
                                            bgcolor: alpha(theme.palette.error.main, 0.1)
                                          }
                                        }}
                                        onClick={async () => {
                                          try {
                                            await applicationApi.withdrawApplication(application._id!);
                                            // Refresh applications
                                            const updatedApplications = await applicationApi.getUserApplications();
                                            setUserApplications(updatedApplications);
                                          } catch (err) {
                                            console.error('Error withdrawing application:', err);
                                          }
                                        }}
                                      >
                                        <CancelIcon />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default UserDashboardPage; 