// src/services/storageService.ts
// ====================================================
// SERVICIO DE ALMACENAMIENTO - Adaptado para AsyncStorage
// ====================================================
import AsyncStorage from '@react-native-async-storage/async-storage'

class StorageService {
    private tokenKey: string = 'auth_token'
    private userKey: string = 'user_data'
    private roleKey: string = 'user_role'

    // ============================================
    // TOKEN
    // ============================================
    async setToken(token: string): Promise<void> {
        try {
            await AsyncStorage.setItem(this.tokenKey, token)
            console.log('💾 Token guardado')
        } catch (error) {
            console.error('Error al guardar token:', error)
        }
    }

    async getToken(): Promise<string | null> {
        try {
            const token = await AsyncStorage.getItem(this.tokenKey)
            console.log('🔑 Token obtenido:', token ? 'Sí' : 'No')
            return token
        } catch (error) {
            console.error('Error al obtener token:', error)
            return null
        }
    }

    async removeToken(): Promise<void> {
        try {
            await AsyncStorage.removeItem(this.tokenKey)
            console.log('🗑️ Token eliminado')
        } catch (error) {
            console.error('Error al eliminar token:', error)
        }
    }

    // ============================================
    // USUARIO
    // ============================================
    async setUser(user: any): Promise<void> {
        try {
            await AsyncStorage.setItem(this.userKey, JSON.stringify(user))
            console.log('💾 Usuario guardado:', user.email)
        } catch (error) {
            console.error('Error al guardar usuario:', error)
        }
    }

    async getUser(): Promise<any> {
        try {
            const user = await AsyncStorage.getItem(this.userKey)
            return user ? JSON.parse(user) : null
        } catch (error) {
            console.error('Error al obtener usuario:', error)
            return null
        }
    }

    async removeUser(): Promise<void> {
        try {
            await AsyncStorage.removeItem(this.userKey)
        } catch (error) {
            console.error('Error al eliminar usuario:', error)
        }
    }

    // ============================================
    // ROL
    // ============================================
    async setUserRole(role: string): Promise<void> {
        try {
            await AsyncStorage.setItem(this.roleKey, role)
        } catch (error) {
            console.error('Error al guardar rol:', error)
        }
    }

    async getUserRole(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(this.roleKey)
        } catch (error) {
            console.error('Error al obtener rol:', error)
            return null
        }
    }

    async removeUserRole(): Promise<void> {
        try {
            await AsyncStorage.removeItem(this.roleKey)
        } catch (error) {
            console.error('Error al eliminar rol:', error)
        }
    }

    // ============================================
    // LIMPIAR SESIÓN
    // ============================================
    async clearSession(): Promise<void> {
        await this.removeToken()
        await this.removeUser()
        await this.removeUserRole()
        console.log('🧹 Sesión limpiada')
    }
}

export default new StorageService()