import axios from 'axios';

const API_BASE = 'http://localhost:5050/api';

const client = axios.create({ baseURL: API_BASE });

// Attach the JWT token to every request if we have one
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
