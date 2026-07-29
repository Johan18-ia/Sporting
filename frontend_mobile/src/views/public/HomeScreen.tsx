// src/views/public/HomeScreen.tsx
// ====================================================
// PANTALLA: HOME PÚBLICO (Catálogo + Hero)
// Equivalente funcional de CatalogoView.jsx del web
// ====================================================
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Card, Button, Loading } from '../../components'
import { ProductModel } from '../../models/ProductModel'
import { ROUTES } from '../../config/routes'
import { formatPrice } from '../../utils/helpers'
import { colors, spacing, radius, fontSize, fontWeight } from '../../theme'
import type { Product } from '../../types'
import type { PublicStackParamList } from '../../navigation/types'

type Props = NativeStackScreenProps<PublicStackParamList, typeof ROUTES.HOME>

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ProductModel.getAllProducts()
      .then((r) => {
        if (r.success && r.data) setProducts(r.data)
        else setError('No se pudieron cargar los productos')
      })
      .catch(() => setError('Sin conexión con el servidor'))
      .finally(() => setLoading(false))
  }, [])

  const handleWhatsApp = (product: Product) => {
    const phone = '573000000000' // placeholder — reemplazar por número real
    const text = encodeURIComponent(`Hola, estoy interesado en: ${product.nombre}`)
    const url = `https://wa.me/${phone}?text=${text}`
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'No se pudo abrir WhatsApp'),
    )
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={{ paddingBottom: insets.bottom + spacing.lg }}
    >
      {/* HERO */}
      <View style={styles.hero}>
        <Image
          source={require('../../assets/img1.png')}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroEyebrow}>— Gestión de Escuelas de Microfútbol —</Text>
          <Text style={styles.heroTitle}>¡Forma tus campeones ahora!</Text>
          <Text style={styles.heroText}>
            Únete a Sporting y forma parte de una comunidad que inspira esfuerzo, compañerismo
            y el deseo de alcanzar una meta.
          </Text>
          <View style={styles.heroActions}>
            <Button
              title="Ver Catálogo"
              onPress={() => {
                // El catálogo está en la misma pantalla, scroll abajo
              }}
              style={{ marginRight: spacing.sm }}
            />
            <Button
              title="Iniciar Sesión"
              variant="secondary"
              onPress={() => navigation.navigate(ROUTES.LOGIN)}
            />
          </View>
        </View>
      </View>

      {/* FEATURES */}
      <View style={styles.section}>
        <Text style={styles.sectionEyebrow}>Por qué elegirnos</Text>
        <Text style={styles.sectionTitle}>¿Por Qué Unirte a Sporting?</Text>
        <Text style={styles.sectionSubtitle}>
          Una plataforma integral diseñada para simplificar el día a día de tu escuela deportiva.
        </Text>

        {[
          {
            title: 'Asignación de horarios sin complicaciones',
            description:
              'Organiza las jornadas de entrenamiento de cada categoría de forma visual y rápida.',
          },
          {
            title: 'Gestiona tus estudiantes',
            description: 'Mantén un control más cómodo de tus alumnos.',
          },
          {
            title: 'Creación de equipos y torneos',
            description:
              'Configura tus planteles por niveles o edades, y organiza ligas o campeonatos internos.',
          },
        ].map((f) => (
          <Card key={f.title} title={f.title}>
            <Text style={styles.cardText}>{f.description}</Text>
          </Card>
        ))}
      </View>

      {/* CATALOGO */}
      <View style={styles.section}>
        <Text style={styles.sectionEyebrow}>Tienda oficial</Text>
        <Text style={styles.sectionTitle}>Catálogo</Text>
        <Text style={styles.sectionSubtitle}>
          Encuentra todo lo que necesitas para tu entrenamiento.
        </Text>

        {loading && <Loading message="Cargando catálogo..." />}
        {!loading && error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        {!loading && !error && products.length === 0 && (
          <Text style={styles.mutedText}>No hay productos disponibles en este momento.</Text>
        )}

        {!loading &&
          products.map((p) => (
            <Card key={p.id}>
              <View style={styles.productRow}>
                {p.imagen ? (
                  <Image source={{ uri: p.imagen }} style={styles.productImage} />
                ) : (
                  <View style={[styles.productImage, styles.productPlaceholder]}>
                    <Text style={styles.placeholderText}>{p.nombre}</Text>
                  </View>
                )}
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{p.nombre}</Text>
                  <Text style={styles.productDesc} numberOfLines={2}>
                    {p.descripcion || 'Sin descripción'}
                  </Text>
                  <View style={styles.productFooter}>
                    <Text style={styles.productPrice}>{formatPrice(p.precio)}</Text>
                    <TouchableOpacity
                      style={styles.waButton}
                      onPress={() => handleWhatsApp(p)}
                      accessibilityRole="button"
                      accessibilityLabel={`Pedir ${p.nombre} por WhatsApp`}
                    >
                      <Text style={styles.waButtonText}>WhatsApp</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Card>
          ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  hero: {
    height: 320,
    backgroundColor: colors.dark,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
  },
  heroOverlay: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  heroEyebrow: {
    color: colors.white,
    fontSize: fontSize.xs,
    marginBottom: spacing.sm,
    opacity: 0.9,
  },
  heroTitle: {
    color: colors.white,
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.sm,
  },
  heroText: {
    color: colors.white,
    fontSize: fontSize.md,
    marginBottom: spacing.lg,
    opacity: 0.9,
  },
  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  section: {
    padding: spacing.lg,
  },
  sectionEyebrow: {
    color: colors.red,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  cardText: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 22,
  },
  errorText: {
    color: colors.danger,
    fontSize: fontSize.md,
    textAlign: 'center',
    padding: spacing.lg,
  },
  mutedText: {
    color: colors.textMuted,
    textAlign: 'center',
    padding: spacing.lg,
  },
  productRow: {
    flexDirection: 'row',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    backgroundColor: colors.lightGray,
    marginRight: spacing.md,
  },
  productPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    padding: spacing.xs,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  productDesc: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.red,
  },
  waButton: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  waButtonText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
})

export default HomeScreen
