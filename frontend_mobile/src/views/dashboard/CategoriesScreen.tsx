// src/views/dashboard/CategoriesScreen.tsx
// ====================================================
// PANTALLA: CATEGORIES (CRUD)
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
import { useCategories } from '../../hooks/useCategories'
import { useAuth } from '../../hooks/useAuth'
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme'
import type { Category } from '../../types'

export const CategoriesScreen: React.FC = () => {
  const insets = useSafeAreaInsets()
  const { categories, loading, error, fetchCategories, createCategory, deleteCategory } = useCategories()
  const { hasAnyRole } = useAuth()

  const canCreate = hasAnyRole(['admin', 'seller'])
  const canDelete = hasAnyRole(['admin'])

  const [modalOpen, setModalOpen] = useState(false)
  const [year, setYear] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleCreate = async () => {
    setFormError(null)
    setSuccessMsg(null)
    const yearNum = parseInt(year, 10)
    if (!year || isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
      setFormError('Ingresa un año válido')
      return
    }
    setSubmitting(true)
    const result = await createCategory(yearNum, description.trim())
    setSubmitting(false)
    if (result.success) {
      setSuccessMsg('Categoría creada exitosamente')
      setYear('')
      setDescription('')
      setTimeout(() => {
        setModalOpen(false)
        setSuccessMsg(null)
      }, 800)
    } else {
      setFormError(result.message || 'Error al crear categoría')
    }
  }

  const handleDelete = (category: Category) => {
    if (!canDelete) {
      Alert.alert('Sin permisos', 'Solo administradores pueden eliminar categorías')
      return
    }
    Alert.alert(
      'Eliminar categoría',
      `¿Eliminar la categoría "${category.category_year}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const r = await deleteCategory(category.id)
            if (!r.success) Alert.alert('Error', r.message || 'No se pudo eliminar')
          },
        },
      ],
    )
  }

  if (loading && categories.length === 0) {
    return <Loading fullScreen message="Cargando categorías..." />
  }

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 80 }]}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchCategories}
            tintColor={colors.red}
          />
        }
      >
        <Text style={styles.title}>Categorías</Text>
        <Text style={styles.subtitle}>Años de nacimiento de los estudiantes</Text>

        {error && <Card><Text style={styles.errorText}>{error}</Text></Card>}

        {categories.length === 0 && !loading && (
          <Card>
            <Text style={styles.emptyTitle}>No hay categorías</Text>
            <Text style={styles.emptySubtitle}>
              {canCreate
                ? 'Crea la primera categoría para empezar.'
                : 'Pide al administrador que cree categorías.'}
            </Text>
            {canCreate && (
              <Button
                title="Crear primera categoría"
                onPress={() => setModalOpen(true)}
                style={{ marginTop: spacing.md }}
              />
            )}
          </Card>
        )}

        {categories.map((c) => (
          <Card key={c.id}>
            <View style={styles.row}>
              <View style={styles.rowMain}>
                <Text style={styles.year}>{c.category_year}</Text>
                {c.description ? (
                  <Text style={styles.desc}>{c.description}</Text>
                ) : (
                  <Text style={styles.descMuted}>Sin descripción</Text>
                )}
              </View>
              {canDelete && (
                <Pressable
                  onPress={() => handleDelete(c)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={`Eliminar categoría ${c.category_year}`}
                  style={styles.deleteBtn}
                >
                  <Text style={styles.deleteText}>✕</Text>
                </Pressable>
              )}
            </View>
          </Card>
        ))}
      </ScrollView>

      {canCreate && categories.length > 0 && (
        <TouchableOpacity
          style={[styles.fab, { bottom: insets.bottom + spacing.lg }]}
          onPress={() => setModalOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Crear categoría"
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}

      <Modal visible={modalOpen} onClose={() => setModalOpen(false)} title="Nueva categoría">
        {formError && (
          <Text style={styles.errorText}>{formError}</Text>
        )}
        {successMsg && (
          <Text style={styles.successText}>{successMsg}</Text>
        )}
        <Input
          label="Año *"
          type="number"
          value={year}
          onChangeText={setYear}
          placeholder="2010"
          editable={!submitting}
        />
        <Input
          label="Descripción"
          value={description}
          onChangeText={setDescription}
          placeholder="Ej: Sub-12"
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
    justifyContent: 'space-between',
  },
  rowMain: { flex: 1 },
  year: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.red,
    marginBottom: spacing.xs,
  },
  desc: { fontSize: fontSize.md, color: colors.text },
  descMuted: { fontSize: fontSize.sm, color: colors.textMuted, fontStyle: 'italic' },
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
  errorText: {
    color: colors.danger,
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
  },
  successText: {
    color: colors.success,
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
    fontWeight: fontWeight.medium,
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
  modalActions: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
})

export default CategoriesScreen