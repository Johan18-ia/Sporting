// src/domain/useCases/userLocal/GetUserLocal.ts
import { UserLocalRepositoryImpl } from '../../../data/repositories/UserLocalRepository';

const { getUser } = new UserLocalRepositoryImpl();

export const GetUserLocalUseCase = async () => {
    return await getUser();
};