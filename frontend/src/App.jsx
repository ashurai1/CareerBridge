import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import AnimatedBackground from './components/AnimatedBackground'
import AuthContainer from './components/AuthContainer'
import Toast from './components/Toast'
import DashboardLayout from './components/Dashboard/DashboardLayout'
import DashboardHome from './pages/DashboardHome'
import Profile from './pages/Profile'
import JobsNew from './pages/JobsNew'
import JobDetail from './pages/JobDetail'
import MyApplications from './pages/MyApplications'
import EmployerApplications from './pages/EmployerApplications'
import JobManagement from './components/JobManagement'
import Settings from './pages/Settings'
import Notifications from './components/Notifications'
import OAuthSuccess from './pages/OAuthSuccess'
import './App.css'

function App() {
    const [toastMessage, setToastMessage] = useState('')
    const [showToast, setShowToast] = useState(false)

    const handleShowToast = (message) => {
        setToastMessage(message)
        setShowToast(true)
        setTimeout(() => {
            setShowToast(false)
        }, 3000)
    }

    return (
        <>
            <AnimatedBackground />
            <Routes>
                <Route path="/" element={<AuthContainer onShowToast={handleShowToast} />} />
                <Route path="/oauth-success" element={<OAuthSuccess />} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<DashboardHome />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="jobs" element={<JobsNew />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="job-management" element={<JobManagement />} />
                    <Route path="applications" element={<EmployerApplications />} />
                    <Route path="applications/:jobId" element={<EmployerApplications />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="/job/:jobId" element={<DashboardLayout />}>
                    <Route index element={<JobDetail />} />
                </Route>
                <Route path="/my-applications" element={<DashboardLayout />}>
                    <Route index element={<MyApplications />} />
                </Route>
            </Routes>
            <Toast message={toastMessage} show={showToast} />
        </>
    )
}

export default App
