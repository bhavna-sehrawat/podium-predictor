import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.route.js';

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.get('/', (req,res) => {
  res.send('Podium Predictor API is running...');
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => { 
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
});