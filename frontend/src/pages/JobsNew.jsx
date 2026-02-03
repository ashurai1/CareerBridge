import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiService from '../services/api'
import { FiMapPin, FiBriefcase, FiDollarSign, FiClock, FiArrowRight, FiSearch } from 'react-icons/fi'
import './JobsNew.css'

export default function Jobs() {
    const navigate = useNavigate()
    const [jobs, setJobs] = useState([])
    const [filteredJobs, setFilteredJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [user, setUser] = useState(null)
    const [appliedJobs, setAppliedJobs] = useState(new Set())

    // Filters
    const [searchTerm, setSearchTerm] = useState('')
    const [locationFilter, setLocationFilter] = useState('')
    const [jobTypeFilter, setJobTypeFilter] = useState('')
    const [salaryMin, setSalaryMin] = useState('')
    const [salaryMax, setSalaryMax] = useState('')
    const [sortBy, setSortBy] = useState('newest')

    useEffect(() => {
        fetchJobs()
        fetchUserData()
        fetchUserApplications()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [jobs, searchTerm, locationFilter, jobTypeFilter, salaryMin, salaryMax, sortBy])

    const fetchJobs = async () => {
        setLoading(true)
        try {
            const response = await apiService.getAllJobs()
            if (response.success) {
                setJobs(response.data || [])
            } else {
                setError('Failed to load jobs')
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const fetchUserData = async () => {
        try {
            const userData = localStorage.getItem('user')
            if (userData) {
                setUser(JSON.parse(userData))
            }
        } catch (err) {
            console.error('Error loading user:', err)
        }
    }

    const fetchUserApplications = async () => {
        try {
            const response = await apiService.getCandidateApplications()
            if (response.success) {
                const appliedJobIds = new Set(response.data.map(app => app.jobId._id || app.jobId))
                setAppliedJobs(appliedJobIds)
            }
        } catch (err) {
            console.error('Error loading applications:', err)
        }
    }

    const applyFilters = () => {
        let filtered = [...jobs]

        // Search by title or company
        if (searchTerm) {
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Filter by location
        if (locationFilter) {
            filtered = filtered.filter(job =>
                job.location.toLowerCase().includes(locationFilter.toLowerCase())
            )
        }

        // Filter by job type
        if (jobTypeFilter) {
            filtered = filtered.filter(job => job.jobType === jobTypeFilter)
        }

        // Filter by salary range
        if (salaryMin || salaryMax) {
            filtered = filtered.filter(job => {
                const salary = parseInt(job.salary.replace(/\D/g, '')) || 0
                if (salaryMin && salary < parseInt(salaryMin)) return false
                if (salaryMax && salary > parseInt(salaryMax)) return false
                return true
            })
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt)
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt)
                case 'salary-high':
                    return parseInt(b.salary.replace(/\D/g, '')) - parseInt(a.salary.replace(/\D/g, ''))
                case 'salary-low':
                    return parseInt(a.salary.replace(/\D/g, '')) - parseInt(b.salary.replace(/\D/g, ''))
                default:
                    return 0
            }
        })

        setFilteredJobs(filtered)
    }

    const handleResetFilters = () => {
        setSearchTerm('')
        setLocationFilter('')
        setJobTypeFilter('')
        setSalaryMin('')
        setSalaryMax('')
        setSortBy('newest')
    }

    const handleViewDetails = (jobId) => {
        navigate(`/job/${jobId}`)
    }

    const handleApplyNow = (jobId) => {
        navigate(`/job/${jobId}`)
    }

    if (loading) {
        return (
            <div className="jobs-container">
                <div className="loading">Loading jobs...</div>
            </div>
        )
    }

    return (
        <div className="jobs-container">
            {/* Header */}
            <div className="jobs-header">
                <div className="header-content">
                    <h1>Find Your Next Opportunity</h1>
                    <p>Browse {filteredJobs.length} job positions available</p>
                </div>
                <button
                    onClick={() => navigate('/my-applications')}
                    className="btn-my-apps"
                >
                    📋 My Applications
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Search & Filters */}
            <form onSubmit={(e) => e.preventDefault()} className="search-filters">
                <div className="search-box">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Search by job title or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-row">
                    <input
                        type="text"
                        placeholder="Location"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="filter-input"
                    />

                    <select
                        value={jobTypeFilter}
                        onChange={(e) => setJobTypeFilter(e.target.value)}
                        className="filter-input"
                    >
                        <option value="">All Job Types</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Internship">Internship</option>
                        <option value="Contract">Contract</option>
                    </select>

                    <input
                        type="number"
                        placeholder="Min Salary"
                        value={salaryMin}
                        onChange={(e) => setSalaryMin(e.target.value)}
                        className="filter-input"
                    />

                    <input
                        type="number"
                        placeholder="Max Salary"
                        value={salaryMax}
                        onChange={(e) => setSalaryMax(e.target.value)}
                        className="filter-input"
                    />

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="filter-input"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="salary-high">Highest Salary</option>
                        <option value="salary-low">Lowest Salary</option>
                    </select>
                </div>

                <div className="button-row">
                    <button type="button" onClick={applyFilters} className="btn-search">
                        Search Jobs
                    </button>
                    <button type="button" onClick={handleResetFilters} className="btn-reset">
                        Reset Filters
                    </button>
                </div>
            </form>

            {/* Jobs List */}
            <div className="jobs-list">
                {loading && <div className="loading">Loading jobs...</div>}
                {filteredJobs.length === 0 && !loading && (
                    <div className="no-jobs">
                        <div className="empty-icon">🔍</div>
                        <p>No jobs found matching your criteria</p>
                    </div>
                )}

                {filteredJobs.map((job) => (
                    <div key={job._id} className="job-card-new">
                        <div className="job-card-header">
                            <div className="job-title-section">
                                <h3>{job.title}</h3>
                                <p className="company-name">{job.company}</p>
                            </div>
                            <span className={`job-type ${job.jobType}`}>{job.jobType}</span>
                        </div>

                        <div className="job-details">
                            <div className="detail-item">
                                <FiMapPin size={16} />
                                <span>{job.location}</span>
                            </div>
                            <div className="detail-item">
                                <FiDollarSign size={16} />
                                <span>{job.salary}</span>
                            </div>
                            <div className="detail-item">
                                <FiBriefcase size={16} />
                                <span>{job.jobType}</span>
                            </div>
                            <div className="detail-item">
                                <FiClock size={16} />
                                <span>
                                    {new Date(job.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="job-description">
                            <p>
                                {job.description.substring(0, 180)}
                                {job.description.length > 180 ? '...' : ''}
                            </p>
                        </div>

                        <div className="job-card-footer">
                            <button
                                onClick={() => handleViewDetails(job._id)}
                                className="btn-view-details"
                            >
                                <FiArrowRight size={16} /> View Details
                            </button>
                            {user?.role === 'candidate' && (
                                <button
                                    onClick={() => handleApplyNow(job._id)}
                                    className={`btn-apply-now ${appliedJobs.has(job._id) ? 'applied' : ''}`}
                                    disabled={appliedJobs.has(job._id)}
                                >
                                    {appliedJobs.has(job._id) ? '✓ Applied' : 'Apply Now'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
