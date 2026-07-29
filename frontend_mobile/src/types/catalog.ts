// src/types/catalog.ts
// ====================================================
// TIPOS: Category, Product, Schedule
// ====================================================

export interface Category {
  id: number
  category_year: string | number
  name_year?: string | number
  description?: string
}

export interface Product {
  id: number
  nombre: string
  descripcion?: string
  precio: number | string
  imagen?: string
}

export interface Schedule {
  id: number
  category_id: number
  dia?: string
  hora_inicio?: string
  hora_fin?: string
  lugar?: string
  profesor?: string
}

export interface Student {
  id: number
  name: string
  lastname?: string
  document?: string
  birth_date?: string
  category_id?: number
  email?: string
  phone?: string
}

export interface Team {
  id: number
  name: string
  description?: string
  studentIds: number[]
  created_at?: string
}

export interface Tournament {
  id: number
  name: string
  category: string | number
  status: 'Inscripciones' | 'En Progreso' | 'Finalizado' | 'Activo'
  students: Array<{ id: number; name: string }>
}

// Wrapper genérico para todas las respuestas del Model
// (Mantiene paridad con el patrón { success, data, error } del web)
export interface ModelResult<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}