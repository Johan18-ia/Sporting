// src/views/dashboard/ReportsScreen.tsx
// ====================================================
// PANTALLA: REPORTS (resumen de estadísticas)
// ====================================================
import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Card, Loading } from '../../components'
import { useStudents } from '../../hooks/useStudents'
import { useTournaments } from '../../hooks/useTournaments'
import { useSchedules } from '../../hooks/useSchedules'
import { useCategories } from '../../hooks/useCategories'
import { useProducts } from '../../hooks/useProducts'
import TeamModel from '../../models/TeamModel'
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme'

interface ReportSummary {
  students: number
  categories: number
  tournaments: number
  schedules: number
  products: number
  teams: number
  lastUpdate: string
}

export const ReportsScreen: React.FC = () => {
  const insets = useSafeAreaInsets()
  const { students, loading: loadingStudents } = useStudents()
  const { tournaments, loading: loadingTournaments } = useTournaments()
  const { schedules, loading: loadingSchedules } = useSchedules()
  const { categories, loading: loadingCategories } = useCategories()
  const { products, loading: loadingProducts } = useProducts()

  const [teamsCount, setTeamsCount] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<string>(new Date().toLocaleTimeString())

  const loadingAny =
    loadingStudents ||
    loadingTournaments ||
    loadingSchedules ||
    loadingCategories ||
    loadingProducts

  const loadTeamsCount = useCallback(async () => {
    const r = await TeamModel.getAllTeams()
    if (r.success && Array.isArray(r.data)) {
      setTeamsCount(r.data.length)
    } else {
      setTeamsCount(0)
    }
  }, [])

  useEffect(() => {
    loadTeamsCount()
  }, [loadTeamsCount])

  const handleRefresh = async () => {
    setRefreshing(true)
    await Promise.all([
      loadTeamsCount(),
    ])
    setLastRefresh(new Date().toLocaleTimeString())
    setRefreshing(false)
  }

  const summary: ReportSummary = {
    students: students.length,
    categories: categories.length,
    tournaments: tournaments.length,
    schedules: schedules.length,
    products: products.length,
    teams: teamsCount,
    lastUpdate: lastRefresh,
  }

  if (loadingAny && teamsCount === 0) {
    return <Loading fullScreen message="Cargando reportes..." />
  }

  const stats: Array<{ key: keyof Omit<ReportSummary, 'lastUpdate'>; label: string; icon: string }> = [
    { key: 'students', label: 'Estudiantes', icon: '👥' },
    { key: 'categories', label: 'Categorías', icon: '🏷️' },
    { key: 'schedules', label: 'Horarios', icon: '🕐' },
    { key: 'tournaments', label: 'Torneos', icon: '🏆' },
    { key: 'teams', label: 'Equipos', icon: '⚽' },
    { key: 'products', label: 'Productos', icon: '🛒' },
  ]

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 80 }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.red} />
        }
      >
        <Text style={styles.title}>Reportes</Text>
        <Text style={styles.subtitle}>Resumen general de Sporting Club</Text>

        <Card>
          <Text style={styles.lastUpdate}>Última actualización: {summary.lastUpdate}</Text>
          <TouchableOpacity
            onPress={handleRefresh}
            accessibilityRole="button"
            accessibilityLabel="Refrescar reportes"
            style={styles.refreshBtn}
          >
            <Text style={styles.refreshBtnText}>🔄 Refrescar</Text>
          </TouchableOpacity>
        </Card>

        <View style={styles.grid}>
          {stats.map((s) => (
            <Card key={s.key} style={styles.statCard}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={styles.statValue}>{summary[s.key]}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </Card>
          ))}
        </View>

        <Card>
          <Text style={styles.sectionTitle}>Desglose rápido</Text>
          <View style={styles.divider} />
          <Row label="Torneos activos" value={String(summary.tournaments)} />
          <Row label="Horarios por categoría (prom.)" value={summary.categories > 0 ? (summary.schedules / summary.categories).toFixed(1) : '0'} />
          <Row label="Estudiantes por equipo (prom.)" value={summary.teams > 0 ? (summary.students / summary.teams).toFixed(1) : '—'} />
          <Row label="Productos en catálogo" value={String(summary.products)} />
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Próximamente</Text>
          <Text style={styles.muted}>
            • Exportación PDF/CSV{'\n'}
            • Gráficos de asistencia mensual{'\n'}
            • Reportes financieros
          </Text>
        </Card>
      </ScrollView>
    </View>
  )
}

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
)

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg },
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
  lastUpdate: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  refreshBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.red,
    borderRadius: radius.md,
  },
  refreshBtnText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statIcon: { fontSize: 28, marginBottom: spacing.xs },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  rowLabel: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  rowValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  muted: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    lineHeight: 20,
  },
})

export default ReportsScreen