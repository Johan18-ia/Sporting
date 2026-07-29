// src/views/dashboard/ProductsScreen.tsx
// ====================================================
// PANTALLA: PRODUCTS (CRUD)
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
  Image,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Card, Loading, Modal, Input, Button } from '../../components'
import { useProducts } from '../../hooks/useProducts'
import { useAuth } from '../../hooks/useAuth'
import { formatPrice } from '../../utils/helpers'
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme'
import type { Product } from '../../types'

interface ProductForm {
  nombre: string
  descripcion: string
  precio: string
  imagen: string
}

const initialForm = (): ProductForm => ({
  nombre: '',
  descripcion: '',
  precio: '',
  imagen: '',
})

export const ProductsScreen: React.FC = () => {
  const insets = useSafeAreaInsets()
  const { products, loading, error, fetchProducts } = useProducts()
  const { hasAnyRole } = useAuth()

  const canCreate = hasAnyRole(['admin', 'seller'])
  // La lógica de borrado se deja como pendiente (paridad con web)

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<ProductForm>(initialForm())
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const update = (key: keyof ProductForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleCreate = async () => {
    setFormError(null)
    setSuccess(null)
    if (!form.nombre.trim() || !form.precio) {
      setFormError('Nombre y precio son obligatorios')
      return
    }
    const precioNum = parseFloat(form.precio)
    if (isNaN(precioNum) || precioNum <= 0) {
      setFormError('Ingresa un precio válido')
      return
    }
    setSubmitting(true)
    try {
      // Import dinámico para evitar ciclos
      const { default: ProductModel } = await import('../../models/ProductModel')
      const r = await ProductModel.createProduct({
        nombre: form.nombre.trim(),
        descripcion: form.descripcion,
        precio: precioNum,
        imagen: form.imagen,
      })
      setSubmitting(false)
      if (r.success) {
        setSuccess('Producto creado')
        setForm(initialForm())
        fetchProducts()
        setTimeout(() => {
          setModalOpen(false)
          setSuccess(null)
        }, 800)
      } else {
        setFormError(typeof r.error === 'string' ? r.error : 'Error al crear producto')
      }
    } catch (err: any) {
      setSubmitting(false)
      setFormError(err?.message || 'Error inesperado')
    }
  }

  if (loading && products.length === 0) {
    return <Loading fullScreen message="Cargando productos..." />
  }

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 80 }]}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchProducts}
            tintColor={colors.red}
          />
        }
      >
        <Text style={styles.title}>Productos</Text>
        <Text style={styles.subtitle}>Catálogo de productos deportivos</Text>

        {error && <Card><Text style={styles.errorText}>{error}</Text></Card>}

        {products.length === 0 && !loading && (
          <Card>
            <Text style={styles.emptyTitle}>No hay productos</Text>
            <Text style={styles.emptySubtitle}>
              {canCreate ? 'Crea el primer producto con el botón +.' : 'Aún no hay productos cargados.'}
            </Text>
          </Card>
        )}

        {products.map((p) => (
          <Card key={p.id}>
            <View style={styles.row}>
              {p.imagen ? (
                <Image source={{ uri: p.imagen }} style={styles.productImage} />
              ) : (
                <View style={[styles.productImage, styles.productImagePlaceholder]}>
                  <Text style={styles.placeholderText}>{p.nombre?.charAt(0) || '?'}</Text>
                </View>
              )}
              <View style={styles.rowMain}>
                <Text style={styles.name}>{p.nombre}</Text>
                {p.descripcion && (
                  <Text style={styles.desc} numberOfLines={2}>
                    {p.descripcion}
                  </Text>
                )}
                <Text style={styles.price}>{formatPrice(p.precio)}</Text>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>

      {canCreate && (
        <TouchableOpacity
          style={[styles.fab, { bottom: insets.bottom + spacing.lg }]}
          onPress={() => setModalOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Crear producto"
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}

      <Modal visible={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo producto">
        {formError && <Text style={styles.errorText}>{formError}</Text>}
        {success && <Text style={styles.successText}>{success}</Text>}

        <Input
          label="Nombre *"
          value={form.nombre}
          onChangeText={update('nombre')}
          placeholder="Nombre del producto"
          editable={!submitting}
        />
        <Input
          label="Descripción"
          value={form.descripcion}
          onChangeText={update('descripcion')}
          placeholder="Descripción"
          editable={!submitting}
        />
        <Input
          label="Precio *"
          type="number"
          value={form.precio}
          onChangeText={update('precio')}
          placeholder="0"
          editable={!submitting}
        />
        <Input
          label="URL de imagen"
          value={form.imagen}
          onChangeText={update('imagen')}
          placeholder="https://..."
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
  },
  productImage: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    marginRight: spacing.md,
    backgroundColor: colors.lightGray,
  },
  productImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGray,
  },
  placeholderText: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
  },
  rowMain: { flex: 1 },
  name: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  desc: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.red,
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
  modalActions: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
})

export default ProductsScreen