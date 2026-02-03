import React from 'react'

const RoleSelector = ({ name, selectedRole, onChange }) => {
    return (
        <div className="role-selector">
            <div className="role-toggle">
                <input
                    type="radio"
                    name={name}
                    id={`${name}-candidate`}
                    value="candidate"
                    checked={selectedRole === 'candidate'}
                    onChange={(e) => onChange(e.target.value)}
                />
                <label htmlFor={`${name}-candidate`} className="role-option">
                    <i className="fas fa-user"></i>
                    <span>Candidate</span>
                </label>

                <input
                    type="radio"
                    name={name}
                    id={`${name}-employer`}
                    value="employer"
                    checked={selectedRole === 'employer'}
                    onChange={(e) => onChange(e.target.value)}
                />
                <label htmlFor={`${name}-employer`} className="role-option">
                    <i className="fas fa-building"></i>
                    <span>Employer</span>
                </label>

                <div className="role-slider"></div>
            </div>
        </div>
    )
}

export default RoleSelector
