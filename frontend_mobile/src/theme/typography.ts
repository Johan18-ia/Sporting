// src/theme/typography.ts
// ====================================================
// TIPOGRAFÍA — Equivalente al font-family del web
// (Segoe UI, Tahoma...) → en RN usamos "System" para
// mantener native look sin cargar fuentes externas.
// ====================================================

import { Platform, TextStyle } from 'react-native'
import { fontSize, fontWeight } from './spacing'

// Familia de fuentes: el web usa 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif.
// En RN la opción portable es "System" (San Francisco en iOS, Roboto en Android).
const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
}) as string

export const typography = {
  fontFamily,
  h1: {
    fontFamily,
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
  } as TextStyle,
  h2: {
    fontFamily,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  } as TextStyle,
  h3: {
    fontFamily,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
  } as TextStyle,
  body: {
    fontFamily,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
  } as TextStyle,
  bodyBold: {
    fontFamily,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  } as TextStyle,
  caption: {
    fontFamily,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
  } as TextStyle,
  small: {
    fontFamily,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
  } as TextStyle,
}