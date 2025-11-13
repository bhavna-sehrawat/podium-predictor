import express from 'express';
import { getUserProfile } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

console.log('✅ User router file was loaded!'); 

const router = express.Router();

router.use((req, res, next) => {
    console.log('[USER ROUTER]: Request received by user router.');
    next();
});

router.route('/profile').get(protect, getUserProfile);

export default router;