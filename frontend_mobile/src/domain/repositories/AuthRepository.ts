// src/domain/repositories/AuthRepository.ts
import { User, UserLogin } from '../entities/User';
import { ResponseApiDelivery } from '../../data/sources/remote/models/ResponseApiDelivery';

export interface AuthRepository {
    login(credentials: UserLogin): Promise<ResponseApiDelivery>;
    register(user: User): Promise<ResponseApiDelivery>;
}