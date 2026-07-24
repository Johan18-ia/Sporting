// src/config/routes.ts
// ====================================================
// CONFIGURACIÓN DE RUTAS DE NAVEGACIÓN
// ====================================================

export const ROUTES = {
    // Rutas públicas
    LOGIN: 'Login',
    REGISTER: 'Register',
    CATALOGO: 'Catalogo',
    
    // Rutas principales
    DASHBOARD: 'Dashboard',
    USERS: 'Users',
    CATEGORIES: 'Categories',
    SCHEDULES: 'Schedules',
    PRODUCTS: 'Products',
    STUDENTS: 'Students',
    TOURNAMENTS: 'Tournaments',
    TEAMS: 'Teams',
    REPORTS: 'Reports',
    
    // Rutas de estudiante
    MY_PROFILE: 'MyProfile',
    MY_SCHEDULES: 'MySchedules',
    MY_TOURNAMENTS: 'MyTournaments',
}

export const PROTECTED_ROUTES = [
    ROUTES.DASHBOARD,
    ROUTES.USERS,
    ROUTES.CATEGORIES,
    ROUTES.SCHEDULES,
    ROUTES.PRODUCTS,
    ROUTES.STUDENTS,
    ROUTES.TOURNAMENTS,
    ROUTES.TEAMS,
    ROUTES.REPORTS,
    ROUTES.MY_PROFILE,
    ROUTES.MY_SCHEDULES,
    ROUTES.MY_TOURNAMENTS,
]

export const PUBLIC_ROUTES = [
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.CATALOGO,
]