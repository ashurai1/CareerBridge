import { useState } from 'react'
import FormHeader from './FormHeader'
import RoleSelector from './RoleSelector'
import SocialLogin from './SocialLogin'
import InputField from './InputField'
import { validateEmail } from '../utils/validators'

const SignInForm = ({ onShowToast, onToggle }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'candidate'
    })
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleSocialLogin = (platform) => {
        onShowToast(`${platform} login coming soon!`)
    }

    const handleForgotPassword = (e) => {
        e.preventDefault()
        onShowToast('Password reset link will be sent to your email')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        const newErrors = {}

        const emailError = validateEmail(formData.email)
        if (emailError) newErrors.email = emailError

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        // API call
        setIsLoading(true)
        try {
            const apiService = (await import('../services/api.js')).default
            const response = await apiService.login({
                email: formData.email,
                password: formData.password
            })

            setIsLoading(false)
            onShowToast(`Welcome back, ${formData.role}!`)
            console.log('Sign In Success:', response.data)

            // Reset form
            setTimeout(() => {
                setFormData({ email: '', password: '', role: 'candidate' })
                // Redirect to dashboard
                // window.location.href = '/dashboard'
            }, 1500)
        } catch (error) {
            setIsLoading(false)
            onShowToast(error.message || 'Login failed. Please check your credentials.')
            console.error('Sign In Error:', error)
        }
    }

    return (
        <div className="form-container sign-in">
            <form id="signinForm" onSubmit={handleSubmit} noValidate>
                <FormHeader
                    title="CareerBridge"
                    subtitle="Sign in to continue your journey"
                />

                <RoleSelector
                    name="signin-role"
                    selectedRole={formData.role}
                    onChange={(value) => handleChange('role', value)}
                />

                <SocialLogin onSocialLogin={handleSocialLogin} />

                <InputField
                    id="signin-email"
                    type="email"
                    label="Email Address"
                    icon="fas fa-envelope"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={errors.email}
                />

                <InputField
                    id="signin-password"
                    type="password"
                    label="Password"
                    icon="fas fa-lock"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    error={errors.password}
                    showPasswordToggle={true}
                />

                <a href="#" className="forgot-password" onClick={handleForgotPassword}>
                    Forgot your password?
                </a>

                <button type="submit" className={`btn-primary ${isLoading ? 'loading' : ''}`}>
                    <span>Sign In</span>
                    <i className="fas fa-arrow-right"></i>
                </button>

                <div className="mobile-toggle-text">
                    Don't have an account? <button type="button" className="btn-link" onClick={onToggle}>Sign Up</button>
                </div>
            </form>
        </div>
    )
}

export default SignInForm
