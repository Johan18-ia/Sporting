// src/hooks/useAuth.ts
// ====================================================
// HOOK: AUTENTICACIÓN
// ====================================================
import { useState, useEffect } from 'react'
import AuthModel from '../models/AuthModel'
import storageService from '../services/storageService'

interface User {
    id: number
    email: string
    name: string
    lastname: string
    role: string
    phone?: string
    image?: string
}

interface LoginCredentials {
    email: string
    password: string
}

interface RegisterData {
    name: string
    lastname?: string
    email: string
    password: string
    phone?: string
    image?: string
    role?: string
}

interface UseAuthReturn {
    currentUser: User | null
    isAuthenticated: boolean
    loading: boolean
    error: string | null
    login: (credentials: LoginCredentials) => Promise<any>
    register: (userData: RegisterData) => Promise<any>
    logout: () => Promise<{ success: boolean }>
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
                setCurrentUser(result.user)
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

    const register = async (userData: RegisterData) => {
        setLoading(true)
        setError(null)
        try {
            const result = await AuthModel.register(userData)
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