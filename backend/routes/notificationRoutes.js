import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
} from '../controllers/notificationController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/notifications
// @desc    Get all notifications
router.get('/', getNotifications);

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
router.put('/:id/read', markAsRead);

// @route   PUT /api/notifications/mark-all-read
// @desc    Mark all notifications as read
router.put('/mark-all-read', markAllAsRead);

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
router.delete('/:id', deleteNotification);

export default router;
