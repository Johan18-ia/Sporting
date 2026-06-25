// src/config/routes.js
// ====================================================
// CONFIGURACIÓN DE RUTAS
// ====================================================
export const ROUTES = {
    HOME: '/',
    CATALOGO: '/catalogo',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard'
}

export const PROTECTED_ROUTES = [ROUTES.DASHBOARD]

export const PUBLIC_ROUTES = [
    ROUTES.HOME,
    ROUTES.CATALOGO,
    ROUTES.LOGIN,
    ROUTES.REGISTER
]