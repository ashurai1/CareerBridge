import React from 'react'

const TogglePanel = ({ onToggle, isActive }) => {
    return (
        <div className="toggle-container">
            <div className="toggle">
                <div className="toggle-panel toggle-left">
                    <div className="panel-content">
                        <h1>Already have an account?</h1>
                        <p>Sign in to access your dashboard and continue building your career</p>
                        <button className="btn-ghost" onClick={onToggle}>
                            <span>Sign In</span>
                            <i className="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
                <div className="toggle-panel toggle-right">
                    <div className="panel-content">
                        <h1>New to CareerBridge?</h1>
                        <p>Create an account and discover thousands of opportunities waiting for you</p>
                        <button className="btn-ghost" onClick={onToggle}>
                            <span>Sign Up</span>
                            <i className="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TogglePanel
