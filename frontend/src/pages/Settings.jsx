import React, { useState } from 'react'
import './Setting.css'

const Settings = () => {
    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: false,
        publicProfile: true,
        theme: 'light'
    })

    const handleToggle = (key) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
            </div>

            <div className="settings-container">
                <div className="settings-section">
                    <h2>
                        <i className="fas fa-bell"></i> Notifications
                    </h2>
                    <div className="setting-item">
                        <div className="setting-info">
                            <h3>Email Notifications</h3>
                            <p>Receive updates about your job applications via email</p>
                        </div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={settings.emailNotifications}
                                onChange={() => handleToggle('emailNotifications')}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h3>Push Notifications</h3>
                            <p>Receive instant notifications on your device</p>
                        </div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={settings.pushNotifications}
                                onChange={() => handleToggle('pushNotifications')}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>
                        <i className="fas fa-lock"></i> Privacy
                    </h2>
                    <div className="setting-item">
                        <div className="setting-info">
                            <h3>Public Profile</h3>
                            <p>Allow employers to find your profile</p>
                        </div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={settings.publicProfile}
                                onChange={() => handleToggle('publicProfile')}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>
                        <i className="fas fa-user-cog"></i> Account
                    </h2>
                    <div className="setting-item">
                        <div className="setting-info">
                            <h3>Change Password</h3>
                            <p>Update your password securely</p>
                        </div>
                        <button className="btn-outline">Update</button>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h3 style={{ color: '#f87171' }}>Delete Account</h3>
                            <p>Permanently delete your account and all data</p>
                        </div>
                        <button className="btn-danger">Delete Account</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings
