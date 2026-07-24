// src/models/AuthModel.ts
// ====================================================
// MODELO: AUTENTICACIÓN
// ====================================================
import httpService from '../services/httpService'
import storageService from '../services/storageService'
import jwtService from '../services/jwtService'
import API_CONFIG from '../config/api'

class AuthModel {
    static async login(credentials: { email: string; password: string }) {
        try {
            console.log('🔐 Enviando login a API real:', credentials.email)

            const response = await httpService.post(
                API_CONFIG.ENDPOINTS.LOGIN,
                {
                    email: credentials.email,
                    password: credentials.password
                },
                false // No requiere token
            )

            console.log('📦 Respuesta del login:', JSON.stringify(response, null, 2))

            if (!response.success) {
                return {
                    success: false,
                    error: response.message || 'Error en el servidor'
                }
            }

            const userData = response.data

            if (!userData) {
                return {
                    success: false,
                    error: 'Error en la respuesta del servidor'
                }
            }

            const sessionToken = userData.session_token

            if (!sessionToken) {
                return {
                    success: false,
                    error: 'Error al obtener token de autenticación'
                }
            }

            let token = sessionToken
            if (sessionToken.startsWith('JWT ')) {
                token = sessionToken.substring(4)
            }

            await storageService.setToken(token)

            const user = {
                id: userData.id,
                email: userData.email,
                name: userData.name || userData.email.split('@')[0],
                lastname: userData.lastname || '',
                role: userData.role || 'user',
                phone: userData.phone || '',
                image: userData.image || ''
            }

            await storageService.setUser(user)

            if (user.role) {
                await storageService.setUserRole(user.role)
            }

            console.log('✅ Login exitoso, usuario guardado:', user.email)

            return {
                success: true,
                token: token,
                user: user
            }

        } catch (error: any) {
            console.error('❌ Error en login:', error)
            return {
                success: false,
                error: error.message || 'Error de conexión con el servidor'
            }
        }
    }

    static async register(userData: any) {
        try {
            console.log('📝 Registrando usuario:', userData.email)

            const response = await httpService.post(
                API_CONFIG.ENDPOINTS.REGISTER,
                {
                    name: userData.name,
                    lastname: userData.lastname || '',
                    email: userData.email,
                    password: userData.password,
                    phone: userData.phone || '',
                    image: userData.image || '',
                    role: userData.role || 'user'
                },
                false // No requiere token para registro
            )

            if (!response.success) {
                return {
                    success: false,
                    error: response.message || 'Error al registrar usuario'
                }
            }

            return {
                success: true,
                user: response.data || response,
                message: 'Usuario registrado exitosamente'
            }

        } catch (error: any) {
            console.error('❌ Error en registro:', error)
            return {
                success: false,
                error: error.message || 'Error al registrar usuario'
            }
        }
    }

    static async logout() {
        try {
            await storageService.clearSession()
            return { success: true }
        } catch (error: any) {
            console.error('Error en logout:', error)
            return { success: false, error: error.message }
        }
    }

    static async isAuthenticated(): Promise<boolean> {
        const token = await storageService.getToken()
        if (!token) return false

        const isValid = jwtService.verifyToken(token)

        if (!isValid) {
            await storageService.clearSession()
            return false
        }

        return true
    }

    static async getCurrentUser() {
        return await storageService.getUser()
    }

    static async getCurrentToken() {
        return await storageService.getToken()
    }
}

export default AuthModel