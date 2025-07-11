import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { userAuthService } from '../../services/userAuthService';

interface UserProtectedRouteProps {
  children: ReactNode;
  redirectPath?: string;
}

const UserProtectedRoute = ({ 
  children, 
  redirectPath = '/login' 
}: UserProtectedRouteProps) => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const isValid = await userAuthService.verifyToken();
        setIsAuthenticated(isValid);
      } catch (error) {
        console.error('User auth verification error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAuth();
  }, []);

  // Show loading spinner while verifying
  if (isVerifying) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Verifying authentication...
        </Typography>
      </Box>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default UserProtectedRoute; 