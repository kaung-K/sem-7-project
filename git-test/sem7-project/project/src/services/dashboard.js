// Dashboard API service
import { makeRequest } from './api';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

// Get dashboard data based on user role
export const getDashboardData = async () => {
    const token = localStorage.getItem('token');
    return makeRequest('/private/dashboard', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
};

// Get creator stats
export const getCreatorStats = async () => {
    const token = localStorage.getItem('token');
    return makeRequest('/private/subscriber', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
};

// Get posts for creator dashboard
export const getCreatorPosts = async () => {
    const token = localStorage.getItem('token');
    return makeRequest('/private/post', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
};

// Get subscriptions for reader dashboard
export const getSubscriptions = async () => {
    const token = localStorage.getItem('token');
    return makeRequest('/private/creator/subscribed', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
};

export const getAdminDashboard = async() => {
    const token = localStorage.getItem('token');
    console.log(token);
    
    return makeRequest(`/private/admin/dashboard`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
};

export const getStripeDashboardLink = async () => {
  const token = localStorage.getItem('token');
  return makeRequest('/private/stripe/dashboard', {   // 👈 fixed path
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get all creators (for admin)
export const getAllCreators = async () => {
    return makeRequest('/public/creator/all', {
        method: 'GET',
    });
};

// Get all users + creators (admin only)
export const getAllUsers = async () => {
  const token = localStorage.getItem('token');
  return makeRequest('/private/admin/users', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

// Get all users (admin only)
// export const getAllUsers = async () => {
//     const token = localStorage.getItem('token');
//     return axios.get(`${API_BASE_URL}/admin/users`, {
//         headers: {
//             'Authorization': `Bearer ${token}`,
//         },
//     });
// };

// Admin login
export const adminLogin = async (credentials) => {
    return makeRequest('/auth/admin-login', {
        method: 'POST',
        data: credentials,
    });
};

// Get platform stats (admin)
export const getPlatformStats = async () => {
    const token = localStorage.getItem('token');
    return makeRequest('/admin/stats', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
};

// Get notifications count
export const getNotificationCount = async () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}/notifications/unread/count`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
};
