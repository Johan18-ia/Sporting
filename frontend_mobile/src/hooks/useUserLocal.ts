// Encargado: Hook - useUserLocal
// Descripción: Abstracción para persistencia local del usuario
// Archivo: src/hooks/useUserLocal.ts
// ============================================

// src/hooks/useUserLocal.ts
import { useCallback, useEffect, useState } from 'react';
import { User } from '../domain/entities/User';
import { GetUserLocalUseCase } from '../domain/useCases/userLocal/GetUserLocal';

export const useUserLocal = () => {
    const [user, setUser] = useState<User | null>(null);

    const getUserSession = useCallback(async () => {
        const userData = await GetUserLocalUseCase();
        setUser(userData);
    }, []);

    useEffect(() => {
        void getUserSession().catch((error: unknown) => {
            console.error('Error al obtener la sesión local del usuario:', error);
        });
    }, [getUserSession]);

    return {
        user,
        getUserSession
    };
};