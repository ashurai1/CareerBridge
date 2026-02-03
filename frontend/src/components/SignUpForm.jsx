import { useState } from 'react'
import FormHeader from './FormHeader'
import RoleSelector from './RoleSelector'
import SocialLogin from './SocialLogin'
import InputField from './InputField'
import { validateName, validateEmail, validatePassword } from '../utils/validators'

const SignUpForm = ({ onShowToast, onToggle }) => {
    const [formData, setFormData] = useState({
        name: '',
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

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        const newErrors = {}

        const nameError = validateName(formData.name)
        if (nameError) newErrors.name = nameError

        const emailError = validateEmail(formData.email)
        if (emailError) newErrors.email = emailError

        const passwordError = validatePassword(formData.password)
        if (passwordError) newErrors.password = passwordError

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        // API call
        setIsLoading(true)
        try {
            const apiService = (await import('../services/api.js')).default
            const response = await apiService.signup(formData)

            setIsLoading(false)
            onShowToast(`Account created successfully as ${formData.role}!`)
            console.log('Sign Up Success:', response.data)

            // Reset form
            setTimeout(() => {
                setFormData({ name: '', email: '', password: '', role: 'candidate' })
                // Redirect to dashboard or home page
                // window.location.href = '/dashboard'
            }, 1500)
        } catch (error) {
            setIsLoading(false)
            onShowToast(error.message || 'Signup failed. Please try again.')
            console.error('Sign Up Error:', error)
        }
    }

    return (
        <div className="form-container sign-up">
            <form id="signupForm" onSubmit={handleSubmit} noValidate>
                <FormHeader
                    title="Join CareerBridge"
                    subtitle="Start your career journey today"
                />

                <RoleSelector
                    name="signup-role"
                    selectedRole={formData.role}
                    onChange={(value) => handleChange('role', value)}
                />

                <SocialLogin onSocialLogin={handleSocialLogin} />

                <InputField
                    id="signup-name"
                    type="text"
                    label="Full Name"
                    icon="fas fa-user"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    error={errors.name}
                />

                <InputField
                    id="signup-email"
                    type="email"
                    label="Email Address"
                    icon="fas fa-envelope"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={errors.email}
                />

                <InputField
                    id="signup-password"
                    type="password"
                    label="Password"
                    icon="fas fa-lock"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    error={errors.password}
                    showPasswordToggle={true}
                />

                <button type="submit" className={`btn-primary ${isLoading ? 'loading' : ''}`}>
                    <span>Create Account</span>
                    <i className="fas fa-arrow-right"></i>
                </button>

                <div className="mobile-toggle-text">
                    Already have an account? <button type="button" className="btn-link" onClick={onToggle}>Sign In</button>
                </div>
            </form>
        </div>
    )
}

export default SignUpForm
