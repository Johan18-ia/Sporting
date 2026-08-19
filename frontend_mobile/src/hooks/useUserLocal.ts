// Encargado: Hook - useUserLocal
// Descripción: Abstracción para persistencia local del usuario
// Archivo: src/hooks/useUserLocal.ts
// ============================================

// src/hooks/useUserLocal.ts
import { useEffect, useState } from 'react';
import { User } from '../domain/entities/User';
import { GetUserLocalUseCase } from '../domain/useCases/userLocal/GetUserLocal';

export const useUserLocal = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        getUserSession();
    }, []);

    const getUserSession = async () => {
        const userData = await GetUserLocalUseCase();
        setUser(userData);
    };

    return {
        user,
        getUserSession
    };
};