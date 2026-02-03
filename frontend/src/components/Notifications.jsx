import { useState, useEffect } from 'react'
import apiService from '../services/api'
import { FiBell, FiX, FiCheck } from 'react-icons/fi'
import './Notifications.css'

export default function Notifications() {
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchNotifications()
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000)
        return () => clearInterval(interval)
    }, [])

    const fetchNotifications = async () => {
        try {
            const response = await apiService.getNotifications()
            if (response.success) {
                setNotifications(response.data || [])
                setUnreadCount(response.unreadCount || 0)
            }
        } catch (err) {
            setError('Failed to load notifications')
        }
    }

    const handleMarkAsRead = async (notificationId) => {
        try {
            await apiService.markNotificationAsRead(notificationId)
            fetchNotifications()
        } catch (err) {
            console.error('Error marking notification as read:', err)
        }
    }

    const handleMarkAllAsRead = async () => {
        try {
            await apiService.markAllNotificationsAsRead()
            fetchNotifications()
        } catch (err) {
            console.error('Error marking all as read:', err)
        }
    }

    const handleDelete = async (notificationId) => {
        try {
            await apiService.deleteNotification(notificationId)
            fetchNotifications()
        } catch (err) {
            console.error('Error deleting notification:', err)
        }
    }

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'application_received':
                return '📥'
            case 'application_shortlisted':
                return '⭐'
            case 'application_rejected':
                return '❌'
            case 'job_posted':
                return '📝'
            case 'application_applied':
                return '✅'
            default:
                return '🔔'
        }
    }

    return (
        <div className="notifications-container">
            <div className="notifications-header">
                <h2>
                    <FiBell className="bell-icon" /> Notifications
                </h2>
                {unreadCount > 0 && (
                    <div className="notification-badge">{unreadCount}</div>
                )}
            </div>

            {unreadCount > 0 && (
                <button onClick={handleMarkAllAsRead} className="btn-mark-all-read">
                    Mark all as read
                </button>
            )}

            <div className="notifications-list">
                {notifications.length === 0 ? (
                    <div className="no-notifications">
                        <FiBell size={48} />
                        <p>No notifications yet</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                        >
                            <div className="notification-icon">
                                {getNotificationIcon(notification.type)}
                            </div>

                            <div className="notification-content">
                                <h4>{notification.title}</h4>
                                <p>{notification.message}</p>
                                <span className="notification-time">
                                    {new Date(notification.createdAt).toLocaleDateString()}{' '}
                                    {new Date(notification.createdAt).toLocaleTimeString()}
                                </span>
                            </div>

                            <div className="notification-actions">
                                {!notification.isRead && (
                                    <button
                                        onClick={() => handleMarkAsRead(notification._id)}
                                        className="btn-read"
                                        title="Mark as read"
                                    >
                                        <FiCheck size={18} />
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(notification._id)}
                                    className="btn-delete"
                                    title="Delete"
                                >
                                    <FiX size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
