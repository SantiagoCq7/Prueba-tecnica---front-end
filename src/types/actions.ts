export interface Action {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  status: number; // 0 = inactivo, 1 = activo
  createdAt: string;
}

// Respuesta real del API de listado
export interface ActionsApiResponse {
  data: {
    pageSize: number;
    pageNumber: number;
    totalElements: number;
    totalPages: number;
    data: Action[];
  };
}

export interface ActionsListResponse {
  data: Action[];
  totalCount: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export interface CreateActionRequest {
  name: string;
  description: string;
  color: string;
  icon: File; // Archivo requerido
  status: number; // 0 o 1
}

export interface ActionsState {
  actions: Action[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  error: string | null;
  fetchActions: (page?: number, size?: number) => Promise<void>;
  createAction: (action: CreateActionRequest) => Promise<boolean>;
  clearError: () => void;
}
