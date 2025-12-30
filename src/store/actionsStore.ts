import { create } from 'zustand';
import { ActionsState, CreateActionRequest } from '../types/actions';
import { actionsService } from '../api/actionsService';
import { DEFAULT_PAGE_SIZE } from '../api/config';

// Store para manejar el estado de las acciones (listado, creación, etc.)
export const useActionsStore = create<ActionsState>((set, get) => ({
  // Estado inicial
  actions: [],
  totalCount: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  isLoading: false,
  error: null,

  // Función para traer las acciones del backend
  fetchActions: async (page: number = 1, size: number = DEFAULT_PAGE_SIZE) => {
    // Activamos el loading
    set({ isLoading: true, error: null });
    try {
      // Llamamos al servicio
      const response = await actionsService.getList(page, size);
      
      // Guardamos los datos en el estado
      set({
        actions: response.data,
        totalCount: response.totalCount,
        totalPages: response.totalPages,
        currentPage: page,
        pageSize: response.pageSize,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      // Manejo de errores
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error ||
        error.message || 
        'Error al cargar las acciones.';
      
      set({
        actions: [],
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  // Función para crear una nueva acción
  createAction: async (action: CreateActionRequest): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      // Llamamos al servicio de creación
      await actionsService.create(action);
      
      // Si sale bien, recargamos la lista para que aparezca la nueva acción
      // Usamos get() para obtener el estado actual de la paginación
      await get().fetchActions(get().currentPage, get().pageSize);
      return true;
    } catch (error: any) {
      let errorMessage = 'Error al crear la acción.';
      
      // Si el error es 403, mostramos un mensaje más claro
      if (error.response?.status === 403) {
        errorMessage = 'No tienes permisos para crear acciones. El usuario actual no tiene rol de administrador.';
      } else {
        errorMessage = 
          error.response?.data?.message || 
          error.response?.data?.error ||
          error.message || 
          'Error al crear la acción.';
      }
      
      set({
        isLoading: false,
        error: errorMessage,
      });
      return false;
    }
  },

  // Limpiar errores de la UI
  clearError: () => {
    set({ error: null });
  },
}));
