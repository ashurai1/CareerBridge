import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
// import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected route - add middleware later
// router.get('/stats', protect, getDashboardStats);
router.get('/stats', getDashboardStats);

export default router;
