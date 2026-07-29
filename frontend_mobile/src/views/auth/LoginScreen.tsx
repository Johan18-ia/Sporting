// src/views/auth/LoginScreen.tsx
// ====================================================
// PANTALLA: LOGIN
// Equivalente funcional de LoginView.jsx del web
// ====================================================
import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Button, Input, AlertMessage } from '../../components'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../config/routes'
import { colors, spacing, fontSize, fontWeight } from '../../theme'
import { validateLogin } from '../../utils/validators'
import type { AuthStackParamList } from '../../navigation/types'

type Props = NativeStackScreenProps<AuthStackParamList, typeof ROUTES.LOGIN>

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const { login, loading, error } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setFormError(null)
    const validationError = validateLogin(email.trim(), password)
    if (validationError) {
      setFormError(validationError)
      return
    }
    try {
      await login({ email: email.trim(), password })
      // El RootNavigator detectará el token y cambiará al Main
    } catch (err: any) {
      setFormError(err?.error || 'Error al iniciar sesión. Verifica tus credenciales.')
    }
  }

  const handleForgotPassword = () => {
    Alert.alert(
      'Recuperar contraseña',
      'Para restablecer tu contraseña, comunícate con el administrador del sistema.',
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
        <View style={styles.brand}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Logo Sporting Club"
          />
          <Text style={styles.brandName}>SPORTING</Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Bienvenido a Sporting</Text>
          <Text style={styles.subtitle}>Inicia sesión para acceder al panel</Text>
        </View>

        {(formError || error) && (
          <AlertMessage
            type="error"
            message={formError || error || 'Error al iniciar sesión'}
            onClose={() => setFormError(null)}
          />
        )}

        <Input
          label="Correo Electrónico"
          value={email}
          onChangeText={setEmail}
          type="email"
          placeholder="usuario@ejemplo.com"
          editable={!loading}
        />
        <Input
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          type="password"
          placeholder="••••••••"
          editable={!loading}
        />

        <Button
          title={loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          onPress={handleSubmit}
          loading={loading}
          fullWidth
          style={{ marginTop: spacing.md }}
        />

        <TouchableOpacity
          onPress={handleForgotPassword}
          style={styles.forgotLink}
          accessibilityRole="link"
        >
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ¿No tienes cuenta?{' '}
            <Text
              style={styles.linkText}
              onPress={() => !loading && navigation.navigate(ROUTES.REGISTER)}
              accessibilityRole="link"
            >
              Regístrate aquí
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: {
    paddingHorizontal: spacing.lg,
    flexGrow: 1,
  },
  brand: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
    marginTop: spacing.lg,
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: spacing.sm,
  },
  brandName: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.red,
    letterSpacing: 2,
  },
  header: {
    marginBottom: spacing.xl,
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
  },
  forgotLink: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  forgotText: {
    color: colors.red,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  footer: {
    marginTop: spacing.xxl,
    alignItems: 'center',
  },
  footerText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  linkText: {
    color: colors.red,
    fontWeight: fontWeight.semibold,
  },
})

export default LoginScreen
