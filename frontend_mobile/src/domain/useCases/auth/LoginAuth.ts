// Encargado: Caso de uso - LoginAuth
// Descripción: Lógica de autenticación (login) y manejo de errores
// Archivo: src/domain/useCases/auth/LoginAuth.ts
// ============================================

// src/domain/useCases/auth/LoginAuth.ts
import { AuthRepositoryImpl } from '../../../data/repositories/AuthRepository';
import { UserLogin } from '../../entities/User';

const { login } = new AuthRepositoryImpl();

export const LoginAuthUseCase = async (credentials: UserLogin) => {
    return await login(credentials);
};