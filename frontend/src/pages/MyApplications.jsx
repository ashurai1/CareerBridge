import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiService from '../services/api'
import { FiMapPin, FiBriefcase, FiDollarSign, FiClock, FiFilter, FiX } from 'react-icons/fi'
import './MyApplications.css'

export default function MyApplications() {
    const navigate = useNavigate()
    const [applications, setApplications] = useState([])
    const [filteredApplications, setFilteredApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [sortBy, setSortBy] = useState('recent')

    useEffect(() => {
        fetchApplications()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [applications, searchTerm, statusFilter, sortBy])

    const fetchApplications = async () => {
        setLoading(true)
        try {
            console.log('Fetching applications...')
            const response = await apiService.getCandidateApplications()
            console.log('Applications response:', response)
            if (response.success) {
                const apps = response.data || []
                console.log('Setting applications:', apps)
                setApplications(apps)
            } else {
                const errMsg = response.message || 'Failed to load applications'
                console.error('API error:', errMsg)
                setError(errMsg)
            }
        } catch (err) {
            console.error('Fetch error:', err)
            setError(err.message || 'Error loading applications')
        } finally {
            setLoading(false)
        }
    }

    const applyFilters = () => {
        let filtered = [...applications]

        // Search by job title or company
        if (searchTerm) {
            filtered = filtered.filter(app =>
                app.jobId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.jobId.company.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Filter by status
        if (statusFilter) {
            filtered = filtered.filter(app => app.status === statusFilter)
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'recent':
                    return new Date(b.createdAt) - new Date(a.createdAt)
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt)
                default:
                    return 0
            }
        })

        setFilteredApplications(filtered)
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'applied':
                return 'status-applied'
            case 'shortlisted':
                return 'status-shortlisted'
            case 'rejected':
                return 'status-rejected'
            default:
                return 'status-default'
        }
    }

    const getStatusLabel = (status) => {
        switch (status) {
            case 'applied':
                return '📋 Applied'
            case 'shortlisted':
                return '⭐ Shortlisted'
            case 'rejected':
                return '❌ Rejected'
            default:
                return status
        }
    }

    const handleResetFilters = () => {
        setSearchTerm('')
        setStatusFilter('')
        setSortBy('recent')
    }

    const handleViewJob = (jobId) => {
        navigate(`/job/${jobId}`)
    }

    return (
        <div className="my-applications-container">
            {console.log('Render: loading=', loading, 'error=', error, 'apps=', applications.length, 'filtered=', filteredApplications.length)}
            {/* Header */}
            <div className="applications-header">
                <div className="header-content">
                    <h1>📊 My Applications</h1>
                    <p>Track the status of all your job applications</p>
                </div>
                <div className="header-stats">
                    <div className="stat-box">
                        <span className="stat-number">{applications.length}</span>
                        <span className="stat-label">Total</span>
                    </div>
                    <div className="stat-box applied">
                        <span className="stat-number">
                            {applications.filter(a => a.status === 'applied').length}
                        </span>
                        <span className="stat-label">Applied</span>
                    </div>
                    <div className="stat-box shortlisted">
                        <span className="stat-number">
                            {applications.filter(a => a.status === 'shortlisted').length}
                        </span>
                        <span className="stat-label">Shortlisted</span>
                    </div>
                    <div className="stat-box rejected">
                        <span className="stat-number">
                            {applications.filter(a => a.status === 'rejected').length}
                        </span>
                        <span className="stat-label">Rejected</span>
                    </div>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Filters */}
            <div className="filter-section">
                <div className="filter-box">
                    <FiFilter size={18} />
                    <input
                        type="text"
                        placeholder="Search by job title or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="filter-input"
                    />
                </div>

                <div className="filter-controls">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Status</option>
                        <option value="applied">📋 Applied</option>
                        <option value="shortlisted">⭐ Shortlisted</option>
                        <option value="rejected">❌ Rejected</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="filter-select"
                    >
                        <option value="recent">Most Recent</option>
                        <option value="oldest">Oldest First</option>
                    </select>

                    {(searchTerm || statusFilter || sortBy !== 'recent') && (
                        <button onClick={handleResetFilters} className="btn-clear-filters">
                            <FiX size={18} /> Clear All
                        </button>
                    )}
                </div>
            </div>

            {/* Applications List */}
            <div className="applications-list">
                {loading && <div className="loading">Loading your applications...</div>}

                {filteredApplications.length === 0 && !loading && (
                    <div className="no-applications">
                        <div className="empty-icon">📭</div>
                        <p>No applications found</p>
                        <button
                            onClick={() => navigate('/dashboard/jobs')}
                            className="btn-browse-jobs"
                        >
                            Browse Jobs
                        </button>
                    </div>
                )}

                {filteredApplications.map((application) => (
                    <div key={application._id} className={`application-card ${getStatusColor(application.status)}`}>
                        <div className="app-card-header">
                            <div className="app-title-section">
                                <h3>{application.jobId.title}</h3>
                                <p className="app-company">{application.jobId.company}</p>
                            </div>
                            <span className={`status-badge ${getStatusColor(application.status)}`}>
                                {getStatusLabel(application.status)}
                            </span>
                        </div>

                        <div className="app-details">
                            <div className="detail-item">
                                <FiMapPin size={16} />
                                <span>{application.jobId.location}</span>
                            </div>
                            <div className="detail-item">
                                <FiDollarSign size={16} />
                                <span>{application.jobId.salary}</span>
                            </div>
                            <div className="detail-item">
                                <FiBriefcase size={16} />
                                <span>{application.jobId.jobType}</span>
                            </div>
                            <div className="detail-item">
                                <FiClock size={16} />
                                <span>
                                    Applied {new Date(application.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        {application.coverLetter && (
                            <div className="cover-letter-section">
                                <label>Your Cover Letter:</label>
                                <p>{application.coverLetter}</p>
                            </div>
                        )}

                        <div className="app-card-footer">
                            <button
                                onClick={() => handleViewJob(application.jobId._id)}
                                className="btn-view-job"
                            >
                                View Job Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
