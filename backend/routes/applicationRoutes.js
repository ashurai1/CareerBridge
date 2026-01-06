import express from 'express';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Middleware to check if user is candidate
const isCandidate = (req, res, next) => {
    if (req.user.role !== 'candidate') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Candidate role required.',
        });
    }
    next();
};

// @route   POST /api/applications
// @desc    Apply to a job
// @access  Private (Candidate only)
router.post('/', protect, isCandidate, async (req, res) => {
    try {
        const { jobId, coverLetter } = req.body;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            jobId,
            candidateId: req.user._id,
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied to this job',
            });
        }

        const application = await Application.create({
            jobId,
            candidateId: req.user._id,
            coverLetter,
        });

        // Add application to job's applicants array
        job.applicants.push(application._id);
        await job.save();

        res.status(201).json({
            success: true,
            data: application,
            message: 'Application submitted successfully',
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   GET /api/applications/my
// @desc    Get candidate's applications
// @access  Private (Candidate only)
router.get('/my', protect, isCandidate, async (req, res) => {
    try {
        const applications = await Application.find({ candidateId: req.user._id })
            .populate('jobId')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: applications,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   GET /api/applications/job/:jobId
// @desc    Get all applications for a job
// @access  Private (Employer only - own jobs)
router.get('/job/:jobId', protect, async (req, res) => {
    try {
        // Check if job exists and belongs to employer
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        if (job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view these applications',
            });
        }

        const applications = await Application.find({ jobId: req.params.jobId })
            .populate('candidateId', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: applications,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status
// @access  Private (Employer only)
router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body;

        if (!['applied', 'shortlisted', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status',
            });
        }

        const application = await Application.findById(req.params.id).populate('jobId');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        // Check if user owns the job
        if (application.jobId.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this application',
            });
        }

        application.status = status;
        await application.save();

        res.json({
            success: true,
            data: application,
            message: 'Application status updated',
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

export default router;
