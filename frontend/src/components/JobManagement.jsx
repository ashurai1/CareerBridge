import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiService from '../services/api'
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi'
import './JobManagement.css'

export default function JobManagement() {
    const navigate = useNavigate()
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [editingJobId, setEditingJobId] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [formErrors, setFormErrors] = useState({})
    const [successMessage, setSuccessMessage] = useState('')
    const [user, setUser] = useState(null)
    const [showTemplates, setShowTemplates] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        jobType: 'Full-time',
        salary: '',
        description: '',
        requirements: '',
    })

    useEffect(() => {
        fetchMyJobs()
        fetchUserData()
    }, [])

    const fetchUserData = async () => {
        try {
            const userData = localStorage.getItem('user')
            if (userData) {
                setUser(JSON.parse(userData))
            }
        } catch (err) {
            console.error('Failed to load user data:', err)
        }
    }

    const fetchMyJobs = async () => {
        setLoading(true)
        try {
            const response = await apiService.getMyJobs()
            if (response.success) {
                setJobs(response.data || [])
            } else {
                setError('Failed to load your jobs')
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: '',
            }))
        }
    }

    const validateForm = () => {
        const errors = {}
        
        if (!formData.title.trim()) {
            errors.title = 'Job title is required'
        } else if (formData.title.trim().length < 3) {
            errors.title = 'Job title must be at least 3 characters'
        }
        
        if (!formData.location.trim()) {
            errors.location = 'Location is required'
        }
        
        if (!formData.salary.trim()) {
            errors.salary = 'Salary range is required'
        }
        
        if (!formData.description.trim()) {
            errors.description = 'Job description is required'
        } else if (formData.description.trim().length < 50) {
            errors.description = 'Description must be at least 50 characters'
        }
        
        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const applyTemplate = (template) => {
        setFormData((prev) => ({
            ...prev,
            ...template,
        }))
        setShowTemplates(false)
    }

    const jobTemplates = [
        {
            title: 'Senior Developer',
            location: 'Remote',
            jobType: 'Full-time',
            salary: '$80,000 - $120,000',
            description: 'We are looking for an experienced Senior Developer to lead our tech team. You will be responsible for designing and implementing scalable solutions. Required: 5+ years of experience in software development.',
            requirements: '• 5+ years of professional development experience\n• Strong knowledge of modern frameworks\n• Experience with cloud platforms\n• Excellent problem-solving skills'
        },
        {
            title: 'UI/UX Designer',
            location: 'Hybrid',
            jobType: 'Full-time',
            salary: '$60,000 - $90,000',
            description: 'We are seeking a creative UI/UX Designer to create beautiful and functional user interfaces. You will work closely with our product and development teams to deliver exceptional digital experiences.',
            requirements: '• 3+ years of UX design experience\n• Proficiency in Figma or Adobe XD\n• Strong portfolio\n• Experience with user research'
        },
        {
            title: 'Frontend Developer',
            location: 'Remote',
            jobType: 'Full-time',
            salary: '$70,000 - $100,000',
            description: 'Looking for a talented Frontend Developer to build responsive and interactive web applications. You will work with React/Vue and collaborate with designers and backend developers.',
            requirements: '• 2+ years of React/Vue experience\n• Strong JavaScript/TypeScript skills\n• Experience with REST APIs\n• Knowledge of responsive design'
        },
        {
            title: 'Backend Engineer',
            location: 'On-site',
            jobType: 'Full-time',
            salary: '$75,000 - $110,000',
            description: 'We need a skilled Backend Engineer to build robust and scalable APIs. You will work with Node.js and databases to create reliable server-side solutions.',
            requirements: '• 3+ years of backend development\n• Experience with Node.js or similar\n• Database design knowledge\n• API development expertise'
        }
    ]

    const handleSubmitForm = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setSubmitting(true)
        setSuccessMessage('')

        try {
            if (editingJobId) {
                // Update existing job
                const response = await apiService.updateJob(editingJobId, formData)
                if (response.success) {
                    setSuccessMessage('Job updated successfully! 🎉')
                    setEditingJobId(null)
                } else {
                    setError('Failed to update job')
                }
            } else {
                // Create new job
                const response = await apiService.createJob(formData)
                if (response.success) {
                    setSuccessMessage('Job posted successfully! 🎉')
                } else {
                    setError('Failed to create job')
                }
            }

            // Reset form and refresh list
            setTimeout(() => {
                resetForm()
                fetchMyJobs()
                setSuccessMessage('')
            }, 1000)
        } catch (err) {
            setError(err.message || 'An error occurred while posting the job')
        } finally {
            setSubmitting(false)
        }
    }

    const handleEditJob = (job) => {
        setFormData({
            title: job.title,
            location: job.location,
            jobType: job.jobType,
            salary: job.salary,
            description: job.description,
            requirements: job.requirements || '',
        })
        setEditingJobId(job._id)
        setShowCreateForm(true)
    }

    const handleDeleteJob = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                const response = await apiService.deleteJob(jobId)
                if (response.success) {
                    setSuccessMessage('Job deleted successfully!')
                    fetchMyJobs()
                    setTimeout(() => setSuccessMessage(''), 3000)
                } else {
                    setError('Failed to delete job')
                }
            } catch (err) {
                setError(err.message)
            }
        }
    }

    const handleViewApplications = (jobId) => {
        navigate(`/dashboard/applications/${jobId}`)
    }

    const resetForm = () => {
        setFormData({
            title: '',
            location: '',
            jobType: 'Full-time',
            salary: '',
            description: '',
            requirements: '',
        })
        setShowCreateForm(false)
        setEditingJobId(null)
        setFormErrors({})
    }

    return (
        <div className="job-management-container">
            <div className="management-header">
                <h2>Job Management</h2>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="btn-create-job"
                >
                    <FiPlus /> {showCreateForm ? 'Cancel' : 'Post New Job'}
                </button>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="success-message">
                    {successMessage}
                </div>
            )}

            {/* Create/Edit Job Form */}
            {showCreateForm && (
                <div className="job-form-container">
                    <div className="form-header">
                        <h3>{editingJobId ? 'Edit Job' : 'Post New Job'}</h3>
                        <p className="form-subtitle">Fill in the details to post a job opening</p>
                    </div>

                    {/* Job Templates */}
                    <div className="templates-section">
                        <button 
                            type="button"
                            onClick={() => setShowTemplates(!showTemplates)}
                            className="btn-templates"
                        >
                            💡 Use Template
                        </button>
                        
                        {showTemplates && (
                            <div className="templates-grid">
                                {jobTemplates.map((template, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => applyTemplate(template)}
                                        className="template-card"
                                    >
                                        <h4>{template.title}</h4>
                                        <p className="template-location">{template.location}</p>
                                        <p className="template-salary">{template.salary}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmitForm}>
                        <div className="form-group">
                            <label>Job Title * <span className="required-mark">(required)</span></label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g., Senior Developer, UI Designer, etc."
                                required
                                className={formErrors.title ? 'input-error' : ''}
                            />
                            {formErrors.title && (
                                <span className="error-text">{formErrors.title}</span>
                            )}
                            <span className="char-count">{formData.title.length} characters</span>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Location * <span className="required-mark">(required)</span></label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="e.g., New York, Remote, Hybrid"
                                    required
                                    className={formErrors.location ? 'input-error' : ''}
                                />
                                {formErrors.location && (
                                    <span className="error-text">{formErrors.location}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Job Type * <span className="required-mark">(required)</span></label>
                                <select
                                    name="jobType"
                                    value={formData.jobType}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Salary Range * <span className="required-mark">(required)</span></label>
                                <input
                                    type="text"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleInputChange}
                                    placeholder="e.g., $50,000-$80,000"
                                    required
                                    className={formErrors.salary ? 'input-error' : ''}
                                />
                                {formErrors.salary && (
                                    <span className="error-text">{formErrors.salary}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Job Description * <span className="required-mark">(min 50 chars)</span></label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe the job responsibilities, required qualifications, and what you're looking for..."
                                rows="6"
                                required
                                className={formErrors.description ? 'input-error' : ''}
                            />
                            {formErrors.description && (
                                <span className="error-text">{formErrors.description}</span>
                            )}
                            <span className="char-count">{formData.description.length} characters (min 50)</span>
                        </div>

                        <div className="form-group">
                            <label>Requirements <span className="optional">(optional)</span></label>
                            <textarea
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleInputChange}
                                placeholder="List key requirements, skills, and qualifications..."
                                rows="4"
                            />
                            <span className="char-count">{formData.requirements.length} characters</span>
                        </div>

                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="btn-submit"
                                disabled={submitting}
                            >
                                {submitting ? 'Posting...' : (editingJobId ? 'Update Job' : 'Post Job')}
                            </button>
                            <button 
                                type="button" 
                                onClick={resetForm} 
                                className="btn-cancel"
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Jobs List */}
            <div className="jobs-management-list">
                {loading && <div className="loading">Loading your jobs...</div>}
                {error && <div className="error-message">{error}</div>}

                {!loading && !error && jobs.length === 0 && (
                    <div className="no-jobs">
                        <p>No jobs posted yet. Create your first job posting!</p>
                    </div>
                )}

                {!loading &&
                    !error &&
                    jobs.map((job) => (
                        <div key={job._id} className="job-management-card">
                            <div className="job-management-header">
                                <div>
                                    <h3>{job.title}</h3>
                                    <p className="job-location">{job.location}</p>
                                </div>
                                <span className={`job-status ${job.status}`}>{job.status}</span>
                            </div>

                            <div className="job-management-info">
                                <span className="info-badge">{job.jobType}</span>
                                <span className="info-badge">{job.salary}</span>
                                <span className="info-badge">
                                    {job.applicants?.length || 0} Applications
                                </span>
                            </div>

                            <p className="job-description">
                                {job.description.substring(0, 150)}...
                            </p>

                            <div className="job-management-actions">
                                <button
                                    onClick={() => handleViewApplications(job._id)}
                                    className="btn-view-applications"
                                >
                                    View Applications ({job.applicants?.length || 0})
                                </button>
                                <button
                                    onClick={() => handleEditJob(job)}
                                    className="btn-edit"
                                >
                                    <FiEdit2 /> Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteJob(job._id)}
                                    className="btn-delete"
                                >
                                    <FiTrash2 /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}
