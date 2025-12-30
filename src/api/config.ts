// Configuración de la API
// MODO: Chrome sin seguridad

export const API_CONFIG = {
  AUTH_BASE_URL: 'https://dev.apinetbo.bekindnetwork.com',
  ACTIONS_BASE_URL: 'https://dev.api.bekindnetwork.com',
} as const;

export const ENDPOINTS = {
  LOGIN: '/api/Authentication/Login',
  ACTIONS_LIST: '/api/v1/actions/admin-list',
  ACTIONS_ADD: '/api/v1/actions/admin-add',
} as const;

export const DEFAULT_PAGE_SIZE = 10;
