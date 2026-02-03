import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiService from '../../services/api'

const Header = ({ toggleSidebar }) => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [showProfileMenu, setShowProfileMenu] = useState(false)

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

    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        // Redirect to login
        navigate('/')
    }

    return (
        <header className="dashboard-header">
            <div className="header-left">
                <button className="menu-toggle" onClick={toggleSidebar}>
                    <i className="fas fa-bars"></i>
                </button>
            </div>

            <div className="header-actions">

                <button className="icon-btn" onClick={() => navigate('/dashboard/notifications')}>
                    <i className="fas fa-bell"></i>
                    <span className="notification-dot"></span>
                </button>

                <div className="user-profile" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                    <div className="avatar">{getInitials(user?.name)}</div>
                    <div className="user-info">
                        <span className="user-name">{user?.name || 'User'}</span>
                    </div>
                    <i className="fas fa-chevron-down" style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: '8px' }}></i>

                    {showProfileMenu && (
                        <div className="profile-dropdown-menu">
                            <a href="/dashboard/profile" className="dropdown-item">
                                <i className="fas fa-user"></i> Edit Profile
                            </a>
                            <a href="/dashboard/settings" className="dropdown-item">
                                <i className="fas fa-cog"></i> Settings
                            </a>
                            <div className="dropdown-divider"></div>
                            <button onClick={handleLogout} className="dropdown-item logout-btn">
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
