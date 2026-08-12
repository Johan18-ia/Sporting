// Encargado: Repositorio - Auth
// Descripción: Comunicación con el backend para endpoints de autenticación
// Archivo: src/domain/repositories/AuthRepository.ts
// ============================================

// src/domain/repositories/AuthRepository.ts
import { User, UserLogin } from '../entities/User';
import { ResponseApiDelivery } from '../../data/sources/remote/models/ResponseApiDelivery';

export interface AuthRepository {
    login(credentials: UserLogin): Promise<ResponseApiDelivery>;
    register(user: User): Promise<ResponseApiDelivery>;
}