// src/config/routes.js
// ====================================================
// CONFIGURACIÓN DE RUTAS
// ====================================================
export const ROUTES = {
    HOME: '/',
    CATALOGO: '/catalogo',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    CHANGE_PASSWORD: '/dashboard/change-password',
    TOURNAMENTS: '/tournaments',
    TOURNAMENT_DETAIL: '/tournaments/:id',
    TOURNAMENT_TEAMS: '/tournaments/:id/teams',
    TEAMS: '/teams',
    TEAM_DETAIL: '/teams/:id',
    TEAM_MEMBERS: '/teams/:id/members',
    SCHEDULES: '/schedules'
}

export const PROTECTED_ROUTES = [ROUTES.DASHBOARD, ROUTES.TOURNAMENTS, ROUTES.TEAMS, ROUTES.SCHEDULES]

export const PUBLIC_ROUTES = [
    ROUTES.HOME,
    ROUTES.CATALOGO,
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.TOURNAMENTS,
    ROUTES.TEAMS,
    ROUTES.SCHEDULES
]