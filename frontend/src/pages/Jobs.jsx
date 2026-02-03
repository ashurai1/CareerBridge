import React from 'react'
import './Jobs.css'

const Jobs = () => {
    // Mock data
    const jobs = [
        {
            id: 1,
            title: 'Senior Frontend Developer',
            company: 'TechCorp',
            location: 'Remote',
            status: 'Interviewing',
            dateApplied: '2024-01-15',
            logo: 'TC'
        },
        {
            id: 2,
            title: 'Full Stack Engineer',
            company: 'StartupX',
            location: 'New York, NY',
            status: 'Applied',
            dateApplied: '2024-01-20',
            logo: 'SX'
        },
        {
            id: 3,
            title: 'React Native Developer',
            company: 'MobileFirst',
            location: 'San Francisco, CA',
            status: 'Rejected',
            dateApplied: '2024-01-10',
            logo: 'MF'
        }
    ]

    const getStatusColor = (status) => {
        switch (status) {
            case 'Interviewing': return 'status-interview';
            case 'Applied': return 'status-applied';
            case 'Rejected': return 'status-rejected';
            default: return '';
        }
    }

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1 className="page-title">My Applications</h1>
                <button className="btn-primary-sm">Find More Jobs</button>
            </div>

            <div className="jobs-list">
                {jobs.map(job => (
                    <div key={job.id} className="job-card">
                        <div className="job-header">
                            <div className="job-logo">{job.logo}</div>
                            <span className={`job-status-badge ${getStatusColor(job.status)}`}>
                                {job.status}
                            </span>
                        </div>

                        <div className="job-info">
                            <h3>{job.title}</h3>
                            <p className="company-name">
                                <i className="fas fa-building"></i> {job.company}
                            </p>
                        </div>

                        <div className="job-meta">
                            <div className="meta-item">
                                <i className="fas fa-map-marker-alt"></i>
                                {job.location}
                            </div>
                            <div className="meta-item">
                                <i className="fas fa-clock"></i>
                                {job.dateApplied}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Jobs
