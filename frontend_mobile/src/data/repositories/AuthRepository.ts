// Encargado: Repositorio de datos - Auth
// Descripción: Implementación para llamadas de autenticación al backend
// Archivo: src/data/repositories/AuthRepository.ts
// ============================================

// src/data/repositories/AuthRepository.ts
import { AxiosError } from 'axios';
import { User, UserLogin } from '../../domain/entities/User';
import { AuthRepository } from '../../domain/repositories/AuthRepository';
import { ApiDelivery } from '../sources/remote/api/ApiDelivery';
import { ResponseApiDelivery } from '../sources/remote/models/ResponseApiDelivery';

// ============================================
// Antes se hacia JSON.parse(JSON.stringify(e.response?.data)).
// El problema: cuando la peticion falla SIN respuesta del servidor
// (IP incorrecta, backend apagado, sin conexion, timeout), e.response
// es undefined. JSON.stringify(undefined) devuelve undefined (no un
// string), y JSON.parse(undefined) lo convierte a texto "undefined"
// y truena con "Unexpected character: u" — exactamente el error que
// viste. Esta version maneja ese caso sin reventar la app.
// ============================================
const buildSafeError = (error: unknown): ResponseApiDelivery => {
    const e = error as AxiosError;

    if (e.response?.data) {
        // El servidor SI respondio (ej. 401, 400) con un cuerpo JSON valido
        return e.response.data as ResponseApiDelivery;
    }

    if (e.request) {
        // La peticion salio pero nunca hubo respuesta (IP incorrecta,
        // backend apagado, celular sin acceso al servidor, etc.)
        return {
            success: false,
            message: 'No se pudo conectar con el servidor. Verifica que el backend esté encendido y que la IP en src/config/api.ts sea la correcta.'
        };
    }

    return {
        success: false,
        message: e.message || 'Ocurrió un error inesperado'
    };
};

export class AuthRepositoryImpl implements AuthRepository {
    async login(credentials: UserLogin): Promise<ResponseApiDelivery> {
        try {
            const response = await ApiDelivery.post<ResponseApiDelivery>('/users/login', {
                email: credentials.email,
                password: credentials.password
            });
            return Promise.resolve(response.data);
        } catch (error) {
            console.log('Error login:', error);
            return Promise.resolve(buildSafeError(error));
        }
    }

    async register(user: User): Promise<ResponseApiDelivery> {
        try {
            const response = await ApiDelivery.post<ResponseApiDelivery>('/users/create', user);
            return Promise.resolve(response.data);
        } catch (error) {
            console.log('Error register:', error);
            return Promise.resolve(buildSafeError(error));
        }
    }
}