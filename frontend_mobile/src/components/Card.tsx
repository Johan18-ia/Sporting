// src/components/Card.tsx
// ====================================================
// Card — Equivalente a <Card /> del web con sombra ligera
// ====================================================
import React from 'react'
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native'
import { colors, radius, spacing, fontSize, fontWeight } from '../theme'

interface Props {
  title?: string
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}

export const Card: React.FC<Props> = ({ title, children, style }) => (
  <View style={[styles.card, style]}>
    {title && <Text style={styles.title}>{title}</Text>}
    {children}
  </View>
)

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    // iOS
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    // Android
    elevation: 2,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
})

export default Card
