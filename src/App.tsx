import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
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

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={
          <Container 
            maxWidth="lg" 
            sx={{ 
              py: { xs: 2, md: 4 },
              mt: 0,
              pt: { xs: '70px', md: '80px' } // Add top padding to account for fixed header
            }}
            disableGutters
          >
            <Routes>
              <Route path="/dogs" element={<DogsPage />} />
              <Route path="/dogs/:id" element={<DogDetailPage />} />
              <Route path="/volunteer" element={<VolunteerPage />} />
              <Route path="/donate" element={<DonatePage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Container>
        } />
      </Routes>
    </Layout>
  );
}

export default App; 