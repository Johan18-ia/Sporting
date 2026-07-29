// src/services/storageService.ts
// ====================================================
// SERVICIO DE ALMACENAMIENTO - AsyncStorage
// Compatible con el storageService.js del web (mismas claves)
// ====================================================
import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_KEYS } from '../config/storageKeys'
import type { User, UserRole } from '../types'

class StorageService {
  // ============================================
  // TOKEN
  // ============================================
  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
      console.log('💾 Token guardado')
    } catch (error) {
      console.error('Error al guardar token:', error)
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    } catch (error) {
      console.error('Error al obtener token:', error)
      return null
    }
  }

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      console.log('🗑️ Token eliminado')
    } catch (error) {
      console.error('Error al eliminar token:', error)
    }
  }

  // ============================================
  // USER
  // ============================================
  async setUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user))
      console.log('💾 Usuario guardado:', user.email)
    } catch (error) {
      console.error('Error al guardar usuario:', error)
    }
  }

  async getUser(): Promise<User | null> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA)
      return raw ? (JSON.parse(raw) as User) : null
    } catch (error) {
      console.error('Error al obtener usuario:', error)
      return null
    }
  }

  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA)
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
    }
  }

  // ============================================
  // ROLE
  // ============================================
  async setUserRole(role: UserRole): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_ROLE, role)
    } catch (error) {
      console.error('Error al guardar rol:', error)
    }
  }

  async getUserRole(): Promise<UserRole | null> {
    try {
      const role = await AsyncStorage.getItem(STORAGE_KEYS.USER_ROLE)
      return (role as UserRole) || null
    } catch (error) {
      console.error('Error al obtener rol:', error)
      return null
    }
  }

  async removeUserRole(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_ROLE)
    } catch (error) {
      console.error('Error al eliminar rol:', error)
    }
  }

  // ============================================
  // SESSION
  // ============================================
  async clearSession(): Promise<void> {
    await this.removeToken()
    await this.removeUser()
    await this.removeUserRole()
    console.log('🧹 Sesión limpiada')
  }
}

export default new StorageService()