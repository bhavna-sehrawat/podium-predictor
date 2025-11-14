import express from 'express';
import { createPrediction } from '../controllers/prediction.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/').post(protect, createPrediction);

export default router;