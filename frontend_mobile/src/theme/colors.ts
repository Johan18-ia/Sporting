// src/theme/colors.ts
// ====================================================
// PALETA DE COLORES — Sporting Club
// Equivalente a src/styles/sporting-theme.css del web
// ====================================================

export const colors = {
  // Marca
  red: '#8B0000',
  redHover: '#a00000',
  redGradientStart: '#8B0000',
  redGradientEnd: '#eb472ae7',

  // Neutros
  dark: '#111111',
  gray: '#333333',
  lightGray: '#f5f5f5',
  border: '#eeeeee',
  white: '#ffffff',

  // Texto
  text: '#333333',
  textMuted: '#666666',

  // Estados
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#c82333',
  info: '#3b82f6',

  // Fondos
  background: '#ffffff',
  surface: '#ffffff',
  surfaceMuted: '#f9f9f9',

  // Sombras (RN usa elevation en Android + shadow* en iOS)
  shadow: '#000000',

  // Translucidos
  overlay: 'rgba(0,0,0,0.4)',
} as const

export type ColorKey = keyof typeof colors