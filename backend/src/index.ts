import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';

// Route imports
import dogRoutes from './routes/dogs';
import volunteerRoutes from './routes/volunteers';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Mount routes
app.use('/api/dogs', dogRoutes);
app.use('/api/volunteers', volunteerRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Dog Rescue API',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 