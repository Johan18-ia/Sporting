// src/views/dashboard/ProfileScreen.tsx
// ====================================================
// PANTALLA: MI PERFIL (estudiante)
// ====================================================
import React from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Card, Button } from '../../components'
import { useAuth } from '../../hooks/useAuth'
import { getDisplayName, getInitials } from '../../utils/helpers'
import { colors, spacing, radius, fontSize, fontWeight } from '../../theme'

export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets()
  const { currentUser, logout } = useAuth()

  const initials = getInitials(currentUser?.name ?? '', currentUser?.lastname)

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + spacing.lg }]}
    >
      <View style={styles.avatarRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{getDisplayName(currentUser)}</Text>
        <Text style={styles.email}>{currentUser?.email}</Text>
      </View>

      <Card title="Datos personales">
        <View style={styles.row}>
          <Text style={styles.label}>Teléfono:</Text>
          <Text style={styles.value}>{currentUser?.phone || '—'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Rol:</Text>
          <Text style={styles.value}>{currentUser?.role}</Text>
        </View>
      </Card>

      <Button
        title="Cerrar Sesión"
        variant="danger"
        fullWidth
        onPress={() => logout()}
        style={{ marginTop: spacing.lg }}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg },
  avatarRow: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontWeight: fontWeight.medium,
  },
  value: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
})

export default ProfileScreen
