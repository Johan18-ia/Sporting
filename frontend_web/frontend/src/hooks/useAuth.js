/**
 * useAuth.js:
 * - ¿Qué hace? Centraliza la autenticación global, carga la sesión persistida y expone login/logout/register al resto del frontend.
 * - ¿Qué función cumple en el proyecto? Es el hook equivalente al patrón de sesión del mobile para mantener la app web autenticada y consistente.
 * - Origen mobile equivalente: frontend_mobile/src/hooks/useAuth.ts
 */
import React, { createContext, useContext, useEffect, useState } from 'react'
import AuthModel from '../models/AuthModel'
import storageService from '../services/storageService'

const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storageService.getUser())
  const [currentUser, setCurrentUser] = useState(() => storageService.getUser())
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(storageService.getToken()))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const syncAuthState = () => {
    const savedUser = storageService.getUser()
    const token = storageService.getToken()
    const hasValidToken = Boolean(token) && !storageService.isTokenExpired(token)

    setUser(savedUser)
    setCurrentUser(savedUser)
    setIsAuthenticated(hasValidToken)

    if (!hasValidToken && savedUser) {
      storageService.clearSession()
    }
  }

  const updateUserSession = (updatedUser) => {
    const nextUser = updatedUser && typeof updatedUser === 'object' ? { ...updatedUser } : null

    if (!nextUser) {
      storageService.clearSession()
      setUser(null)
      setCurrentUser(null)
      setIsAuthenticated(false)
      return null
    }

    if (nextUser.session_token || storageService.getToken()) {
      const token = nextUser.session_token || storageService.getToken()
      storageService.setToken(token)
      nextUser.session_token = String(token).replace(/^JWT\s+/i, '').trim()
    }

    storageService.saveUser(nextUser)
    if (nextUser.role) {
      storageService.setUserRole(nextUser.role)
    }

    setUser(nextUser)
    setCurrentUser(nextUser)
    setIsAuthenticated(true)
    return nextUser
  }

  useEffect(() => {
    syncAuthState()
    setLoading(false)
  }, [])

  const checkAuth = async () => {
    setLoading(true)
    try {
      syncAuthState()
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    setLoading(true)
    setError(null)

    try {
      const result = await AuthModel.login(credentials)

      if (result.success) {
        const nextUser = result.user || storageService.getUser()

        if (nextUser) {
          updateUserSession(nextUser)
        }

        return result
      }

      setUser(null)
      setCurrentUser(null)
      setIsAuthenticated(false)
      throw { error: result.error || 'Contraseña o correo incorrecto' }
    } catch (err) {
      const message = err?.error || err?.message || 'Error al iniciar sesión'
      setError(message)
      throw { error: message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    setError(null)

    try {
      const result = await AuthModel.register(userData)

      if (!result.success) {
        throw { error: result.error || 'Error al registrar usuario' }
      }

      return result
    } catch (err) {
      const message = err?.error || err?.message || 'Error al registrar usuario'
      setError(message)
      throw { error: message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    setError(null)

    try {
      await AuthModel.logout()
      setUser(null)
      setCurrentUser(null)
      setIsAuthenticated(false)
      return { success: true }
    } catch (err) {
      const message = err?.message || 'Error al cerrar sesión'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth,
    updateUserSession
  }

  return React.createElement(AuthContext.Provider, { value }, children)
}

const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }

  return context
}

export default useAuth