// src/controllers/AuthController.js
// ====================================================
// CONTROLADOR: AUTH
// ====================================================
import AuthModel from '../models/AuthModel'

type AuthCallback = (data?: any, token?: string) => void

type ErrorCallback = (message: string) => void

class AuthController {
    // ============================================
    // MANEJAR LOGIN
    // ============================================
    static async handleLogin(credentials: { email: string; password: string }, onSuccess: AuthCallback, onError: ErrorCallback) {
        try {
            console.log('🔧 AuthController: Procesando login para:', credentials.email)

            // Validar que los campos no estén vacíos
            if (!credentials.email || !credentials.password) {
                onError('Por favor complete todos los campos')
                return
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(credentials.email)) {
                onError('Por favor ingrese un email válido')
                return
            }

            // Intentar login con la API real
            const result = await AuthModel.login(credentials)

            console.log('📊 Resultado del login:', result)

            if (result.success) {
                // Resultado exitoso
                onSuccess(result.user, result.token)
            } else {
                onError(result.error || 'Credenciales incorrectas')
            }
        } catch (error) {
            console.error('❌ Error en handleLogin:', error)
            onError('Error al conectar con el servidor')
        }
    }

    // ============================================
    // MANEJAR REGISTRO (SOLO ADMIN/SELLER)
    // ============================================
    static async handleRegister(userData: { email: string; password: string; name: string }, onSuccess: AuthCallback, onError: ErrorCallback) {
        try {
            console.log('🔧 AuthController: Procesando registro para:', userData.email)

            // ============================================
            // VALIDACIONES
            // ============================================
            if (!userData.email || !userData.password || !userData.name) {
                onError('Por favor complete todos los campos obligatorios (nombre, email, contraseña)')
                return
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(userData.email)) {
                onError('Por favor ingrese un email válido')
                return
            }

            if (userData.password.length < 6) {
                onError('La contraseña debe tener al menos 6 caracteres')
                return
            }

            // ============================================
            // REGISTRAR USUARIO (CON TOKEN DE ADMIN/SELLER)
            // ============================================
            const result = await AuthModel.register(userData)

            console.log('📊 Resultado del registro:', result)

            if (result.success) {
                onSuccess(result.user)
            } else {
                onError(result.error || 'Error al crear el usuario')
            }
        } catch (error) {
            console.error('❌ Error en handleRegister:', error)
            onError('Error al registrar usuario')
        }
    }

    // ============================================
    // MANEJAR LOGOUT
    // ============================================
    static async handleLogout(onSuccess: () => void, onError: ErrorCallback) {
        try {
            const result = await AuthModel.logout()
            if (result.success) {
                onSuccess()
            } else {
                onError(result.error || 'Error al cerrar sesión')
            }
        } catch (error) {
            onError('Error al cerrar sesión')
        }
    }

    // ============================================
    // OBTENER ESTADO DE AUTENTICACIÓN
    // ============================================
    static async getAuthState() {
        return {
            isAuthenticated: await AuthModel.isAuthenticated(),
            currentUser: await AuthModel.getCurrentUser(),
            currentToken: await AuthModel.getCurrentToken()
        }
    }

    // ============================================
    // VERIFICAR AUTENTICACIÓN
    // ============================================
    static async checkAuth() {
        const isValid = AuthModel.isAuthenticated()
        if (!isValid) {
            await AuthModel.logout()
        }
        return isValid
    }

    // ============================================
    // OBTENER ROL DEL USUARIO ACTUAL
    // ============================================
    static async getUserRole() {
        const user = await AuthModel.getCurrentUser()
        return user?.role || null
    }

    // ============================================
    // VERIFICAR SI EL USUARIO TIENE UN ROL ESPECÍFICO
    // ============================================
    static async hasRole(requiredRole: string) {
        const userRole = await this.getUserRole()
        return userRole === requiredRole
    }

    // ============================================
    // VERIFICAR SI EL USUARIO TIENE ALGUNO DE LOS ROLES PERMITIDOS
    // ============================================
    static async hasAnyRole(allowedRoles: string[]) {
        const userRole = await this.getUserRole()
        return userRole !== null && allowedRoles.includes(userRole)
    }

    // ============================================
    // VERIFICAR SI EL USUARIO PUEDE CREAR OTROS USUARIOS
    // ============================================
    static async canCreateUsers() {
        return this.hasAnyRole(['admin', 'seller'])
    }
}

export default AuthController