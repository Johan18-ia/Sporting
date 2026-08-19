// Encargado: Caso de uso - SaveUserLocal
// Descripción: Guarda el usuario en almacenamiento local
// Archivo: src/domain/useCases/userLocal/SaveUserLocal.ts
// ============================================

// src/domain/useCases/userLocal/SaveUserLocal.ts
import { UserLocalRepositoryImpl } from '../../../data/repositories/UserLocalRepository';
import { User } from '../../entities/User';

const { save } = new UserLocalRepositoryImpl();

export const SaveUserLocalUseCase = async (user: User) => {
    return await save(user);
};