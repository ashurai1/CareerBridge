import React, { useEffect, useState } from 'react'

const DashboardHome = () => {
    const [stats, setStats] = useState({
        jobsApplied: 0,
        profileViews: 0,
        interviewsScheduled: 0
    })

    useEffect(() => {
        // Mock data fetch - replace with actual API call later
        setStats({
            jobsApplied: 12,
            profileViews: 45,
            interviewsScheduled: 3
        })
    }, [])

    return (
        <div className="dashboard-home">
            <div className="welcome-section">
                <h1 className="page-title">Dashboard Overview</h1>
                <p className="page-subtitle">Welcome back! Here's what's happening with your job search.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-content">
                        <div className="stat-header">
                            <h3>Jobs Applied</h3>
                            <div className="stat-icon applied">
                                <i className="fas fa-paper-plane"></i>
                            </div>
                        </div>
                        <p className="stat-value">{stats.jobsApplied}</p>
                        <p className="stat-trend positive">
                            <i className="fas fa-arrow-up"></i> 12% from last week
                        </p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-content">
                        <div className="stat-header">
                            <h3>Profile Views</h3>
                            <div className="stat-icon views">
                                <i className="fas fa-eye"></i>
                            </div>
                        </div>
                        <p className="stat-value">{stats.profileViews}</p>
                        <p className="stat-trend positive">
                            <i className="fas fa-arrow-up"></i> 5% from last week
                        </p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-content">
                        <div className="stat-header">
                            <h3>Interviews</h3>
                            <div className="stat-icon interviews">
                                <i className="fas fa-calendar-check"></i>
                            </div>
                        </div>
                        <p className="stat-value">{stats.interviewsScheduled}</p>
                        <p className="stat-trend neutral">
                            <i className="fas fa-minus"></i> Same as last week
                        </p>
                    </div>
                </div>
            </div>

            <div className="content-grid">
                <div className="recent-activity">
                    <div className="section-header">
                        <h2>Recent Activity</h2>
                        <button className="btn-link">View All</button>
                    </div>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-icon-wrapper">
                                <div className="activity-icon success">
                                    <i className="fas fa-check"></i>
                                </div>
                                <div className="connector"></div>
                            </div>
                            <div className="activity-details">
                                <h4>Applied to Frontend Developer</h4>
                                <p className="activity-meta">TechCorp • Remote</p>
                                <span className="activity-time">2 hours ago</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon-wrapper">
                                <div className="activity-icon info">
                                    <i className="fas fa-user-edit"></i>
                                </div>
                                <div className="connector"></div>
                            </div>
                            <div className="activity-details">
                                <h4>Updated Profile Skills</h4>
                                <p className="activity-meta">Added React, Node.js</p>
                                <span className="activity-time">1 day ago</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon-wrapper">
                                <div className="activity-icon warning">
                                    <i className="fas fa-envelope"></i>
                                </div>
                            </div>
                            <div className="activity-details">
                                <h4>New Message from Recruiter</h4>
                                <p className="activity-meta">Sarah from StartupX</p>
                                <span className="activity-time">2 days ago</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="upcoming-events">
                    <div className="section-header">
                        <h2>Upcoming Interviews</h2>
                    </div>
                    <div className="empty-state">
                        <div className="empty-icon">
                            <i className="fas fa-calendar-alt"></i>
                        </div>
                        <p>No interviews scheduled for today.</p>
                        <button className="btn-primary-sm">Schedule Now</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardHome
