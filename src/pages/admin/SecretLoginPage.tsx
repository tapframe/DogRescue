import { useState } from 'react';
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
  GridLegacy as Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PetsIcon from '@mui/icons-material/Pets';
import { authService } from '../../services/authService';

const SecretLoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // State for form values
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // State for error handling
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await authService.login({ username, password });
      
      if (response.success) {
        setSnackbarMessage('Login successful!');
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate('/admin');
        }, 1000);
      } else {
        setError(response.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!secretKey) {
      setError('Secret key is required for registration');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await authService.registerAdmin({
        username,
        password,
        secretKey
      });
      
      if (response.success) {
        setSnackbarMessage('Registration successful! You can now log in.');
        setSnackbarOpen(true);
        setIsRegistering(false);
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
  
  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
  };
  
  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ m: 1, bgcolor: theme.palette.primary.main }}>
              {isRegistering ? <PetsIcon /> : <LockOutlinedIcon />}
            </Avatar>
            <Typography component="h1" variant="h5" fontWeight="bold">
              {isRegistering ? 'Register Admin Account' : 'Admin Access'}
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={isRegistering ? handleRegister : handleLogin}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  id="password"
                  autoComplete={isRegistering ? 'new-password' : 'current-password'}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={toggleShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              {isRegistering && (
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="secretKey"
                    label="Secret Registration Key"
                    id="secretKey"
                    type={showPassword ? 'text' : 'password'}
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
              )}
            </Grid>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 3, py: 1.5, fontWeight: 'bold', borderRadius: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : isRegistering ? 'Register' : 'Sign In'}
            </Button>
            
            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>
            
            <Box sx={{ textAlign: 'center' }}>
              <Link
                component="button"
                variant="body2"
                onClick={toggleMode}
                underline="hover"
                sx={{ color: theme.palette.primary.main, fontWeight: 'medium' }}
              >
                {isRegistering
                  ? 'Already have an account? Sign in'
                  : 'Need an admin account? Register'}
              </Link>
            </Box>
          </form>
        </Paper>
      </Box>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SecretLoginPage; 