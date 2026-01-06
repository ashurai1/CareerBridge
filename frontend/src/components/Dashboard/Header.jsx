import React, { useEffect, useState } from 'react'
import apiService from '../../services/api'

const Header = ({ toggleSidebar }) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await apiService.getProfile()
                if (userData.success) {
                    setUser(userData.data)
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error)
            }
        }
        fetchUser()
    }, [])

    // Get initials from name
    const getInitials = (name) => {
        if (!name) return 'U'
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <header className="dashboard-header">
            <div className="header-left">
                <button className="menu-toggle" onClick={toggleSidebar}>
                    <i className="fas fa-bars"></i>
                </button>
            </div>

            <div className="header-actions">
                <span className="role-badge">
                    {user?.role === 'employer' ? 'Employer View' : 'Candidate View'}
                </span>

                <button className="icon-btn">
                    <i className="fas fa-bell"></i>
                    <span className="notification-dot"></span>
                </button>

                <div className="user-profile">
                    <div className="avatar">{getInitials(user?.name)}</div>
                    <div className="user-info">
                        <span className="user-name">{user?.name || 'Loading...'}</span>
                        <span className="user-role">{user?.email || ''}</span>
                    </div>
                    <i className="fas fa-chevron-down" style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: '8px' }}></i>
                </div>
            </div>
        </header>
    )
}

export default Header
