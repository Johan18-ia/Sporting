// src/utils/helpers.ts
// ====================================================
// HELPERS GENERALES — Formateo, displayName, etc.
// ====================================================

import type { User } from '../types'

/** Iniciales para avatares (ej: "Juan Pérez" → "JP") */
export const getInitials = (name: string, lastname?: string): string => {
  const first = name?.charAt(0).toUpperCase() ?? ''
  const second = lastname?.charAt(0).toUpperCase() ?? ''
  return `${first}${second}` || '?'
}

/** Display name preferido (prioriza nombre + apellido, fallback email) */
export const getDisplayName = (user: User | null | undefined): string => {
  if (!user) return 'Usuario'
  if (user.name && user.lastname) return `${user.name} ${user.lastname}`
  return user.name || user.email?.split('@')[0] || 'Usuario'
}

/** Formatear precio en COP */
export const formatPrice = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '$0'
  return `$${num.toLocaleString('es-CO')}`
}

/** Formatear fecha a DD/MM/YYYY */
export const formatDate = (iso?: string | null): string => {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

/** Quitar prefijo "JWT " si existe (paridad con AuthModel web) */
export const cleanToken = (raw: string): string => {
  if (raw && raw.startsWith('JWT ')) return raw.substring(4)
  return raw
}

/** Reemplazar :id en un endpoint pattern */
export const resolveEndpoint = (pattern: string, params: Record<string, string | number>): string => {
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`:${key}`, String(value)),
    pattern,
  )
}

/** Truncar texto largo */
export const truncate = (text: string, max = 50): string => {
  if (!text || text.length <= max) return text
  return `${text.substring(0, max)}…`
}
