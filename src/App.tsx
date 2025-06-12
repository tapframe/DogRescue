import { Routes, Route, Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Layout from './components/layout/Layout';

// Import pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import DogsPage from './pages/DogsPage';
import DogDetailPage from './pages/DogDetailPage';
import VolunteerPage from './pages/VolunteerPage';
import DonatePage from './pages/DonatePage';
import ResourcesPage from './pages/ResourcesPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminPage from './pages/AdminPage';
import RescueSubmissionPage from './pages/RescueSubmissionPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboardPage from './pages/UserDashboardPage';

// Import secret admin login page
import SecretLoginPage from './pages/admin/SecretLoginPage';

// Import protected route components
import ProtectedRoute from './components/auth/ProtectedRoute';
import UserProtectedRoute from './components/auth/UserProtectedRoute';

// Import keyboard shortcut listener
import KeyboardShortcutListener from './components/auth/KeyboardShortcutListener';

// Layout wrapper component to use with React Router
const MainLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

function App() {
  return (
    <>
      {/* Keyboard shortcut listener for admin access */}
      <KeyboardShortcutListener />
      
      {/* Single Routes component with proper route organization */}
      <Routes>
        {/* Admin routes - these need to be outside Layout */}
        <Route path="/admin-login-7a91b523e61" element={<SecretLoginPage />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } 
        />
        
        {/* User authentication routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Regular routes with standard layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/dogs" element={<DogsPage />} />
          <Route path="/dogs/:id" element={<DogDetailPage />} />
          <Route path="/volunteer" element={<VolunteerPage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Protected routes that require user authentication */}
          <Route path="/rescue" element={
            <UserProtectedRoute>
              <RescueSubmissionPage />
            </UserProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <UserProtectedRoute>
              <UserDashboardPage />
            </UserProtectedRoute>
          } />
        </Route>
        
        {/* 404 route - this should be last */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App; 