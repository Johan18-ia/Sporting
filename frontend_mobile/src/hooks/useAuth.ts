// src/hooks/useAuth.ts
// ====================================================
// HOOK: AUTENTICACIÓN
// Usa los tipos compartidos de src/types/user.ts
// ====================================================
import { useState, useEffect } from 'react'
import AuthModel from '../models/AuthModel'
import storageService from '../services/storageService'
import type { User, LoginCredentials, RegisterPayload, UserRole } from '../types'

interface UseAuthReturn {
  currentUser: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<any>
  register: (userData: RegisterPayload) => Promise<any>
  logout: () => Promise<{ success: boolean }>
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean
}

export const useAuth = (): UseAuthReturn => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await storageService.getUser()
        const token = await storageService.getToken()
        setCurrentUser(user)
        setIsAuthenticated(!!token)
      } catch (err) {
        console.error('Error al cargar usuario:', err)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setLoading(true)
    setError(null)
    try {
      const result = await AuthModel.login(credentials)
      if (result.success) {
        setCurrentUser(result.user ?? null)
        setIsAuthenticated(true)
        return result
      }
      throw new Error(result.error)
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: RegisterPayload) => {
    setLoading(true)
    setError(null)
    try {
      const result = await AuthModel.register(userData as any)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    } catch (err: any) {
      setError(err.message || 'Error al registrar usuario')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await AuthModel.logout()
      setCurrentUser(null)
      setIsAuthenticated(false)
      return { success: true }
    } catch (err: any) {
      setError(err.message || 'Error al cerrar sesión')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const hasRole = (role: UserRole) => currentUser?.role === role
  const hasAnyRole = (roles: UserRole[]) => !!currentUser && roles.includes(currentUser.role)

  return {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    hasRole,
    hasAnyRole,
  }
}

export default useAuth
