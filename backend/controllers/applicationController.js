import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { createNotification } from './notificationController.js';

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Candidate only)
export const applyForJob = async (req, res, next) => {
    try {
        const { jobId, coverLetter } = req.body;

        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: 'Job ID is required',
            });
        }

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        // Check if user is candidate
        if (req.user.role !== 'candidate') {
            return res.status(403).json({
                success: false,
                message: 'Only candidates can apply for jobs',
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
                message: 'You have already applied for this job',
            });
        }

        // Create application
        const application = await Application.create({
            jobId,
            candidateId: req.user._id,
            coverLetter,
        });

        // Add application to job's applicants array
        job.applicants.push(application._id);
        await job.save();

        // Populate for response
        await application.populate('candidateId', 'name email');
        await application.populate('jobId', 'title company');

        // Create notification for employer
        const employer = await User.findById(job.postedBy);
        if (employer) {
            await createNotification(
                job.postedBy,
                'application_received',
                'New Application',
                `${req.user.name} applied for ${job.title}`,
                jobId,
                application._id,
                req.user._id,
                `/dashboard/applications/${application._id}`
            );
        }

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: application,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get applications for a candidate
// @route   GET /api/applications/candidate/my-applications
// @access  Private (Candidate only)
export const getCandidateApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({ candidateId: req.user._id })
            .populate('jobId')
            .populate('candidateId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: applications,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single application by ID
// @route   GET /api/applications/:id
// @access  Private
export const getApplicationById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const application = await Application.findById(id)
            .populate('jobId')
            .populate('candidateId', 'name email skills');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        res.status(200).json({
            success: true,
            data: application,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get applications for employer (for all their jobs)
// @route   GET /api/applications/employer/all
// @access  Private (Employer only)
export const getEmployerApplications = async (req, res, next) => {
    try {
        // Get all jobs posted by employer
        const employerJobs = await Job.find({ postedBy: req.user._id });
        const jobIds = employerJobs.map((job) => job._id);

        // Get all applications for these jobs
        const applications = await Application.find({
            jobId: { $in: jobIds },
        })
            .populate('jobId', 'title company')
            .populate('candidateId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: applications,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get application statistics for employer
// @route   GET /api/applications/employer/statistics
// @access  Private (Employer only)
export const getApplicationStatistics = async (req, res, next) => {
    try {
        // Get all jobs posted by employer
        const employerJobs = await Job.find({ postedBy: req.user._id });
        const jobIds = employerJobs.map((job) => job._id);

        // Get statistics
        const totalApplications = await Application.countDocuments({
            jobId: { $in: jobIds },
        });

        const statusBreakdown = await Application.aggregate([
            { $match: { jobId: { $in: jobIds } } },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalApplications,
                statusBreakdown,
                jobsPosted: employerJobs.length,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer only)
export const updateApplicationStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required',
            });
        }

        const application = await Application.findById(id);
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        // Verify user owns the job
        const job = await Job.findById(application.jobId);
        if (job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this application',
            });
        }

        application.status = status;
        await application.save();

        // Create notification for candidate with a valid type
        const candidate = await User.findById(application.candidateId);
        if (candidate) {
            let notifType = 'application_applied';
            let notifTitle = 'Application Status Updated';

            if (status === 'shortlisted') {
                notifType = 'application_shortlisted';
                notifTitle = 'Application Shortlisted';
            } else if (status === 'rejected') {
                notifType = 'application_rejected';
                notifTitle = 'Application Rejected';
            } else if (status === 'applied') {
                notifType = 'application_applied';
                notifTitle = 'Application Submitted';
            }

            await createNotification(
                application.candidateId,
                notifType,
                notifTitle,
                `Your application for ${job.title} is now ${status}`,
                application.jobId,
                application._id,
                req.user._id,
                `/my-applications`
            );
        }

        res.status(200).json({
            success: true,
            message: 'Application status updated',
            data: application,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete an application
// @route   DELETE /api/applications/:id
// @access  Private
export const deleteApplication = async (req, res, next) => {
    try {
        const { id } = req.params;

        const application = await Application.findById(id);
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        // Check authorization
        if (
            application.candidateId.toString() !== req.user._id.toString() &&
            req.user.role !== 'employer'
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this application',
            });
        }

        // Remove application from job's applicants array
        const job = await Job.findById(application.jobId);
        if (job) {
            job.applicants = job.applicants.filter(
                (appId) => appId.toString() !== id
            );
            await job.save();
        }

        await Application.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Application deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

