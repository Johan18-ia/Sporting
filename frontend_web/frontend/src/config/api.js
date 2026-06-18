// src/config/api.js

const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',

  TIMEOUT: 10000,

  ENDPOINTS: {
    LOGIN: '/users/login',
    REGISTER: '/users/create',

    USERS: '/users',

    USER_BY_ID: '/users/:id',

    UPDATE_USER: '/users',

    DELETE_USER: '/users/delete/:id'
  }
}

export default API_CONFIG