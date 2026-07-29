// src/components/Modal.tsx
// ====================================================
// Modal nativo RN — Envuelve el componente Modal con header
// ====================================================
import React from 'react'
import {
  Modal as RNModal,
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { colors, radius, spacing, fontSize, fontWeight } from '../theme'

interface Props {
  visible: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export const Modal: React.FC<Props> = ({ visible, onClose, title, children }) => (
  <RNModal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
    accessibilityViewIsModal
  >
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.overlay}
    >
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Cerrar modal" />
      <View style={styles.content}>
        {title && (
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Cerrar"
              style={styles.close}
            >
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>
        )}
        <View style={styles.body}>{children}</View>
      </View>
    </KeyboardAvoidingView>
  </RNModal>
)

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  content: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    width: '90%',
    maxWidth: 480,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    flex: 1,
  },
  close: {
    paddingHorizontal: spacing.xs,
  },
  closeText: {
    fontSize: fontSize.xl,
    color: colors.textMuted,
    fontWeight: fontWeight.bold,
  },
  body: {
    padding: spacing.lg,
  },
})

export default Modal
