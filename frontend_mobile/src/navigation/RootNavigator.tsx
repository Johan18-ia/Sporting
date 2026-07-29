// src/navigation/RootNavigator.tsx
// ====================================================
// Decisor raíz: muestra Public si NO hay sesión, Main si SÍ hay
// ====================================================
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { useAuth } from '../hooks/useAuth'
import { AuthNavigator } from './AuthNavigator'
import { MainNavigator } from './MainNavigator'
import { LoadingScreen } from '../views/common/LoadingScreen'

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, loading } = useAuth()
  const [initialCheckDone, setInitialCheckDone] = useState(false)

  // Pequeño delay para evitar parpadeo en cold start con token válido
  useEffect(() => {
    const t = setTimeout(() => setInitialCheckDone(true), 100)
    return () => clearTimeout(t)
  }, [])

  if (loading || !initialCheckDone) {
    return <LoadingScreen />
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  )
}

export default RootNavigator
