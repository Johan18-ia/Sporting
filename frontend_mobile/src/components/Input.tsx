// src/components/Input.tsx
// ====================================================
// Input controlado — Equivalente a <input className="sporting-input">
// ====================================================
import React from 'react'
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  KeyboardTypeOptions,
} from 'react-native'
import { colors, radius, spacing, fontSize, fontWeight } from '../theme'

interface Props extends Omit<TextInputProps, 'style'> {
  label?: string
  error?: string | null
  helperText?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date'
}

const KEYBOARD_BY_TYPE: Record<NonNullable<Props['type']>, KeyboardTypeOptions> = {
  text: 'default',
  email: 'email-address',
  password: 'default',
  number: 'numeric',
  tel: 'phone-pad',
  date: 'default',
}

export const Input: React.FC<Props> = ({
  label,
  error,
  helperText,
  type = 'text',
  secureTextEntry,
  autoCapitalize,
  autoComplete,
  ...rest
}) => {
  const isPassword = type === 'password'

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        keyboardType={KEYBOARD_BY_TYPE[type]}
        secureTextEntry={isPassword}
        autoCapitalize={isPassword || type === 'email' ? 'none' : autoCapitalize}
        autoCorrect={false}
        autoComplete={isPassword ? 'password' : type === 'email' ? 'email' : autoComplete}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={label}
        {...rest}
      />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
    backgroundColor: colors.white,
    minHeight: 44,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  helperText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
})

export default Input
