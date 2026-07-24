import { useState, useEffect } from 'react'
import AuthModel from '../models/AuthModel'
import storageService from '../services/storageService'

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(() => storageService.getUser())
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(storageService.getToken()))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const savedUser = storageService.getUser()
    const hasToken = Boolean(storageService.getToken())
    setCurrentUser(savedUser)
    setIsAuthenticated(hasToken)
  }, [])

  const login = async (credentials) => {
    setLoading(true)
    setError(null)

    try {
      const result = await AuthModel.login(credentials)

      if (result.success) {
        setCurrentUser(result.user)
        setIsAuthenticated(true)
        return result
      }

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

  return {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout
  }
}

export default useAuth