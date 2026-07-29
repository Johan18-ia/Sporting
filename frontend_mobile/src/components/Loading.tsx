// src/components/Loading.tsx
// ====================================================
// Loading — ActivityIndicator con texto opcional
// ====================================================
import React from 'react'
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native'
import { colors, spacing, fontSize } from '../theme'

interface Props {
  message?: string
  size?: 'small' | 'large'
  fullScreen?: boolean
}

export const Loading: React.FC<Props> = ({
  message = 'Cargando...',
  size = 'large',
  fullScreen = false,
}) => (
  <View style={[styles.container, fullScreen && styles.fullScreen]} accessibilityRole="progressbar">
    <ActivityIndicator size={size} color={colors.red} />
    {message && <Text style={styles.message}>{message}</Text>}
  </View>
)

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  message: {
    marginTop: spacing.md,
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
})

export default Loading
