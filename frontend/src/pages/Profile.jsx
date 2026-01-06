import React, { useState, useEffect } from 'react'
import apiService from '../services/api'
import './Profile.css'

const Profile = () => {
    const [user, setUser] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    })
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })

    useEffect(() => {
        fetchUserData()
    }, [])

    const fetchUserData = async () => {
        try {
            const response = await apiService.getProfile()
            if (response.success) {
                setUser(response.data)
                setFormData({
                    name: response.data.name,
                    email: response.data.email,
                })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to load profile' })
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await apiService.updateProfile(formData)
            if (response.success) {
                setUser(response.data)
                setIsEditing(false)
                setMessage({ type: 'success', text: 'Profile updated successfully!' })
                setTimeout(() => setMessage({ type: '', text: '' }), 3000)
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to update profile' })
        }
    }

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="spinner"></div>
                <p>Loading profile...</p>
            </div>
        )
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1 className="page-title">My Profile</h1>
                <p className="page-subtitle">Manage your account information</p>
            </div>

            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="profile-content">
                <div className="profile-card">
                    <div className="profile-avatar-section">
                        <div className="profile-avatar-large">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="profile-info">
                            <h2>{user?.name}</h2>
                            <p className="profile-role">{user?.role === 'employer' ? 'Employer' : 'Candidate'}</p>
                        </div>
                    </div>

                    <div className="profile-form-section">
                        {!isEditing ? (
                            <div className="profile-details">
                                <div className="detail-group">
                                    <label>Full Name</label>
                                    <p>{user?.name}</p>
                                </div>
                                <div className="detail-group">
                                    <label>Email Address</label>
                                    <p>{user?.email}</p>
                                </div>
                                <div className="detail-group">
                                    <label>Account Type</label>
                                    <p className="role-badge-profile">
                                        {user?.role === 'employer' ? 'Employer Account' : 'Candidate Account'}
                                    </p>
                                </div>
                                <div className="detail-group">
                                    <label>Member Since</label>
                                    <p>{new Date(user?.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</p>
                                </div>

                                <button
                                    className="btn-primary"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <i className="fas fa-edit"></i> Edit Profile
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="profile-edit-form">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn-primary">
                                        <i className="fas fa-save"></i> Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => {
                                            setIsEditing(false)
                                            setFormData({
                                                name: user.name,
                                                email: user.email,
                                            })
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
