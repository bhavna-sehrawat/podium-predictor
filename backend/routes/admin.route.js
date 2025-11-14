import express from 'express';
import { scoreRaceController } from '../controllers/admin.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/score-race/:season/:round').post(protect, admin, scoreRaceController);

export default router;