// src/services/httpService.js

import API_CONFIG from '../config/api'

const TOKEN_KEY = 'sporty_token'

class HttpService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  }

  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json'
    }

    if (includeAuth) {
      const token = this.getToken()

      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
    }

    return headers
  }

  async handleResponse(response) {
    console.log('📡 Response status:', response.status)

    let data = {}

    try {
      data = await response.json()
    } catch (error) {
      console.error('❌ Error al parsear JSON:', error)
    }

    console.log('📡 Response data:', data)

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem(TOKEN_KEY)

        window.location.href = '/login'

        throw new Error('Sesión expirada')
      }

      const errorMessage =
        data.message ||
        data.error ||
        `Error HTTP: ${response.status}`

      throw new Error(errorMessage)
    }

    return data
  }

  createTimeoutController() {
    const controller = new AbortController()

    const timeoutId = setTimeout(() => {
      controller.abort()
    }, API_CONFIG.TIMEOUT)

    return { controller, timeoutId }
  }

  async post(endpoint, data, includeAuth = true) {
    try {
      const url = `${this.baseURL}${endpoint}`

      console.log(`📡 POST: ${url}`)
      console.log('📡 Datos enviados:', data)

      const { controller, timeoutId } =
        this.createTimeoutController()

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(includeAuth),
        body: JSON.stringify(data),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      return await this.handleResponse(response)
    } catch (error) {
      console.error(`❌ POST ${endpoint}:`, error)

      if (error.name === 'AbortError') {
        throw new Error(
          'Tiempo de espera agotado'
        )
      }

      throw error
    }
  }

  async get(endpoint, includeAuth = true) {
    try {
      const url = `${this.baseURL}${endpoint}`

      console.log(`📡 GET: ${url}`)

      const { controller, timeoutId } =
        this.createTimeoutController()

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(includeAuth),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      return await this.handleResponse(response)
    } catch (error) {
      console.error(`❌ GET ${endpoint}:`, error)

      if (error.name === 'AbortError') {
        throw new Error(
          'Tiempo de espera agotado'
        )
      }

      throw error
    }
  }

  async put(endpoint, data, includeAuth = true) {
    try {
      const url = `${this.baseURL}${endpoint}`

      console.log(`📡 PUT: ${url}`)

      const { controller, timeoutId } =
        this.createTimeoutController()

      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(includeAuth),
        body: JSON.stringify(data),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      return await this.handleResponse(response)
    } catch (error) {
      console.error(`❌ PUT ${endpoint}:`, error)

      if (error.name === 'AbortError') {
        throw new Error(
          'Tiempo de espera agotado'
        )
      }

      throw error
    }
  }

  async patch(endpoint, data, includeAuth = true) {
    try {
      const url = `${this.baseURL}${endpoint}`

      console.log(`📡 PATCH: ${url}`)

      const { controller, timeoutId } =
        this.createTimeoutController()

      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.getHeaders(includeAuth),
        body: JSON.stringify(data),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      return await this.handleResponse(response)
    } catch (error) {
      console.error(`❌ PATCH ${endpoint}:`, error)

      if (error.name === 'AbortError') {
        throw new Error(
          'Tiempo de espera agotado'
        )
      }

      throw error
    }
  }

  async delete(endpoint, includeAuth = true) {
    try {
      const url = `${this.baseURL}${endpoint}`

      console.log(`📡 DELETE: ${url}`)

      const { controller, timeoutId } =
        this.createTimeoutController()

      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(includeAuth),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      return await this.handleResponse(response)
    } catch (error) {
      console.error(`❌ DELETE ${endpoint}:`, error)

      if (error.name === 'AbortError') {
        throw new Error(
          'Tiempo de espera agotado'
        )
      }

      throw error
    }
  }
}

export default new HttpService()