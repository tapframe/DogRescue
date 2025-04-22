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

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={
          <Box 
            sx={{ 
              width: '100%',
              height: '100%',
              margin: 0,
              padding: 0,
              overflow: 'hidden'
            }}
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
          </Box>
        } />
      </Routes>
    </Layout>
  );
}

export default App; 