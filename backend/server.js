import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import raceRoutes from './routes/race.route.js';

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.get('/', (req,res) => {
  res.send('Podium Predictor API is running...');
});

app.use((req, res, next) => {
  console.log(`[INCOMING REQUEST]: ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/races', raceRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => { 
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
});