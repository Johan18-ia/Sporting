// src/services/httpService.js
// ====================================================
// SERVICIO HTTP - CORREGIDO CON MEJOR MANEJO DE ERRORES
// ====================================================
import API_CONFIG from '../config/api'

class HttpService {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL
    }

    getToken() {
        return localStorage.getItem('auth_token')
    }

    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json'
        }

        if (includeAuth) {
            const token = this.getToken()
            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }
        }

        return headers
    }

    // ============================================
    // MANEJO DE RESPUESTAS MEJORADO
    // ============================================
    async handleResponse(response) {
        console.log('📡 Response status:', response.status)

        let data = {}
        let errorMessage = `Error HTTP: ${response.status}`

        try {
            // Intentar parsear como JSON
            data = await response.json()
            
            // Si la respuesta tiene un mensaje de error del backend, usarlo
            if (data.message) errorMessage = data.message
            if (data.error) errorMessage = data.error
            
            console.log('📡 Response data (JSON):', data)
        } catch (e) {
            // Si no es JSON, leer como texto
            try {
                const text = await response.text()
                if (text) errorMessage = text
                console.warn('📡 Response data (text):', text)
            } catch (textError) {
                console.error('Error al leer respuesta como texto:', textError)
            }
            console.warn('⚠️ La respuesta no es un JSON válido:', e)
        }

        if (!response.ok) {
            // Lanzar un error con el mensaje específico
            throw new Error(errorMessage)
        }

        return data
    }

    // ============================================
    // POST
    // ============================================
    async post(endpoint, data, includeAuth = true) {
        try {
            const url = `${this.baseURL}${endpoint}`
            console.log(`📡 POST a: ${url}`)
            console.log('📡 Datos enviados:', data)

            const response = await fetch(url, {
                method: 'POST',
                headers: this.getHeaders(includeAuth),
                body: JSON.stringify(data)
            })

            console.log('📡 Status:', response.status)
            return await this.handleResponse(response)
        } catch (error) {
            console.error(`❌ POST ${endpoint} error:`, error)
            throw error
        }
    }

    // ============================================
    // GET
    // ============================================
    async get(endpoint, includeAuth = true) {
        try {
            const url = `${this.baseURL}${endpoint}`
            console.log(`📡 GET: ${url}`)
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(includeAuth)
            })
            return await this.handleResponse(response)
        } catch (error) {
            console.error(`❌ GET ${endpoint} error:`, error)
            throw error
        }
    }

    // ============================================
    // PUT
    // ============================================
    async put(endpoint, data, includeAuth = true) {
        try {
            const url = `${this.baseURL}${endpoint}`
            console.log(`📡 PUT a: ${url}`)
            const response = await fetch(url, {
                method: 'PUT',
                headers: this.getHeaders(includeAuth),
                body: JSON.stringify(data)
            })
            return await this.handleResponse(response)
        } catch (error) {
            console.error(`❌ PUT ${endpoint} error:`, error)
            throw error
        }
    }

    // ============================================
    // PATCH
    // ============================================
    async patch(endpoint, data, includeAuth = true) {
        try {
            const url = `${this.baseURL}${endpoint}`
            console.log(`📡 PATCH a: ${url}`)
            const response = await fetch(url, {
                method: 'PATCH',
                headers: this.getHeaders(includeAuth),
                body: JSON.stringify(data)
            })
            return await this.handleResponse(response)
        } catch (error) {
            console.error(`❌ PATCH ${endpoint} error:`, error)
            throw error
        }
    }

    // ============================================
    // DELETE
    // ============================================
    async delete(endpoint, includeAuth = true) {
        try {
            const url = `${this.baseURL}${endpoint}`
            console.log(`📡 DELETE a: ${url}`)
            const response = await fetch(url, {
                method: 'DELETE',
                headers: this.getHeaders(includeAuth)
            })
            return await this.handleResponse(response)
        } catch (error) {
            console.error(`❌ DELETE ${endpoint} error:`, error)
            throw error
        }
    }
}

export default new HttpService()