// src/domain/useCases/auth/LoginAuth.ts
import { AuthRepositoryImpl } from '../../../data/repositories/AuthRepository';
import { UserLogin } from '../../entities/User';

const { login } = new AuthRepositoryImpl();

export const LoginAuthUseCase = async (credentials: UserLogin) => {
    return await login(credentials);
};