// Encargado: Utilidades - Helpers
// Descripción: Funciones auxiliares generales usadas en la app móvil
// Archivo: src/utils/helpers.ts
// ============================================
// src/utils/helpers.ts

/**
 * Formatea un número como moneda (COP - Peso Colombiano)
 * @param value - Número a formatear
 * @returns String formateado ej: $1.234.567
 */
export const formatCurrency = (value: number): string => {
    if (value === null || value === undefined || isNaN(value)) {
        return '$0';
    }
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

/**
 * Formatea una fecha a formato local (DD/MM/YYYY)
 * @param date - Fecha en string o Date
 * @returns String formateado ej: 31/12/2024
 */
export const formatDate = (date: string | Date): string => {
    if (!date) return 'N/A';
    
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(dateObj.getTime())) return 'N/A';
        
        return new Intl.DateTimeFormat('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(dateObj);
    } catch {
        return 'N/A';
    }
};

/**
 * Formatea una fecha con hora (DD/MM/YYYY HH:MM)
 * @param date - Fecha en string o Date
 * @returns String formateado ej: 31/12/2024 14:30
 */
export const formatDateTime = (date: string | Date): string => {
    if (!date) return 'N/A';
    
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(dateObj.getTime())) return 'N/A';
        
        return new Intl.DateTimeFormat('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).format(dateObj);
    } catch {
        return 'N/A';
    }
};

/**
 * Obtiene el tiempo relativo (hace X minutos, hace X horas, etc.)
 * @param date - Fecha en string o Date
 * @returns String relativo ej: "Hace 5 minutos"
 */
export const timeAgo = (date: string | Date): string => {
    if (!date) return 'N/A';
    
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(dateObj.getTime())) return 'N/A';
        
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
        
        if (diffInSeconds < 60) {
            return 'Hace ' + diffInSeconds + ' segundos';
        }
        
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return 'Hace ' + diffInMinutes + ' minuto' + (diffInMinutes !== 1 ? 's' : '');
        }
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return 'Hace ' + diffInHours + ' hora' + (diffInHours !== 1 ? 's' : '');
        }
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) {
            return 'Hace ' + diffInDays + ' día' + (diffInDays !== 1 ? 's' : '');
        }
        
        return formatDate(dateObj);
    } catch {
        return 'N/A';
    }
};

/**
 * Trunca un texto a una longitud máxima
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima
 * @returns Texto truncado con "..."
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Capitaliza la primera letra de cada palabra
 * @param text - Texto a capitalizar
 * @returns Texto capitalizado ej: "juan pérez" -> "Juan Pérez"
 */
export const capitalize = (text: string): string => {
    if (!text) return '';
    return text
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

/**
 * Genera un ID único (timestamp + random)
 * @returns ID único ej: "1234567890_abc123"
 */
export const generateId = (): string => {
    return Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
};

/**
 * Valida si un string es un email válido
 * @param email - Email a validar
 * @returns true si es válido
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Valida si un string es un número de teléfono válido (Colombia)
 * @param phone - Teléfono a validar
 * @returns true si es válido
 */
export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{7,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
};

/**
 * Obtiene las iniciales de un nombre
 * @param name - Nombre completo
 * @returns Iniciales ej: "Juan Pérez" -> "JP"
 */
export const getInitials = (name: string): string => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Convierte un objeto a FormData para enviar archivos
 * @param obj - Objeto con datos
 * @returns FormData
 */
export const objectToFormData = (obj: Record<string, any>): FormData => {
    const formData = new FormData();
    Object.keys(obj).forEach(key => {
        if (obj[key] !== null && obj[key] !== undefined) {
            if (obj[key] instanceof File || obj[key] instanceof Blob) {
                formData.append(key, obj[key]);
            } else if (typeof obj[key] === 'object') {
                formData.append(key, JSON.stringify(obj[key]));
            } else {
                formData.append(key, String(obj[key]));
            }
        }
    });
    return formData;
};

/**
 * Ordena un array de objetos por una propiedad
 * @param array - Array a ordenar
 * @param key - Propiedad por la que ordenar
 * @param ascending - Orden ascendente (true) o descendente (false)
 * @returns Array ordenado
 */
export const sortBy = <T>(array: T[], key: keyof T, ascending: boolean = true): T[] => {
    return [...array].sort((a, b) => {
        const valA = a[key] ?? '';
        const valB = b[key] ?? '';
        
        if (typeof valA === 'string' && typeof valB === 'string') {
            return ascending 
                ? valA.localeCompare(valB) 
                : valB.localeCompare(valA);
        }
        
        if (typeof valA === 'number' && typeof valB === 'number') {
            return ascending ? valA - valB : valB - valA;
        }
        
        return 0;
    });
};

/**
 * Agrupa un array de objetos por una propiedad
 * @param array - Array a agrupar
 * @param key - Propiedad por la que agrupar
 * @returns Objeto agrupado
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
    return array.reduce((acc, item) => {
        const groupKey = String(item[key] ?? 'undefined');
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }
        acc[groupKey].push(item);
        return acc;
    }, {} as Record<string, T[]>);
};

/**
 * Obtiene el nombre de un rol en español
 * @param role - Rol en inglés
 * @returns Rol en español
 */
export const getRoleName = (role: string): string => {
    const roles: Record<string, string> = {
        admin: 'Administrador',
        seller: 'Vendedor',
        user: 'Usuario',
        student: 'Estudiante',
    };
    return roles[role] || role;
};

/**
 * Obtiene el color de un rol
 * @param role - Rol
 * @returns Color CSS
 */
export const getRoleColor = (role: string): string => {
    const colors: Record<string, string> = {
        admin: '#8B0000',
        seller: '#f59e0b',
        user: '#6b7280',
        student: '#2196F3',
    };
    return colors[role] || '#6b7280';
};