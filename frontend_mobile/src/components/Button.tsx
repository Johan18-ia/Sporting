// src/components/Button.tsx
// ====================================================
// Botón Sporting — Equivalente a btn-sporting-primary del web
// Variantes: primary | secondary | danger | ghost
// ====================================================
import React from 'react'
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
  PressableStateCallbackType,
} from 'react-native'
import { colors, radius, spacing, fontSize, fontWeight } from '../theme'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

interface Props {
  title: string
  onPress: () => void
  variant?: Variant
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  style?: StyleProp<ViewStyle>
  accessibilityLabel?: string
}

const VARIANT_BG: Record<Variant, string> = {
  primary: colors.red,
  secondary: colors.white,
  danger: colors.red,
  ghost: 'transparent',
}

const VARIANT_FG: Record<Variant, string> = {
  primary: colors.white,
  secondary: colors.gray,
  danger: colors.white,
  ghost: colors.red,
}

const VARIANT_BORDER: Record<Variant, string> = {
  primary: colors.red,
  secondary: '#cccccc',
  danger: colors.red,
  ghost: 'transparent',
}

export const Button: React.FC<Props> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  accessibilityLabel,
}) => {
  const isDisabled = disabled || loading

  const containerStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [
    styles.base,
    {
      backgroundColor: VARIANT_BG[variant],
      borderColor: VARIANT_BORDER[variant],
      opacity: isDisabled ? 0.6 : pressed ? 0.85 : 1,
      width: fullWidth ? '100%' : undefined,
    },
    style,
  ]

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={containerStyle}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color={VARIANT_FG[variant]} />
      ) : (
        <Text style={[styles.label, { color: VARIANT_FG[variant] }]}>{title}</Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44, // target touch mínimo recomendado
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
  },
})

export default Button
