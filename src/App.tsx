import { Routes, Route } from 'react-router-dom';
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

// Import secret admin login page
import SecretLoginPage from './pages/admin/SecretLoginPage';

// Import protected route component
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <>
      {/* Admin and secret routes rendered outside of main layout */}
      <Routes>
        {/* Secret Admin Login - using obscure path to make it harder to discover */}
        <Route path="/admin-login-7a91b523e61" element={<SecretLoginPage />} />
        
        {/* Protected Admin Route */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
      
      {/* Non-admin routes with the standard layout */}
      <Routes>
        <Route 
          path="*" 
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/dogs" element={<DogsPage />} />
                <Route path="/dogs/:id" element={<DogDetailPage />} />
                <Route path="/volunteer" element={<VolunteerPage />} />
                <Route path="/donate" element={<DonatePage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Layout>
          } 
        />
      </Routes>
    </>
  );
}

export default App; 