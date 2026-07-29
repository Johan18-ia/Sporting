// src/views/auth/RegisterScreen.tsx
// ====================================================
// PANTALLA: REGISTRO
// Equivalente funcional de RegisterView.jsx del web
// Solo admin/seller — protegido en flujo
// ====================================================
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Button, Input, AlertMessage } from '../../components'
import { useAuth } from '../../hooks/useAuth'
import { validateRegister } from '../../utils/validators'
import { ROUTES } from '../../config/routes'
import { colors, spacing, fontSize, fontWeight } from '../../theme'
import CategoryModel from '../../models/CategoryModel'
import { ROLES } from '../../config/constants'
import type { Category, UserRole } from '../../types'
import type { AuthStackParamList } from '../../navigation/types'

type Props = NativeStackScreenProps<AuthStackParamList, typeof ROUTES.REGISTER>

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const { currentUser, register, loading } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    category_id: '',
    role: 'USER' as 'ADMIN' | 'SELLER' | 'USER' | 'CUSTOMER',
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Cargar categorías
  useEffect(() => {
    CategoryModel.getAllCategories()
      .then((r: any) => {
        if (r.success && r.data) setCategories(r.data)
      })
      .catch(() => {})
  }, [])

  const update = (key: keyof typeof formData) => (value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async () => {
    setFormError(null)
    setSuccess(null)

    const validationError = validateRegister(formData)
    if (validationError) {
      setFormError(validationError)
      return
    }

    try {
      const result = await register({
        name: formData.name,
        lastname: formData.lastname || '',
        email: formData.email,
        password: formData.password,
        phone: formData.phone || '',
        role: formData.role.toLowerCase() as UserRole,
        category_id: formData.category_id ? parseInt(formData.category_id, 10) : null,
      })

      if (result.success) {
        setSuccess('Usuario creado exitosamente')
        setFormData({
          name: '',
          lastname: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          category_id: '',
          role: 'USER',
        })
      } else {
        setFormError(result.error || 'Error al crear el usuario')
      }
    } catch (err: any) {
      setFormError(err?.error || 'Error al crear el usuario')
    }
  }

  // Si el usuario actual no es admin/seller, mostrar aviso
  if (currentUser && currentUser.role !== 'admin' && currentUser.role !== 'seller') {
    return (
      <View style={[styles.flex, styles.center]}>
        <AlertMessage
          type="error"
          message="No tienes permisos para registrar usuarios. Contacta al administrador."
        />
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
          { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.lg },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Registrar Usuario</Text>
        <Text style={styles.subtitle}>
          Completa los datos para crear un nuevo usuario
          {currentUser && (
            <Text style={styles.roleHint}>{'\n'}Rol: {currentUser.role}</Text>
          )}
        </Text>

        {formError && (
          <AlertMessage type="error" message={formError} onClose={() => setFormError(null)} />
        )}
        {success && (
          <AlertMessage
            type="success"
            message={success}
            onClose={() => setSuccess(null)}
          />
        )}

        <Input
          label="Nombre *"
          value={formData.name}
          onChangeText={update('name')}
          placeholder="Nombre completo"
          editable={!loading}
        />
        <Input
          label="Apellido"
          value={formData.lastname}
          onChangeText={update('lastname')}
          placeholder="Apellido"
          editable={!loading}
        />
        <Input
          label="Correo Electrónico *"
          type="email"
          value={formData.email}
          onChangeText={update('email')}
          placeholder="usuario@ejemplo.com"
          editable={!loading}
        />
        <Input
          label="Contraseña *"
          type="password"
          value={formData.password}
          onChangeText={update('password')}
          placeholder="Mínimo 6 caracteres"
          editable={!loading}
        />
        <Input
          label="Confirmar Contraseña *"
          type="password"
          value={formData.confirmPassword}
          onChangeText={update('confirmPassword')}
          placeholder="Repita la contraseña"
          editable={!loading}
        />
        <Input
          label="Teléfono"
          type="tel"
          value={formData.phone}
          onChangeText={update('phone')}
          placeholder="Número de contacto"
          editable={!loading}
        />

        <Button
          title={loading ? 'Creando usuario...' : 'Crear Usuario'}
          onPress={handleSubmit}
          loading={loading}
          fullWidth
          style={{ marginTop: spacing.lg }}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate(ROUTES.LOGIN)}
          style={styles.backLink}
        >
          <Text style={styles.linkText}>← Volver al Login</Text>
        </TouchableOpacity>

        <Text style={styles.mutedNote}>Los campos marcados con * son obligatorios</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', padding: spacing.lg },
  container: {
    paddingHorizontal: spacing.lg,
    flexGrow: 1,
  },
  title: {
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
  roleHint: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  backLink: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  linkText: {
    color: colors.red,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  mutedNote: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: spacing.md,
  },
})

export default RegisterScreen

// Evita warning de unused
void ROLES
