// src/config/routes.js
export const ROUTES = {
 LOGIN: '/login',
  REGISTER: '/register',

  DASHBOARD: '/dashboard',

  USERS: '/users',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  SCHEDULES: '/schedules',
  TOURNAMENTS: '/tournaments',
  HOME: '/'
}
export const PROTECTED_ROUTES = [ROUTES.DASHBOARD]
export const PUBLIC_ROUTES = [ROUTES.LOGIN, ROUTES.HOME]