import React from 'react'
import { FaGoogle, FaGithub, FaLinkedinIn } from 'react-icons/fa'

const SocialLogin = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

    const handleSocialClick = (e, platform) => {
        e.preventDefault()
        window.location.href = `${API_URL}/auth/${platform.toLowerCase()}`
    }

    return (
        <>
            <div className="social-icons">
                <a
                    href="#"
                    className="icon"
                    aria-label="Login with Google"
                    onClick={(e) => handleSocialClick(e, 'Google')}
                >
                    <FaGoogle />
                </a>

                <a
                    href="#"
                    className="icon"
                    aria-label="Login with LinkedIn"
                    onClick={(e) => handleSocialClick(e, 'LinkedIn')}
                >
                    <FaLinkedinIn />
                </a>
                <a
                    href="#"
                    className="icon"
                    aria-label="Login with GitHub"
                    onClick={(e) => handleSocialClick(e, 'GitHub')}
                >
                    <FaGithub />
                </a>
            </div>

            <div className="divider">
                <span>or use your email</span>
            </div>
        </>
    )
}

export default SocialLogin
