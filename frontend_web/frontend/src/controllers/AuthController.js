// src/controllers/AuthController.js
import AuthModel from '../models/AuthModel'
class AuthController {

  // ==========================================
  // LOGIN
  // ==========================================
  static async login(credentials) {
    try {
      console.log(
        '🔧 AuthController: Procesando login para:',
        credentials.email
      )
      // Validar email
      if (!credentials.email) {
        return {
          success: false,
          error: 'El correo es obligatorio'
        }
      }
      // Validar contraseña
      if (!credentials.password) {
        return {
          success: false,
          error: 'La contraseña es obligatoria'
        }
      }
      // Validar formato email
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(credentials.email)) {
        return {
          success: false,
          error: 'Ingrese un correo válido'
        }
      }
      // Llamar al modelo
      const result =
        await AuthModel.login(credentials)
      console.log(
        '📊 Resultado login:',
        result
      )
      return result
    } catch (error) {
      console.error(
        '❌ Error AuthController.login:',
        error
      )
      return {
        success: false,
        error:
          error.message ||
          'Error al conectar con el servidor'
      }
    }
  }

  // ==========================================
  // REGISTRO
  // ==========================================
  static async register(userData) {
    try {
      console.log(
        '🔧 AuthController: Procesando registro:',
        userData.email
      )
      // Validar nombre
      if (!userData.name) {
        return {
          success: false,
          error: 'El nombre es obligatorio'
        }
      }
      // Validar apellido
      if (!userData.lastname) {
        return {
          success: false,
          error: 'El apellido es obligatorio'
        }
      }
      // Validar email
      if (!userData.email) {
        return {
          success: false,
          error: 'El correo es obligatorio'
        }
      }
      // Validar contraseña
      if (!userData.password) {
        return {
          success: false,
          error: 'La contraseña es obligatoria'
        }
      }
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(userData.email)) {
        return {
          success: false,
          error: 'Ingrese un correo válido'
        }
      }
      if (userData.password.length < 6) {
        return {
          success: false,
          error:
            'La contraseña debe tener mínimo 6 caracteres'
        }
      }
      const result =
        await AuthModel.register(userData)
      console.log(
        '📊 Resultado registro:',
        result
      )
      return result
    } catch (error) {
      console.error(
        '❌ Error AuthController.register:',
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
      return await AuthModel.logout()
    } catch (error) {
      console.error(
        '❌ Error logout:',
        error
      )
      return {
        success: false,
        error:
          error.message ||
          'Error al cerrar sesión'
      }
    }
  }

  // ==========================================
  // ESTADO DE AUTENTICACIÓN
  // ==========================================
  static getAuthState() {
    return {
      isAuthenticated:
        AuthModel.isAuthenticated(),
      currentUser:
        AuthModel.getCurrentUser(),
      currentToken:
        AuthModel.getCurrentToken()
    }
  }

  // ==========================================
  // VALIDAR SESIÓN
  // ==========================================
  static async checkAuth() {
    try {
      const valid =
        AuthModel.isAuthenticated()
      if (!valid) {
        await AuthModel.logout()
      }
      return valid
    } catch (error) {
      console.error(
        '❌ Error checkAuth:',
        error
      )
      return false
    }
  }

  // ==========================================
  // USUARIO ACTUAL
  // ==========================================
  static getCurrentUser() {
    return AuthModel.getCurrentUser()
  }
  static getCurrentToken() {
    return AuthModel.getCurrentToken()
  }

  // ==========================================
  // ROLES
  // ==========================================
  static getUserRole() {
    const user =
      AuthModel.getCurrentUser()
    return user?.role || null
  }
  static hasRole(requiredRole) {
    const role =
      this.getUserRole()
    return role === requiredRole
  }
  static hasAnyRole(allowedRoles = []) {
    const role =
      this.getUserRole()
    return allowedRoles.includes(role)
  }
  static isAdmin() {
    return this.hasRole('ADMIN')
  }
  static isCoach() {
    return this.hasRole('COACH')
  }
  static isStudent() {
    return this.hasRole('STUDENT')
  }
}
export default AuthController