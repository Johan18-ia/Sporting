// src/services/jwtService.js

class JWTService {

  // ==========================================
  // GUARDAR TOKEN
  // ==========================================
  saveToken(token) {

    try {

      localStorage.setItem(
        'sporty_token',
        token
      )

      console.log(
        '💾 Token guardado'
      )

      return true

    } catch (error) {

      console.error(
        '❌ Error guardando token:',
        error
      )

      return false
    }
  }

  // ==========================================
  // OBTENER TOKEN
  // ==========================================
  getToken() {

    return localStorage.getItem(
      'sporty_token'
    )
  }

  // ==========================================
  // ELIMINAR TOKEN
  // ==========================================
  removeToken() {

    localStorage.removeItem(
      'sporty_token'
    )
  }

  // ==========================================
  // DECODIFICAR TOKEN
  // ==========================================
  decodeToken(token) {

    try {

      if (!token) return null

      const parts = token.split('.')

      if (parts.length !== 3) {
        return null
      }

      return JSON.parse(
        atob(parts[1])
      )

    } catch (error) {

      console.error(
        '❌ Error decodificando token:',
        error
      )

      return null
    }
  }

  // ==========================================
  // VALIDAR TOKEN
  // ==========================================
  verifyToken(token) {

    try {

      if (!token) {
        return false
      }

      const payload =
        this.decodeToken(token)

      if (!payload) {
        return false
      }

      if (payload.exp) {

        const currentTime =
          Date.now()

        const expirationTime =
          payload.exp * 1000

        const tolerance =
          5 * 60 * 1000

        if (
          expirationTime + tolerance <
          currentTime
        ) {

          console.warn(
            '⚠️ Token expirado'
          )

          return false
        }
      }

      return true

    } catch (error) {

      console.error(
        '❌ Error verificando token:',
        error
      )

      return false
    }
  }

  // ==========================================
  // TIEMPO RESTANTE
  // ==========================================
  getTokenRemainingTime(token) {

    try {

      const payload =
        this.decodeToken(token)

      if (
        !payload ||
        !payload.exp
      ) {
        return 0
      }

      const remainingTime =
        payload.exp * 1000 -
        Date.now()

      return remainingTime > 0
        ? remainingTime
        : 0

    } catch (error) {

      console.error(
        '❌ Error obteniendo tiempo restante:',
        error
      )

      return 0
    }
  }

  // ==========================================
  // OBTENER USUARIO DEL TOKEN
  // ==========================================
  getUserFromToken(token) {

    const payload =
      this.decodeToken(token)

    if (!payload) {
      return null
    }

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role
    }
  }

  // ==========================================
  // TOKEN VÁLIDO ACTUAL
  // ==========================================
  isAuthenticated() {

    const token =
      this.getToken()

    return this.verifyToken(
      token
    )
  }
}

export default new JWTService()