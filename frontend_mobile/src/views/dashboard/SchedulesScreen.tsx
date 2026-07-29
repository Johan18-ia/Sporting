// src/views/dashboard/SchedulesScreen.tsx
// ====================================================
// PANTALLA: SCHEDULES (CRUD)
// ====================================================
import React, { useState } from 'react'
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
import { useSchedules } from '../../hooks/useSchedules'
import { useAuth } from '../../hooks/useAuth'
import { DAYS_OF_WEEK } from '../../config/constants'
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme'
import type { Schedule } from '../../types'

const initialForm = () => ({
  categoryId: '',
  dayOfWeek: DAYS_OF_WEEK[0],
  startTime: '',
  endTime: '',
})

export const SchedulesScreen: React.FC = () => {
  const insets = useSafeAreaInsets()
  const { schedules, categories, loading, error, loadData, createSchedule } = useSchedules()
  const { hasAnyRole } = useAuth()

  const canCreate = hasAnyRole(['admin', 'seller'])

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(initialForm())
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleCreate = async () => {
    setFormError(null)
    setSuccess(null)
    const catId = parseInt(form.categoryId, 10)
    if (!catId || isNaN(catId)) {
      setFormError('Selecciona una categoría')
      return
    }
    if (!form.startTime || !form.endTime) {
      setFormError('Ingresa hora de inicio y fin')
      return
    }
    setSubmitting(true)
    const r = await createSchedule(catId, form.dayOfWeek, form.startTime, form.endTime)
    setSubmitting(false)
    if (r.success) {
      setSuccess('Horario creado')
      setForm(initialForm())
      setTimeout(() => {
        setModalOpen(false)
        setSuccess(null)
      }, 800)
    } else {
      setFormError(r.message || 'Error al crear horario')
    }
  }

  if (loading && schedules.length === 0 && categories.length === 0) {
    return <Loading fullScreen message="Cargando horarios..." />
  }

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 80 }]}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadData}
            tintColor={colors.red}
          />
        }
      >
        <Text style={styles.title}>Horarios</Text>
        <Text style={styles.subtitle}>Horarios de entrenamiento por categoría</Text>

        {error && <Card><Text style={styles.errorText}>{error}</Text></Card>}

        {schedules.length === 0 && !loading && (
          <Card>
            <Text style={styles.emptyTitle}>No hay horarios</Text>
            <Text style={styles.emptySubtitle}>
              {canCreate ? 'Crea el primer horario con el botón +.' : 'Aún no hay horarios cargados.'}
            </Text>
          </Card>
        )}

        {schedules.map((s) => {
          const cat = categories.find((c) => c.id === s.id_category)
          return (
            <Card key={s.id}>
              <View style={styles.row}>
                <View style={styles.rowMain}>
                  <Text style={styles.day}>{s.day_of_week}</Text>
                  <Text style={styles.time}>
                    🕐 {s.start_time} - {s.end_time}
                  </Text>
                  {cat ? (
                    <Text style={styles.cat}>Categoría: {cat.category_year}</Text>
                  ) : s.category_name ? (
                    <Text style={styles.cat}>Categoría: {s.category_name}</Text>
                  ) : null}
                </View>
              </View>
            </Card>
          )
        })}
      </ScrollView>

      {canCreate && (
        <TouchableOpacity
          style={[styles.fab, { bottom: insets.bottom + spacing.lg }]}
          onPress={() => setModalOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Crear horario"
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}

      <Modal visible={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo horario">
        {formError && <Text style={styles.errorText}>{formError}</Text>}
        {success && <Text style={styles.successText}>{success}</Text>}

        {categories.length === 0 ? (
          <Text style={styles.warnText}>
            Primero crea al menos una categoría.
          </Text>
        ) : (
          <>
            <Text style={styles.fieldLabel}>Categoría</Text>
            <View style={styles.chipsRow}>
              {categories.map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => setForm((p) => ({ ...p, categoryId: String(c.id) }))}
                  style={[
                    styles.chip,
                    form.categoryId === String(c.id) && styles.chipActive,
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: form.categoryId === String(c.id) }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      form.categoryId === String(c.id) && styles.chipTextActive,
                    ]}
                  >
                    {c.category_year}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        <Text style={styles.fieldLabel}>Día</Text>
        <View style={styles.chipsRow}>
          {DAYS_OF_WEEK.map((d) => (
            <Pressable
              key={d}
              onPress={() => setForm((p) => ({ ...p, dayOfWeek: d }))}
              style={[styles.chip, form.dayOfWeek === d && styles.chipActive]}
              accessibilityRole="radio"
              accessibilityState={{ selected: form.dayOfWeek === d }}
            >
              <Text
                style={[styles.chipText, form.dayOfWeek === d && styles.chipTextActive]}
              >
                {d.substring(0, 3)}
              </Text>
            </Pressable>
          ))}
        </View>

        <Input
          label="Hora inicio"
          value={form.startTime}
          onChangeText={(v) => setForm((p) => ({ ...p, startTime: v }))}
          placeholder="16:00"
          editable={!submitting}
        />
        <Input
          label="Hora fin"
          value={form.endTime}
          onChangeText={(v) => setForm((p) => ({ ...p, endTime: v }))}
          placeholder="18:00"
          editable={!submitting}
        />

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
            disabled={categories.length === 0}
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
  row: { flexDirection: 'row', alignItems: 'center' },
  rowMain: { flex: 1 },
  day: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.red,
    marginBottom: spacing.xs,
  },
  time: {
    fontSize: fontSize.md,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cat: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
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
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.red,
    borderColor: colors.red,
  },
  chipText: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  chipTextActive: {
    color: colors.white,
    fontWeight: fontWeight.semibold,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
})

export default SchedulesScreen