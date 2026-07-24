// src/services/jwtService.ts
// ====================================================
// SERVICIO JWT
// ====================================================
class JWTService {
    decodeToken(token: string): any {
        try {
            const parts = token.split('.')
            if (parts.length !== 3) return null
            const payload = JSON.parse(atob(parts[1]))
            return payload
        } catch (error) {
            console.error('Error al decodificar token:', error)
            return null
        }
    }

    verifyToken(token: string): boolean {
        try {
            if (!token) return false

            const parts = token.split('.')
            if (parts.length !== 3) return false

            const payload = JSON.parse(atob(parts[1]))

            // Verificar expiración con tolerancia de 5 minutos
            if (payload.exp) {
                const now = Date.now()
                const expTime = payload.exp * 1000
                const tolerance = 5 * 60 * 1000

                if (expTime + tolerance < now) {
                    console.warn('Token expirado')
                    return false
                }
            }

            return true
        } catch (error) {
            console.error('Error al verificar token:', error)
            return false
        }
    }

    getTokenRemainingTime(token: string): number {
        try {
            const payload = this.decodeToken(token)
            if (!payload || !payload.exp) return 0
            const remainingTime = (payload.exp * 1000) - Date.now()
            return remainingTime > 0 ? remainingTime : 0
        } catch (error) {
            return 0
        }
    }
}

export default new JWTService()