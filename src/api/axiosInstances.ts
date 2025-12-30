import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from './config';
import { useAuthStore } from '../store/authStore';

// Instancia para la API de autenticación
export const authApi: AxiosInstance = axios.create({
  baseURL: API_CONFIG.AUTH_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Instancia para la API de acciones
export const actionsApi: AxiosInstance = axios.create({
  baseURL: API_CONFIG.ACTIONS_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de solicitud para agregar el token a la API de acciones
actionsApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Debug: mostrar que el token se está enviando
      console.log('Token enviado:', token.substring(0, 50) + '...');
    } else {
      console.warn('No hay token disponible para la solicitud');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar errores de autenticación
actionsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si hay error 401 o 400 (token inválido o expirado), limpiar sesión
    if (error.response?.status === 401 || error.response?.status === 400) {
      const token = useAuthStore.getState().token;
      // Solo hacer logout si hay un token (evitar loop)
      if (token) {
        console.log('Token inválido o expirado, cerrando sesión...');
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
