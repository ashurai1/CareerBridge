import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    applyForJob,
    getCandidateApplications,
    getApplicationById,
    updateApplicationStatus,
    getApplicationStatistics,
    getEmployerApplications,
    deleteApplication,
} from '../controllers/applicationController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   POST /api/applications
// @desc    Apply for a job
router.post('/', applyForJob);

// IMPORTANT: Specific routes MUST come before generic :id routes
// @route   GET /api/applications/candidate/my-applications
// @desc    Get candidate's applications
router.get('/candidate/my-applications', getCandidateApplications);

// @route   GET /api/applications/employer/all
// @desc    Get all applications for employer
router.get('/employer/all', getEmployerApplications);

// @route   GET /api/applications/employer/statistics
// @desc    Get application statistics for employer
router.get('/employer/statistics', getApplicationStatistics);

// Generic routes - MUST be last
// @route   GET /api/applications/:id
// @desc    Get single application
router.get('/:id', getApplicationById);

// @route   PUT /api/applications/:id/status
// @desc    Update application status
router.put('/:id/status', updateApplicationStatus);

// @route   DELETE /api/applications/:id
// @desc    Delete application
router.delete('/:id', deleteApplication);

export default router;
