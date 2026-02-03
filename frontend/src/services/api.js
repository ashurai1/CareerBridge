// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// API Service
class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Set auth token
    setToken(token) {
        localStorage.setItem('token', token);
    }

    // Remove auth token
    removeToken() {
        localStorage.removeItem('token');
    }

    // Get auth headers
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };

        // Always read token from localStorage to ensure we have the latest token
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    async signup(userData) {
        const data = await this.request('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData),
        });

        if (data.success && data.data.token) {
            this.setToken(data.data.token);
        }

        return data;
    }

    async login(credentials) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        if (data.success && data.data.token) {
            this.setToken(data.data.token);
        }

        return data;
    }

    async getProfile() {
        return await this.request('/auth/me', {
            method: 'GET',
        });
    }

    async updateProfile(profileData) {
        return await this.request('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    }

    async changePassword(passwordData) {
        return await this.request('/auth/change-password', {
            method: 'PUT',
            body: JSON.stringify(passwordData),
        });
    }

    // Job endpoints
    async getAllJobs(filters = {}) {
        const params = new URLSearchParams(filters);
        return await this.request(`/jobs?${params}`, {
            method: 'GET',
        });
    }

    async getJobById(jobId) {
        return await this.request(`/jobs/${jobId}`, {
            method: 'GET',
        });
    }

    async createJob(jobData) {
        return await this.request('/jobs', {
            method: 'POST',
            body: JSON.stringify(jobData),
        });
    }

    async updateJob(jobId, jobData) {
        return await this.request(`/jobs/${jobId}`, {
            method: 'PUT',
            body: JSON.stringify(jobData),
        });
    }

    async deleteJob(jobId) {
        return await this.request(`/jobs/${jobId}`, {
            method: 'DELETE',
        });
    }

    async getMyJobs() {
        return await this.request('/jobs/employer/my-jobs', {
            method: 'GET',
        });
    }

    async closeJob(jobId) {
        return await this.request(`/jobs/${jobId}/close`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'closed' }),
        });
    }

    async getJobApplications(jobId) {
        return await this.request(`/jobs/${jobId}/applications`, {
            method: 'GET',
        });
    }

    // Application endpoints
    async applyForJob(jobId, coverLetter = '') {
        return await this.request('/applications', {
            method: 'POST',
            body: JSON.stringify({ jobId, coverLetter }),
        });
    }

    async getCandidateApplications() {
        return await this.request('/applications/candidate/my-applications', {
            method: 'GET',
        });
    }

    async getEmployerApplications() {
        return await this.request('/applications/employer/all', {
            method: 'GET',
        });
    }

    async getApplicationById(appId) {
        return await this.request(`/applications/${appId}`, {
            method: 'GET',
        });
    }

    async updateApplicationStatus(appId, status) {
        return await this.request(`/applications/${appId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    async deleteApplication(appId) {
        return await this.request(`/applications/${appId}`, {
            method: 'DELETE',
        });
    }

    async getApplicationStatistics() {
        return await this.request('/applications/employer/statistics', {
            method: 'GET',
        });
    }

    // Notification endpoints
    async getNotifications() {
        return await this.request('/notifications', {
            method: 'GET',
        });
    }

    async markNotificationAsRead(notificationId) {
        return await this.request(`/notifications/${notificationId}/read`, {
            method: 'PUT',
        });
    }

    async markAllNotificationsAsRead() {
        return await this.request('/notifications/mark-all-read', {
            method: 'PUT',
        });
    }

    async deleteNotification(notificationId) {
        return await this.request(`/notifications/${notificationId}`, {
            method: 'DELETE',
        });
    }

    logout() {
        this.removeToken();
    }
}

export default new ApiService();
