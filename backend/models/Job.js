import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Job title is required'],
            trim: true,
        },
        company: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
        },
        jobType: {
            type: String,
            enum: ['Internship', 'Full-time', 'Part-time'],
            required: [true, 'Job type is required'],
        },
        salary: {
            type: String,
            required: [true, 'Salary is required'],
        },
        description: {
            type: String,
            required: [true, 'Job description is required'],
        },
        requirements: {
            type: String,
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        applicants: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }],
        status: {
            type: String,
            enum: ['active', 'closed'],
            default: 'active',
        },
    },
    {
        timestamps: true,
    }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;
