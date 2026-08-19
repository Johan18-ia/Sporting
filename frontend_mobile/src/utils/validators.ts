// Encargado: Utilidades - Validadores
// Descripción: Validaciones reutilizables para formularios (email, contraseñas, etc.)
// ============================================
import { isEmail } from 'validator';
// src/utils/validators.ts

/**
 * Valida que un campo no esté vacío
 */
export const isRequired = (value: string): boolean => {
    return value !== null && value !== undefined && value.trim().length > 0;
};

/**
 * Valida que un email sea válido
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Valida que una contraseña tenga al menos 6 caracteres
 */
export const isValidPassword = (password: string): boolean => {
    return password.length >= 6;
};

/**
 * Valida que dos contraseñas coincidan
 */
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword;
};

/**
 * Valida que un número de teléfono sea válido (Colombia)
 */
export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{7,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
};

/**
 * Valida que un número sea positivo
 */
export const isPositiveNumber = (value: number): boolean => {
    return value > 0;
};

/**
 * Valida que un número esté en un rango
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max;
};

/**
 * Valida que un string tenga una longitud mínima
 */
export const hasMinLength = (value: string, min: number): boolean => {
    return value.trim().length >= min;
};

/**
 * Valida que un string tenga una longitud máxima
 */
export const hasMaxLength = (value: string, max: number): boolean => {
    return value.trim().length <= max;
};

/**
 * Valida que un string tenga una longitud exacta
 */
export const hasExactLength = (value: string, length: number): boolean => {
    return value.trim().length === length;
};

/**
 * Valida que un string solo contenga letras y espacios
 */
export const isOnlyLetters = (value: string): boolean => {
    const lettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return lettersRegex.test(value);
};

/**
 * Valida que un string solo contenga números
 */
export const isOnlyNumbers = (value: string): boolean => {
    const numbersRegex = /^[0-9]+$/;
    return numbersRegex.test(value);
};

/**
 * Valida que un string sea alfanumérico
 */
export const isAlphanumeric = (value: string): boolean => {
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(value);
};

/**
 * Valida que una fecha sea válida
 */
export const isValidDate = (date: string): boolean => {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
};

/**
 * Valida que una fecha no sea futura
 */
export const isNotFutureDate = (date: string): boolean => {
    const dateObj = new Date(date);
    const now = new Date();
    return dateObj <= now;
};

/**
 * Valida que una fecha sea mayor a 18 años (para edad mínima)
 */
export const isOver18 = (date: string): boolean => {
    const dateObj = new Date(date);
    const now = new Date();
    const age = now.getFullYear() - dateObj.getFullYear();
    const monthDiff = now.getMonth() - dateObj.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dateObj.getDate())) {
        return age - 1 >= 18;
    }
    return age >= 18;
};

/**
 * Valida un objeto con múltiples reglas
 * @param data - Objeto a validar
 * @param rules - Reglas de validación
 * @returns Objeto con errores
 */
export const validateObject = (
    data: Record<string, any>,
    rules: Record<string, (value: any) => boolean>
): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    Object.keys(rules).forEach((key) => {
        const value = data[key];
        const isValid = rules[key](value);
        
        if (!isValid) {
            errors[key] = `El campo ${key} no es válido`;
        }
    });
    
    return errors;
};

/**
 * Valida un formulario de registro de usuario
 */
export const validateUserForm = (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    phone?: string;
}) => {
    const errors: Record<string, string> = {};

    if (!isRequired(data.name)) {
        errors.name = 'El nombre es requerido';
    } else if (!isOnlyLetters(data.name)) {
        errors.name = 'El nombre solo debe contener letras';
    }

    if (!isRequired(data.email)) {
        errors.email = 'El email es requerido';
    } else if (!isValidEmail(data.email)) {
        errors.email = 'El email no es válido';
    }

    if (!isRequired(data.password)) {
        errors.password = 'La contraseña es requerida';
    } else if (!isValidPassword(data.password)) {
        errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (data.confirmPassword !== undefined) {
        if (!doPasswordsMatch(data.password, data.confirmPassword)) {
            errors.confirmPassword = 'Las contraseñas no coinciden';
        }
    }

    if (data.phone && !isValidPhone(data.phone)) {
        errors.phone = 'El teléfono no es válido (mínimo 7 dígitos)';
    }

    return errors;
};

/**
 * Valida un formulario de estudiante
 */
export const validateStudentForm = (data: {
    name: string;
    lastname: string;
    document: string;
    category_id: string | number;
    phone?: string;
}) => {
    const errors: Record<string, string> = {};

    if (!isRequired(data.name)) {
        errors.name = 'El nombre es requerido';
    }

    if (!isRequired(data.lastname)) {
        errors.lastname = 'El apellido es requerido';
    }

    if (!isRequired(data.document)) {
        errors.document = 'El documento es requerido';
    } else if (!isOnlyNumbers(data.document)) {
        errors.document = 'El documento solo debe contener números';
    }

    if (!data.category_id) {
        errors.category_id = 'La categoría es requerida';
    }

    if (data.phone && !isValidPhone(data.phone)) {
        errors.phone = 'El teléfono no es válido';
    }

    return errors;
};

/**
 * Valida un formulario de producto
 */
export const validateProductForm = (data: {
    nombre: string;
    precio: number | string;
    stock?: number | string;
}) => {
    const errors: Record<string, string> = {};

    if (!isRequired(data.nombre)) {
        errors.nombre = 'El nombre del producto es requerido';
    }

    const precio = typeof data.precio === 'string' ? parseFloat(data.precio) : data.precio;
    if (isNaN(precio) || !isPositiveNumber(precio)) {
        errors.precio = 'El precio debe ser un número positivo';
    }

    if (data.stock !== undefined) {
        const stock = typeof data.stock === 'string' ? parseInt(data.stock) : data.stock;
        if (isNaN(stock) || stock < 0) {
            errors.stock = 'El stock no puede ser negativo';
        }
    }

    return errors;
};