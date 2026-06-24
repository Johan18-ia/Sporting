// frontend_web/frontend/src/config/api.js
const getBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }

  if (typeof window !== 'undefined' && window.location.hostname) {
    return `http://${window.location.hostname}:3000/api`
  }

  return 'http://localhost:3000/api'
}

const API_CONFIG = {
  BASE_URL: getBaseUrl(),
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