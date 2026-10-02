// Encargado: Cliente HTTP - ApiDelivery
// Descripción: Configuración de axios con interceptores para auth y logging
// Archivo: src/data/sources/remote/api/ApiDelivery.ts
// ============================================
// frontend_mobile/src/data/sources/remote/api/ApiDelivery.ts

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

// Interceptor para verificar token
ApiDelivery.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('auth_token') || '';
        const expiryStr = await AsyncStorage.getItem('auth_token_expiry');
        if (expiryStr) {
            const expiry = Number(expiryStr);
            if (!isNaN(expiry) && expiry <= Date.now()) {
                console.log('Token expirado detectado en interceptor, limpiando sesión');
                await AsyncStorage.removeItem('auth_token');
                await AsyncStorage.removeItem('auth_token_expiry');
                await AsyncStorage.removeItem('user_data');
                return Promise.reject(new Error('Token expired'));
            }
        }
        const normalizedToken = token.replace(/^bearer\s+/i, '').replace(/^jwt\s+/i, '').trim();
        
        console.log('Peticion a:', config.url);
        console.log('Token en interceptor:', normalizedToken ? 'Existe' : 'No existe');
        
        if (normalizedToken) {
            if (normalizedToken.length < 10) {
                console.warn('Token demasiado corto:', normalizedToken);
            } else {
                console.log('Token:', normalizedToken.substring(0, 20) + '...');
                config.headers.Authorization = `Bearer ${normalizedToken}`;
                console.log('Token agregado al header Authorization');
            }
        } else {
            console.warn('No hay token para esta peticion');
        }
        
        console.log('Headers configurados para la petición');
        return config;
    },
    (error) => {
        console.error('Error en interceptor de solicitud:', error?.message || 'Error desconocido');
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas
ApiDelivery.interceptors.response.use(
    (response) => {
        console.log('Respuesta exitosa de:', response.config.url);
        console.log('Status:', response.status);
        return response;
    },
    async (error) => {
        const isLoginRequest = error.config?.url?.includes('/users/login');
        const errorMessage = String(error.response?.data?.message || error.message || 'Error desconocido');
        if (isLoginRequest && error.response?.status === 401) {
            console.log('Credenciales invalidas en login:', errorMessage);
        } else {
            console.error('Error en respuesta:', String(error.config?.url || 'URL desconocida'));
            console.error('Status:', String(error.response?.status || 'Sin respuesta'));
            console.error('Mensaje:', errorMessage);
        }

        if (error.response?.status === 401 && !isLoginRequest) {
            console.log('Token expirado o invalido, limpiando sesion');
            await AsyncStorage.removeItem('auth_token');
            await AsyncStorage.removeItem('user_data');
        }
        return Promise.reject(error);
    }
);

export { ApiDelivery };