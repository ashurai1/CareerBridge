import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import apiService from '../services/api'
import { FiMapPin, FiBriefcase, FiDollarSign, FiClock, FiFilter, FiX, FiCheck, FiX as FiXIcon } from 'react-icons/fi'
import './EmployerApplications.css'

export default function EmployerApplications() {
    const navigate = useNavigate()
    const [applications, setApplications] = useState([])
    const [filteredApplications, setFilteredApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [sortBy, setSortBy] = useState('recent')
    const [updatingId, setUpdatingId] = useState(null)
    const { jobId } = useParams()

    useEffect(() => {
        fetchApplications()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [applications, searchTerm, statusFilter, sortBy, jobId]) // Added jobId dependency

    const fetchApplications = async () => {
        setLoading(true)
        try {
            console.log('Fetching employer applications...')
            const response = await apiService.getEmployerApplications()
            console.log('Employer applications response:', response)
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

        // Filter by Job ID if present in URL
        if (jobId) {
            filtered = filtered.filter(app => app.jobId && app.jobId._id === jobId)
        }

        // Search by job title, company, or candidate name
        if (searchTerm) {
            filtered = filtered.filter(app =>
                app.jobId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.jobId.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.candidateId.name.toLowerCase().includes(searchTerm.toLowerCase())
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

    const handleStatusUpdate = async (applicationId, newStatus) => {
        setUpdatingId(applicationId)
        try {
            console.log('Updating application status:', applicationId, 'to', newStatus)
            const response = await apiService.updateApplicationStatus(applicationId, newStatus)
            console.log('Update response:', response)
            if (response.success) {
                // Update local state
                setApplications(apps =>
                    apps.map(app =>
                        app._id === applicationId ? { ...app, status: newStatus } : app
                    )
                )
                console.log('Application status updated successfully')
            } else {
                setError(response.message || 'Failed to update status')
                console.error('Update failed:', response.message)
            }
        } catch (err) {
            setError(err.message || 'Error updating application status')
            console.error('Update error:', err)
        } finally {
            setUpdatingId(null)
        }
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

    return (
        <div className="employer-applications-container">
            {console.log('Render: loading=', loading, 'error=', error, 'apps=', applications.length, 'filtered=', filteredApplications.length)}
            {/* Header */}
            <div className="applications-header">
                <div className="header-content">
                    <h1>📥 Applications Received</h1>
                    <p>Review and manage applications from candidates</p>
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
                        placeholder="Search by job, company, or candidate name..."
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
                {loading && <div className="loading">Loading applications...</div>}

                {filteredApplications.length === 0 && !loading && (
                    <div className="no-applications">
                        <div className="empty-icon">📭</div>
                        <p>No applications found</p>
                    </div>
                )}

                {filteredApplications.map((application) => (
                    <div key={application._id} className={`application-card employer-card ${getStatusColor(application.status)}`}>
                        <div className="app-card-header">
                            <div className="app-title-section">
                                <h3>{application.jobId.title}</h3>
                                <p className="app-company">{application.jobId.company}</p>
                            </div>
                            <span className={`status-badge ${getStatusColor(application.status)}`}>
                                {getStatusLabel(application.status)}
                            </span>
                        </div>

                        <div className="candidate-info">
                            <h4>Candidate Information</h4>
                            <div className="candidate-details">
                                <p><strong>Name:</strong> {application.candidateId.name}</p>
                                <p><strong>Email:</strong> <a href={`mailto:${application.candidateId.email}`}>{application.candidateId.email}</a></p>
                            </div>
                        </div>

                        {application.coverLetter && (
                            <div className="cover-letter-section">
                                <label>Cover Letter:</label>
                                <p>{application.coverLetter}</p>
                            </div>
                        )}

                        <div className="app-details">
                            <div className="detail-item">
                                <FiClock size={16} />
                                <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="app-card-footer employer-footer">
                            {application.status === 'applied' ? (
                                <>
                                    <button
                                        onClick={() => handleStatusUpdate(application._id, 'shortlisted')}
                                        disabled={updatingId === application._id}
                                        className="btn-shortlist"
                                    >
                                        <FiCheck size={16} /> Shortlist
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(application._id, 'rejected')}
                                        disabled={updatingId === application._id}
                                        className="btn-reject"
                                    >
                                        <FiXIcon size={16} /> Reject
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="status-info">
                                        <p>Status: <strong>{getStatusLabel(application.status)}</strong></p>
                                    </div>
                                    {application.status === 'shortlisted' ? (
                                        <button
                                            onClick={() => handleStatusUpdate(application._id, 'rejected')}
                                            disabled={updatingId === application._id}
                                            className="btn-reject-small"
                                        >
                                            Change to Rejected
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleStatusUpdate(application._id, 'shortlisted')}
                                            disabled={updatingId === application._id}
                                            className="btn-shortlist-small"
                                        >
                                            Change to Shortlisted
                                        </button>
                                    )}
                                </>
                            )}
                            {updatingId === application._id && <span className="updating">Updating...</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
