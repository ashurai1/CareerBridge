import { useState } from 'react'
import SignInForm from './SignInForm'
import SignUpForm from './SignUpForm'
import TogglePanel from './TogglePanel'
import BridgeAnimation from './BridgeAnimation'

const AuthContainer = ({ onShowToast }) => {
    const [isActive, setIsActive] = useState(false)

    const handleToggle = () => {
        setIsActive(!isActive)
    }

    return (
        <div className={`container ${isActive ? 'active' : ''}`} id="container">
            <SignUpForm onShowToast={onShowToast} onToggle={handleToggle} />
            <SignInForm onShowToast={onShowToast} onToggle={handleToggle} />
            <BridgeAnimation />
            <TogglePanel onToggle={handleToggle} isActive={isActive} />
        </div>
    )
}

export default AuthContainer
