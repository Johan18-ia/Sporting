// src/navigation/CustomDrawerContent.tsx
// ====================================================
// Drawer custom para admin/seller — replica la Sidebar del web
// con header del usuario, badge de rol y botón de logout
// ====================================================
import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer'
import { Ionicons } from '@expo/vector-icons'
import type { User } from '../types'
import { colors, spacing, fontSize, fontWeight, radius } from '../theme'
import { getDisplayName } from '../utils/helpers'

interface Props extends DrawerContentComponentProps {
  user: User | null
  onLogout: () => Promise<void> | void
}

export const CustomDrawerContent: React.FC<Props> = ({ user, onLogout, ...rest }) => {
  return (
    <DrawerContentScrollView {...rest} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.brandName}>SPORTING</Text>
      </View>

      <View style={styles.userBox}>
        <Text style={styles.userName} numberOfLines={1}>
          {getDisplayName(user)}
        </Text>
        <Text style={styles.userEmail} numberOfLines={1}>
          {user?.email}
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{user?.role?.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.spacer} />

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={onLogout}
        accessibilityRole="button"
        accessibilityLabel="Cerrar sesión"
      >
        <Ionicons name="log-out-outline" size={20} color={colors.white} />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: spacing.sm,
  },
  brandName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.red,
    letterSpacing: 2,
  },
  userBox: {
    padding: spacing.lg,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
  },
  userName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  badge: {
    backgroundColor: colors.red,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  badgeText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  spacer: { flex: 1 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.red,
    margin: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  logoutText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
})

export default CustomDrawerContent
