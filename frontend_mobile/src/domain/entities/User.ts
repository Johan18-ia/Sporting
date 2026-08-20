// Encargado: Entidad - User
// Descripción: Definición del tipo Usuario usado en la capa de dominio
// Archivo: src/domain/entities/User.ts
// ============================================

// src/domain/entities/User.ts
export interface User {
    id?: number;
    name: string;
    lastname: string;
    email: string;
    password: string;
    confirmPassword?: string;
    phone?: string;
    document?: string;
    birth_date?: string;
    role?: 'admin' | 'seller' | 'user';
    image?: string;
    category_id?: number;
    is_active?: number;
    session_token?: string;
    created_at?: string;
    updated_at?: string;
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface UserRegister extends User {
    confirmPassword: string;
}