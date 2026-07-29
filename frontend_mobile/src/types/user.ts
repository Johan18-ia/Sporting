// src/types/user.ts
// ====================================================
// TIPOS: User
// Equivalente a UserModel.js + AuthModel.js del web
// ====================================================

export type UserRole = 'admin' | 'seller' | 'user'

export interface User {
  id: number
  email: string
  name: string
  lastname?: string
  role: UserRole
  phone?: string
  image?: string
  document?: string | null
  birth_date?: string | null
  emergency_contact?: string | null
  emergency_phone?: string | null
  address?: string | null
  category_id?: number | null
  student_id?: number | null
  is_active?: 0 | 1
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  lastname?: string
  document?: string | null
  birth_date?: string | null
  email: string
  password: string
  phone?: string
  emergency_contact?: string | null
  emergency_phone?: string | null
  address?: string | null
  image?: string
  role?: UserRole
  category_id?: number | null
  is_active?: 0 | 1
}

export interface AuthSuccess {
  success: true
  token: string
  user: User
}

export interface AuthError {
  success: false
  error: string
}

export type AuthResult = AuthSuccess | AuthError