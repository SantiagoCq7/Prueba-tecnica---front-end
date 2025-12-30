export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface LoginResponse {
  token: string;
  user?: User;
  message?: string;
  success?: boolean;
}

// El API devuelve el token JWT directamente como string
export type LoginApiResponse = string;

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}
