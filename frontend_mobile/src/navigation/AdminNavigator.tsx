// src/navigation/AdminNavigator.tsx
// ====================================================
// Drawer con las 9 secciones del admin/seller
// Cada tab es un Stack interno para detalle
// ====================================================
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../hooks/useAuth'
import { DashboardScreen } from '../views/dashboard/DashboardScreen'
import { UsersScreen } from '../views/dashboard/UsersScreen'
import { UserFormScreen } from '../views/dashboard/UserFormScreen'
import { CategoriesScreen } from '../views/dashboard/CategoriesScreen'
import { SchedulesScreen } from '../views/dashboard/SchedulesScreen'
import { StudentsScreen } from '../views/dashboard/StudentsScreen'
import { TeamsScreen } from '../views/dashboard/TeamsScreen'
import { TournamentsScreen } from '../views/dashboard/TournamentsScreen'
import { ProductsScreen } from '../views/dashboard/ProductsScreen'
import { ReportsScreen } from '../views/dashboard/ReportsScreen'
import { CustomDrawerContent } from './CustomDrawerContent'
import { colors } from '../theme'
import type {
  AdminDrawerParamList,
  DashboardStackParamList,
  UsersStackParamList,
  CategoriesStackParamList,
  SchedulesStackParamList,
  StudentsStackParamList,
  TeamsStackParamList,
  TournamentsStackParamList,
  ProductsStackParamList,
  ReportsStackParamList,
} from './types'

const Drawer = createDrawerNavigator<AdminDrawerParamList>()

// Stacks internos (uno por tab)
const DashboardStack = createNativeStackNavigator<DashboardStackParamList>()
const DashboardStackScreen = () => (
  <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
    <DashboardStack.Screen name="Dashboard" component={DashboardScreen} />
  </DashboardStack.Navigator>
)

const UsersStack = createNativeStackNavigator<UsersStackParamList>()
const UsersStackScreen = () => (
  <UsersStack.Navigator screenOptions={{ headerShown: false }}>
    <UsersStack.Screen name="Users" component={UsersScreen} />
    <UsersStack.Screen name="UserForm" component={UserFormScreen} />
  </UsersStack.Navigator>
)

const CategoriesStack = createNativeStackNavigator<CategoriesStackParamList>()
const CategoriesStackScreen = () => (
  <CategoriesStack.Navigator screenOptions={{ headerShown: false }}>
    <CategoriesStack.Screen name="Categories" component={CategoriesScreen} />
  </CategoriesStack.Navigator>
)

const SchedulesStack = createNativeStackNavigator<SchedulesStackParamList>()
const SchedulesStackScreen = () => (
  <SchedulesStack.Navigator screenOptions={{ headerShown: false }}>
    <SchedulesStack.Screen name="Schedules" component={SchedulesScreen} />
  </SchedulesStack.Navigator>
)

const StudentsStack = createNativeStackNavigator<StudentsStackParamList>()
const StudentsStackScreen = () => (
  <StudentsStack.Navigator screenOptions={{ headerShown: false }}>
    <StudentsStack.Screen name="Students" component={StudentsScreen} />
  </StudentsStack.Navigator>
)

const TeamsStack = createNativeStackNavigator<TeamsStackParamList>()
const TeamsStackScreen = () => (
  <TeamsStack.Navigator screenOptions={{ headerShown: false }}>
    <TeamsStack.Screen name="Teams" component={TeamsScreen} />
  </TeamsStack.Navigator>
)

const TournamentsStack = createNativeStackNavigator<TournamentsStackParamList>()
const TournamentsStackScreen = () => (
  <TournamentsStack.Navigator screenOptions={{ headerShown: false }}>
    <TournamentsStack.Screen name="Tournaments" component={TournamentsScreen} />
  </TournamentsStack.Navigator>
)

const ProductsStack = createNativeStackNavigator<ProductsStackParamList>()
const ProductsStackScreen = () => (
  <ProductsStack.Navigator screenOptions={{ headerShown: false }}>
    <ProductsStack.Screen name="Products" component={ProductsScreen} />
  </ProductsStack.Navigator>
)

const ReportsStack = createNativeStackNavigator<ReportsStackParamList>()
const ReportsStackScreen = () => (
  <ReportsStack.Navigator screenOptions={{ headerShown: false }}>
    <ReportsStack.Screen name="Reports" component={ReportsScreen} />
  </ReportsStack.Navigator>
)

export const AdminNavigator: React.FC = () => {
  const { currentUser, logout } = useAuth()

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} user={currentUser} onLogout={logout} />
      )}
      screenOptions={{
        headerStyle: { backgroundColor: colors.red },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '700' },
        drawerActiveBackgroundColor: colors.red,
        drawerActiveTintColor: colors.white,
        drawerInactiveTintColor: colors.text,
      }}
    >
      <Drawer.Screen
        name="DashboardTab"
        component={DashboardStackScreen}
        options={{
          title: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="UsersTab"
        component={UsersStackScreen}
        options={{
          title: 'Usuarios',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="CategoriesTab"
        component={CategoriesStackScreen}
        options={{
          title: 'Categorías',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="pricetags-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="SchedulesTab"
        component={SchedulesStackScreen}
        options={{
          title: 'Horarios',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="StudentsTab"
        component={StudentsStackScreen}
        options={{
          title: 'Estudiantes',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="school-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="TeamsTab"
        component={TeamsStackScreen}
        options={{
          title: 'Equipos',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="shield-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="TournamentsTab"
        component={TournamentsStackScreen}
        options={{
          title: 'Torneos',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="trophy-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ProductsTab"
        component={ProductsStackScreen}
        options={{
          title: 'Productos',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="bag-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ReportsTab"
        component={ReportsStackScreen}
        options={{
          title: 'Reportes',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="download-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  )
}

export default AdminNavigator
