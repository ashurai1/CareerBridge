import React from 'react'

const FormHeader = ({ title, subtitle }) => {
    return (
        <div className="form-header">
            <div className="logo">
                {/* Bridge Logo SVG */}
                <svg width="32" height="32" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="512" height="512" rx="120" fill="transparent" />
                    <g transform="translate(56, 100) scale(0.8)">
                        <rect x="50" y="150" width="40" height="200" rx="4" fill="#FFFFFF" />
                        <rect x="410" y="150" width="40" height="200" rx="4" fill="#FFFFFF" />
                        <path d="M 70 160 Q 250 350, 430 160" fill="none" stroke="#FFFFFF" strokeWidth="30" strokeLinecap="round" />
                        <path d="M 20 280 L 480 280" fill="none" stroke="#FFFFFF" strokeWidth="40" strokeLinecap="round" />
                        <line x1="130" y1="280" x2="130" y2="200" stroke="#FFFFFF" strokeWidth="15" />
                        <line x1="190" y1="280" x2="190" y2="245" stroke="#FFFFFF" strokeWidth="15" />
                        <line x1="250" y1="280" x2="250" y2="260" stroke="#FFFFFF" strokeWidth="15" />
                        <line x1="310" y1="280" x2="310" y2="245" stroke="#FFFFFF" strokeWidth="15" />
                        <line x1="370" y1="280" x2="370" y2="200" stroke="#FFFFFF" strokeWidth="15" />
                    </g>
                </svg>
            </div>
            <h1>{title}</h1>
            <p className="subtitle">{subtitle}</p>
        </div>
    )
}

export default FormHeader
