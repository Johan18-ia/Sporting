// Encargado: Módulo de Usuarios - Entidad
// Descripción: Define la estructura del usuario del sistema para las HU de gestión de usuarios: registro, edición, activación, desactivación y eliminación.
// Archivo: src/domain/entities/User.ts
// ============================================
// NOTAS: Esta entidad soporta los datos requeridos por HU04, HU05, HU06, HU08, HU09 y HU10.
// Incluye rol, estado activo, categoría, contacto y sesión del usuario autenticado.
// ============================================
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