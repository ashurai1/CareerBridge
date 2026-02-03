import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import apiService from '../../services/api'

const Sidebar = ({ isOpen }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUserProfile()
    }, [])

    const fetchUserProfile = async () => {
        try {
            const response = await apiService.getProfile()
            if (response.success) {
                setUser(response.data.user)
            }
        } catch (err) {
            console.error('Error fetching profile:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <h2>CareerBridge</h2>
            </div>
            <nav className="sidebar-nav">
                <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                >
                    <i className="fas fa-home"></i>
                    <span>Overview</span>
                </NavLink>

                <NavLink
                    to="/dashboard/notifications"
                    className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                >
                    <i className="fas fa-bell"></i>
                    <span>Notifications</span>
                </NavLink>

                <NavLink
                    to="/dashboard/profile"
                    className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                >
                    <i className="fas fa-user"></i>
                    <span>Profile</span>
                </NavLink>

                <NavLink
                    to="/dashboard/jobs"
                    className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                >
                    <i className="fas fa-briefcase"></i>
                    <span>Browse Jobs</span>
                </NavLink>

                {!loading && user && user.role === 'candidate' && (
                    <NavLink
                        to="/my-applications"
                        className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                    >
                        <i className="fas fa-clipboard-list"></i>
                        <span>My Applications</span>
                    </NavLink>
                )}

                {!loading && user && user.role === 'employer' && (
                    <>
                        <NavLink
                            to="/dashboard/job-management"
                            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                        >
                            <i className="fas fa-pencil-alt"></i>
                            <span>Manage Jobs</span>
                        </NavLink>
                        <NavLink
                            to="/dashboard/applications"
                            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                        >
                            <i className="fas fa-inbox"></i>
                            <span>Applications</span>
                        </NavLink>
                    </>
                )}

                <NavLink
                    to="/dashboard/settings"
                    className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                >
                    <i className="fas fa-cog"></i>
                    <span>Settings</span>
                </NavLink>
            </nav>
        </aside>
    )
}

export default Sidebar
