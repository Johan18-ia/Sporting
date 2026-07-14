// src/config/api.js
// ====================================================
// CONFIGURACIÓN DE API
// ====================================================

// ============================================
// USAR VARIABLE DE ENTORNO CON FALLBACK
// ============================================
const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://10.1.196.38:3000/api',
    TIMEOUT: 10000,
    ENDPOINTS: {
        // ============================================
        // USERS
        // ============================================
        LOGIN: '/users/login',
        REGISTER: '/users/create',
        USERS: '/users',
        USER_BY_ID: '/users/:id',
        USER_DELETE: '/users/delete/:id',
        USER_UPDATE: '/users',
        USER_TOGGLE_STATUS: '/users/toggle-status/:id',

        // ============================================
        // STUDENTS
        // ============================================
        STUDENTS: '/students',
        STUDENT_CREATE: '/students/create',
        STUDENT_DELETE: '/students/delete/:id',
        STUDENT_UPDATE: '/students',
        STUDENT_BY_ID: '/students/:id',

        // ============================================
        // PRODUCTS
        // ============================================
        PRODUCTS: '/products',
        PRODUCT_BY_ID: '/products/:id',
        PRODUCT_CREATE: '/products/create',
        PRODUCT_DELETE: '/products/delete/:id',

        // ============================================
        // CATEGORIES (CORREGIDO A /categories)
        // ============================================
        CATEGORIES: '/categories',
        CATEGORY_BY_ID: '/categories/:id',
        CATEGORY_CREATE: '/categories/create',
        CATEGORY_DELETE: '/categories/delete/:id',

        // ============================================
        // SCHEDULES
        // ============================================
        SCHEDULES: '/schedules',
        SCHEDULE_CREATE: '/schedules/create',
        SCHEDULE_BY_CATEGORY: '/schedules/category/:id_category',
        SCHEDULE_DELETE: '/schedules/delete/:id',

        // ============================================
        // TOURNAMENTS
        // ============================================
        TOURNAMENTS: '/tournaments',
        TOURNAMENT_CREATE: '/tournaments/create',
        TOURNAMENT_GENERATE_TEAMS: '/tournaments/generate-teams'
    }
}

export default API_CONFIG