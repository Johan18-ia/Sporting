// src/models/AuthModel.js

import httpService from '../services/httpService'
import storageService from '../services/storageService'
import jwtService from '../services/jwtService'
import API_CONFIG from '../config/api'

class AuthModel {

  // ==========================================
  // LOGIN
  // ==========================================
  static async login(credentials) {
    try {

      console.log('🔐 Enviando login a API real:', credentials.email)
      console.log(
        '🔐 URL completa:',
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`
      )

      const response = await httpService.post(
        API_CONFIG.ENDPOINTS.LOGIN,
        {
          email: credentials.email,
          password: credentials.password
        },
        false
      )

      console.log(
        '📦 Respuesta COMPLETA del login:',
        JSON.stringify(response, null, 2)
      )

      // Verificar respuesta del backend
      if (!response.success) {
        console.error(
          '❌ Login rechazado por la API:',
          response.message
        )

        return {
          success: false,
          error:
            response.message ||
            'Credenciales incorrectas'
        }
      }

      // Obtener datos del usuario
      const userDataFromApi = response.data

      if (!userDataFromApi) {
        console.error(
          '❌ No existe response.data'
        )

        return {
          success: false,
          error:
            'El servidor no devolvió datos del usuario'
        }
      }

      console.log(
        '👤 Datos usuario:',
        userDataFromApi
      )

      // Obtener token
      const sessionToken =
        userDataFromApi.session_token

      if (!sessionToken) {
        console.error(
          '❌ session_token no encontrado'
        )

        return {
          success: false,
          error:
            'No fue posible obtener el token'
        }
      }

      let token = sessionToken

      // Algunos backends envían:
      // JWT xxxxxxxxx
      if (
        sessionToken &&
        sessionToken.startsWith('JWT ')
      ) {
        token = sessionToken.substring(4)
      }

      console.log('✅ Token obtenido')

      // Guardar token
      storageService.setToken(token)

      // También guardarlo usando jwtService
      if (jwtService.saveToken) {
        jwtService.saveToken(token)
      }

      // Normalizar usuario
      const userData = {
        id: userDataFromApi.id || null,
        email: userDataFromApi.email || '',
        name:
          userDataFromApi.name ||
          userDataFromApi.email?.split('@')[0] ||
          '',
        lastname:
          userDataFromApi.lastname || '',
        role:
          userDataFromApi.role || 'USER',
        phone:
          userDataFromApi.phone || '',
        image:
          userDataFromApi.image || ''
      }

      console.log(
        '💾 Guardando usuario:',
        userData
      )

      storageService.setUser(userData)

      if (
        storageService.setUserRole &&
        userData.role
      ) {
        storageService.setUserRole(
          userData.role
        )
      }

      console.log(
        '✅ Login exitoso:',
        userData.email
      )

      return {
        success: true,
        token,
        user: userData
      }

    } catch (error) {

      console.error(
        '❌ Error durante login:',
        error
      )

      return {
        success: false,
        error:
          error.message ||
          'Error de conexión con el servidor'
      }
    }
  }

  // ==========================================
  // REGISTRO
  // ==========================================
  static async register(userData) {
    try {

      console.log(
        '📝 Registrando usuario:',
        userData.email
      )

      const userToCreate = {
        name: userData.name,
        lastname:
          userData.lastname || '',
        email: userData.email,
        password: userData.password,
        phone: userData.phone || '',
        image: userData.image || '',
        role: userData.role || 'USER'
      }

      console.log(
        '📤 Datos enviados:',
        userToCreate
      )

      const response = await httpService.post(
        API_CONFIG.ENDPOINTS.REGISTER,
        userToCreate,
        false
      )

      console.log(
        '📦 Respuesta registro:',
        response
      )

      if (!response.success) {

        console.error(
          '❌ Registro rechazado:',
          response.message
        )

        return {
          success: false,
          error:
            response.message ||
            'No fue posible registrar el usuario'
        }
      }

      const createdUser =
        response.data || response

      console.log(
        '✅ Usuario creado:',
        createdUser
      )

      return {
        success: true,
        user: createdUser,
        message:
          'Usuario registrado exitosamente'
      }

    } catch (error) {

      console.error(
        '❌ Error durante registro:',
        error
      )

      return {
        success: false,
        error:
          error.message ||
          'Error al registrar usuario'
      }
    }
  }

  // ==========================================
  // LOGOUT
  // ==========================================
  static async logout() {
    try {

      console.log(
        '🚪 Cerrando sesión'
      )

      storageService.clearSession()

      if (jwtService.removeToken) {
        jwtService.removeToken()
      }

      return {
        success: true
      }

    } catch (error) {

      console.error(
        '❌ Error durante logout:',
        error
      )

      return {
        success: false,
        error: error.message
      }
    }
  }

  // ==========================================
  // AUTENTICACIÓN
  // ==========================================
  static isAuthenticated() {

    const token =
      storageService.getToken()

    if (!token) {
      console.warn(
        '⚠️ No existe token'
      )
      return false
    }

    // Si existe verifyToken
    if (jwtService.verifyToken) {

      const isValid =
        jwtService.verifyToken(token)

      if (!isValid) {

        console.warn(
          '⚠️ Token inválido'
        )

        storageService.clearSession()

        return false
      }
    }

    return true
  }

  // ==========================================
  // USUARIO ACTUAL
  // ==========================================
  static getCurrentUser() {
    return storageService.getUser()
  }

  static getCurrentToken() {
    return storageService.getToken()
  }
}

export default AuthModel