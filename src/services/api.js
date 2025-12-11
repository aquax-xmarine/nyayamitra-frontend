import axios from 'axios';
import API_URL from '../config/api';

const API_BASE_URL = `${API_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: async (email, password, name) => {
    const response = await api.post('/auth/signup', { email, password, name });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export const userAPI = {
  updateProfile: async (data) => {
    const response = await api.put('/user/profile', data);
    return response.data;
  },

  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await api.post('/user/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Add this new method
  updateDisplayName: async (displayName) => {
    const response = await api.put('/user/display-name', { displayName });
    return response.data;
  },
};

// Lawyer specific APIs
export const lawyerAPI = {
  // Get all provinces
  getProvinces: async () => {
    const response = await api.get('/lawyer/provinces');
    return response.data;
  },

  // Get districts by province ID
  getDistricts: async (provinceId) => {
    const response = await api.get(`/lawyer/districts/${provinceId}`);
    return response.data;
  },

  // Get all practice areas
  getPracticeAreas: async () => {
    const response = await api.get('/lawyer/practice-areas');
    return response.data;
  },

  // Get high court for a district
  getHighCourt: async (districtName) => {
    const response = await api.get(`/lawyer/high-court/${districtName}`);
    return response.data;
  },

  // Get logged-in lawyer's profile
  getProfile: async () => {
    const response = await api.get('/lawyer/profile');
    return response.data;
  },

  // Update lawyer profile
  updateProfile: async (data) => {
    const response = await api.put('/lawyer/profile', data);
    return response.data;
  },

  // Get lawyer profile by ID
  getProfileById: async (userId) => {
    const response = await api.get(`/lawyer/profile/${userId}`);
    return response.data;
  },

  // Search lawyers by district and/or practice area
  searchLawyers: async (filters) => {
    const params = new URLSearchParams();
    if (filters.district) params.append('district', filters.district);
    if (filters.practiceArea) params.append('practiceArea', filters.practiceArea);

    const response = await api.get(`/lawyer/search?${params.toString()}`);
    return response.data;
  }
};
// End of Lawyer specific APIs

export default api;