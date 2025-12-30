import { actionsApi } from './axiosInstances';
import { ENDPOINTS, DEFAULT_PAGE_SIZE } from './config';
import { ActionsListResponse, ActionsApiResponse, CreateActionRequest, Action } from '../types/actions';

// Servicio para manejar las peticiones de las acciones
export const actionsService = {
  // Función para obtener el listado paginado
  getList: async (pageNumber: number = 1, pageSize: number = DEFAULT_PAGE_SIZE): Promise<ActionsListResponse> => {
    // Hacemos la petición GET enviando los parámetros de paginación
    const response = await actionsApi.get<ActionsApiResponse>(ENDPOINTS.ACTIONS_LIST, {
      params: { pageNumber, pageSize },
    });
    
    // Transformar la respuesta del API al formato que usamos internamente
    // Esto es necesario porque el API devuelve una estructura anidada
    const apiData = response.data.data;
    return {
      data: apiData.data,
      totalCount: apiData.totalElements,
      totalPages: apiData.totalPages,
      pageNumber: apiData.pageNumber,
      pageSize: apiData.pageSize,
    };
  },

  // Función para crear una nueva acción
  create: async (action: CreateActionRequest): Promise<Action> => {
    console.log('Enviando acción:', {
      name: action.name,
      description: action.description,
      color: action.color,
      status: action.status,
      iconFileName: action.icon?.name,
    });

    // Usar FormData para enviar el archivo
    // Es obligatorio usar FormData cuando se envían archivos
    const formData = new FormData();
    formData.append('name', action.name);
    formData.append('description', action.description);
    formData.append('color', action.color);
    formData.append('icon', action.icon);
    formData.append('status', String(action.status));

    try {
      const response = await actionsApi.post<Action>(ENDPOINTS.ACTIONS_ADD, formData, {
        headers: {
        },
      });

      console.log('✅ Acción creada exitosamente:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al crear la acción:', error.message);
      throw error;
    }
  },
};
