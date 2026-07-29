// src/navigation/AuthNavigator.tsx
// ====================================================
// Stack de autenticación (Login + Register)
// Se muestra antes de iniciar sesión
// ====================================================
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { LoginScreen } from '../views/auth/LoginScreen'
import { RegisterScreen } from '../views/auth/RegisterScreen'
import { ROUTES } from '../config/routes'
import { colors } from '../theme'
import type { AuthStackParamList } from './types'

const Stack = createNativeStackNavigator<AuthStackParamList>()

export const AuthNavigator: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.red },
      headerTintColor: colors.white,
      headerTitleStyle: { fontWeight: '700' },
    }}
  >
    <Stack.Screen
      name={ROUTES.LOGIN}
      component={LoginScreen}
      options={{ title: 'Iniciar Sesión' }}
    />
    <Stack.Screen
      name={ROUTES.REGISTER}
      component={RegisterScreen}
      options={{ title: 'Registrar Usuario' }}
    />
  </Stack.Navigator>
)

export default AuthNavigator
