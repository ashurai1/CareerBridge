import React, { useState, useEffect } from 'react'
import apiService from '../services/api'
import './Setting.css'

const Settings = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('profile')
    const [message, setMessage] = useState({ type: '', text: '' })

    // Profile Picture State
    const [profilePicture, setProfilePicture] = useState(null)
    const [profilePicturePreview, setProfilePicturePreview] = useState(null)

    // Settings State
    const [settings, setSettings] = useState({
        // Notifications
        emailNotifications: true,
        applicationUpdates: true,
        jobRecommendations: true,
        marketingEmails: false,
        pushNotifications: false,
        smsNotifications: false,

        // Privacy
        publicProfile: true,
        showEmail: false,
        showPhone: false,
        allowMessages: true,
        profileVisibility: 'public', // public, connections, private

        // Security
        twoFactorAuth: false,
        loginAlerts: true,

        // Preferences
        language: 'en',
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',

        // Data
        dataSharing: false,
        analytics: true
    })

    // Password Change State
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [showPasswordModal, setShowPasswordModal] = useState(false)

    // Delete Account State
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState('')

    useEffect(() => {
        fetchUserData()
        loadSettings()
    }, [])

    const fetchUserData = async () => {
        try {
            const response = await apiService.getProfile()
            if (response.success) {
                // API returns { success: true, data: { user } }
                setUser(response.data.user)
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to load profile' })
        } finally {
            setLoading(false)
        }
    }

    const loadSettings = () => {
        // Load settings from localStorage or API
        const savedSettings = localStorage.getItem('userSettings')
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings))
        }
    }

    const saveSettings = (newSettings) => {
        const updated = { ...settings, ...newSettings }
        setSettings(updated)
        localStorage.setItem('userSettings', JSON.stringify(updated))
        showMessage('success', 'Settings saved successfully!')
    }

    const handleToggle = (key) => {
        saveSettings({ [key]: !settings[key] })
    }

    const handleSelectChange = (key, value) => {
        saveSettings({ [key]: value })
    }

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showMessage('error', 'Image size should be less than 5MB')
                return
            }
            setProfilePicture(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfilePicturePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault()
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            showMessage('error', 'New passwords do not match')
            return
        }
        if (passwordForm.newPassword.length < 6) {
            showMessage('error', 'Password must be at least 6 characters')
            return
        }

        try {
            const response = await apiService.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            })
            if (response.success) {
                showMessage('success', 'Password changed successfully!')
                setShowPasswordModal(false)
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
            }
        } catch (error) {
            showMessage('error', error.message || 'Failed to change password')
        }
    }

    const handleDeleteAccount = async () => {
        if (deleteConfirm !== 'DELETE') {
            showMessage('error', 'Please type DELETE to confirm')
            return
        }

        try {
            // API call to delete account would go here
            showMessage('success', 'Account deletion requested. This action cannot be undone.')
            setShowDeleteModal(false)
        } catch (error) {
            showMessage('error', error.message || 'Failed to delete account')
        }
    }

    const showMessage = (type, text) => {
        setMessage({ type, text })
        setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    }

    if (loading) {
        return (
            <div className="settings-loading">
                <div className="spinner"></div>
                <p>Loading settings...</p>
            </div>
        )
    }

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Manage your account settings and preferences</p>
            </div>

            {message.text && (
                <div className={`settings-message ${message.type}`}>
                    <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                    {message.text}
                </div>
            )}

            <div className="settings-wrapper">
                {/* Sidebar Navigation */}
                <div className="settings-sidebar">
                    <button
                        className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <i className="fas fa-user"></i> Profile
                    </button>
                    <button
                        className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        <i className="fas fa-bell"></i> Notifications
                    </button>
                    <button
                        className={`settings-tab ${activeTab === 'privacy' ? 'active' : ''}`}
                        onClick={() => setActiveTab('privacy')}
                    >
                        <i className="fas fa-lock"></i> Privacy
                    </button>
                    <button
                        className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <i className="fas fa-shield-alt"></i> Security
                    </button>
                    <button
                        className={`settings-tab ${activeTab === 'preferences' ? 'active' : ''}`}
                        onClick={() => setActiveTab('preferences')}
                    >
                        <i className="fas fa-cog"></i> Preferences
                    </button>
                    <button
                        className={`settings-tab ${activeTab === 'connected' ? 'active' : ''}`}
                        onClick={() => setActiveTab('connected')}
                    >
                        <i className="fas fa-link"></i> Connected Accounts
                    </button>
                    <button
                        className={`settings-tab ${activeTab === 'data' ? 'active' : ''}`}
                        onClick={() => setActiveTab('data')}
                    >
                        <i className="fas fa-database"></i> Data & Privacy
                    </button>
                </div>

                {/* Settings Content */}
                <div className="settings-content">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="settings-section">
                            <h2><i className="fas fa-user"></i> Profile Information</h2>

                            <div className="profile-picture-section">
                                <div className="profile-picture-container">
                                    <div className="profile-picture-preview">
                                        {profilePicturePreview ? (
                                            <img src={profilePicturePreview} alt="Profile" />
                                        ) : (
                                            <div className="profile-picture-placeholder">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <label className="btn-outline btn-upload">
                                        <i className="fas fa-camera"></i> Upload Photo
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleProfilePictureChange}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                    <button className="btn-text" onClick={() => {
                                        setProfilePicture(null)
                                        setProfilePicturePreview(null)
                                    }}>
                                        Remove
                                    </button>
                                </div>
                                <div className="profile-info-display">
                                    <h3>{user?.name}</h3>
                                    <p>{user?.email}</p>
                                    <span className="role-badge">{user?.role === 'employer' ? 'Employer' : 'Candidate'}</span>
                                </div>
                            </div>

                            <div className="account-info-grid">
                                <div className="info-card">
                                    <i className="fas fa-calendar"></i>
                                    <div>
                                        <label>Member Since</label>
                                        <p>{new Date(user?.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}</p>
                                    </div>
                                </div>
                                <div className="info-card">
                                    <i className="fas fa-envelope"></i>
                                    <div>
                                        <label>Email Status</label>
                                        <p className="status-verified">
                                            <i className="fas fa-check-circle"></i> Verified
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="settings-section">
                            <h2><i className="fas fa-bell"></i> Notification Preferences</h2>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h3>Email Notifications</h3>
                                    <p>Receive notifications via email</p>
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
                                    <h3>Application Updates</h3>
                                    <p>Get notified when your application status changes</p>
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={settings.applicationUpdates}
                                        onChange={() => handleToggle('applicationUpdates')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h3>Job Recommendations</h3>
                                    <p>Receive personalized job recommendations</p>
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={settings.jobRecommendations}
                                        onChange={() => handleToggle('jobRecommendations')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h3>Marketing Emails</h3>
                                    <p>Receive updates about new features and promotions</p>
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={settings.marketingEmails}
                                        onChange={() => handleToggle('marketingEmails')}
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

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h3>SMS Notifications</h3>
                                    <p>Receive important updates via SMS</p>
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={settings.smsNotifications}
                                        onChange={() => handleToggle('smsNotifications')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Privacy Tab */}
                    {activeTab === 'privacy' && (
                        <div className="settings-section">
                            <h2><i className="fas fa-lock"></i> Privacy Settings</h2>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h3>Public Profile</h3>
                                    <p>Allow employers to find and view your profile</p>
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

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h3>Show Email Address</h3>
                                    <p>Display your email address on your public profile</p>
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={settings.showEmail}
                                        onChange={() => handleToggle('showEmail')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h3>Show Phone Number</h3>
                                    <p>Display your phone number on your public profile</p>
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={settings.showPhone}
                                        onChange={() => handleToggle('showPhone')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h3>Allow Messages</h3>
                                    <p>Allow employers to send you direct messages</p>
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={settings.allowMessages}
                                        onChange={() => handleToggle('allowMessages')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h3>Profile Visibility</h3>
                                    <p>Control who can see your profile</p>
                                </div>
                                <select
                                    className="settings-select"
                                    value={settings.profileVisibility}
                                    onChange={(e) => handleSelectChange('profileVisibility', e.target.value)}
                                >
                                    <option value="public">Public - Everyone</option>
                                    <option value="connections">Connections Only</option>
                                    <option value="private">Private - Only Me</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="settings-section">
                            <h2><i className="fas fa-shield-alt"></i> Security Settings</h2>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h3>Change Password</h3>
                                    <p>Update your password to keep your account secure</p>
                                </div>
                                <button className="btn-outline" onClick={() => setShowPasswordModal(true)}>
                                    Change Password
                                </button>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h3>Two-Factor Authentication</h3>
                                    <p>Add an extra layer of security to your account</p>
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={settings.twoFactorAuth}
                                        onChange={() => handleToggle('twoFactorAuth')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h3>Login Alerts</h3>
                                    <p>Get notified when someone logs into your account</p>
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={settings.loginAlerts}
                                        onChange={() => handleToggle('loginAlerts')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="security-info">
                                <h3><i className="fas fa-info-circle"></i> Active Sessions</h3>
                                <div className="session-item">
                                    <div>
                                        <p><strong>Current Session</strong></p>
                                        <p className="session-details">Windows • Chrome • {new Date().toLocaleString()}</p>
                                    </div>
                                    <span className="session-status active">Active</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === 'preferences' && (
                        <div className="settings-section">
                            <h2><i className="fas fa-cog"></i> Preferences</h2>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h3>Language</h3>
                                    <p>Select your preferred language</p>
                                </div>
                                <select
                                    className="settings-select"
                                    value={settings.language}
                                    onChange={(e) => handleSelectChange('language', e.target.value)}
                                >
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                    <option value="zh">Chinese</option>
                                </select>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h3>Timezone</h3>
                                    <p>Set your timezone for accurate timestamps</p>
                                </div>
                                <select
                                    className="settings-select"
                                    value={settings.timezone}
                                    onChange={(e) => handleSelectChange('timezone', e.target.value)}
                                >
                                    <option value="UTC">UTC</option>
                                    <option value="America/New_York">Eastern Time</option>
                                    <option value="America/Chicago">Central Time</option>
                                    <option value="America/Denver">Mountain Time</option>
                                    <option value="America/Los_Angeles">Pacific Time</option>
                                    <option value="Europe/London">London</option>
                                    <option value="Asia/Tokyo">Tokyo</option>
                                </select>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h3>Date Format</h3>
                                    <p>Choose how dates are displayed</p>
                                </div>
                                <select
                                    className="settings-select"
                                    value={settings.dateFormat}
                                    onChange={(e) => handleSelectChange('dateFormat', e.target.value)}
                                >
                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Connected Accounts Tab */}
                    {activeTab === 'connected' && (
                        <div className="settings-section">
                            <h2><i className="fas fa-link"></i> Connected Accounts</h2>
                            <p className="section-description">Manage your connected social accounts</p>

                            <div className="connected-account-item">
                                <div className="account-info">
                                    <i className="fab fa-google"></i>
                                    <div>
                                        <h3>Google</h3>
                                        <p>Not connected</p>
                                    </div>
                                </div>
                                <button className="btn-outline">Connect</button>
                            </div>

                            <div className="connected-account-item">
                                <div className="account-info">
                                    <i className="fab fa-github"></i>
                                    <div>
                                        <h3>GitHub</h3>
                                        <p>Not connected</p>
                                    </div>
                                </div>
                                <button className="btn-outline">Connect</button>
                            </div>

                            <div className="connected-account-item">
                                <div className="account-info">
                                    <i className="fab fa-linkedin"></i>
                                    <div>
                                        <h3>LinkedIn</h3>
                                        <p>Not connected</p>
                                    </div>
                                </div>
                                <button className="btn-outline">Connect</button>
                            </div>
                        </div>
                    )}

                    {/* Data & Privacy Tab */}
                    {activeTab === 'data' && (
                        <div className="settings-section">
                            <h2><i className="fas fa-database"></i> Data & Privacy</h2>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h3>Data Sharing</h3>
                                    <p>Allow us to use your data to improve our services</p>
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={settings.dataSharing}
                                        onChange={() => handleToggle('dataSharing')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h3>Analytics</h3>
                                    <p>Help us improve by sharing anonymous usage data</p>
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={settings.analytics}
                                        onChange={() => handleToggle('analytics')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="data-actions">
                                <button className="btn-outline">
                                    <i className="fas fa-download"></i> Download My Data
                                </button>
                                <p className="data-description">Request a copy of all your data</p>
                            </div>

                            <div className="danger-zone">
                                <h3><i className="fas fa-exclamation-triangle"></i> Danger Zone</h3>
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <h3 style={{ color: '#f87171' }}>Delete Account</h3>
                                        <p>Permanently delete your account and all associated data</p>
                                    </div>
                                    <button className="btn-danger" onClick={() => setShowDeleteModal(true)}>
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Change Password</h2>
                        <form onSubmit={handlePasswordChange}>
                            <div className="form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">Change Password</button>
                                <button type="button" className="btn-secondary" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-content modal-danger" onClick={(e) => e.stopPropagation()}>
                        <h2><i className="fas fa-exclamation-triangle"></i> Delete Account</h2>
                        <p>This action cannot be undone. This will permanently delete your account and all associated data.</p>
                        <div className="form-group">
                            <label>Type <strong>DELETE</strong> to confirm</label>
                            <input
                                type="text"
                                value={deleteConfirm}
                                onChange={(e) => setDeleteConfirm(e.target.value)}
                                placeholder="DELETE"
                            />
                        </div>
                        <div className="modal-actions">
                            <button className="btn-danger" onClick={handleDeleteAccount}>Delete Account</button>
                            <button className="btn-secondary" onClick={() => {
                                setShowDeleteModal(false)
                                setDeleteConfirm('')
                            }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Settings
