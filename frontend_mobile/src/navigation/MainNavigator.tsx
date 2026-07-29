// src/navigation/MainNavigator.tsx
// ====================================================
// Decide Drawer (admin/seller) o BottomTabs (user)
// según el rol del usuario actual
// ====================================================
import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { AdminNavigator } from './AdminNavigator'
import { StudentNavigator } from './StudentNavigator'
import { ROLES } from '../config/constants'

export const MainNavigator: React.FC = () => {
  const { currentUser } = useAuth()

  if (currentUser?.role === ROLES.USER) {
    return <StudentNavigator />
  }

  // admin o seller → drawer
  return <AdminNavigator />
}

export default MainNavigator
