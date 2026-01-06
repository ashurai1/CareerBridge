import User from '../models/User.js';

export const getDashboardStats = async (req, res) => {
    try {
        // In a real app, you would fetch these from the database based on the user's ID
        // const userId = req.user.id;

        // Mock data for now
        const stats = {
            jobsApplied: 12,
            profileViews: 45,
            interviewsScheduled: 3
        };

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
