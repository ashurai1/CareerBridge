import React, { useState } from 'react'
import './Profile.css'

const Profile = () => {
    const [user, setUser] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Candidate',
        bio: 'Passionate frontend developer with 3 years of experience.',
        skills: ['React', 'JavaScript', 'CSS', 'Node.js']
    })

    const [isEditing, setIsEditing] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setUser(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsEditing(false)
        // TODO: API call to update profile
        console.log('Profile updated:', user)
    }

    return (
        <div className="dashboard-page">
            <div className="profile-container">
                <div className="profile-header-card">
                    <div className="profile-avatar-large">
                        <i className="fas fa-user"></i>
                    </div>
                    <div className="profile-info-large">
                        <h2>{user.name}</h2>
                        <span className="role-badge">{user.role}</span>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <button
                            className={`btn-primary-sm ${isEditing ? 'btn-danger' : ''}`}
                            onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                        >
                            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                        </button>
                    </div>
                </div>

                <div className="profile-form-section">
                    <form className="profile-form" onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    value={user.name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    value={user.email}
                                    onChange={handleChange}
                                    disabled={true}
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>Bio</label>
                                <textarea
                                    name="bio"
                                    className="form-textarea"
                                    value={user.bio}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    rows="4"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>Skills (Comma separated)</label>
                                <input
                                    type="text"
                                    name="skills"
                                    className="form-input"
                                    value={user.skills.join(', ')}
                                    onChange={(e) => setUser({ ...user, skills: e.target.value.split(',').map(s => s.trim()) })}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <div className="form-actions" style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="submit" className="btn-primary-sm">Save Changes</button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Profile
