// src/views/dashboard/TournamentsScreen.tsx
// ====================================================
// PANTALLA: TOURNAMENTS (CRUD)
// ====================================================
import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Pressable,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Card, Loading, Modal, Input, Button } from '../../components'
import { useTournaments } from '../../hooks/useTournaments'
import { useCategories } from '../../hooks/useCategories'
import { useAuth } from '../../hooks/useAuth'
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme'
import type { Tournament } from '../../types'

export const TournamentsScreen: React.FC = () => {
  const insets = useSafeAreaInsets()
  const { tournaments, loading, error, loadTournaments, createTournament } = useTournaments()
  const { categories } = useCategories()
  const { hasAnyRole } = useAuth()

  const canCreate = hasAnyRole(['admin', 'seller'])

  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleCreate = async () => {
    setFormError(null)
    setSuccess(null)
    if (!name.trim()) {
      setFormError('El nombre es obligatorio')
      return
    }
    if (!categoryId) {
      setFormError('Selecciona una categoría')
      return
    }
    setSubmitting(true)
    const r = await createTournament({ name: name.trim(), category: categoryId })
    setSubmitting(false)
    if (r.success) {
      setSuccess('Torneo creado')
      setName('')
      setCategoryId('')
      setTimeout(() => {
        setModalOpen(false)
        setSuccess(null)
      }, 800)
    } else {
      setFormError(typeof r.error === 'string' ? r.error : 'Error al crear torneo')
    }
  }

  if (loading && tournaments.length === 0) {
    return <Loading fullScreen message="Cargando torneos..." />
  }

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 80 }]}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadTournaments}
            tintColor={colors.red}
          />
        }
      >
        <Text style={styles.title}>Torneos</Text>
        <Text style={styles.subtitle}>Torneos y competencias internas</Text>

        {error && <Card><Text style={styles.errorText}>{error}</Text></Card>}

        {tournaments.length === 0 && !loading && (
          <Card>
            <Text style={styles.emptyTitle}>No hay torneos</Text>
            <Text style={styles.emptySubtitle}>
              {canCreate ? 'Crea el primer torneo con el botón +.' : 'Aún no hay torneos registrados.'}
            </Text>
          </Card>
        )}

        {tournaments.map((t) => {
          const status = t.status || 'Activo'
          return (
            <Card key={t.id}>
              <View style={styles.row}>
                <View style={styles.rowMain}>
                  <Text style={styles.name}>{t.name}</Text>
                  <Text style={styles.cat}>Categoría: {t.category}</Text>
                  <View style={styles.statusRow}>
                    <View
                      style={[
                        styles.statusBadge,
                        status === 'Activo' && styles.statusBadgeActive,
                        status === 'En Progreso' && styles.statusBadgeProgress,
                        status === 'Finalizado' && styles.statusBadgeDone,
                      ]}
                    >
                      <Text style={styles.statusText}>{status}</Text>
                    </View>
                    <Text style={styles.students}>
                      👥 {t.students?.length || 0} estudiantes
                    </Text>
                  </View>
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
          accessibilityLabel="Crear torneo"
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}

      <Modal visible={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo torneo">
        {formError && <Text style={styles.errorText}>{formError}</Text>}
        {success && <Text style={styles.successText}>{success}</Text>}

        {categories.length === 0 ? (
          <Text style={styles.warnText}>
            Primero crea al menos una categoría.
          </Text>
        ) : (
          <>
            <Input
              label="Nombre *"
              value={name}
              onChangeText={setName}
              placeholder="Ej: Copa Sporting 2025"
              editable={!submitting}
            />
            <Text style={styles.fieldLabel}>Categoría *</Text>
            <View style={styles.chipsRow}>
              {categories.map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => setCategoryId(String(c.id))}
                  style={[
                    styles.chip,
                    categoryId === String(c.id) && styles.chipActive,
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: categoryId === String(c.id) }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      categoryId === String(c.id) && styles.chipTextActive,
                    ]}
                  >
                    {c.category_year}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
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
  name: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cat: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: colors.gray,
  },
  statusBadgeActive: { backgroundColor: colors.success },
  statusBadgeProgress: { backgroundColor: colors.warning },
  statusBadgeDone: { backgroundColor: colors.textMuted },
  statusText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: fontWeight.bold,
  },
  students: {
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

export default TournamentsScreen