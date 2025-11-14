import express from 'express';
import { getLeaderboard, getUserProfile } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();


router.route('/profile').get(protect, getUserProfile);

router.route('/leaderboard').get(protect, getLeaderboard);

export default router;