import axios from 'axios';

// Usa variable de entorno en producción, localhost en desarrollo
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
});

export default api;