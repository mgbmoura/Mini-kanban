import axios from 'axios';

// Usamos caminho relativo para que o Nginx trate o proxy internamente no Docker
// ou o Vite trate no ambiente local de desenvolvimento através do proxy configurado.
// Isso evita erros de CORS e redirecionamentos de autenticação em Workstations.
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
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
