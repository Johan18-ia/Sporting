// src/views/dashboard/MyTournamentsScreen.tsx
// ====================================================
// PANTALLA: MIS TORNEOS (estudiante)
// ====================================================
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Card, Loading, Input, Modal, Button } from '../../components'
import { useTournaments } from '../../hooks/useTournaments'
import { useStudents } from '../../hooks/useStudents'
import { useCategories } from '../../hooks/useCategories'
import { useAuth } from '../../hooks/useAuth'
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme'
import type { Student } from '../../types'

export const MyTournamentsScreen: React.FC = () => {
  const insets = useSafeAreaInsets()
  const { tournaments, loading, loadTournaments } = useTournaments()
  const { students } = useStudents()
  const { categories } = useCategories()
  const { currentUser } = useAuth()

  const [me, setMe] = useState<Student | null>(null)
  const [docInput, setDocInput] = useState('')
  const [docError, setDocError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

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

  if (loading && tournaments.length === 0) {
    return <Loading fullScreen message="Cargando torneos..." />
  }

  const myCategoryId = me?.category_id ?? null
  const myTournaments = myCategoryId
    ? tournaments.filter((t) => {
        // La categoría en Tournament es string (ej. "Sub-12"); intentamos matchear por id cuando posible.
        const cat = categories.find((c) => String(c.id) === String(t.category))
        return cat ? cat.id === myCategoryId : false
      })
    : []

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 80 }]}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadTournaments} tintColor={colors.red} />
        }
      >
        <Text style={styles.title}>Mis Torneos</Text>
        <Text style={styles.subtitle}>
          {me
            ? `Categoría: ${categories.find((c) => c.id === me.category_id)?.category_year || 'Sin categoría'}`
            : 'Identifícate para ver tus torneos'}
        </Text>

        {!me && (
          <Card>
            <Text style={styles.emptyTitle}>¿Quién eres?</Text>
            <Text style={styles.emptySubtitle}>
              Ingresa tu documento para ver los torneos de tu categoría.
            </Text>
            <Button
              title="Identificarme"
              onPress={() => setModalOpen(true)}
              style={{ marginTop: spacing.sm }}
            />
          </Card>
        )}

        {me && myTournaments.length === 0 && (
          <Card>
            <Text style={styles.emptyTitle}>Sin torneos</Text>
            <Text style={styles.emptySubtitle}>
              Aún no estás registrado en torneos de tu categoría.
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

        {me && myTournaments.length > 0 && (
          <>
            {myTournaments.map((t: any) => {
              const status = t.status || 'Activo'
              return (
                <Card key={t.id}>
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
                  </View>
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
  statusRow: { flexDirection: 'row', alignItems: 'center' },
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

export default MyTournamentsScreen