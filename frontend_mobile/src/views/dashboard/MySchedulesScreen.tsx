// src/views/dashboard/MySchedulesScreen.tsx
// ====================================================
// PANTALLA: MIS HORARIOS (estudiante)
// Muestra todos los horarios; el estudiante se identifica
// con su documento para resaltar su categoría.
// ====================================================
import React, { useEffect, useState } from 'react'
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
import { Card, Loading, Input, Modal, Button } from '../../components'
import { useSchedules } from '../../hooks/useSchedules'
import { useStudents } from '../../hooks/useStudents'
import { useCategories } from '../../hooks/useCategories'
import { useAuth } from '../../hooks/useAuth'
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme'
import type { Student } from '../../types'

export const MySchedulesScreen: React.FC = () => {
  const insets = useSafeAreaInsets()
  const { schedules, categories, loading, loadData } = useSchedules()
  const { students, loading: loadingStudents } = useStudents()
  const { categories: allCategories } = useCategories()
  const { currentUser } = useAuth()

  const [me, setMe] = useState<Student | null>(null)
  const [docInput, setDocInput] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [docError, setDocError] = useState<string | null>(null)

  // Auto-match por email si el usuario autenticado tiene email
  useEffect(() => {
    if (currentUser?.email && students.length > 0 && !me) {
      const match = students.find((s) => (s.email || '').toLowerCase() === currentUser.email?.toLowerCase())
      if (match) setMe(match)
    }
  }, [currentUser, students, me])

  const handleIdentify = () => {
    setDocError(null)
    const q = docInput.trim().toLowerCase()
    if (!q) {
      setDocError('Ingresa tu documento')
      return
    }
    const match = students.find((s) => (s.document || '').toLowerCase() === q)
    if (!match) {
      setDocError('No encontramos un estudiante con ese documento')
      return
    }
    setMe(match)
    setModalOpen(false)
    setDocInput('')
  }

  if (loading && schedules.length === 0) {
    return <Loading fullScreen message="Cargando tus horarios..." />
  }

  const myCategoryId = me?.category_id ?? null
  const mySchedules = myCategoryId
    ? schedules.filter((s) => s.id_category === myCategoryId)
    : []

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 80 }]}
        refreshControl={
          <RefreshControl refreshing={loading || loadingStudents} onRefresh={loadData} tintColor={colors.red} />
        }
      >
        <Text style={styles.title}>Mis Horarios</Text>
        <Text style={styles.subtitle}>
          {me
            ? `Categoría: ${allCategories.find((c) => c.id === me.category_id)?.category_year || 'Sin categoría'}`
            : 'Identifícate para ver tus horarios'}
        </Text>

        {!me && (
          <Card>
            <Text style={styles.emptyTitle}>¿Quién eres?</Text>
            <Text style={styles.emptySubtitle}>
              Ingresa tu documento para ver los horarios de tu categoría.
            </Text>
            <Button
              title="Identificarme"
              onPress={() => setModalOpen(true)}
              style={{ marginTop: spacing.sm }}
            />
          </Card>
        )}

        {me && mySchedules.length === 0 && (
          <Card>
            <Text style={styles.emptyTitle}>Sin horarios</Text>
            <Text style={styles.emptySubtitle}>
              Aún no hay horarios registrados para tu categoría.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setMe(null)
                setModalOpen(true)
              }}
              accessibilityRole="button"
              accessibilityLabel="Cambiar de estudiante"
              style={styles.changeBtn}
            >
              <Text style={styles.changeBtnText}>Cambiar de estudiante</Text>
            </TouchableOpacity>
          </Card>
        )}

        {me && mySchedules.length > 0 && (
          <>
            {mySchedules.map((s: any) => {
              const cat = categories.find((c) => c.id === s.id_category)
              return (
                <Card key={s.id}>
                  <Text style={styles.day}>{s.day_of_week}</Text>
                  <Text style={styles.time}>🕐 {s.start_time} - {s.end_time}</Text>
                  {cat && <Text style={styles.cat}>Categoría: {cat.category_year}</Text>}
                </Card>
              )
            })}
            <TouchableOpacity
              onPress={() => {
                setMe(null)
                setModalOpen(true)
              }}
              accessibilityRole="button"
              accessibilityLabel="Cambiar de estudiante"
              style={styles.changeBtn}
            >
              <Text style={styles.changeBtnText}>Cambiar de estudiante</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <Modal visible={modalOpen} onClose={() => setModalOpen(false)} title="Identifícate">
        {docError && <Text style={styles.errorText}>{docError}</Text>}
        <Input
          label="Documento"
          value={docInput}
          onChangeText={setDocInput}
          placeholder="Tu número de documento"
          keyboardType="numeric"
        />
        <View style={styles.modalActions}>
          <Button
            title="Cancelar"
            variant="secondary"
            onPress={() => setModalOpen(false)}
            style={{ flex: 1, marginRight: spacing.sm }}
          />
          <Button
            title="Buscar"
            onPress={handleIdentify}
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
    marginBottom: spacing.sm,
  },
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
  changeBtn: {
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  changeBtnText: {
    fontSize: fontSize.sm,
    color: colors.red,
    fontWeight: fontWeight.medium,
  },
  errorText: {
    color: colors.danger,
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
})

export default MySchedulesScreen