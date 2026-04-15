
import axios from 'axios';

/**
 * API: Configuração base do Axios.
 * Centraliza a URL base e os interceptors de Token.
 */
const api = axios.create({
    baseURL: '/api'
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
