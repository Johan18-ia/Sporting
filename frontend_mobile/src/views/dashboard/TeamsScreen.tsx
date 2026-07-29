// src/views/dashboard/TeamsScreen.tsx
// ====================================================
// PANTALLA: TEAMS (CRUD local con AsyncStorage)
// ====================================================
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
  TouchableOpacity,
  Pressable,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Card, Loading, Modal, Input, Button } from '../../components'
import TeamModel, { type Team } from '../../models/TeamModel'
import { useStudents } from '../../hooks/useStudents'
import { useAuth } from '../../hooks/useAuth'
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme'

interface TeamForm {
  name: string
  description: string
  studentIds: number[]
}

const initialForm = (): TeamForm => ({
  name: '',
  description: '',
  studentIds: [],
})

export const TeamsScreen: React.FC = () => {
  const insets = useSafeAreaInsets()
  const { students, loading: loadingStudents } = useStudents()
  const { hasAnyRole } = useAuth()
  const canCreate = hasAnyRole(['admin', 'seller'])

  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<TeamForm>(initialForm())
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const loadTeams = async () => {
    setLoading(true)
    setError(null)
    const r = await TeamModel.getAllTeams()
    setLoading(false)
    if (r.success && Array.isArray(r.data)) {
      setTeams(r.data)
    } else if (r.success) {
      setTeams([])
    } else {
      setError(r.message || 'Error al cargar equipos')
    }
  }

  useEffect(() => {
    loadTeams()
  }, [])

  const toggleStudent = (id: number) => {
    setForm((prev) => {
      const exists = prev.studentIds.includes(id)
      return {
        ...prev,
        studentIds: exists
          ? prev.studentIds.filter((s) => s !== id)
          : [...prev.studentIds, id],
      }
    })
  }

  const handleCreate = async () => {
    setFormError(null)
    setSuccess(null)
    if (!form.name.trim()) {
      setFormError('El nombre del equipo es obligatorio')
      return
    }
    if (form.studentIds.length < 4) {
      setFormError('Mínimo 4 estudiantes (máximo 8)')
      return
    }
    if (form.studentIds.length > 8) {
      setFormError('Máximo 8 estudiantes por equipo')
      return
    }
    setSubmitting(true)
    const r = await TeamModel.createTeam({
      name: form.name.trim(),
      description: form.description,
      studentIds: form.studentIds,
    })
    setSubmitting(false)
    if (r.success) {
      setSuccess('Equipo creado')
      setForm(initialForm())
      await loadTeams()
      setTimeout(() => {
        setModalOpen(false)
        setSuccess(null)
      }, 800)
    } else {
      setFormError(r.message || 'Error al crear equipo')
    }
  }

  const handleDelete = (team: Team) => {
    Alert.alert(
      'Eliminar equipo',
      `¿Eliminar el equipo "${team.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const r = await TeamModel.deleteTeam(team.id)
            if (!r.success) Alert.alert('Error', r.message || 'No se pudo eliminar')
            loadTeams()
          },
        },
      ],
    )
  }

  if (loading && teams.length === 0 && loadingStudents) {
    return <Loading fullScreen message="Cargando equipos..." />
  }

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 80 }]}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadTeams} tintColor={colors.red} />
        }
      >
        <Text style={styles.title}>Equipos</Text>
        <Text style={styles.subtitle}>Equipos conformados por categoría</Text>

        {error && <Card><Text style={styles.errorText}>{error}</Text></Card>}

        {teams.length === 0 && !loading && (
          <Card>
            <Text style={styles.emptyTitle}>No hay equipos</Text>
            <Text style={styles.emptySubtitle}>
              {canCreate ? 'Crea el primer equipo con el botón +.' : 'Aún no hay equipos conformados.'}
            </Text>
          </Card>
        )}

        {teams.map((team) => (
          <Card key={team.id}>
            <View style={styles.row}>
              <View style={styles.rowMain}>
                <Text style={styles.teamName}>{team.name}</Text>
                {team.description ? (
                  <Text style={styles.teamDesc}>{team.description}</Text>
                ) : null}
                <Text style={styles.teamMeta}>
                  👥 {team.studentIds.length} jugadores
                </Text>
              </View>
              {canCreate && (
                <Pressable
                  onPress={() => handleDelete(team)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={`Eliminar equipo ${team.name}`}
                  style={styles.deleteBtn}
                >
                  <Text style={styles.deleteText}>✕</Text>
                </Pressable>
              )}
            </View>
          </Card>
        ))}
      </ScrollView>

      {canCreate && (
        <TouchableOpacity
          style={[styles.fab, { bottom: insets.bottom + spacing.lg }]}
          onPress={() => setModalOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Crear equipo"
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}

      <Modal visible={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo equipo">
        {formError && <Text style={styles.errorText}>{formError}</Text>}
        {success && <Text style={styles.successText}>{success}</Text>}

        <Input
          label="Nombre del equipo *"
          value={form.name}
          onChangeText={(v) => setForm((p) => ({ ...p, name: v }))}
          placeholder="Los Halcones"
          editable={!submitting}
        />
        <Input
          label="Descripción"
          value={form.description}
          onChangeText={(v) => setForm((p) => ({ ...p, description: v }))}
          placeholder="Color / observaciones"
          editable={!submitting}
        />

        <Text style={styles.fieldLabel}>
          Jugadores ({form.studentIds.length}/8) *
        </Text>
        {students.length === 0 ? (
          <Text style={styles.warnText}>
            No hay estudiantes registrados. Crea estudiantes primero.
          </Text>
        ) : (
          <ScrollView style={styles.studentsScroll} nestedScrollEnabled>
            {students.map((s) => {
              const selected = form.studentIds.includes(s.id)
              return (
                <Pressable
                  key={s.id}
                  onPress={() => toggleStudent(s.id)}
                  style={[styles.studentRow, selected && styles.studentRowActive]}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected }}
                >
                  <View style={[styles.checkbox, selected && styles.checkboxActive]}>
                    {selected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={[styles.studentName, selected && styles.studentNameActive]}>
                    {s.name} {s.lastname || ''}
                  </Text>
                </Pressable>
              )
            })}
          </ScrollView>
        )}

        <View style={styles.modalActions}>
          <Button
            title="Cancelar"
            variant="secondary"
            onPress={() => setModalOpen(false)}
            disabled={submitting}
            style={{ flex: 1, marginRight: spacing.sm }}
          />
          <Button
            title={submitting ? 'Creando...' : 'Crear'}
            onPress={handleCreate}
            loading={submitting}
            disabled={students.length === 0}
            style={{ flex: 1 }}
          />
        </View>
      </Modal>
    </View>
  )
}

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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowMain: { flex: 1 },
  teamName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  teamDesc: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  teamMeta: {
    fontSize: fontSize.sm,
    color: colors.red,
    fontWeight: fontWeight.medium,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: { color: colors.white, fontSize: fontSize.lg, fontWeight: fontWeight.bold },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  fabText: { color: colors.white, fontSize: 28, fontWeight: fontWeight.bold },
  errorText: { color: colors.danger, fontSize: fontSize.sm, marginBottom: spacing.md },
  successText: {
    color: colors.success,
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
    fontWeight: fontWeight.medium,
  },
  warnText: {
    color: colors.warning,
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },
  fieldLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  studentsScroll: {
    maxHeight: 240,
    marginBottom: spacing.md,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
  },
  studentRowActive: {
    backgroundColor: '#fef2f2',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.red,
    borderColor: colors.red,
  },
  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: fontWeight.bold,
  },
  studentName: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  studentNameActive: {
    fontWeight: fontWeight.semibold,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
})

export default TeamsScreen