// src/services/httpService.js

import API_CONFIG from '../config/api'

const TOKEN_KEY = 'sporty_token'

class HttpService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
  }
  // ============================
  // TOKEN
  // ============================
  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  }
  // ============================
  // HEADERS
  // ============================
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
  // ============================
  // RESPONSE HANDLER
  // ============================
  async handleResponse(response) {
    let data = null
    try {
      data = await response.json()
    } catch {
      data = null
    }
    if (!response.ok) {
      const message =
        data?.message ||
        data?.error ||
        `Error HTTP ${response.status}`
      if (response.status === 401) {
        localStorage.removeItem(TOKEN_KEY)
        window.location.href = '/login'
        throw new Error('Sesión expirada')
      }
      throw new Error(message)
    }
    return data
  }
  // ============================
  // TIMEOUT CONTROL
  // ============================
  createTimeoutController() {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
    }, API_CONFIG.TIMEOUT || 10000)
    return { controller, timeoutId }
  }
  // ============================
  // REQUEST BASE
  // ============================
  async request(method, endpoint, data = null, includeAuth = true) {
    const url = `${this.baseURL}${endpoint}`

    const { controller, timeoutId } = this.createTimeoutController()
    try {
      const response = await fetch(url, {
        method,
        headers: this.getHeaders(includeAuth),
        body: data ? JSON.stringify(data) : null,
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      return await this.handleResponse(response)
    } catch (error) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error('Tiempo de espera agotado')
      }
      throw error
    }
  }
  // ============================
  // MÉTODOS HTTP
  // ============================
  get(endpoint, includeAuth = true) {
    return this.request('GET', endpoint, null, includeAuth)
  }

  post(endpoint, data, includeAuth = true) {
    return this.request('POST', endpoint, data, includeAuth)
  }

  put(endpoint, data, includeAuth = true) {
    return this.request('PUT', endpoint, data, includeAuth)
  }

  patch(endpoint, data, includeAuth = true) {
    return this.request('PATCH', endpoint, data, includeAuth)
  }

  delete(endpoint, includeAuth = true) {
    return this.request('DELETE', endpoint, null, includeAuth)
  }
}
export default new HttpService()