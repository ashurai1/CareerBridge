import { useState } from 'react'
import AnimatedBackground from './components/AnimatedBackground'
import AuthContainer from './components/AuthContainer'
import Toast from './components/Toast'
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
            <AuthContainer onShowToast={handleShowToast} />
            <Toast message={toastMessage} show={showToast} />
        </>
    )
}

export default App
