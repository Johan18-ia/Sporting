// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { User } from '../domain/entities/User';
import { GetUserLocalUseCase } from '../domain/useCases/userLocal/GetUserLocal';
import { SaveUserLocalUseCase } from '../domain/useCases/userLocal/SaveUserLocal';
import { RemoveUserLocalUseCase } from '../domain/useCases/userLocal/RemoveUserLocal';
import { LoginAuthUseCase } from '../domain/useCases/auth/LoginAuth';
import { RegisterAuthUseCase } from '../domain/useCases/auth/RegisterAuth';
import { UserLogin, UserRegister } from '../domain/entities/User';
import { LocalStorage } from '../data/sources/local/LocalStorage';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { getItem } = LocalStorage();

    // Verificar sesión al iniciar
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        setLoading(true);
        try {
            const token = await getItem('auth_token');
            const userData = await GetUserLocalUseCase();
            
            if (token && userData) {
                setUser(userData);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Error checking auth:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials: UserLogin) => {
        setLoading(true);
        setError(null);
        try {
            const response = await LoginAuthUseCase(credentials);
            
            if (response.success && response.data) {
                // Guardar token
                const { save } = LocalStorage();
                const token = response.data.session_token?.replace('JWT ', '') || response.data.token;
                await save('auth_token', token);
                
                // Guardar usuario
                const userData: User = {
                    id: response.data.id,
                    name: response.data.name || '',
                    lastname: response.data.lastname || '',
                    email: response.data.email || '',
                    password: '',
                    phone: response.data.phone || '',
                    role: response.data.role || 'user',
                    image: response.data.image || '',
                    session_token: token
                };
                await SaveUserLocalUseCase(userData);
                
                setUser(userData);
                setIsAuthenticated(true);
                return { success: true, data: userData };
            } else {
                setError(response.message || 'Error al iniciar sesión');
                return { success: false, error: response.message };
            }
        } catch (error: any) {
            setError(error.message || 'Error al iniciar sesión');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: UserRegister) => {
        setLoading(true);
        setError(null);
        try {
            const response = await RegisterAuthUseCase(userData);
            
            if (response.success) {
                return { success: true, data: response.data };
            } else {
                setError(response.message || 'Error al registrar usuario');
                return { success: false, error: response.message };
            }
        } catch (error: any) {
            setError(error.message || 'Error al registrar usuario');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await RemoveUserLocalUseCase();
            setUser(null);
            setIsAuthenticated(false);
            return { success: true };
        } catch (error) {
            console.error('Error logging out:', error);
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        checkAuth
    };
};