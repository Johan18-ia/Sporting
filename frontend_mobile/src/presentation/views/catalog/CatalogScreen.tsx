// src/presentation/views/catalog/CatalogScreen.tsx
// ====================================================
// PANTALLA DE CATALOGO — accesible sin sesion iniciada.
// Misma logica de datos que tenia el HomeScreen antes
// (fetch a /products), solo que ahora vive en su propia
// pantalla, reachable desde la barra de navegacion inferior.
// ====================================================
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { MyColors } from '../../theme/AppTheme';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';
import { styles } from './styles';

interface Product {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen?: string;
}

export const CatalogScreen = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadProducts = async () => {
        setError(null);
        try {
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

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[MyColors.primary]} />
            }
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Catálogo</Text>
                <Text style={styles.headerSubtitle}>Encuentra todo lo que necesitas para tu entrenamiento</Text>
            </View>

            <View style={styles.grid}>
                {loading && <ActivityIndicator size="large" color={MyColors.primary} style={{ marginTop: 30 }} />}
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
                            <Text style={styles.productDescription} numberOfLines={2}>
                                {product.descripcion || 'Sin descripción'}
                            </Text>
                            <View style={styles.productFooter}>
                                <Text style={styles.productPrice}>${product.precio}</Text>
                                <TouchableOpacity style={styles.productBtn}>
                                    <Text style={styles.productBtnText}>WhatsApp</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};