// src/data/repositories/AuthRepository.ts
import { AxiosError } from 'axios';
import { User, UserLogin } from '../../domain/entities/User';
import { AuthRepository } from '../../domain/repositories/AuthRepository';
import { ApiDelivery } from '../sources/remote/api/ApiDelivery';
import { ResponseApiDelivery } from '../sources/remote/models/ResponseApiDelivery';

export class AuthRepositoryImpl implements AuthRepository {
    async login(credentials: UserLogin): Promise<ResponseApiDelivery> {
        try {
            const response = await ApiDelivery.post<ResponseApiDelivery>('/users/login', {
                email: credentials.email,
                password: credentials.password
            });
            return Promise.resolve(response.data);
        } catch (error) {
            const e = error as AxiosError;
            console.log('Error login:', JSON.stringify(e.response?.data));
            const apiError: ResponseApiDelivery = JSON.parse(JSON.stringify(e.response?.data));
            return Promise.resolve(apiError);
        }
    }

    async register(user: User): Promise<ResponseApiDelivery> {
        try {
            const response = await ApiDelivery.post<ResponseApiDelivery>('/users/create', user);
            return Promise.resolve(response.data);
        } catch (error) {
            const e = error as AxiosError;
            console.log('Error register:', JSON.stringify(e.response?.data));
            const apiError: ResponseApiDelivery = JSON.parse(JSON.stringify(e.response?.data));
            return Promise.resolve(apiError);
        }
    }
}