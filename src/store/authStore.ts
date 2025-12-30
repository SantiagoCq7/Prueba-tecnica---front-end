import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, LoginRequest } from '../types/auth';
import { authService } from '../api/authService';

// Función auxiliar para leer la información que viene dentro del token JWT
// Esto es necesario porque el backend no nos devuelve los datos del usuario, solo el token
const decodeJwtPayload = (token: string) => {
  try {
    // El token tiene 3 partes separadas por puntos. La segunda parte es el payload
    const base64Url = token.split('.')[1];
    // Reemplazamos caracteres para que sea un base64 válido
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Decodificamos el base64 a un string JSON
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    // Convertimos el string JSON a un objeto de JavaScript
    return JSON.parse(jsonPayload);
  } catch {
    // Si falla algo, devolvemos null
    return null;
  }
};

// Creamos el store de autenticación usando Zustand
// Usamos 'persist' para que los datos se guarden en el localStorage y no se pierdan al recargar
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Estado inicial
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Acción para iniciar sesión
      login: async (credentials: LoginRequest) => {
        // Ponemos isLoading en true para mostrar el spinner
        set({ isLoading: true, error: null });
        try {
          // Llamamos al servicio de login
          const token = await authService.login(credentials);
          
          // Verificamos que nos haya llegado un token válido
          if (token && typeof token === 'string') {
            // Decodificamos el token para sacar el email y el rol
            const payload = decodeJwtPayload(token);
            
            // Armamos el objeto usuario con los datos del token
            const user = payload ? {
              id: payload.id || payload.sub, // A veces viene como id, a veces como sub
              email: payload.sub || credentials.username,
              name: payload.name,
              role: payload.role,
            } : null;

            // Actualizamos el estado con el usuario logueado
            set({
              token,
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error('No se recibió un token válido');
          }
        } catch (error: any) {
          // Si hay error, guardamos el mensaje para mostrarlo en la alerta
          const errorMessage = 
            error.response?.data?.message || 
            error.response?.data?.error ||
            error.message || 
            'Error al iniciar sesión. Verifica tus credenciales.';
          
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      // Acción para cerrar sesión
      logout: () => {
        // Limpiamos todo el estado
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      // Acción para limpiar el mensaje de error
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage', // Nombre con el que se guarda en localStorage
      // Solo guardamos estas propiedades en el localStorage
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
