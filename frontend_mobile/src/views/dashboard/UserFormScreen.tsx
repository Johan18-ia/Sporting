// src/views/dashboard/UserFormScreen.tsx
// ====================================================
// PANTALLA: FORMULARIO DE USUARIO (crear/editar/ver)
// ====================================================
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Pressable,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Input, Loading, AlertMessage } from '../../components'
import { useUsers } from '../../hooks/useUsers'
import { useAuth } from '../../hooks/useAuth'
import { validateRegister } from '../../utils/validators'
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { UsersStackParamList } from '../../navigation/types'

type Props = NativeStackScreenProps<UsersStackParamList, 'UserForm'>

interface FormData {
  name: string
  lastname: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  document: string
  address: string
  role: 'admin' | 'seller' | 'user'
  is_active: boolean
}

const initialForm = (): FormData => ({
  name: '',
  lastname: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  document: '',
  address: '',
  role: 'user',
  is_active: true,
})

const ROLES_LABEL: Record<'admin' | 'seller' | 'user', string> = {
  admin: 'Admin',
  seller: 'Vendedor',
  user: 'Estudiante',
}

export const UserFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets()
  const { userId, mode } = route.params
  const { currentUser } = useAuth()
  const { getUserById, createUser, updateUser, loading } = useUsers()

  const isEdit = mode === 'edit' && !!userId
  const isView = mode === 'view'

  const [form, setForm] = useState<FormData>(initialForm())
  const [initialLoading, setInitialLoading] = useState(isEdit || isView)
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    if ((isEdit || isView) && userId) {
      getUserById(userId).then((u) => {
        if (cancelled || !u) return
        setForm({
          name: u.name || '',
          lastname: u.lastname || '',
          email: u.email || '',
          password: '',
          confirmPassword: '',
          phone: u.phone || '',
          document: u.document || '',
          address: u.address || '',
          role: (u.role as 'admin' | 'seller' | 'user') || 'user',
          is_active: u.is_active === 1 || u.is_active === undefined,
        })
        setInitialLoading(false)
      })
    } else {
      setInitialLoading(false)
    }
    return () => {
      cancelled = true
    }
  }, [userId, isEdit, isView, getUserById])

  const update = (key: keyof FormData) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    setFormError(null)
    setSuccess(null)

    // Validación: en edit, password es opcional
    if (!form.name || !form.email) {
      setFormError('Nombre y email son obligatorios')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setFormError('Ingresa un email válido')
      return
    }
    if (!isEdit) {
      const v = validateRegister({
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      })
      if (v) {
        setFormError(v)
        return
      }
    } else if (form.password) {
      // En edición, si se ingresó password, validar
      if (form.password.length < 6) {
        setFormError('La contraseña debe tener al menos 6 caracteres')
        return
      }
      if (form.password !== form.confirmPassword) {
        setFormError('Las contraseñas no coinciden')
        return
      }
    }

    try {
      if (isEdit && userId) {
        const payload: any = {
          name: form.name,
          lastname: form.lastname,
          email: form.email,
          phone: form.phone,
          document: form.document || null,
          address: form.address || null,
          role: form.role,
          is_active: form.is_active ? 1 : 0,
        }
        if (form.password) payload.password = form.password

        const r = await updateUser(userId, payload)
        if (r.success) {
          setSuccess('Usuario actualizado')
          setTimeout(() => navigation.goBack(), 800)
        } else {
          setFormError(typeof r.error === 'string' ? r.error : 'Error al actualizar')
        }
      } else {
        const r = await createUser({
          name: form.name,
          lastname: form.lastname,
          email: form.email,
          password: form.password,
          phone: form.phone,
          role: form.role,
          document: form.document || null,
          address: form.address || null,
          is_active: form.is_active ? 1 : 0,
        })
        if (r.success) {
          setSuccess('Usuario creado')
          setTimeout(() => navigation.goBack(), 800)
        } else {
          setFormError(typeof r.error === 'string' ? r.error : 'Error al crear usuario')
        }
      }
    } catch (err: any) {
      setFormError(err?.message || 'Error inesperado')
    }
  }

  if (initialLoading) return <Loading fullScreen message="Cargando usuario..." />

  // Solo admin/seller pueden acceder (defensa en profundidad)
  if (currentUser && !['admin', 'seller'].includes(currentUser.role)) {
    return (
      <View style={[styles.flex, { padding: spacing.lg }]}>
        <AlertMessage type="error" message="No tienes permisos para gestionar usuarios." />
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: spacing.lg, paddingBottom: insets.bottom + spacing.lg },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          {isView ? 'Detalle de usuario' : isEdit ? 'Editar usuario' : 'Nuevo usuario'}
        </Text>

        {formError && (
          <AlertMessage type="error" message={formError} onClose={() => setFormError(null)} />
        )}
        {success && (
          <AlertMessage type="success" message={success} onClose={() => setSuccess(null)} />
        )}

        <Input
          label="Nombre *"
          value={form.name}
          onChangeText={update('name')}
          placeholder="Nombre"
          editable={!loading && !isView}
        />
        <Input
          label="Apellido"
          value={form.lastname}
          onChangeText={update('lastname')}
          placeholder="Apellido"
          editable={!loading && !isView}
        />
        <Input
          label="Documento"
          value={form.document}
          onChangeText={update('document')}
          placeholder="CC / TI"
          editable={!loading && !isView}
        />
        <Input
          label="Correo *"
          type="email"
          value={form.email}
          onChangeText={update('email')}
          placeholder="usuario@ejemplo.com"
          editable={!loading && !isView}
        />
        <Input
          label={isEdit ? 'Nueva contraseña (opcional)' : 'Contraseña *'}
          type="password"
          value={form.password}
          onChangeText={update('password')}
          placeholder={isEdit ? 'Dejar vacío para no cambiar' : 'Mínimo 6 caracteres'}
          editable={!loading && !isView}
        />
        {form.password.length > 0 && (
          <Input
            label="Confirmar contraseña"
            type="password"
            value={form.confirmPassword}
            onChangeText={update('confirmPassword')}
            placeholder="Repetir contraseña"
            editable={!loading && !isView}
          />
        )}
        <Input
          label="Teléfono"
          type="tel"
          value={form.phone}
          onChangeText={update('phone')}
          placeholder="+57 300 123 4567"
          editable={!loading && !isView}
        />
        <Input
          label="Dirección"
          value={form.address}
          onChangeText={update('address')}
          placeholder="Calle / Carrera"
          editable={!loading && !isView}
        />

        <Text style={styles.fieldLabel}>Rol</Text>
        <View style={styles.roleRow}>
          {(['admin', 'seller', 'user'] as const).map((r) => (
            <Pressable
              key={r}
              onPress={() => !isView && setForm((p) => ({ ...p, role: r }))}
              disabled={isView}
              style={[
                styles.rolePill,
                form.role === r && styles.rolePillActive,
              ]}
              accessibilityRole="radio"
              accessibilityState={{ selected: form.role === r }}
              accessibilityLabel={`Rol ${ROLES_LABEL[r]}`}
            >
              <Text
                style={[
                  styles.rolePillText,
                  form.role === r && styles.rolePillTextActive,
                ]}
              >
                {ROLES_LABEL[r]}
              </Text>
            </Pressable>
          ))}
        </View>

        {(isEdit || isView) && (
          <>
            <Text style={styles.fieldLabel}>Estado</Text>
            <View style={styles.roleRow}>
              <Pressable
                onPress={() => !isView && setForm((p) => ({ ...p, is_active: true }))}
                disabled={isView}
                style={[styles.rolePill, form.is_active && styles.rolePillActive]}
                accessibilityRole="radio"
                accessibilityState={{ selected: form.is_active }}
              >
                <Text style={[styles.rolePillText, form.is_active && styles.rolePillTextActive]}>
                  Activo
                </Text>
              </Pressable>
              <Pressable
                onPress={() => !isView && setForm((p) => ({ ...p, is_active: false }))}
                disabled={isView}
                style={[styles.rolePill, !form.is_active && styles.rolePillActive]}
                accessibilityRole="radio"
                accessibilityState={{ selected: !form.is_active }}
              >
                <Text style={[styles.rolePillText, !form.is_active && styles.rolePillTextActive]}>
                  Inactivo
                </Text>
              </Pressable>
            </View>
          </>
        )}

        {!isView && (
          <Button
            title={loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear usuario'}
            onPress={handleSubmit}
            loading={loading}
            fullWidth
            style={{ marginTop: spacing.xl }}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  roleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  rolePill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  rolePillActive: {
    backgroundColor: colors.red,
    borderColor: colors.red,
  },
  rolePillText: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  rolePillTextActive: {
    color: colors.white,
    fontWeight: fontWeight.semibold,
  },
})

export default UserFormScreen