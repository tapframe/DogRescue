import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import path from 'path';

// Route imports
import dogRoutes from './routes/dogs';
import uploadRoutes from './routes/uploads';
import volunteerRoutes from './routes/volunteers';
import authRoutes from './routes/auth';
import rescueSubmissionRoutes from './routes/rescueSubmissions';
import applicationRoutes from './routes/applications';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Mount routes
app.use('/api/dogs', dogRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/rescue-submissions', rescueSubmissionRoutes);
app.use('/api/applications', applicationRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Dog Rescue API',
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 