import express from 'express';
import dotenv from 'dotenv';
import cron from 'node-cron';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import raceRoutes from './routes/race.route.js';
import predictionRoutes from './routes/prediction.route.js'; 
import adminRoutes from './routes/admin.route.js';
import { scoreRace } from './services/scoring.service.js';
import Race from './model/race.model.js';

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
app.use('/api/predictions', predictionRoutes);
app.use('/api/admin', adminRoutes); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => { 
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
});


console.log('Scheduler initialized.');



// JOB 1: Lock races that have started. Runs every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  const now = new Date();
  console.log(`[${now.toISOString()}] Running job: Lock due races...`);
  try {
    // 1. Find races where status is 'scheduled' AND date is in the past.
    const racesToLock = await Race.find({
      status: 'scheduled',
      date: { $lte: now },
    });

    if (racesToLock.length > 0) {
      console.log(`Found ${racesToLock.length} race(s) to lock.`);
      // 2. Loop through them and update their status to 'locked'.
      for (const race of racesToLock) {
        race.status = 'locked';
        await race.save();
        console.log(`Locked race: ${race.raceName}`);
      }
    } else {
      console.log('No races to lock at this time.');
    }
  } catch (error) {
    console.error('Error during race locking job:', error);
  }
});

// JOB 2: Score races that have finished. Runs once every hour
cron.schedule('0 * * * *', async () => {
  const now = new Date();
  // We'll look for races that finished at least 2 hours ago to ensure results are final.
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

  console.log(`[${now.toISOString()}] Running job: Score completed races...`);
  try {
    // 1. Find races where status is 'locked' AND date is more than 2 hours in the past.
    const racesToScore = await Race.find({
      status: 'locked',
      date: { $lte: twoHoursAgo },
    });

    if (racesToScore.length > 0) {
      console.log(`Found ${racesToScore.length} race(s) to score.`);
      // 2. Loop through them and call the scoring service.
      for (const race of racesToScore) {
        console.log(`Scoring race: ${race.raceName} (Season: ${race.season}, Round: ${race.round})`);
        await scoreRace(race.season, race.round);
      }
    } else {
      console.log('No races to score at this time.');
    }
  } catch (error) {
    console.error('Error during race scoring job:', error);
  }
});