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
    const hasToken = Boolean(storageService.getToken())
    setUser(savedUser)
    setCurrentUser(savedUser)
    setIsAuthenticated(hasToken)
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
        setUser(nextUser)
        setCurrentUser(nextUser)
        setIsAuthenticated(true)
        return result
      }

      setUser(null)
      setCurrentUser(null)
      setIsAuthenticated(false)
      throw { error: result.error || 'Credenciales incorrectas' }
    } catch (err) {
      setError(err.error || 'Error al iniciar sesión')
      throw err
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
      setError(err.error || 'Error al registrar usuario')
      throw err
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
      setError(err.message || 'Error al cerrar sesión')
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
    checkAuth
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