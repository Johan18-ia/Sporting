/**
 * storageService.js:
 * - ¿Qué hace? Gestiona la sesión persistida del usuario en localStorage, incluyendo token JWT y expiración.
 * - ¿Qué función cumple en el proyecto? Mantiene la autenticación del web sincronizada con el comportamiento móvil y evita sesiones inválidas.
 * - Origen mobile equivalente: frontend_mobile/src/data/repositories/UserLocalRepository.ts
 */
import jwtService from './jwtService'

class StorageService {
  constructor(storageType = 'localStorage') {
    this.storage = storageType === 'localStorage' ? localStorage : sessionStorage
    this.tokenKey = 'auth_token'
    this.userKey = 'user_data'
    this.roleKey = 'user_role'
    this.tokenExpiryKey = 'auth_token_expiry'
  }

  setToken(token) {
    const normalized = token ? String(token).replace(/^JWT\s+/i, '').trim() : ''
    if (!normalized) {
      this.removeToken()
      return false
    }

    this.setItem(this.tokenKey, normalized)
    const expiresAt = this.getTokenExpiry(normalized)
    this.setItem(this.tokenExpiryKey, String(expiresAt))
    return true
  }

  getToken() {
    const token = this.getItem(this.tokenKey)
    if (!token) return null

    if (this.isTokenExpired(token)) {
      this.clearSession()
      return null
    }

    return token
  }

  removeToken() {
    this.removeItem(this.tokenKey)
    this.removeItem(this.tokenExpiryKey)
    return true
  }

  saveUser(user) {
    if (!user || typeof user !== 'object') {
      return false
    }

    const sanitizedUser = { ...user }
    const token = sanitizedUser.session_token || this.getToken()

    if (token) {
      const normalizedToken = String(token).replace(/^JWT\s+/i, '').trim()
      sanitizedUser.session_token = normalizedToken
      sanitizedUser.expiresAt = this.getTokenExpiry(normalizedToken)
      this.setToken(normalizedToken)
    }

    const stored = this.setItem(this.userKey, JSON.stringify(sanitizedUser))
    return stored
  }

  getUser() {
    const rawUser = this.getItem(this.userKey)
    if (!rawUser) return null

    try {
      const user = JSON.parse(rawUser)
      const token = user?.session_token || this.getToken()

      if (!token || this.isTokenExpired(token)) {
        this.clearSession()
        return null
      }

      return user
    } catch (error) {
      console.error('Error al leer usuario del storage:', error)
      this.removeUser()
      return null
    }
  }

  removeUser() {
    this.removeItem(this.userKey)
    this.removeItem(this.roleKey)
    return true
  }

  setUserRole(role) {
    console.log('💾 Guardando rol en storage:', role)
    return this.setItem(this.roleKey, role)
  }

  getUserRole() {
    return this.getItem(this.roleKey)
  }

  removeUserRole() {
    return this.removeItem(this.roleKey)
  }

  clearSession() {
    this.removeToken()
    this.removeUser()
    this.removeUserRole()
  }

  isTokenExpired(token) {
    if (!token) return true

    const normalizedToken = String(token).replace(/^JWT\s+/i, '').trim()
    const payload = jwtService.decodeToken(normalizedToken)

    if (!payload || !payload.exp) {
      const storedExpiry = Number(this.getItem(this.tokenExpiryKey))
      if (storedExpiry && Date.now() > storedExpiry) {
        return true
      }
      return false
    }

    return Date.now() >= payload.exp * 1000
  }

  getTokenExpiry(token) {
    const normalizedToken = String(token || '').replace(/^JWT\s+/i, '').trim()
    const payload = jwtService.decodeToken(normalizedToken)

    if (payload && payload.exp) {
      return Number(payload.exp) * 1000
    }

    return Date.now() + 24 * 60 * 60 * 1000
  }

  setItem(key, value) {
    try {
      this.storage.setItem(key, value)
      return true
    } catch (error) {
      console.error('Error al guardar en storage:', error)
      return false
    }
  }

  getItem(key) {
    try {
      return this.storage.getItem(key)
    } catch (error) {
      console.error('Error al obtener del storage:', error)
      return null
    }
  }

  removeItem(key) {
    try {
      this.storage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error al eliminar del storage:', error)
      return false
    }
  }

  clear() {
    try {
      this.storage.clear()
      return true
    } catch (error) {
      console.error('Error al limpiar storage:', error)
      return false
    }
  }

  hasItem(key) {
    return this.getItem(key) !== null
  }
}

export default new StorageService('localStorage')