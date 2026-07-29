// src/views/dashboard/StudentsScreen.tsx
// ====================================================
// PANTALLA: STUDENTS (CRUD)
// ====================================================
import React, { useMemo, useState } from 'react'
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
import { useStudents } from '../../hooks/useStudents'
import { useCategories } from '../../hooks/useCategories'
import { useAuth } from '../../hooks/useAuth'
import { getDisplayName, getInitials } from '../../utils/helpers'
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme'
import type { Student } from '../../types'

interface StudentForm {
  name: string
  lastname: string
  document: string
  birth_date: string
  email: string
  phone: string
  category_id: string
}

const initialForm = (): StudentForm => ({
  name: '',
  lastname: '',
  document: '',
  birth_date: '',
  email: '',
  phone: '',
  category_id: '',
})

export const StudentsScreen: React.FC = () => {
  const insets = useSafeAreaInsets()
  const { students, loading, error, loadStudents, createStudent } = useStudents()
  const { categories } = useCategories()
  const { hasAnyRole } = useAuth()

  const canCreate = hasAnyRole(['admin', 'seller'])

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<StudentForm>(initialForm())
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return students
    return students.filter((s) => {
      const full = `${s.name || ''} ${s.lastname || ''}`.toLowerCase()
      return (
        full.includes(q) ||
        (s.document || '').toLowerCase().includes(q) ||
        (s.email || '').toLowerCase().includes(q)
      )
    })
  }, [students, search])

  const update = (key: keyof StudentForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleCreate = async () => {
    setFormError(null)
    setSuccess(null)
    if (!form.name || !form.document) {
      setFormError('Nombre y documento son obligatorios')
      return
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setFormError('Email inválido')
      return
    }
    setSubmitting(true)
    const payload: any = {
      name: form.name,
      lastname: form.lastname,
      document: form.document,
      birth_date: form.birth_date || null,
      email: form.email || null,
      phone: form.phone,
      category_id: form.category_id ? parseInt(form.category_id, 10) : null,
    }
    const r = await createStudent(payload)
    setSubmitting(false)
    if (r.success) {
      setSuccess('Estudiante creado')
      setForm(initialForm())
      setTimeout(() => {
        setModalOpen(false)
        setSuccess(null)
      }, 800)
    } else {
      setFormError(typeof r.error === 'string' ? r.error : 'Error al crear estudiante')
    }
  }

  if (loading && students.length === 0) {
    return <Loading fullScreen message="Cargando estudiantes..." />
  }

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 80 }]}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadStudents}
            tintColor={colors.red}
          />
        }
      >
        <Text style={styles.title}>Estudiantes</Text>
        <Text style={styles.subtitle}>Estudiantes inscritos en Sporting</Text>

        <Input
          placeholder="Buscar por nombre, documento o email"
          value={search}
          onChangeText={setSearch}
        />

        {error && <Card><Text style={styles.errorText}>{error}</Text></Card>}

        {filtered.length === 0 && !loading && (
          <Card>
            <Text style={styles.emptyTitle}>
              {search ? 'Sin resultados' : 'No hay estudiantes'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {search
                ? 'Intenta con otro término de búsqueda.'
                : canCreate
                ? 'Registra el primer estudiante con el botón +.'
                : 'Aún no hay estudiantes registrados.'}
            </Text>
          </Card>
        )}

        {filtered.map((s) => {
          const initials = getInitials(s.name, s.lastname)
          const cat = categories.find((c) => c.id === s.category_id)
          return (
            <Card key={s.id}>
              <View style={styles.row}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View style={styles.rowMain}>
                  <Text style={styles.name}>{getDisplayName(s)}</Text>
                  {s.document && (
                    <Text style={styles.doc}>CC {s.document}</Text>
                  )}
                  {cat && (
                    <Text style={styles.cat}>Categoría: {cat.category_year}</Text>
                  )}
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
          accessibilityLabel="Crear estudiante"
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}

      <Modal visible={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo estudiante">
        {formError && <Text style={styles.errorText}>{formError}</Text>}
        {success && <Text style={styles.successText}>{success}</Text>}

        <Input
          label="Nombre *"
          value={form.name}
          onChangeText={update('name')}
          placeholder="Nombre"
          editable={!submitting}
        />
        <Input
          label="Apellido"
          value={form.lastname}
          onChangeText={update('lastname')}
          placeholder="Apellido"
          editable={!submitting}
        />
        <Input
          label="Documento *"
          value={form.document}
          onChangeText={update('document')}
          placeholder="CC / TI"
          editable={!submitting}
        />
        <Input
          label="Fecha de nacimiento"
          type="date"
          value={form.birth_date}
          onChangeText={update('birth_date')}
          placeholder="YYYY-MM-DD"
          editable={!submitting}
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChangeText={update('email')}
          placeholder="opcional"
          editable={!submitting}
        />
        <Input
          label="Teléfono"
          type="tel"
          value={form.phone}
          onChangeText={update('phone')}
          placeholder="opcional"
          editable={!submitting}
        />

        {categories.length > 0 && (
          <>
            <Text style={styles.fieldLabel}>Categoría</Text>
            <View style={styles.chipsRow}>
              {categories.map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => setForm((p) => ({ ...p, category_id: String(c.id) }))}
                  style={[
                    styles.chip,
                    form.category_id === String(c.id) && styles.chipActive,
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: form.category_id === String(c.id) }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      form.category_id === String(c.id) && styles.chipTextActive,
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
    marginBottom: spacing.md,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  rowMain: { flex: 1 },
  name: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  doc: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  cat: {
    fontSize: fontSize.sm,
    color: colors.red,
    marginTop: 2,
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

export default StudentsScreen