// src/navigation/types.ts
// ====================================================
// TIPOS de los param lists de React Navigation
// ====================================================

import type { NavigatorScreenParams } from '@react-navigation/native'

// ============ Public Stack (sin sesión) ============
export type PublicStackParamList = {
  Home: undefined
  Login: undefined
  Register: undefined
}

// ============ Auth Stack (con sesión, no abrió sesión) ============
export type AuthStackParamList = {
  Login: undefined
  Register: undefined
}

// ============ Admin Drawer (admin/seller) ============
export type AdminDrawerParamList = {
  DashboardTab: undefined
  UsersTab: undefined
  CategoriesTab: undefined
  SchedulesTab: undefined
  StudentsTab: undefined
  TeamsTab: undefined
  TournamentsTab: undefined
  ProductsTab: undefined
  ReportsTab: undefined
}

// ============ Student Bottom Tabs (rol user) ============
export type StudentTabParamList = {
  DashboardTab: undefined
  ProfileTab: undefined
  SchedulesTab: undefined
  TournamentsTab: undefined
}

// ============ Cada tab tiene su propio Stack interno ============
export type DashboardStackParamList = {
  Dashboard: undefined
}

export type UsersStackParamList = {
  Users: undefined
  UserForm: { userId?: number; mode: 'create' | 'edit' | 'view' }
}

export type CategoriesStackParamList = {
  Categories: undefined
  CategoryForm: { categoryId?: number }
}

export type SchedulesStackParamList = {
  Schedules: undefined
  ScheduleForm: { scheduleId?: number }
}

export type StudentsStackParamList = {
  Students: undefined
  StudentForm: { studentId?: number }
}

export type TeamsStackParamList = {
  Teams: undefined
  TeamForm: { teamId?: number }
}

export type TournamentsStackParamList = {
  Tournaments: undefined
  TournamentForm: { tournamentId?: number }
}

export type ProductsStackParamList = {
  Products: undefined
  ProductForm: { productId?: number }
}

export type ReportsStackParamList = {
  Reports: undefined
}

export type ProfileStackParamList = {
  Profile: undefined
}

export type MySchedulesStackParamList = {
  MySchedules: undefined
}

export type MyTournamentsStackParamList = {
  MyTournaments: undefined
}

// Main Navigator (decide Drawer vs Tabs)
export type MainStackParamList = {
  Admin: NavigatorScreenParams<AdminDrawerParamList>
  Student: NavigatorScreenParams<StudentTabParamList>
}
