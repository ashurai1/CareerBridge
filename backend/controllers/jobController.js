import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { createNotification } from './notificationController.js';
import User from '../models/User.js';

// @desc    Create a new job listing (Employer only)
// @route   POST /api/jobs
// @access  Private
export const createJob = async (req, res, next) => {
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({
                success: false,
                message: 'Only employers can create job listings',
            });
        }

        const { title, location, jobType, salary, description, requirements } =
            req.body;

        // Validation
        if (!title || !location || !jobType || !salary || !description) {
            return res.status(400).json({
                success: false,
                message:
                    'Please provide all required fields: title, location, jobType, salary, description',
            });
        }

        const job = await Job.create({
            title,
            company: req.user.companyName || req.user.name || 'Company',
            location,
            jobType,
            salary,
            description,
            requirements,
            postedBy: req.user._id,
        });

        // Populate the postedBy field
        await job.populate('postedBy', 'name email companyName');

        // Create notifications for all candidates about the new job
        try {
            const candidates = await User.find({ role: 'candidate' }).select('_id');
            if (candidates && candidates.length > 0) {
                const notifyPromises = candidates.map((c) =>
                    createNotification(
                        c._id,
                        'job_posted',
                        `New job posted: ${job.title}`,
                        `${req.user.companyName} posted a new job: ${job.title} in ${job.location}`,
                        job._id,
                        null,
                        req.user._id,
                        `/jobs/${job._id}`
                    )
                );

                // Fire-and-forget, but await to surface any DB errors
                await Promise.all(notifyPromises);
            }
        } catch (notifErr) {
            console.error('Failed to create job notifications:', notifErr);
            // don't fail the request if notifications fail
        }

        res.status(201).json({
            success: true,
            message: 'Job listing created successfully',
            data: job,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
export const getAllJobs = async (req, res, next) => {
    try {
        const { location, jobType, search, salaryMin, salaryMax } = req.query;
        const query = { status: 'active' };

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        if (jobType) {
            query.jobType = jobType;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        // Handle salary range filtering
        if (salaryMin || salaryMax) {
            // Parse salary strings to numbers for comparison
            const minSalary = salaryMin ? parseInt(salaryMin) : 0;
            const maxSalary = salaryMax ? parseInt(salaryMax) : Infinity;

            // This is a simple filter - in production, store salary as numbers
            const allJobs = await Job.find(query)
                .populate('postedBy', 'name email companyName')
                .sort({ createdAt: -1 });

            const filteredJobs = allJobs.filter((job) => {
                const salaryRange = job.salary.split('-').map((s) => parseInt(s));
                const jobMinSalary = salaryRange[0] || 0;
                return jobMinSalary >= minSalary && jobMinSalary <= maxSalary;
            });

            return res.json({
                success: true,
                count: filteredJobs.length,
                data: filteredJobs,
            });
        }

        const jobs = await Job.find(query)
            .populate('postedBy', 'name email companyName')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: jobs.length,
            data: jobs,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('postedBy', 'name email companyName companyWebsite')
            .populate({
                path: 'applicants',
                populate: {
                    path: 'candidateId',
                    select: 'name email skills resume',
                },
            });

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
        next(error);
    }
};

// @desc    Get jobs posted by logged-in employer
// @route   GET /api/jobs/employer/my-jobs
// @access  Private
export const getMyJobs = async (req, res, next) => {
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({
                success: false,
                message: 'Only employers can view their jobs',
            });
        }

        const jobs = await Job.find({ postedBy: req.user._id })
            .populate('postedBy', 'name email companyName')
            .populate({
                path: 'applicants',
                populate: {
                    path: 'candidateId',
                    select: 'name email skills',
                },
            })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: jobs.length,
            data: jobs,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a job listing
// @route   PUT /api/jobs/:id
// @access  Private
export const updateJob = async (req, res, next) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        // Check if user is the one who posted the job
        if (job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this job',
            });
        }

        const { title, location, jobType, salary, description, requirements, status } =
            req.body;

        // Update fields
        if (title) job.title = title;
        if (location) job.location = location;
        if (jobType) job.jobType = jobType;
        if (salary) job.salary = salary;
        if (description) job.description = description;
        if (requirements) job.requirements = requirements;
        if (status) job.status = status;

        job = await job.save();

        await job.populate('postedBy', 'name email companyName');

        res.json({
            success: true,
            message: 'Job updated successfully',
            data: job,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a job listing
// @route   DELETE /api/jobs/:id
// @access  Private
export const deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        // Check if user is the one who posted the job
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
        next(error);
    }
};

// @desc    Close a job listing
// @route   PUT /api/jobs/:id/close
// @access  Private
export const closeJob = async (req, res, next) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        // Check if user is the one who posted the job
        if (job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to close this job',
            });
        }

        job.status = 'closed';
        job = await job.save();

        res.json({
            success: true,
            message: 'Job closed successfully',
            data: job,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get applications for a specific job
// @route   GET /api/jobs/:id/applications
// @access  Private
export const getJobApplications = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        // Check if user is the one who posted the job
        if (job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view applications for this job',
            });
        }

        const applications = await Application.find({ jobId: req.params.id })
            .populate('candidateId', 'name email skills resume profilePicture')
            .populate('jobId', 'title company')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: applications.length,
            data: applications,
        });
    } catch (error) {
        next(error);
    }
};
