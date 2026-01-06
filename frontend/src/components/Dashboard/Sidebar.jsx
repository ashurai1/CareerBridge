import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = ({ isOpen }) => {
    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <h2>CareerBridge</h2>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <i className="fas fa-home"></i>
                    <span>Overview</span>
                </NavLink>
                <NavLink to="/dashboard/profile" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <i className="fas fa-user"></i>
                    <span>Profile</span>
                </NavLink>
                <NavLink to="/dashboard/jobs" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <i className="fas fa-briefcase"></i>
                    <span>Jobs</span>
                </NavLink>
                <NavLink to="/dashboard/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <i className="fas fa-cog"></i>
                    <span>Settings</span>
                </NavLink>
            </nav>
        </aside>
    )
}

export default Sidebar
