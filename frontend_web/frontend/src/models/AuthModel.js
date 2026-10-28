/**
 * AuthModel.js:
 * - ¿Qué hace? Envía las peticiones de login y registro al backend y normaliza la respuesta para la capa de vista.
 * - ¿Qué función cumple en el proyecto? Es el modelo equivalente al auth del mobile que guarda la sesión con usuario y JWT.
 * - Origen mobile equivalente: frontend_mobile/src/data/repositories/UserLocalRepository.ts y frontend_mobile/src/hooks/useAuth.ts
 */
import httpService from '../services/httpService'
import storageService from '../services/storageService'
import jwtService from '../services/jwtService'
import API_CONFIG from '../config/api'

class AuthModel {
  static async login(credentials) {
    try {
      const normalizedCredentials = {
        email: String(credentials?.email || '').trim(),
        password: String(credentials?.password || '')
      }

      const response = await httpService.post(
        API_CONFIG.ENDPOINTS.LOGIN,
        normalizedCredentials,
        false
      )

      if (!response || !response.success) {
        return {
          success: false,
          error: response?.message || 'Contraseña o correo incorrecto'
        }
      }

      const userDataFromApi = response.data

      if (!userDataFromApi) {
        return {
          success: false,
          error: 'Error en la respuesta del servidor: no hay datos'
        }
      }

      const sessionToken = userDataFromApi.session_token || userDataFromApi.token
      if (!sessionToken) {
        return {
          success: false,
          error: 'Error al obtener token de autenticación'
        }
      }

      const token = String(sessionToken).replace(/^JWT\s+/i, '').trim()
      const userData = {
        id: userDataFromApi.id,
        email: userDataFromApi.email,
        name: userDataFromApi.name || userDataFromApi.email?.split('@')[0] || '',
        lastname: userDataFromApi.lastname || '',
        role: userDataFromApi.role || 'user',
        user_type: userDataFromApi.user_type || 'none',
        phone: userDataFromApi.phone || '',
        image: userDataFromApi.image || '',
        session_token: token,
        expiresAt: storageService.getTokenExpiry(token)
      }

      storageService.saveUser(userData)
      storageService.setUserRole(userData.role)

      return {
        success: true,
        token,
        user: userData,
        data: userData,
        message: response.message || 'Usuario autenticado'
      }
    } catch (error) {
      const message = error?.message || 'Error de conexión con el servidor'
      return {
        success: false,
        error: message
      }
    }
  }

  static async register(userData) {
    try {
      const userToCreate = {
        name: userData.name,
        lastname: userData.lastname || '',
        email: userData.email,
        password: userData.password,
        phone: userData.phone || '',
        image: userData.image || '',
        role: userData.role || 'user',
        user_type: userData.user_type || 'student',
        document: userData.document || null,
        birth_date: userData.birth_date || null,
        category_id: userData.category_id || null,
        address: userData.address || null,
        emergency_contact_name: userData.emergency_contact_name || null,
        emergency_contact_phone: userData.emergency_contact_phone || null,
        occupation: userData.occupation || null
      }

      const response = await httpService.post(
        API_CONFIG.ENDPOINTS.REGISTER,
        userToCreate,
        false
      )

      if (!response || !response.success) {
        return {
          success: false,
          error: response?.message || 'Error al registrar usuario'
        }
      }

      const createdUser = response.data || response

      return {
        success: true,
        user: createdUser,
        data: createdUser,
        message: response.message || 'Usuario registrado exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        error: error?.message || 'Error al registrar usuario'
      }
    }
  }

  static async logout() {
    try {
      storageService.clearSession()
      return { success: true }
    } catch (error) {
      console.error('Error en logout:', error)
      return { success: false, error: error.message }
    }
  }

  static isAuthenticated() {
    const token = storageService.getToken()
    if (!token) return false

    const isValid = jwtService.verifyToken(token)

    if (!isValid) {
      storageService.clearSession()
      return false
    }

    return true
  }

  static getCurrentUser() {
    return storageService.getUser()
  }

  static getCurrentToken() {
    return storageService.getToken()
  }
}

export default AuthModel