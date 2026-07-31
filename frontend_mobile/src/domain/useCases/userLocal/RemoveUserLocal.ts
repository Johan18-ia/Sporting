// src/domain/useCases/userLocal/RemoveUserLocal.ts
import { UserLocalRepositoryImpl } from '../../../data/repositories/UserLocalRepository';

const { remove } = new UserLocalRepositoryImpl();

export const RemoveUserLocalUseCase = async () => {
    return await remove();
};