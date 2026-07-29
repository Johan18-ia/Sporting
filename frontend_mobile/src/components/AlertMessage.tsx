// src/components/AlertMessage.tsx
// ====================================================
// AlertMessage — success | error | warning | info
// Equivalente a <AlertMessage type="error" /> del web
// ====================================================
import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { colors, radius, spacing, fontSize, fontWeight } from '../theme'

type AlertType = 'success' | 'error' | 'warning' | 'info'

interface Props {
  type: AlertType
  message: string
  onClose?: () => void
}

const COLORS: Record<AlertType, { bg: string; border: string; text: string }> = {
  success: { bg: '#d1fae5', border: colors.success, text: '#065f46' },
  error: { bg: '#fee2e2', border: colors.danger, text: '#991b1b' },
  warning: { bg: '#fef3c7', border: colors.warning, text: '#92400e' },
  info: { bg: '#dbeafe', border: colors.info, text: '#1e40af' },
}

export const AlertMessage: React.FC<Props> = ({ type, message, onClose }) => {
  const palette = COLORS[type]

  return (
    <View
      style={[styles.container, { backgroundColor: palette.bg, borderColor: palette.border }]}
      accessibilityRole="alert"
    >
      <Text style={[styles.message, { color: palette.text }]} numberOfLines={3}>
        {message}
      </Text>
      {onClose && (
        <Pressable
          onPress={onClose}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Cerrar alerta"
          style={styles.close}
        >
          <Text style={[styles.closeText, { color: palette.text }]}>✕</Text>
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderLeftWidth: 4,
    marginBottom: spacing.md,
  },
  message: {
    flex: 1,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  close: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  closeText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
})

export default AlertMessage
