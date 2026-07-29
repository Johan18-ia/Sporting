// src/views/dashboard/UsersScreen.tsx
// ====================================================
// PANTALLA: USERS (CRUD)
// ====================================================
import React, { useMemo, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
  TouchableOpacity,
  Pressable,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Card, Loading, Input } from '../../components'
import { useUsers } from '../../hooks/useUsers'
import { useAuth } from '../../hooks/useAuth'
import { getDisplayName, getInitials } from '../../utils/helpers'
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme'
import type { UsersStackParamList } from '../../navigation/types'

type Nav = NativeStackNavigationProp<UsersStackParamList, 'Users'>

export const UsersScreen: React.FC = () => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<Nav>()
  const { currentUser } = useAuth()
  const { users, loading, error, loadUsers, deleteUser, toggleUserStatus } = useUsers()

  const canCreate = currentUser?.role === 'admin' || currentUser?.role === 'seller'
  const canEdit = canCreate
  const canDelete = currentUser?.role === 'admin'

  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) => {
      const fullName = `${u.name || ''} ${u.lastname || ''}`.toLowerCase()
      return (
        fullName.includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.role || '').toLowerCase().includes(q)
      )
    })
  }, [users, search])

  const handleDelete = (id: number, name: string) => {
    if (!canDelete) {
      Alert.alert('Sin permisos', 'Solo administradores pueden eliminar usuarios')
      return
    }
    if (currentUser?.id === id) {
      Alert.alert('Acción bloqueada', 'No puedes eliminar tu propio usuario')
      return
    }
    Alert.alert(
      'Eliminar usuario',
      `¿Eliminar a "${name}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const r = await deleteUser(id)
            if (!r.success) {
              const msg = typeof r.error === 'string' ? r.error : 'No se pudo eliminar'
              Alert.alert('Error', msg)
            }
          },
        },
      ],
    )
  }

  const handleToggle = async (id: number, currentActive: boolean) => {
    if (currentUser?.id === id && currentActive) {
      Alert.alert('Acción bloqueada', 'No puedes desactivarte a ti mismo')
      return
    }
    const r = await toggleUserStatus(id, !currentActive)
    if (!r.success) {
      Alert.alert('Error', typeof r.error === 'string' ? r.error : 'No se pudo cambiar el estado')
    }
  }

  if (loading && users.length === 0) {
    return <Loading fullScreen message="Cargando usuarios..." />
  }

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 80 }]}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadUsers}
            tintColor={colors.red}
          />
        }
      >
        <Text style={styles.title}>Usuarios</Text>
        <Text style={styles.subtitle}>Gestión de usuarios del sistema</Text>

        <Input
          placeholder="Buscar por nombre, email o rol"
          value={search}
          onChangeText={setSearch}
          type="text"
        />

        {error && <Card><Text style={styles.errorText}>{error}</Text></Card>}

        {filtered.length === 0 && !loading && (
          <Card>
            <Text style={styles.emptyTitle}>
              {search ? 'Sin resultados' : 'No hay usuarios'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {search
                ? 'Intenta con otro término de búsqueda.'
                : canCreate
                ? 'Crea el primer usuario con el botón +.'
                : 'Aún no se han registrado usuarios.'}
            </Text>
          </Card>
        )}

        {filtered.map((u) => {
          const initials = getInitials(u.name, u.lastname)
          const active = u.is_active === 1 || u.is_active === undefined
          return (
            <Card key={u.id}>
              <View style={styles.row}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View style={styles.rowMain}>
                  <Text style={styles.name}>{getDisplayName(u)}</Text>
                  <Text style={styles.email}>{u.email}</Text>
                  <View style={styles.badges}>
                    <View
                      style={[
                        styles.roleBadge,
                        u.role === 'admin' && styles.roleBadgeAdmin,
                      ]}
                    >
                      <Text style={styles.roleBadgeText}>{u.role?.toUpperCase()}</Text>
                    </View>
                    {!active && (
                      <View style={[styles.roleBadge, styles.roleBadgeInactive]}>
                        <Text style={styles.roleBadgeText}>INACTIVO</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.actions}>
                {canEdit && (
                  <Pressable
                    style={[styles.actionBtn, styles.actionBtnEdit]}
                    onPress={() => navigation.navigate('UserForm', { userId: u.id, mode: 'edit' })}
                    accessibilityRole="button"
                    accessibilityLabel={`Editar ${u.name}`}
                  >
                    <Text style={styles.actionText}>Editar</Text>
                  </Pressable>
                )}
                {canDelete && (
                  <Pressable
                    style={[styles.actionBtn, styles.actionBtnStatus]}
                    onPress={() => handleToggle(u.id, active)}
                    accessibilityRole="button"
                    accessibilityLabel={active ? 'Desactivar' : 'Activar'}
                  >
                    <Text style={styles.actionText}>{active ? 'Desactivar' : 'Activar'}</Text>
                  </Pressable>
                )}
                {canDelete && (
                  <Pressable
                    style={[styles.actionBtn, styles.actionBtnDelete]}
                    onPress={() => handleDelete(u.id, getDisplayName(u))}
                    accessibilityRole="button"
                    accessibilityLabel={`Eliminar ${u.name}`}
                  >
                    <Text style={[styles.actionText, styles.actionTextDanger]}>Eliminar</Text>
                  </Pressable>
                )}
              </View>
            </Card>
          )
        })}
      </ScrollView>

      {canCreate && (
        <TouchableOpacity
          style={[styles.fab, { bottom: insets.bottom + spacing.lg }]}
          onPress={() => navigation.navigate('UserForm', { mode: 'create' })}
          accessibilityRole="button"
          accessibilityLabel="Crear usuario"
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  rowMain: { flex: 1 },
  name: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  email: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  badges: { flexDirection: 'row', gap: spacing.xs },
  roleBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: colors.gray,
  },
  roleBadgeAdmin: {
    backgroundColor: colors.red,
  },
  roleBadgeInactive: {
    backgroundColor: colors.textMuted,
  },
  roleBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: fontWeight.bold,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    flexWrap: 'wrap',
  },
  actionBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.lightGray,
  },
  actionBtnEdit: {
    backgroundColor: colors.info,
  },
  actionBtnStatus: {
    backgroundColor: colors.warning,
  },
  actionBtnDelete: {
    backgroundColor: colors.danger,
  },
  actionText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  actionTextDanger: {
    color: colors.white,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  fabText: { color: colors.white, fontSize: 28, fontWeight: fontWeight.bold },
  errorText: {
    color: colors.danger,
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },
})

export default UsersScreen