import express from 'express';
import { getRacesSchedule } from '../controllers/race.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/').get(protect, getRacesSchedule);

export default router;