// src/data/repositories/UserLocalRepository.ts
import { User } from '../../domain/entities/User';
import { UserLocalRepository } from '../../domain/repositories/UserLocalRepository';
import { LocalStorage } from '../sources/local/LocalStorage';

export class UserLocalRepositoryImpl implements UserLocalRepository {
    async save(user: User): Promise<void> {
        const { save } = LocalStorage();
        await save('user_data', JSON.stringify(user));
    }

    async getUser(): Promise<User | null> {
        const { getItem } = LocalStorage();
        const data = await getItem('user_data');
        if (data) {
            return JSON.parse(data);
        }
        return null;
    }

    async getToken(): Promise<string | null> {
        const { getItem } = LocalStorage();
        return await getItem('auth_token');
    }

    async remove(): Promise<void> {
        const { remove } = LocalStorage();
        await remove('user_data');
        await remove('auth_token');
    }

    async clear(): Promise<void> {
        const { clear } = LocalStorage();
        await clear();
    }
}