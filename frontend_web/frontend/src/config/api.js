// src/config/api.js
const API_CONFIG = {
  // Usa la IP real de tu máquina (la que muestra ipconfig/ifconfig)
  // Si es la misma máquina, usa 'http://localhost:3000/api'
  BASE_URL: 'http://localhost:3000/api',  // ← Verifica que esta IP sea correcta
  TIMEOUT: 10000,
  ENDPOINTS: {
    LOGIN: '/users/login',
    REGISTER: '/users/create',
    USERS: '/users',
    USER_BY_ID: '/users/:id',
    USER_DELETE: '/users/delete/:id'
  }
}

export default API_CONFIG