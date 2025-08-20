import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Alert, 
  Snackbar,
  Container,
  Avatar,
  useTheme,
  InputAdornment,
  IconButton,
  Divider,
  Link,
  GridLegacy as Grid,
  alpha,
  keyframes
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PetsIcon from '@mui/icons-material/Pets';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import { userAuthService } from '../services/userAuthService';

const RegisterPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // State for form values
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // State for error handling
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await userAuthService.verifyToken();
      if (isAuthenticated) {
        navigate('/');
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!username) errors.username = 'Username is required';
    if (!name) errors.name = 'Name is required';
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await userAuthService.register({
        username,
        password,
        name,
        email,
        phone
      });
      
      if (response.success) {
        setSnackbarMessage('Registration successful! Redirecting to home page...');
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Animation keyframes
  const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  `;

  const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  `;

  const slideIn = keyframes`
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  `;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left Side - Hero Section */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          flex: 1,
          background: `linear-gradient(135deg, #FF8C00 0%, #FF5F1F 100%)`,
          position: 'relative',
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          color: 'white',
          textAlign: 'center',
          p: 4
        }}
      >
        {/* Background decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha('#ffffff', 0.1)}, transparent 70%)`,
            filter: 'blur(40px)',
            animation: `${float} 6s ease-in-out infinite`
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            bottom: '15%',
            right: '15%',
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha('#ffffff', 0.08)}, transparent 70%)`,
            filter: 'blur(30px)',
            animation: `${float} 8s ease-in-out infinite reverse`
          }}
        />

        {/* Hero content */}
        <Box sx={{ position: 'relative', zIndex: 2, maxWidth: 500 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${alpha('#ffffff', 0.2)}, ${alpha('#ffffff', 0.1)})`,
              backdropFilter: 'blur(10px)',
              mb: 4,
              animation: `${float} 4s ease-in-out infinite`
            }}
          >
            <PersonAddIcon sx={{ fontSize: 60, color: 'white' }} />
          </Box>
          
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 3,
              fontSize: { lg: '3rem', xl: '3.5rem' },
              lineHeight: 1.2,
              textShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          >
            Join Our Mission!
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.9,
              lineHeight: 1.6,
              fontWeight: 400,
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            Create an account and become part of our community dedicated to rescuing and rehoming dogs in need
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              flexWrap: 'wrap'
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                50+
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Active Volunteers
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderColor: alpha('#ffffff', 0.3) }} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                5000+
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Supporters
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderColor: alpha('#ffffff', 0.3) }} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                12+
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Years of Service
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right Side - Registration Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, md: 6 },
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          minHeight: '100vh',
          overflow: 'auto'
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              animation: `${fadeIn} 0.8s ease-out`
            }}
          >
            {/* Logo and Title */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  m: '0 auto 2rem',
                  bgcolor: theme.palette.primary.main,
                  width: 80,
                  height: 80,
                  boxShadow: '0 8px 25px rgba(255, 140, 0, 0.3)'
                }}
              >
                <PersonAddIcon sx={{ fontSize: 45 }} />
              </Avatar>
              
              <Typography
                component="h1"
                variant="h3"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  background: 'linear-gradient(135deg, #FF8C00, #FF5F1F)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textAlign: 'center'
                }}
              >
                Join Dog Rescue Mission
              </Typography>
              
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                  textAlign: 'center'
                }}
              >
                Create your account and start making a difference
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert
                severity="error"
                sx={{
                  width: '100%',
                  mb: 3,
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                {error}
              </Alert>
            )}

            {/* Registration Form */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                width: '100%',
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }}
            >
              <form onSubmit={handleRegister}>
                <Grid container spacing={3}>
                  {/* Username Field */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="username"
                      label="Username"
                      name="username"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      error={!!fieldErrors.username}
                      helperText={fieldErrors.username}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                            borderWidth: 2,
                          },
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: theme.palette.primary.main }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  {/* Full Name Field */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="name"
                      label="Full Name"
                      name="name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      error={!!fieldErrors.name}
                      helperText={fieldErrors.name}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                            borderWidth: 2,
                          },
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: theme.palette.primary.main }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  {/* Email Field */}
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={!!fieldErrors.email}
                      helperText={fieldErrors.email}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                            borderWidth: 2,
                          },
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: theme.palette.primary.main }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  {/* Phone Field */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="phone"
                      label="Phone Number (Optional)"
                      name="phone"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                            borderWidth: 2,
                          },
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: theme.palette.primary.main }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  {/* Password Field */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={!!fieldErrors.password}
                      helperText={fieldErrors.password}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                            borderWidth: 2,
                          },
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: theme.palette.primary.main }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={toggleShowPassword}
                              edge="end"
                              sx={{ color: theme.palette.primary.main }}
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  {/* Confirm Password Field */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirm Password"
                      type={showPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      error={!!fieldErrors.confirmPassword}
                      helperText={fieldErrors.confirmPassword}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                            borderWidth: 2,
                          },
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: theme.palette.primary.main }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
                
                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    mt: 4,
                    mb: 3,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #FF8C00, #FF5F1F)',
                    boxShadow: '0 8px 25px rgba(255, 140, 0, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #FF5F1F, #FF8C00)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 35px rgba(255, 140, 0, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                    textTransform: 'none'
                  }}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
                
                {/* Sign In Link */}
                <Box sx={{ textAlign: 'center' }}>
                  <Link
                    component={RouterLink}
                    to="/login"
                    variant="body2"
                    sx={{
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      fontWeight: 500,
                      fontSize: '1rem',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Already have an account? Sign in
                  </Link>
                </Box>
              </form>
            </Paper>

            {/* Footer */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  opacity: 0.7,
                  lineHeight: 1.6
                }}
              >
                By signing up, you agree to our{' '}
                <Link href="#" sx={{ color: theme.palette.primary.main, textDecoration: 'none' }}>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" sx={{ color: theme.palette.primary.main, textDecoration: 'none' }}>
                  Privacy Policy
                </Link>
                .
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Box>
  );
};

export default RegisterPage; 