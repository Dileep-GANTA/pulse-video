import axios from 'axios';

// Use environment variable if available, otherwise fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'https://pulse-video-api.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;