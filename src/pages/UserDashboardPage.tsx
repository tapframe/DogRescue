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
  Stack
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

import { rescueApi, RescueSubmissionData } from '../services/api';
import { userAuthService } from '../services/userAuthService';

const UserDashboardPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [userRescues, setUserRescues] = useState<RescueSubmissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        );
      case 'rescued':
        return (
          <Chip 
            icon={<CheckCircleIcon />}
            label="Rescued" 
            color="success" 
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        );
      case 'closed':
        return (
          <Chip 
            icon={<CancelIcon />}
            label="Closed" 
            color="error" 
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        );
      case 'pending':
      default:
        return (
          <Chip 
            icon={<PendingIcon />}
            label="Pending" 
            color="info" 
            variant="outlined"
            sx={{ fontWeight: 500 }}
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

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', py: 8 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading your rescue submissions...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to Home
        </Button>
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          My Rescue Submissions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track the status of your dog rescue submissions
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {userRescues.length === 0 ? (
        <Paper 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.05)
          }}
        >
          <PetsIcon sx={{ fontSize: 60, color: alpha(theme.palette.primary.main, 0.6), mb: 2 }} />
          <Typography variant="h5" gutterBottom fontWeight={600}>
            No Rescue Submissions Yet
          </Typography>
          <Typography variant="body1" paragraph>
            You haven't submitted any dog rescue requests yet.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/rescue')}
            sx={{ mt: 2 }}
          >
            Submit a Rescue Request
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {userRescues.map((rescue) => (
            <Grid item xs={12} key={rescue._id || rescue.id}>
              <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PetsIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography variant="h6">
                        {rescue.name || 'Unnamed Dog'} 
                        <Typography component="span" variant="body2" sx={{ ml: 1 }}>
                          ({rescue.gender}, {rescue.age}, {rescue.size})
                        </Typography>
                      </Typography>
                    </Box>
                    {getStatusChip(rescue.status)}
                  </Stack>
                </Box>
                
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Location
                        </Typography>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.error.main }} />
                          {rescue.location}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Submitted On
                        </Typography>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.info.main }} />
                          {formatDate(rescue.submittedAt)}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Status Timeline
                      </Typography>
                      {getStatusTimeline(rescue.status)}
                    </Grid>
                    
                    {rescue.statusNotes && (
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Notes from our team
                        </Typography>
                        <Paper 
                          variant="outlined" 
                          sx={{ 
                            p: 2, 
                            bgcolor: alpha(theme.palette.info.main, 0.05),
                            borderRadius: 2
                          }}
                        >
                          <Typography variant="body2">
                            {rescue.statusNotes}
                          </Typography>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => navigate('/contact')}
                  >
                    Contact Us About This Rescue
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default UserDashboardPage; 