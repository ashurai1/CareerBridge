import React from 'react'

const Toast = ({ message, show }) => {
    return (
        <div className={`toast ${show ? 'show' : ''}`} id="toast">
            <i className="fas fa-check-circle"></i>
            <span className="toast-message">{message}</span>
        </div>
    )
}

export default Toast
