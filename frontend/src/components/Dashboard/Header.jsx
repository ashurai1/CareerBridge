import React from 'react'

const Header = ({ toggleSidebar }) => {
    return (
        <header className="dashboard-header">
            <div className="header-left">
                <button className="menu-toggle" onClick={toggleSidebar}>
                    <i className="fas fa-bars"></i>
                </button>
            </div>

            <div className="header-actions">
                <span className="role-badge">Candidate View</span>

                <button className="icon-btn">
                    <i className="fas fa-bell"></i>
                    <span className="notification-dot"></span>
                </button>

                <div className="user-profile">
                    <div className="avatar">JD</div>
                    <div className="user-info">
                        <span className="user-name">John Doe</span>
                        <span className="user-role">Frontend Dev</span>
                    </div>
                    <i className="fas fa-chevron-down" style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: '8px' }}></i>
                </div>
            </div>
        </header>
    )
}

export default Header
