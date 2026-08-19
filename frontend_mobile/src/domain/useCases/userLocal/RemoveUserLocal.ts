// Encargado: Caso de uso - RemoveUserLocal
// Descripción: Elimina el usuario del almacenamiento local
// Archivo: src/domain/useCases/userLocal/RemoveUserLocal.ts
// ============================================

// src/domain/useCases/userLocal/RemoveUserLocal.ts
import { UserLocalRepositoryImpl } from '../../../data/repositories/UserLocalRepository';

const { remove } = new UserLocalRepositoryImpl();

export const RemoveUserLocalUseCase = async () => {
    return await remove();
};