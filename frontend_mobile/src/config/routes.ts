// src/config/routes.ts
// ====================================================
// RUTAS DE NAVEGACIÓN — strings tipados
// ====================================================

export const ROUTES = {
  // Públicas
  HOME: 'Home' as const,
  LOGIN: 'Login' as const,
  REGISTER: 'Register' as const,
  CATALOGO: 'Catalogo' as const,

  // Panel
  DASHBOARD: 'Dashboard' as const,
  USERS: 'Users' as const,
  CATEGORIES: 'Categories' as const,
  SCHEDULES: 'Schedules' as const,
  PRODUCTS: 'Products' as const,
  STUDENTS: 'Students' as const,
  TOURNAMENTS: 'Tournaments' as const,
  TEAMS: 'Teams' as const,
  REPORTS: 'Reports' as const,

  // Estudiante
  MY_PROFILE: 'MyProfile' as const,
  MY_SCHEDULES: 'MySchedules' as const,
  MY_TOURNAMENTS: 'MyTournaments' as const,
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
  ROUTES.HOME,
]