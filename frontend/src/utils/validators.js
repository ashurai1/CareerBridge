// Validation functions for form inputs

export const validateName = (value) => {
    if (!value.trim()) return 'Name is required'
    if (value.trim().length < 2) return 'Name must be at least 2 characters'
    if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters'
    return null
}

export const validateEmail = (value) => {
    if (!value.trim()) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return 'Please enter a valid email address'
    return null
}

export const validatePassword = (value) => {
    if (!value) return 'Password is required'
    if (value.length < 6) return 'Password must be at least 6 characters'
    if (!/(?=.*[a-z])/.test(value)) return 'Password must contain a lowercase letter'
    if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain an uppercase letter'
    if (!/(?=.*\d)/.test(value)) return 'Password must contain a number'
    return null
}
