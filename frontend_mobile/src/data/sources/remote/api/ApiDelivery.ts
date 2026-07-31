// src/data/sources/remote/api/ApiDelivery.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG from '../../../../config/api';

const ApiDelivery = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: API_CONFIG.TIMEOUT
});

// Interceptor para agregar token a todas las peticiones
ApiDelivery.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de autenticación
ApiDelivery.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expirado o inválido
            await AsyncStorage.removeItem('auth_token');
            await AsyncStorage.removeItem('user_data');
        }
        return Promise.reject(error);
    }
);

export { ApiDelivery };