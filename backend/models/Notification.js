import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        type: {
            type: String,
            enum: ['application_received', 'application_shortlisted', 'application_rejected', 'job_posted', 'application_applied'],
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        relatedJobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
        },
        relatedApplicationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        link: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient queries
notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
