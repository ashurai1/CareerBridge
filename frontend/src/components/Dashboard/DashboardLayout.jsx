import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import './Dashboard.css'

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <div className="dashboard-container">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="dashboard-main">
                <Header toggleSidebar={toggleSidebar} />
                <div className="dashboard-content">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout
