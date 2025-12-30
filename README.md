# Be Kind Network - Frontend React

## 📁 Estructura del Proyecto

Organicé el código siguiendo una arquitectura por features para mantener todo ordenado:

```
src/
├── api/                    # lógica de conexión con las APIs
├── components/
│   ├── ui/                 # Componentes reutilizables 
│   ├── common/             # Logo, Sidebar y componentes compartidos
│   ├── auth/               # Todo lo relacionado con el login
│   └── actions/            # Tabla y formulario de acciones
├── pages/                  # Las dos vistas principales: Login y Dashboard
├── routes/                 # Configuración de rutas y protección
├── hooks/                  # Hooks 
├── store/                  # Estado global con Zustand
├── types/                  # Tipos de TypeScript
└── styles/                 # Estilos con Tailwind
```

---

## 🔧 Cómo ejecutar el proyecto

### Lo que necesitas tener instalado
- Node.js 16 o superior
- npm o yarn

### Pasos para correrlo

```bash
# Clona el repositorio y entra a la carpeta
git clone <URL_DEL_REPOSITORIO>
cd "prueba tecnica - front end"

# Instala las dependencias
npm install

# Arranca el servidor de desarrollo
npm start
```

### las variables de entorno
 Las URLs de las APIs ya están configuradas directamente en `src/api/config.ts`

```typescript
export const API_CONFIG = {
  AUTH_BASE_URL: 'https://dev.apinetbo.bekindnetwork.com',
  ACTIONS_BASE_URL: 'https://dev.api.bekindnetwork.com',
};
```

### Si te salen errores de CORS

Como las APIs están en dominios externos, puede que el navegador bloquee las peticiones. La solución más rápida para desarrollo es abrir Chrome sin seguridad.

---

## 🔐 Credenciales para probar

| Campo | Valor |
|-------|-------|
| Email | `a.berrio@yopmail.com` |
| Password | `AmuFK8G4Bh64Q1uX+IxQhw==` |

---

## 📝 Decisiones que tomé y por qué

### Tecnologías elegidas

1. **Zustand** para el estado global - Lo elegí porque es súper ligero y tiene una API muy simple. Además permite guardar el estado en localStorage fácilmente para que la sesión persista.

2. **React Hook Form + Zod** - Esta combinación me permite validar los formularios de forma type-safe y con muy buen rendimiento. Los mensajes de error quedaron en español.

3. **Dos instancias de Axios** - Como las APIs tienen dominios diferentes, creé una instancia para autenticación y otra para acciones. La de acciones tiene un interceptor que agrega automáticamente el token.

4. **FormData para crear acciones** - Como el formulario incluye subida de imagen, decidí usar `multipart/form-data` en lugar de JSON puro.

5. **Decodifico el JWT en el cliente** - Así puedo mostrar el nombre del usuario en la UI sin hacer una petición extra al backend.

### Supuestos que hice

Como no tenía documentación completa de las APIs, asumí algunas cosas:

1. El login devuelve el token JWT directamente como string (no envuelto en un objeto).

2. El listado viene con esta estructura: `{ data: { data: [...], totalElements, totalPages } }`.

3. Para crear una acción, el endpoint acepta FormData con los campos: `name`, `description`, `color`, `status` e `icon`.
