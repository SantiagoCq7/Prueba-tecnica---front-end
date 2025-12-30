import { authApi } from './axiosInstances';
import { ENDPOINTS } from './config';
import { LoginRequest } from '../types/auth';

// Este servicio se encarga de todo lo que tiene que ver con la autenticación
export const authService = {
  // Función para iniciar sesión
  // Recibe las credenciales (usuario y contraseña) y devuelve el token
  login: async (credentials: LoginRequest): Promise<string> => {
    // Hacemos la petición POST al endpoint de login
    // El backend nos devuelve el token JWT directamente como un string
    const response = await authApi.post<string>(ENDPOINTS.LOGIN, credentials);
    
    // Devolvemos solo la data que es el token
    return response.data;
  },
};
