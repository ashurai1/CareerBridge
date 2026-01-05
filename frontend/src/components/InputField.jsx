import { useState } from 'react'

const InputField = ({
    id,
    type,
    label,
    icon,
    value,
    onChange,
    error,
    showPasswordToggle = false
}) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    const inputType = showPasswordToggle && showPassword ? 'text' : type

    return (
        <div className={`input-group ${error ? 'error' : ''} ${value ? 'success' : ''}`}>
            <input
                type={inputType}
                id={id}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder=" "
                required
            />
            <label htmlFor={id}>{label}</label>
            <i className={`${icon} input-icon`}></i>

            {showPasswordToggle && (
                <button
                    type="button"
                    className="toggle-password"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
            )}

            {error && <span className="error-message">{error}</span>}
        </div>
    )
}

export default InputField
