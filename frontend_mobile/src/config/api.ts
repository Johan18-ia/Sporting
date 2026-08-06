// src/config/api.ts
export const API_CONFIG = {
    BASE_URL: 'http://10.1.202.216:3000/api', // Cambia por tu IP local
    TIMEOUT: 10000,
    ENDPOINTS: {
        // AUTH
        LOGIN: '/users/login',
        REGISTER: '/users/create',
        
        // USERS
        USERS: '/users',
        USER_BY_ID: '/users/:id',
        USER_DELETE: '/users/delete/:id',
        USER_UPDATE: '/users',
        USER_TOGGLE_STATUS: '/users/toggle-status/:id',
        
        // STUDENTS
        STUDENTS: '/students',
        STUDENT_CREATE: '/students/create',
        STUDENT_DELETE: '/students/delete/:id',
        STUDENT_UPDATE: '/students',
        STUDENT_BY_ID: '/students/:id',
        
        // PRODUCTS
        PRODUCTS: '/products',
        PRODUCT_BY_ID: '/products/:id',
        PRODUCT_CREATE: '/products/create',
        PRODUCT_DELETE: '/products/delete/:id',
        
        // CATEGORIES
        CATEGORIES: '/categories',
        CATEGORY_BY_ID: '/categories/:id',
        CATEGORY_CREATE: '/categories/create',
        CATEGORY_DELETE: '/categories/delete/:id',
        
        // SCHEDULES
        SCHEDULES: '/schedules',
        SCHEDULE_CREATE: '/schedules/create',
        SCHEDULE_BY_CATEGORY: '/schedules/category/:id_category',
        SCHEDULE_DELETE: '/schedules/delete/:id',
        
        // TOURNAMENTS
        TOURNAMENTS: '/tournaments',
        TOURNAMENT_CREATE: '/tournaments/create',
        TOURNAMENT_GENERATE_TEAMS: '/tournaments/generate-teams'
    }
};

export default API_CONFIG;