// src/hooks/useAuth.js

import { useState, useEffect } from 'react'

import AuthModel from '../models/AuthModel'

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] =
    useState(false)
  const [currentUser, setCurrentUser] =
    useState(null)
  const [token, setToken] =
    useState(null)
  const [loading, setLoading] =
    useState(true)

  // ==========================================
  // CARGA INICIAL
  // ==========================================
  useEffect(() => {
    checkAuth()
    const handleStorageChange = e => {
      if (e.key === 'sporty_token') {
        checkAuth()
      }
    }
    window.addEventListener(
      'storage',
      handleStorageChange
    )
    return () => {
      window.removeEventListener(
        'storage',
        handleStorageChange
      )
    }
  }, [])
  // ==========================================
  // VALIDAR SESIÓN
  // ==========================================

  const checkAuth = async () => {
    try {
      setLoading(true)
      const authenticated =
        AuthModel.isAuthenticated()
      const user =
        AuthModel.getCurrentUser()
      const currentToken =
        AuthModel.getCurrentToken()
      setIsAuthenticated(
        authenticated
      )
      setCurrentUser(user)
      setToken(currentToken)
    } catch (error) {
      console.error(
        '❌ Error verificando sesión:',
        error
      )
      setIsAuthenticated(false)
      setCurrentUser(null)
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  // ==========================================
  // LOGIN
  // ==========================================
  const login = async credentials => {
    try {
      setLoading(true)
      const result =
        await AuthModel.login(
          credentials
        )
      if (!result.success) {
        throw new Error(
          result.error
        )
      }
      setIsAuthenticated(true)
      setCurrentUser(
        result.user
      )
      setToken(
        result.token
      )
      return result
    } catch (error) {
      console.error(
        '❌ Error login:',
        error
      )
      return {
        success: false,
        error: error.message
      }
    } finally {
      setLoading(false)
    }
  }

  // ==========================================
  // REGISTRO
  // ==========================================
  const register = async userData => {
    try {
      setLoading(true)
      return await AuthModel.register(
        userData
      )
    } catch (error) {
      console.error(
        '❌ Error registro:',
        error
      )
      return {
        success: false,
        error: error.message
      }
    } finally {
      setLoading(false)
    }
  }

  // ==========================================
  // LOGOUT
  // ==========================================
  const logout = async () => {
    try {
      setLoading(true)
      await AuthModel.logout()
      setIsAuthenticated(false)
      setCurrentUser(null)
      setToken(null)
      return {
        success: true
      }
    } catch (error) {
      console.error(
        '❌ Error logout:',
        error
      )
      return {
        success: false,
        error: error.message
      }
    } finally {
      setLoading(false)
    }
  }
  return {
    isAuthenticated,
    currentUser,
    token,
    loading,
    login,
    register,
    logout,
    checkAuth
  }
}
export default useAuth