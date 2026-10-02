// Manejo de autenticación, login/logout y estado del usuario
// frontend_mobile/src/hooks/useAuth.ts
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserLogin, UserRegister } from '../domain/entities/User';
import { GetUserLocalUseCase } from '../domain/useCases/userLocal/GetUserLocal';
import { SaveUserLocalUseCase } from '../domain/useCases/userLocal/SaveUserLocal';
import { RemoveUserLocalUseCase } from '../domain/useCases/userLocal/RemoveUserLocal';
import { LoginAuthUseCase } from '../domain/useCases/auth/LoginAuth';
import { RegisterAuthUseCase } from '../domain/useCases/auth/RegisterAuth';
import { LocalStorage } from '../data/sources/local/LocalStorage';
import { ApiDelivery } from '../data/sources/remote/api/ApiDelivery';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    initialized: boolean;
    error: string | null;
    login: (credentials: UserLogin) => Promise<{ success: boolean; data?: User; error?: string }>;
    register: (userData: UserRegister) => Promise<{ success: boolean; data?: unknown; error?: string }>;
    logout: () => Promise<{ success: boolean }>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [initialized, setInitialized] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { getItem, save } = LocalStorage();

    useEffect(() => {
        checkAuth(); // se ejecuta UNA sola vez al abrir la app
    }, []);

    const checkAuth = async () => {
        setLoading(true);
        // Busca el token guardado
        try {
            const storedToken = await getItem('auth_token');
            // Busca los datos del usuario
            const userData = await GetUserLocalUseCase();
            const token = storedToken || userData?.session_token || null;

            console.log('Verificando autenticacion:');
            console.log('  Token:', token ? 'Existe' : 'No existe');
            console.log('  Usuario:', userData ? 'Existe' : 'No existe');

            if (token && userData) {
                // Sí hay sesión marca como autenticado
                let hydratedUser = userData;
                if (userData.role === 'user') {
                    try {
                        const response = await ApiDelivery.get('/students');
                        const students = Array.isArray(response.data)
                            ? response.data
                            : response.data?.data || [];
                        const studentProfile = students.find(
                            (student: any) => Number(student.user_id) === Number(userData.id)
                        ) || null;
                        hydratedUser = {
                            ...userData,
                            isStudent: Boolean(studentProfile),
                            studentProfile,
                            category_id: studentProfile?.category_id ?? userData.category_id
                        };
                        await SaveUserLocalUseCase(hydratedUser);
                    } catch (profileError) {
                        console.warn('No se pudo verificar el perfil estudiantil:', profileError);
                    }
                }
                setUser(hydratedUser);
                setIsAuthenticated(true);
                console.log('Sesion activa para:', hydratedUser.name);
            } else {
                setUser(null);
                // No hay sesión
                setIsAuthenticated(false);
                console.log('No hay sesion activa');
            }
        } catch (err) {
            console.error('Error checking auth:', err);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
            setInitialized(true);
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
                const payload = response.data;
                const token = payload?.session_token?.replace(/^JWT\s+/i, '').trim() || payload?.token || '';
                console.log('Token extraido:', token ? token.substring(0, 20) + '...' : 'No hay token');

                await save('auth_token', token);
                console.log('Token guardado en AsyncStorage');
                // Guardar expiración del token (24 horas)
                try {
                    const expiry = Date.now() + 24 * 60 * 60 * 1000;
                    await save('auth_token_expiry', String(expiry));
                    console.log('Token expiry guardado:', new Date(expiry).toISOString());
                } catch (err) {
                    console.warn('No se pudo guardar expiry del token:', err);
                }

                const userData: User = {
                    id: payload?.id,
                    name: payload?.name || '',
                    lastname: payload?.lastname || '',
                    email: payload?.email || '',
                    password: '',
                    phone: payload?.phone || '',
                    role: payload?.role || 'user',
                    image: payload?.image || '',
                    category_id: payload?.category_id,
                    isStudent: payload?.isStudent === true || Boolean(payload?.studentProfile),
                    studentProfile: payload?.studentProfile || null,
                    session_token: token
                };
                await SaveUserLocalUseCase(userData);
                console.log('Usuario guardado:', userData.name);

                setUser(userData);
                setIsAuthenticated(true);
                console.log('Login exitoso para:', userData.name);

                return { success: true, data: userData };
            }

            console.log('Login fallo:', response.message);
            setError(response.message || 'Error al iniciar sesion');
            return { success: false, error: response.message };
        } catch (err: any) {
            console.error('Error en login:', err);
            setError(err.message || 'Error al iniciar sesion');
            return { success: false, error: err.message };
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
            }

            console.log('Registro fallo:', response.message);
            setError(response.message || 'Error al registrar usuario');
            return { success: false, error: response.message };
        } catch (err: any) {
            console.error('Error en registro:', err);
            setError(err.message || 'Error al registrar usuario');
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await RemoveUserLocalUseCase();
            // Asegurar que el token expiry tambien se elimina
            try {
                const { remove } = LocalStorage();
                await remove('auth_token_expiry');
            } catch (err) {
                console.warn('No se pudo eliminar auth_token_expiry en logout:', err);
            }
            setUser(null);
            setIsAuthenticated(false);
            console.log('Sesion cerrada');
            return { success: true };
        } catch (err) {
            console.error('Error logging out:', err);
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated,
        loading,
        initialized,
        error,
        login,
        register,
        logout,
        checkAuth
    };

    return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};