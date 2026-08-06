// src/presentation/views/home/HomeScreen.tsx
// ====================================================
// PANTALLA PUBLICA DE INICIO (equivalente a CatalogoView.jsx
// en el frontend web): hero + sobre nosotros + catalogo de
// productos. Accesible SIN iniciar sesion.
// ====================================================
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/RootStackParamList';
import { MyColors } from '../../theme/AppTheme';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';
import { styles } from './styles';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Product {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen?: string;
}

export const HomeScreen = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const scrollRef = useRef<ScrollView>(null);
    const catalogY = useRef(0);

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadProducts = async () => {
        setError(null);
        try {
            // Mismo endpoint publico que ya usa la web (CatalogoView.jsx),
            // no requiere sesion iniciada.
            const response = await ApiDelivery.get('/products');
            // El backend envuelve la respuesta como { success, message, data }.
            const productsData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setProducts(productsData);
        } catch (err) {
            setError('No se pudieron cargar los productos');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadProducts();
    };

    const scrollToCatalog = () => {
        scrollRef.current?.scrollTo({ y: catalogY.current, animated: true });
    };

    return (
        <ScrollView
            ref={scrollRef}
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[MyColors.primary]} />
            }
        >
            {/* ===================== HERO ===================== */}
            <View style={styles.hero}>
                <Text style={styles.heroEyebrow}>— Escuela de Microfútbol —</Text>
                <Text style={styles.heroTitle}>Formando Campeones, Dentro y Fuera de la Cancha</Text>
                <Text style={styles.heroSubtitle}>
                    Únete a una escuela deportiva enfocada en la disciplina, el trabajo en equipo
                    y el crecimiento de cada estudiante.
                </Text>
                <View style={styles.heroActions}>
                    <TouchableOpacity style={styles.heroBtnPrimary} onPress={scrollToCatalog}>
                        <Text style={styles.heroBtnPrimaryText}>Ver Catálogo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.heroBtnSecondary}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.heroBtnSecondaryText}>Iniciar Sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* ===================== SOBRE NOSOTROS ===================== */}
            <View style={styles.about}>
                <Text style={styles.sectionEyebrow}>Quiénes somos</Text>
                <Text style={styles.sectionTitle}>Sobre Nosotros</Text>
                <Text style={styles.aboutText}>
                    Sporting Club es una escuela de microfútbol enfocada en la formación técnica,
                    física y en valores de niños y jóvenes. Contamos con categorías por año de
                    nacimiento, horarios de entrenamiento organizados y torneos internos para que
                    cada estudiante compita y crezca dentro del club.
                </Text>
                <Text style={styles.aboutText}>
                    Trabajo en equipo, disciplina y respeto son la base de cada sesión de
                    entrenamiento, dentro y fuera de la cancha.
                </Text>
            </View>

            {/* ===================== CATALOGO ===================== */}
            <View
                style={styles.catalog}
                onLayout={(event) => {
                    catalogY.current = event.nativeEvent.layout.y;
                }}
            >
                <Text style={[styles.sectionEyebrow, { textAlign: 'center' }]}>Tienda oficial</Text>
                <Text style={[styles.sectionTitle, { textAlign: 'center' }]}>Catálogo</Text>
                <Text style={styles.catalogSubtitle}>
                    Encuentra todo lo que necesitas para tu entrenamiento.
                </Text>

                {loading && <ActivityIndicator size="large" color={MyColors.primary} style={{ marginTop: 20 }} />}
                {error && <Text style={styles.errorText}>{error}</Text>}

                {!loading && !error && products.length === 0 && (
                    <Text style={styles.emptyText}>No hay productos disponibles en este momento.</Text>
                )}

                {!loading && !error && products.map((product) => (
                    <View key={product.id} style={styles.productCard}>
                        <View style={styles.productImage}>
                            {product.imagen ? (
                                <Image source={{ uri: product.imagen }} style={styles.productImageInner} />
                            ) : (
                                <Text style={styles.productImageNoImage}>{product.nombre}</Text>
                            )}
                        </View>
                        <View style={styles.productBody}>
                            <Text style={styles.productName}>{product.nombre}</Text>
                            <Text style={styles.productDescription}>{product.descripcion || 'Sin descripción'}</Text>
                            <View style={styles.productFooter}>
                                <Text style={styles.productPrice}>${product.precio}</Text>
                                <TouchableOpacity style={styles.productBtn}>
                                    <Text style={styles.productBtnText}>Pedir por WhatsApp</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};