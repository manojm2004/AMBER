import axios from 'axios';

// Connect to production on Render if built; else connect to local server
const API_URL = import.meta.env.PROD 
  ? 'https://amber-backend-agk2.onrender.com' 
  : 'http://localhost:8000';
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('amber_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = (username, password) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  return api.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
};

export const registerUser = (username, email, password) => {
  return api.post('/auth/register', { username, email, password });
};

export const getUserMe = () => {
  return api.get('/auth/me');
};

export const getHistory = () => {
  return api.get('/api/predictions/history');
};

export const getStats = () => {
  return api.get('/api/predictions/stats');
};

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/api/predictions/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const scanLiveCapture = () => {
  return api.get('/api/predictions/live_scan');
};

export const deleteHistory = (id) => {
  return api.delete(`/api/predictions/history/${id}`);
};

export default api;
