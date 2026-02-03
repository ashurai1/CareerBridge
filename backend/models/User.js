import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },

        githubId: {
            type: String,
            unique: true,
            sparse: true,
        },
        linkedinId: {
            type: String,
            unique: true,
            sparse: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        password: {
            type: String,
            required: function () {
                // Password is required if no OAuth ID is present
                return !this.googleId && !this.githubId && !this.linkedinId;
            },
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Don't return password by default
        },
        role: {
            type: String,
            enum: ['candidate', 'employer'],
            required: [true, 'Role is required'],
            default: 'candidate',
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        profilePicture: {
            type: String,
            default: '',
        },
        // Candidate specific fields
        resume: {
            type: String,
            default: '',
        },
        skills: [{
            type: String,
        }],
        experience: [{
            company: String,
            position: String,
            startDate: Date,
            endDate: Date,
            description: String,
        }],
        education: [{
            institution: String,
            degree: String,
            field: String,
            startDate: Date,
            endDate: Date,
        }],
        // Employer specific fields
        companyName: {
            type: String,
            default: '',
        },
        companyWebsite: {
            type: String,
            default: '',
        },
        companySize: {
            type: String,
            enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+', ''],
            default: '',
        },
        industry: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

// Hash password before saving
userSchema.pre('save', async function () {
    // Only hash if password is modified
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

// Method to get user without sensitive data
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.__v;
    return user;
};

const User = mongoose.model('User', userSchema);

export default User;
