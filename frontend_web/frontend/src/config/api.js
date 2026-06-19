// frontend_web/frontend/src/config/api.js
const API_CONFIG = {
  // Usa la IP de tu máquina (la que configuraste en backend/index.js)
  BASE_URL: 'http://192.168.56.1:3000/api',  // ← Cambia por tu IP
  TIMEOUT: 10000,
  ENDPOINTS: {
    // Users
    LOGIN: '/users/login',
    REGISTER: '/users/create',
    USERS: '/users',
    USER_BY_ID: '/users/:id',
    USER_DELETE: '/users/delete/:id',
    USER_UPDATE: '/users',
    
    // Products (nuevos)
    PRODUCTS: '/products',
    PRODUCT_BY_ID: '/products/:id',
    PRODUCT_CREATE: '/products/create',
    PRODUCT_DELETE: '/products/delete/:id',
    
    // Categories (nuevos)
    CATEGORIES: '/categories',
    CATEGORY_BY_ID: '/categories/:id',
    CATEGORY_CREATE: '/categories/create',
    CATEGORY_DELETE: '/categories/delete/:id',
    
    // Schedules (nuevos)
    SCHEDULES: '/schedules',
    SCHEDULE_CREATE: '/schedules/create',
    SCHEDULE_BY_CATEGORY: '/schedules/category/:id_category',
    SCHEDULE_DELETE: '/schedules/delete/:id',
    
    // Tournaments (nuevos)
    TOURNAMENTS: '/tournaments',
    TOURNAMENT_CREATE: '/tournaments/create',
    TOURNAMENT_GENERATE_TEAMS: '/tournaments/generate-teams'
  }
}

export default API_CONFIG