// src/services/storageService.js

class StorageService {
  constructor(storageType = 'localStorage') {

    this.storage =
      storageType === 'localStorage'
        ? localStorage
        : sessionStorage

    // ==========================
    // CLAVES GLOBALES SPORTY
    // ==========================

    this.tokenKey = 'sporty_token'
    this.userKey = 'sporty_user'
    this.roleKey = 'sporty_role'
  }

  // ==========================
  // TOKEN
  // ==========================

  setToken(token) {
    console.log(
      '💾 Guardando token en storage'
    )

    return this.setItem(
      this.tokenKey,
      token
    )
  }

  getToken() {
    const token = this.getItem(
      this.tokenKey
    )

    console.log(
      '🔑 Token obtenido:',
      token ? 'Sí existe' : 'No existe'
    )

    return token
  }

  removeToken() {
    console.log(
      '🗑️ Eliminando token'
    )

    return this.removeItem(
      this.tokenKey
    )
  }

  // ==========================
  // USUARIO
  // ==========================

  setUser(user) {

    console.log(
      '💾 Guardando usuario:',
      user
    )

    return this.setItem(
      this.userKey,
      JSON.stringify(user)
    )
  }

  getUser() {

    const user = this.getItem(
      this.userKey
    )

    return user
      ? JSON.parse(user)
      : null
  }

  removeUser() {

    return this.removeItem(
      this.userKey
    )
  }

  // ==========================
  // ROL
  // ==========================

  setUserRole(role) {

    console.log(
      '💾 Guardando rol:',
      role
    )

    return this.setItem(
      this.roleKey,
      role
    )
  }

  getUserRole() {

    return this.getItem(
      this.roleKey
    )
  }

  removeUserRole() {

    return this.removeItem(
      this.roleKey
    )
  }

  // ==========================
  // SESIÓN
  // ==========================

  clearSession() {

    console.log(
      '🚪 Limpiando sesión'
    )

    this.removeToken()
    this.removeUser()
    this.removeUserRole()
  }

  // ==========================
  // MÉTODOS GENÉRICOS
  // ==========================

  setItem(key, value) {
    try {

      this.storage.setItem(
        key,
        value
      )

      return true

    } catch (error) {

      console.error(
        '❌ Error al guardar:',
        error
      )

      return false
    }
  }

  getItem(key) {
    try {

      return this.storage.getItem(
        key
      )

    } catch (error) {

      console.error(
        '❌ Error al obtener:',
        error
      )

      return null
    }
  }

  removeItem(key) {
    try {

      this.storage.removeItem(
        key
      )

      return true

    } catch (error) {

      console.error(
        '❌ Error al eliminar:',
        error
      )

      return false
    }
  }

  clear() {
    try {

      this.storage.clear()

      return true

    } catch (error) {

      console.error(
        '❌ Error al limpiar:',
        error
      )

      return false
    }
  }

  hasItem(key) {

    return (
      this.getItem(key) !== null
    )
  }
}

export default new StorageService(
  'localStorage'
)