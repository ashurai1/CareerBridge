import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiService from '../services/api'
import { FiMapPin, FiBriefcase, FiDollarSign, FiArrowLeft } from 'react-icons/fi'
import './JobDetail.css'

export default function JobDetail() {
    const { jobId } = useParams()
    const navigate = useNavigate()
    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showApplyForm, setShowApplyForm] = useState(false)
    const [coverLetter, setCoverLetter] = useState('')
    const [applying, setApplying] = useState(false)
    const [user, setUser] = useState(null)
    const [hasApplied, setHasApplied] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        fetchJobDetails()
        fetchUserProfile()
    }, [jobId])

    const fetchJobDetails = async () => {
        try {
            const response = await apiService.getJobById(jobId)
            if (response.success) {
                setJob(response.data)
            } else {
                setError('Failed to load job details')
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const fetchUserProfile = async () => {
        try {
            const response = await apiService.getProfile()
            console.log('Profile response:', response)
            if (response.success) {
                console.log('User set to:', response.data.user)
                setUser(response.data.user)
                // Check if user has already applied
                checkIfApplied(response.data.user._id)
            } else {
                console.error('Profile fetch failed:', response.message)
            }
        } catch (err) {
            console.error('Error fetching profile:', err)
        }
    }

    const checkIfApplied = async (userId) => {
        try {
            const applicationsResponse = await apiService.getCandidateApplications()
            if (applicationsResponse.success) {
                const alreadyApplied = applicationsResponse.data.some(
                    (app) => app.jobId._id === jobId
                )
                setHasApplied(alreadyApplied)
            }
        } catch (err) {
            console.error('Error checking applications:', err)
        }
    }

    const handleApplySubmit = async (e) => {
        e.preventDefault()
        setApplying(true)
        setError('')
        setSuccessMessage('')

        try {
            console.log('Applying for job:', jobId, 'with cover letter:', coverLetter)
            const response = await apiService.applyForJob(jobId, coverLetter)
            console.log('Apply response:', response)
            if (response.success) {
                setSuccessMessage('✓ Application submitted successfully!')
                setCoverLetter('')
                setShowApplyForm(false)
                setHasApplied(true)
                // Redirect to My Applications so user sees updated status
                console.log('Redirecting to My Applications')
                navigate('/my-applications')
                // Auto-clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(''), 3000)
            } else {
                setError(response.message || 'Failed to submit application')
                console.error('Apply failed:', response.message)
            }
        } catch (err) {
            setError(err.message || 'An error occurred while submitting your application')
            console.error('Application error:', err)
        } finally {
            setApplying(false)
        }
    }

    if (loading) {
        return <div className="job-detail-loading">Loading job details...</div>
    }

    if (error) {
        return (
            <div className="job-detail-container">
                <button
                    onClick={() => navigate('/dashboard/jobs')}
                    className="btn-back"
                >
                    <FiArrowLeft /> Back to Jobs
                </button>
                <div className="error-message">{error}</div>
            </div>
        )
    }

    if (!job) {
        return <div className="job-detail-container">Job not found</div>
    }

    return (
        <div className="job-detail-container">
            <button
                onClick={() => navigate('/dashboard/jobs')}
                className="btn-back"
            >
                <FiArrowLeft /> Back to Jobs
            </button>

            {successMessage && (
                <div className="success-message">{successMessage}</div>
            )}

            <div className="job-detail-content">
                {/* Job Header */}
                <div className="job-detail-header">
                    <div className="job-detail-title-section">
                        <h1>{job.title}</h1>
                        <p className="company-detail">{job.company}</p>
                    </div>
                    <span className={`job-type ${job.jobType}`}>{job.jobType}</span>
                </div>

                {/* Job Details Grid */}
                <div className="job-details-grid">
                    <div className="detail-box">
                        <FiMapPin className="detail-icon" />
                        <div>
                            <span className="detail-label">Location</span>
                            <p>{job.location}</p>
                        </div>
                    </div>

                    <div className="detail-box">
                        <FiDollarSign className="detail-icon" />
                        <div>
                            <span className="detail-label">Salary</span>
                            <p>{job.salary}</p>
                        </div>
                    </div>

                    <div className="detail-box">
                        <FiBriefcase className="detail-icon" />
                        <div>
                            <span className="detail-label">Job Type</span>
                            <p>{job.jobType}</p>
                        </div>
                    </div>

                    <div className="detail-box">
                        <span className="detail-label">Posted On</span>
                        <p>{new Date(job.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Job Description and Requirements */}
                <div className="job-content">
                    <section>
                        <h2>Job Description</h2>
                        <div className="content-text">{job.description}</div>
                    </section>

                    {job.requirements && (
                        <section>
                            <h2>Requirements</h2>
                            <div className="content-text">{job.requirements}</div>
                        </section>
                    )}
                </div>

                {/* Apply Section */}
                <div className="apply-section">
                    {user && user.role === 'candidate' ? (
                        <>
                            {hasApplied ? (
                                <div className="applied-message">
                                    <p>✓ You have already applied for this job</p>
                                </div>
                            ) : !showApplyForm ? (
                                <button
                                    onClick={() => setShowApplyForm(true)}
                                    className="btn-apply"
                                >
                                    Apply Now
                                </button>
                            ) : (
                                <form onSubmit={handleApplySubmit} className="apply-form">
                                    <h3>Submit Your Application</h3>
                                    <textarea
                                        placeholder="Write your cover letter here... (optional)"
                                        value={coverLetter}
                                        onChange={(e) => setCoverLetter(e.target.value)}
                                        rows="5"
                                        className="cover-letter-input"
                                    />
                                    <div className="form-actions">
                                        <button
                                            type="submit"
                                            disabled={applying}
                                            className="btn-submit-app"
                                        >
                                            {applying ? 'Submitting...' : 'Submit Application'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowApplyForm(false)}
                                            className="btn-cancel"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </>
                    ) : (
                        <div className="employer-message">
                            <p>
                                Only candidates can apply for jobs. Please log in as a candidate to
                                apply.
                            </p>
                        </div>
                    )}
                </div>

                {/* Employer Info */}
                <div className="employer-info">
                    <h3>About the Employer</h3>
                    <div className="employer-details">
                        <p>
                            <strong>Company:</strong> {job.company}
                        </p>
                        {job.postedBy.companyWebsite && (
                            <p>
                                <strong>Website:</strong>{' '}
                                <a href={job.postedBy.companyWebsite} target="_blank" rel="noreferrer">
                                    {job.postedBy.companyWebsite}
                                </a>
                            </p>
                        )}
                        <p>
                            <strong>Contact:</strong> {job.postedBy.email}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
