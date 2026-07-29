// src/views/dashboard/StudentDashboardScreen.tsx
// ====================================================
// PANTALLA: MI PANEL (Estudiante)
// ====================================================
import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Card } from '../../components'
import { useAuth } from '../../hooks/useAuth'
import { getDisplayName } from '../../utils/helpers'
import { colors, spacing, fontSize, fontWeight } from '../../theme'

export const StudentDashboardScreen: React.FC = () => {
  const insets = useSafeAreaInsets()
  const { currentUser } = useAuth()

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + spacing.lg }]}
    >
      <Text style={styles.welcome}>Hola, {getDisplayName(currentUser)}</Text>
      <Text style={styles.subtitle}>Bienvenido a tu panel de Sporting Club</Text>

      <Card title="Tu perfil">
        <Text style={styles.row}>
          <Text style={styles.label}>Email: </Text>
          {currentUser?.email}
        </Text>
        {currentUser?.phone && (
          <Text style={styles.row}>
            <Text style={styles.label}>Teléfono: </Text>
            {currentUser.phone}
          </Text>
        )}
      </Card>

      <Card title="Próximamente">
        <Text style={styles.muted}>
          Estamos conectando tu información con horarios y torneos. Por ahora puedes ver tu
          perfil en la pestaña "Mi Perfil".
        </Text>
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg },
  welcome: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  row: {
    fontSize: fontSize.md,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  label: {
    fontWeight: fontWeight.semibold,
  },
  muted: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
})

export default StudentDashboardScreen
