import Notification from '../models/Notification.js';
import User from '../models/User.js';

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({ recipientId: userId })
            .populate('senderId', 'name profilePicture')
            .populate('relatedJobId', 'title company')
            .sort({ createdAt: -1 });

        const unreadCount = await Notification.countDocuments({
            recipientId: userId,
            isRead: false,
        });

        res.status(200).json({
            success: true,
            data: notifications,
            unreadCount,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found',
            });
        }

        if (notification.recipientId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this notification',
            });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            data: notification,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
export const markAllAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { recipientId: req.user._id, isRead: false },
            { isRead: true }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found',
            });
        }

        if (notification.recipientId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this notification',
            });
        }

        await Notification.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Notification deleted',
        });
    } catch (error) {
        next(error);
    }
};

// Internal function to create notification
export const createNotification = async (
    recipientId,
    type,
    title,
    message,
    relatedJobId = null,
    relatedApplicationId = null,
    senderId = null,
    link = null
) => {
    try {
        const notification = await Notification.create({
            recipientId,
            senderId,
            type,
            title,
            message,
            relatedJobId,
            relatedApplicationId,
            link,
        });

        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};
