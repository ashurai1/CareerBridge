import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
        },
        candidateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['applied', 'shortlisted', 'rejected'],
            default: 'applied',
        },
        coverLetter: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate applications
applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
