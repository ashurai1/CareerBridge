import React from 'react'

const SocialLogin = ({ onSocialLogin }) => {
    const handleSocialClick = (e, platform) => {
        e.preventDefault()
        onSocialLogin(platform)
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
                    <i className="fa-brands fa-google"></i>
                </a>
                <a
                    href="#"
                    className="icon"
                    aria-label="Login with LinkedIn"
                    onClick={(e) => handleSocialClick(e, 'LinkedIn')}
                >
                    <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <a
                    href="#"
                    className="icon"
                    aria-label="Login with GitHub"
                    onClick={(e) => handleSocialClick(e, 'GitHub')}
                >
                    <i className="fa-brands fa-github"></i>
                </a>
            </div>

            <div className="divider">
                <span>or use your email</span>
            </div>
        </>
    )
}

export default SocialLogin
