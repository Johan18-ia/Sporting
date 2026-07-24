// src/services/httpService.ts
// ====================================================
// SERVICIO HTTP - Adaptado para React Native
// ====================================================
import API_CONFIG from '../config/api'
import storageService from './storageService'

class HttpService {
    private baseURL: string

    constructor() {
        this.baseURL = API_CONFIG.BASE_URL
    }

    async getToken(): Promise<string | null> {
        return await storageService.getToken()
    }

    async getHeaders(includeAuth: boolean = true): Promise<HeadersInit> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json'
        }

        if (includeAuth) {
            const token = await this.getToken()
            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }
        }

        return headers
    }

    async handleResponse(response: Response): Promise<any> {
        console.log('📡 Response status:', response.status)

        let data: any = {}
        let errorMessage = `Error HTTP: ${response.status}`

        try {
            data = await response.json()
            if (data.message) errorMessage = data.message
            if (data.error) errorMessage = data.error
            console.log('📡 Response data:', data)
        } catch (e) {
            try {
                const text = await response.text()
                if (text) errorMessage = text
                console.warn('📡 Response text:', text)
            } catch (textError) {
                console.error('Error al leer respuesta:', textError)
            }
        }

        if (!response.ok) {
            throw new Error(errorMessage)
        }

        return data
    }

    async post(endpoint: string, data: any, includeAuth: boolean = true): Promise<any> {
        try {
            const url = `${this.baseURL}${endpoint}`
            console.log(`📡 POST a: ${url}`)
            console.log('📡 Datos:', data)

            const response = await fetch(url, {
                method: 'POST',
                headers: await this.getHeaders(includeAuth),
                body: JSON.stringify(data)
            })

            return await this.handleResponse(response)
        } catch (error) {
            console.error(`❌ POST ${endpoint} error:`, error)
            throw error
        }
    }

    async get(endpoint: string, includeAuth: boolean = true): Promise<any> {
        try {
            const url = `${this.baseURL}${endpoint}`
            console.log(`📡 GET: ${url}`)

            const response = await fetch(url, {
                method: 'GET',
                headers: await this.getHeaders(includeAuth)
            })

            return await this.handleResponse(response)
        } catch (error) {
            console.error(`❌ GET ${endpoint} error:`, error)
            throw error
        }
    }

    async put(endpoint: string, data: any, includeAuth: boolean = true): Promise<any> {
        try {
            const url = `${this.baseURL}${endpoint}`
            console.log(`📡 PUT a: ${url}`)

            const response = await fetch(url, {
                method: 'PUT',
                headers: await this.getHeaders(includeAuth),
                body: JSON.stringify(data)
            })

            return await this.handleResponse(response)
        } catch (error) {
            console.error(`❌ PUT ${endpoint} error:`, error)
            throw error
        }
    }

    async patch(endpoint: string, data: any, includeAuth: boolean = true): Promise<any> {
        try {
            const url = `${this.baseURL}${endpoint}`
            console.log(`📡 PATCH a: ${url}`)

            const response = await fetch(url, {
                method: 'PATCH',
                headers: await this.getHeaders(includeAuth),
                body: JSON.stringify(data)
            })

            return await this.handleResponse(response)
        } catch (error) {
            console.error(`❌ PATCH ${endpoint} error:`, error)
            throw error
        }
    }

    async delete(endpoint: string, includeAuth: boolean = true): Promise<any> {
        try {
            const url = `${this.baseURL}${endpoint}`
            console.log(`📡 DELETE a: ${url}`)

            const response = await fetch(url, {
                method: 'DELETE',
                headers: await this.getHeaders(includeAuth)
            })

            return await this.handleResponse(response)
        } catch (error) {
            console.error(`❌ DELETE ${endpoint} error:`, error)
            throw error
        }
    }
}

export default new HttpService()