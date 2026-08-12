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
        
        console.log('Headers:', JSON.stringify(config.headers, null, 2));
        return config;
    },
    (error) => {
        console.error('Error en interceptor de solicitud:', error);
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
        console.error('Error en respuesta:', error.config?.url);
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data?.message || error.message);
        
        if (error.response?.status === 401) {
            console.log('Token expirado o invalido, limpiando sesion');
            await AsyncStorage.removeItem('auth_token');
            await AsyncStorage.removeItem('user_data');
        }
        return Promise.reject(error);
    }
);

export { ApiDelivery };