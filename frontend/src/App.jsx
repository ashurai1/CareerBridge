import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import AnimatedBackground from './components/AnimatedBackground'
import AuthContainer from './components/AuthContainer'
import Toast from './components/Toast'
import DashboardLayout from './components/Dashboard/DashboardLayout'
import DashboardHome from './pages/DashboardHome'
import Profile from './pages/Profile'
import Jobs from './pages/Jobs'
import Settings from './pages/Settings'
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
                    <Route path="jobs" element={<Jobs />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Routes>
            <Toast message={toastMessage} show={showToast} />
        </>
    )
}

export default App
