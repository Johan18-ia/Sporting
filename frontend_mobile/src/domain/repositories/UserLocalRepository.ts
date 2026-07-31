// src/domain/repositories/UserLocalRepository.ts
import { User } from '../entities/User';

export interface UserLocalRepository {
    save(user: User): Promise<void>;
    getUser(): Promise<User | null>;
    getToken(): Promise<string | null>;
    remove(): Promise<void>;
    clear(): Promise<void>;
}