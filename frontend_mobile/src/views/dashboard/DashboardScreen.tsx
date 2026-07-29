// src/views/dashboard/DashboardScreen.tsx
// ====================================================
// PANTALLA: DASHBOARD (Resumen admin/seller)
// Equivalente funcional de DashboardView.jsx (tab dashboard)
// ====================================================
import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Card, Loading } from '../../components'
import { useAuth } from '../../hooks/useAuth'
import { getDisplayName } from '../../utils/helpers'
import { colors, spacing, fontSize, fontWeight } from '../../theme'
import { StudentModel } from '../../models/StudentModel'
import { TournamentModel } from '../../models/TournamentModel'
import { ProductModel } from '../../models/ProductModel'
import { CategoryModel } from '../../models/CategoryModel'
import { ScheduleModel } from '../../models/ScheduleModel'
import { TeamModel } from '../../models/TeamModel'

interface Stat {
  label: string
  value: number
}

export const DashboardScreen: React.FC = () => {
  const insets = useSafeAreaInsets()
  const { currentUser } = useAuth()
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [st, tn, pr, ca, sc, te] = await Promise.all([
        StudentModel.getAllStudents(),
        TournamentModel.getAllTournaments(),
        ProductModel.getAllProducts(),
        CategoryModel.getAllCategories(),
        ScheduleModel.getAllSchedules(),
        TeamModel.getAllTeams(),
      ])

      const tList = tn.success && Array.isArray(tn.data) ? tn.data : []
      const activeT = tList.filter((t: any) => (t.status || 'Activo') === 'Activo').length

      setStats([
        { label: 'Estudiantes', value: st.success && st.data ? st.data.length : 0 },
        { label: 'Categorías', value: ca.success && ca.data ? ca.data.length : 0 },
        { label: 'Horarios', value: sc.success && sc.data ? sc.data.length : 0 },
        { label: 'Torneos', value: tList.length },
        { label: 'Torneos Activos', value: activeT },
        { label: 'Productos', value: pr.success && pr.data ? pr.data.length : 0 },
        { label: 'Equipos', value: te.success && te.data ? te.data.length : 0 },
      ])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <Loading fullScreen message="Cargando panel..." />

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.container,
        { paddingBottom: insets.bottom + spacing.lg },
      ]}
    >
      <Text style={styles.welcome}>
        Bienvenido, {getDisplayName(currentUser)}
      </Text>
      <Text style={styles.subtitle}>Panel de administración de Sporting Club</Text>

      <View style={styles.statsGrid}>
        {stats.map((s) => (
          <View key={s.label} style={styles.statCard}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Card title="Resumen del Sistema">
        <Text style={styles.muted}>
          Gestión completa de la escuela de microfútbol
        </Text>
        <View style={styles.dotList}>
          {[
            'Gestión de Usuarios',
            'Categorías por año',
            'Horarios de entrenamiento',
            'Gestión de Estudiantes',
            'Torneos y Equipos',
            'Catálogo de Productos',
          ].map((item) => (
            <Text key={item} style={styles.dotItem}>
              <Text style={styles.dot}>• </Text>
              {item}
            </Text>
          ))}
        </View>
      </Card>

      <Card title="Cuenta">
        <View style={styles.accountRow}>
          <Text style={styles.accountLabel}>Usuario</Text>
          <Text style={styles.accountValue}>{currentUser?.email}</Text>
        </View>
        <View style={styles.accountRow}>
          <Text style={styles.accountLabel}>Rol</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{currentUser?.role}</Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: {
    padding: spacing.lg,
  },
  welcome: {
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    minWidth: '47%',
    flexGrow: 1,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statValue: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.red,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontWeight: fontWeight.medium,
  },
  muted: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
  },
  dotList: {
    marginTop: spacing.xs,
  },
  dotItem: {
    fontSize: fontSize.md,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  dot: {
    color: colors.red,
    fontWeight: fontWeight.bold,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  accountLabel: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontWeight: fontWeight.medium,
  },
  accountValue: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
  badge: {
    backgroundColor: colors.red,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  badgeText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
  },
})

export default DashboardScreen
