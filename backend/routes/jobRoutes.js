import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    createJob,
    getAllJobs,
    getJobById,
    getMyJobs,
    updateJob,
    deleteJob,
    closeJob,
    getJobApplications,
} from '../controllers/jobController.js';

const router = express.Router();

// Public routes
// @route   GET /api/jobs
// @desc    Get all jobs with filters
router.get('/', getAllJobs);

// Protected routes (must come before generic :id routes)
// @route   POST /api/jobs
// @desc    Create new job (Employer only)
router.post('/', protect, createJob);

// @route   GET /api/jobs/employer/my-jobs
// @desc    Get employer's jobs
router.get('/employer/my-jobs', protect, getMyJobs);

// @route   GET /api/jobs/:id/applications
// @desc    Get applications for a job
router.get('/:id/applications', protect, getJobApplications);

// @route   PUT /api/jobs/:id/close
// @desc    Close a job listing
router.put('/:id/close', protect, closeJob);

// Generic routes (must be last)
// @route   GET /api/jobs/:id
// @desc    Get single job
router.get('/:id', getJobById);

// @route   PUT /api/jobs/:id
// @desc    Update a job
router.put('/:id', protect, updateJob);

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
router.delete('/:id', protect, deleteJob);

export default router;
