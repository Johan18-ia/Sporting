// src/navigation/StudentNavigator.tsx
// ====================================================
// Bottom Tabs para el estudiante (rol user)
// 4 secciones: Dashboard, Perfil, Horarios, Torneos
// ====================================================
import React from 'react'
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons'
import { StudentDashboardScreen } from '../views/dashboard/StudentDashboardScreen'
import { ProfileScreen } from '../views/dashboard/ProfileScreen'
import { MySchedulesScreen } from '../views/dashboard/MySchedulesScreen'
import { MyTournamentsScreen } from '../views/dashboard/MyTournamentsScreen'
import { colors } from '../theme'
import type {
  StudentTabParamList,
  DashboardStackParamList,
  ProfileStackParamList,
  MySchedulesStackParamList,
  MyTournamentsStackParamList,
} from './types'

const Tab = createBottomTabNavigator<StudentTabParamList>()

// Stacks internos
const DashboardStack = createNativeStackNavigator<DashboardStackParamList>()
const DashboardStackScreen = () => (
  <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
    <DashboardStack.Screen name="Dashboard" component={StudentDashboardScreen} />
  </DashboardStack.Navigator>
)

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>()
const ProfileStackScreen = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
  </ProfileStack.Navigator>
)

const SchedulesStack = createNativeStackNavigator<MySchedulesStackParamList>()
const SchedulesStackScreen = () => (
  <SchedulesStack.Navigator screenOptions={{ headerShown: false }}>
    <SchedulesStack.Screen name="MySchedules" component={MySchedulesScreen} />
  </SchedulesStack.Navigator>
)

const TournamentsStack = createNativeStackNavigator<MyTournamentsStackParamList>()
const TournamentsStackScreen = () => (
  <TournamentsStack.Navigator screenOptions={{ headerShown: false }}>
    <TournamentsStack.Screen name="MyTournaments" component={MyTournamentsScreen} />
  </TournamentsStack.Navigator>
)

const ICON_MAP: Record<keyof StudentTabParamList, string> = {
  DashboardTab: 'grid-outline',
  ProfileTab: 'person-outline',
  SchedulesTab: 'time-outline',
  TournamentsTab: 'trophy-outline',
}

export const StudentNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={
      ({ route }) =>
        ({
          headerStyle: { backgroundColor: colors.red },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: '700' },
          tabBarActiveTintColor: colors.red,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: { paddingBottom: 4, height: 60 },
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={ICON_MAP[route.name as keyof StudentTabParamList] as any}
              size={size}
              color={color}
            />
          ),
        } as BottomTabNavigationOptions)
    }
  >
    <Tab.Screen name="DashboardTab" component={DashboardStackScreen} options={{ title: 'Mi Panel' }} />
    <Tab.Screen name="ProfileTab" component={ProfileStackScreen} options={{ title: 'Mi Perfil' }} />
    <Tab.Screen name="SchedulesTab" component={SchedulesStackScreen} options={{ title: 'Mis Horarios' }} />
    <Tab.Screen name="TournamentsTab" component={TournamentsStackScreen} options={{ title: 'Mis Torneos' }} />
  </Tab.Navigator>
)

export default StudentNavigator
