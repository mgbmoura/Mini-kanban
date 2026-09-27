import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((configuracao) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    configuracao.headers.Authorization = `Bearer ${token}`;
  }

  return configuracao;
});

export default api;
