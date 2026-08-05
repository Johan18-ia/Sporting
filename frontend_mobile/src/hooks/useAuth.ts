// frontend_mobile/src/hooks/useAuth.ts

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

    const { getItem, save } = LocalStorage();

    // Verificar sesion al iniciar
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        setLoading(true);
        try {
            const token = await getItem('auth_token');
            const userData = await GetUserLocalUseCase();
            
            console.log('Verificando autenticacion:');
            console.log('  Token:', token ? 'Existe' : 'No existe');
            console.log('  Usuario:', userData ? 'Existe' : 'No existe');
            
            if (token && userData) {
                setUser(userData);
                setIsAuthenticated(true);
                console.log('Sesion activa para:', userData.name);
            } else {
                setUser(null);
                setIsAuthenticated(false);
                console.log('No hay sesion activa');
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
        console.log('Intentando login para:', credentials.email);
        
        try {
            const response = await LoginAuthUseCase(credentials);
            console.log('Respuesta del login:', JSON.stringify(response, null, 2));
            
            if (response.success && response.data) {
                // Extraer token
                const token = response.data.session_token?.replace('JWT ', '') || response.data.token;
                console.log('Token extraido:', token ? token.substring(0, 20) + '...' : 'No hay token');
                
                // Guardar token
                await save('auth_token', token);
                console.log('Token guardado en AsyncStorage');
                
                // Verificar que se guardo correctamente
                const savedToken = await getItem('auth_token');
                console.log('Verificando token guardado:', savedToken ? 'Si' : 'No');
                
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
                console.log('Usuario guardado:', userData.name);
                
                // Verificar usuario guardado
                const savedUser = await GetUserLocalUseCase();
                console.log('Usuario guardado verificado:', savedUser ? savedUser.name : 'No encontrado');
                
                setUser(userData);
                setIsAuthenticated(true);
                console.log('Login exitoso para:', userData.name);
                
                return { success: true, data: userData };
            } else {
                console.log('Login fallo:', response.message);
                setError(response.message || 'Error al iniciar sesion');
                return { success: false, error: response.message };
            }
        } catch (error: any) {
            console.error('Error en login:', error);
            setError(error.message || 'Error al iniciar sesion');
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
                console.log('Registro exitoso para:', userData.name);
                return { success: true, data: response.data };
            } else {
                console.log('Registro fallo:', response.message);
                setError(response.message || 'Error al registrar usuario');
                return { success: false, error: response.message };
            }
        } catch (error: any) {
            console.error('Error en registro:', error);
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
            console.log('Sesion cerrada');
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