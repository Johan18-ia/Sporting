// src/utils/validators.ts
// ====================================================
// VALIDADORES PUROS — Equivalentes a los del web
// ====================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^[0-9+\-()\s]{7,20}$/

export const validators = {
  required(value: string | undefined | null, fieldName = 'Este campo'): string | null {
    if (value === undefined || value === null || value.toString().trim() === '') {
      return `${fieldName} es requerido`
    }
    return null
  },

  email(value: string): string | null {
    if (!value) return 'El email es requerido'
    if (!EMAIL_REGEX.test(value)) return 'Por favor ingrese un email válido'
    return null
  },

  password(value: string, minLength = 6): string | null {
    if (!value) return 'La contraseña es requerida'
    if (value.length < minLength) return `La contraseña debe tener al menos ${minLength} caracteres`
    return null
  },

  passwordMatch(value: string, confirm: string): string | null {
    if (value !== confirm) return 'Las contraseñas no coinciden'
    return null
  },

  phone(value: string): string | null {
    if (!value) return null // opcional
    if (!PHONE_REGEX.test(value)) return 'Teléfono inválido'
    return null
  },

  minLength(value: string, min: number, fieldName = 'Este campo'): string | null {
    if (!value || value.length < min) return `${fieldName} debe tener al menos ${min} caracteres`
    return null
  },

  positiveNumber(value: string | number, fieldName = 'Este campo'): string | null {
    const num = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(num) || num <= 0) return `${fieldName} debe ser un número positivo`
    return null
  },
}

// Helper para validar todo el formulario de login (paridad con AuthController)
export const validateLogin = (email: string, password: string): string | null => {
  if (!email || !password) return 'Por favor complete todos los campos'
  return validators.email(email)
}

// Helper para validar el formulario de registro (paridad con AuthController.handleRegister)
export const validateRegister = (data: {
  name: string
  email: string
  password: string
  confirmPassword?: string
}): string | null => {
  if (!data.name || !data.email || !data.password) {
    return 'Por favor complete todos los campos obligatorios (nombre, email, contraseña)'
  }
  const emailErr = validators.email(data.email)
  if (emailErr) return emailErr
  const passErr = validators.password(data.password)
  if (passErr) return passErr
  if (data.confirmPassword !== undefined) {
    const matchErr = validators.passwordMatch(data.password, data.confirmPassword)
    if (matchErr) return matchErr
  }
  return null
}