// src/config/constants.ts
// ====================================================
// CONSTANTES GLOBALES
// ====================================================

export const APP_NAME = 'Sporting Club'
export const APP_VERSION = '1.0.0'

export const ROLES = {
    ADMIN: 'admin',
    SELLER: 'seller',
    USER: 'user',
    CUSTOMER: 'customer'
} as const

export const ROLE_LABELS = {
    [ROLES.ADMIN]: 'Administrador',
    [ROLES.SELLER]: 'Vendedor',
    [ROLES.USER]: 'Usuario',
    [ROLES.CUSTOMER]: 'Cliente'
} as const

export const DAYS_OF_WEEK = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo'
]

export const TOAST_DURATION = 3000
export const TOKEN_EXPIRY_HOURS = 24