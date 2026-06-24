import { useState, useEffect, useCallback } from 'react'
import AuthController from '../controllers/AuthController'

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const syncAuthState = useCallback(() => {
    const state = AuthController.getAuthState()
    setCurrentUser(state.currentUser)
    setIsAuthenticated(state.isAuthenticated)
    setLoading(false)
  }, [])

  useEffect(() => {
    syncAuthState()
  }, [syncAuthState])

  const login = async (credentials) => {
    setLoading(true)

    try {
      const result = await new Promise((resolve, reject) => {
        AuthController.handleLogin(
          credentials,
          (user, token) => resolve({ success: true, user, token }),
          (error) => reject({ success: false, error })
        )
      })

      syncAuthState()
      return result
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const register = async (userData) => {
    setLoading(true)

    try {
      const result = await new Promise((resolve, reject) => {
        AuthController.handleRegister(
          userData,
          (user) => resolve({ success: true, user }),
          (error) => reject({ success: false, error })
        )
      })

      syncAuthState()
      return result
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const logout = async () => {
    setLoading(true)

    try {
      const result = await new Promise((resolve, reject) => {
        AuthController.handleLogout(
          () => resolve({ success: true }),
          (error) => reject({ success: false, error })
        )
      })

      syncAuthState()
      return result
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  return {
    currentUser,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  }
}

export default useAuth