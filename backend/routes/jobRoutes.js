import express from 'express';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Middleware to check if user is employer
const isEmployer = (req, res, next) => {
    if (req.user.role !== 'employer') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Employer role required.',
        });
    }
    next();
};

// @route   GET /api/jobs
// @desc    Get all jobs with filters
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { location, jobType, search } = req.query;
        const query = { status: 'active' };

        if (location) query.location = { $regex: location, $options: 'i' };
        if (jobType) query.jobType = jobType;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
            ];
        }

        const jobs = await Job.find(query)
            .populate('postedBy', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: jobs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   GET /api/jobs/:id
// @desc    Get single job
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('postedBy', 'name email');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        res.json({
            success: true,
            data: job,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   POST /api/jobs
// @desc    Create new job
// @access  Private (Employer only)
router.post('/', protect, isEmployer, async (req, res) => {
    try {
        const job = await Job.create({
            ...req.body,
            postedBy: req.user._id,
        });

        res.status(201).json({
            success: true,
            data: job,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   PUT /api/jobs/:id
// @desc    Update job
// @access  Private (Employer only - own jobs)
router.put('/:id', protect, isEmployer, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        // Check if user owns this job
        if (job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this job',
            });
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: updatedJob,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete job
// @access  Private (Employer only - own jobs)
router.delete('/:id', protect, isEmployer, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        // Check if user owns this job
        if (job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this job',
            });
        }

        await Job.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Job deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   GET /api/jobs/my/posted
// @desc    Get jobs posted by employer
// @access  Private (Employer only)
router.get('/my/posted', protect, isEmployer, async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user._id })
            .populate('applicants')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: jobs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

export default router;
