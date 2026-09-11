// Encargado: Productos
// Descripción: Catálogo de productos — grid estilo featured + CRUD
// Archivo: src/presentation/views/products/ProductsScreen.tsx
// ============================================
import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    RefreshControl,
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    Image,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MyColors } from '../../theme/AppTheme';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';

interface Product {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    categoria: string;
    imagen?: string;
}

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_GAP = 12;
const H_PAD = 16;
const CARD_W = (SCREEN_W - H_PAD * 2 - CARD_GAP) / 2;

export const ProductsScreen = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria: '',
        imagen: ''
    });

    // ============================================
    // LOGICA DE DATOS — sin cambios funcionales
    // ============================================
    const loadProducts = async () => {
        try {
            const response = await ApiDelivery.get('/products');
            const productsData = Array.isArray(response.data)
                ? response.data
                : response.data?.data || [];
            setProducts(
                productsData.map((product: any) => ({
                    ...product,
                    precio: Number(product.precio) || 0,
                    stock: Number(product.stock) || 0
                }))
            );
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar los productos');
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

    const handleSubmit = async () => {
        if (!formData.nombre || !formData.precio) {
            Alert.alert('Error', 'Nombre y precio son requeridos');
            return;
        }

        try {
            const payload = {
                nombre: formData.nombre,
                descripcion: formData.descripcion || '',
                precio: parseFloat(formData.precio),
                stock: parseInt(formData.stock) || 0,
                categoria: formData.categoria || '',
                imagen: formData.imagen || ''
            };

            if (editingProduct) {
                await ApiDelivery.put('/products', { ...payload, id: editingProduct.id });
            } else {
                await ApiDelivery.post('/products/create', payload);
            }
            resetForm();
            loadProducts();
            Alert.alert('Éxito', editingProduct ? 'Producto actualizado' : 'Producto creado');
        } catch (error) {
            Alert.alert('Error', 'No se pudo guardar el producto');
        }
    };

    const handleDelete = (id: number, nombre: string) => {
        Alert.alert('Eliminar Producto', `¿Estás seguro de eliminar "${nombre}"?`, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await ApiDelivery.delete(`/products/delete/${id}`);
                        loadProducts();
                        Alert.alert('Éxito', 'Producto eliminado');
                    } catch (error) {
                        Alert.alert('Error', 'No se pudo eliminar el producto');
                    }
                }
            }
        ]);
    };

    const resetForm = () => {
        setFormData({
            nombre: '',
            descripcion: '',
            precio: '',
            stock: '',
            categoria: '',
            imagen: ''
        });
        setEditingProduct(null);
        setModalVisible(false);
    };

    const startEdit = (product: Product) => {
        setFormData({
            nombre: product.nombre,
            descripcion: product.descripcion || '',
            precio: String(product.precio),
            stock: String(product.stock || 0),
            categoria: product.categoria || '',
            imagen: product.imagen || ''
        });
        setEditingProduct(product);
        setModalVisible(true);
    };

    const categories = useMemo(() => {
        const set = new Set<string>();
        products.forEach((p) => {
            if (p.categoria && p.categoria.trim()) set.add(p.categoria.trim());
        });
        return Array.from(set).sort();
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchSearch =
                p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.categoria && p.categoria.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchCat = !categoryFilter || p.categoria === categoryFilter;
            return matchSearch && matchCat;
        });
    }, [products, searchTerm, categoryFilter]);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={MyColors.primary} />
                <Text style={styles.loadingText}>Cargando productos...</Text>
            </View>
        );
    }

    const renderProductCard = ({ item }: { item: Product }) => (
        <TouchableOpacity
            style={styles.productCard}
            activeOpacity={0.88}
            onPress={() => startEdit(item)}
        >
            <View style={styles.imageWrap}>
                {item.imagen ? (
                    <Image
                        source={{ uri: item.imagen }}
                        style={styles.productImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Ionicons name="cube-outline" size={36} color="rgba(139,0,0,0.35)" />
                    </View>
                )}
                {item.stock <= 0 && (
                    <View style={styles.outBadge}>
                        <Text style={styles.outBadgeText}>Sin stock</Text>
                    </View>
                )}
            </View>

            <View style={styles.cardBody}>
                {!!item.categoria && (
                    <Text style={styles.productBrand} numberOfLines={1}>
                        {item.categoria}
                    </Text>
                )}
                <Text style={styles.productName} numberOfLines={2}>
                    {item.nombre}
                </Text>
                <Text style={styles.productPrice}>
                    ${Number(item.precio).toLocaleString('es-CO')}
                </Text>
            </View>

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={styles.cardActionBtn}
                    onPress={() => startEdit(item)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                    <Ionicons name="create-outline" size={16} color={MyColors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.cardActionBtn}
                    onPress={() => handleDelete(item.id, item.nombre)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                    <Ionicons name="trash-outline" size={16} color="#C45C5C" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Productos</Text>
                    <Text style={styles.headerSub}>{products.length} en catálogo</Text>
                </View>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        resetForm();
                        setModalVisible(true);
                    }}
                    activeOpacity={0.8}
                >
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchWrap}>
                <Ionicons name="search" size={18} color="#9A8585" style={{ marginRight: 8 }} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar producto o categoría..."
                    placeholderTextColor="#B0A0A0"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
                {searchTerm.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchTerm('')}>
                        <Ionicons name="close-circle" size={18} color="#9A8585" />
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.gridRow}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[MyColors.primary]}
                    />
                }
                ListHeaderComponent={
                    <View>
                        {categories.length > 0 && (
                            <View style={styles.sectionBlock}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Por categoría</Text>
                                    {categoryFilter ? (
                                        <TouchableOpacity onPress={() => setCategoryFilter('')}>
                                            <Text style={styles.sectionLink}>Ver todas</Text>
                                        </TouchableOpacity>
                                    ) : null}
                                </View>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.catScroll}
                                >
                                    {categories.map((cat) => {
                                        const active = categoryFilter === cat;
                                        const count = products.filter((p) => p.categoria === cat)
                                            .length;
                                        return (
                                            <TouchableOpacity
                                                key={cat}
                                                style={[
                                                    styles.catCard,
                                                    active && styles.catCardActive
                                                ]}
                                                onPress={() =>
                                                    setCategoryFilter(active ? '' : cat)
                                                }
                                                activeOpacity={0.85}
                                            >
                                                <View
                                                    style={[
                                                        styles.catIcon,
                                                        active && styles.catIconActive
                                                    ]}
                                                >
                                                    <Ionicons
                                                        name="pricetag"
                                                        size={18}
                                                        color={active ? '#fff' : MyColors.primary}
                                                    />
                                                </View>
                                                <Text
                                                    style={[
                                                        styles.catName,
                                                        active && styles.catNameActive
                                                    ]}
                                                    numberOfLines={1}
                                                >
                                                    {cat}
                                                </Text>
                                                <Text
                                                    style={[
                                                        styles.catCount,
                                                        active && styles.catCountActive
                                                    ]}
                                                >
                                                    {count} producto{count !== 1 ? 's' : ''}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </ScrollView>
                            </View>
                        )}

                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Destacados</Text>
                            <Text style={styles.sectionCount}>
                                {filteredProducts.length} producto
                                {filteredProducts.length !== 1 ? 's' : ''}
                            </Text>
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyBox}>
                        <View style={styles.emptyIconCircle}>
                            <Ionicons name="bag-outline" size={28} color={MyColors.primary} />
                        </View>
                        <Text style={styles.emptyTitle}>Sin productos</Text>
                        <Text style={styles.emptyText}>
                            {searchTerm || categoryFilter
                                ? 'No hay resultados con ese filtro.'
                                : 'Aún no hay productos en el catálogo.'}
                        </Text>
                    </View>
                }
                renderItem={renderProductCard}
            />

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={resetForm}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editingProduct ? 'Editar producto' : 'Nuevo producto'}
                            </Text>
                            <TouchableOpacity onPress={resetForm}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={styles.modalBody}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Nombre *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nombre del producto"
                                    value={formData.nombre}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, nombre: text })
                                    }
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Descripción</Text>
                                <TextInput
                                    style={[styles.input, styles.inputMultiline]}
                                    placeholder="Descripción breve"
                                    multiline
                                    numberOfLines={3}
                                    value={formData.descripcion}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, descripcion: text })
                                    }
                                />
                            </View>
                            <View style={styles.row}>
                                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                    <Text style={styles.label}>Precio *</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="0"
                                        keyboardType="decimal-pad"
                                        value={formData.precio}
                                        onChangeText={(text) =>
                                            setFormData({ ...formData, precio: text })
                                        }
                                    />
                                </View>
                                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                    <Text style={styles.label}>Stock</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="0"
                                        keyboardType="number-pad"
                                        value={formData.stock}
                                        onChangeText={(text) =>
                                            setFormData({ ...formData, stock: text })
                                        }
                                    />
                                </View>
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Categoría</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej: Uniformes, Accesorios..."
                                    value={formData.categoria}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, categoria: text })
                                    }
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>URL de imagen</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="https://..."
                                    autoCapitalize="none"
                                    value={formData.imagen}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, imagen: text })
                                    }
                                />
                                {!!formData.imagen && (
                                    <Image
                                        source={{ uri: formData.imagen }}
                                        style={styles.previewImage}
                                        resizeMode="cover"
                                    />
                                )}
                            </View>
                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                <Text style={styles.submitButtonText}>
                                    {editingProduct ? 'Actualizar producto' : 'Crear producto'}
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F4F4',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F6F4F4',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 15,
        color: '#8A7A7A',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        letterSpacing: -0.3,
    },
    headerSub: {
        fontSize: 13,
        color: '#8A7A7A',
        marginTop: 2,
    },
    addButton: {
        backgroundColor: MyColors.primary,
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#8B0000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    searchWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 8,
        marginTop: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: 'rgba(139, 0, 0, 0.06)',
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#1A1A1A',
        padding: 0,
    },
    listContent: {
        paddingHorizontal: H_PAD,
        paddingBottom: 32,
    },
    gridRow: {
        justifyContent: 'space-between',
        marginBottom: CARD_GAP,
    },
    sectionBlock: {
        marginBottom: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
        letterSpacing: -0.2,
    },
    sectionLink: {
        fontSize: 13,
        fontWeight: '600',
        color: MyColors.primary,
    },
    sectionCount: {
        fontSize: 12,
        color: '#9A8585',
        fontWeight: '500',
    },
    catScroll: {
        paddingBottom: 8,
        gap: 10,
    },
    catCard: {
        width: 140,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 14,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(139, 0, 0, 0.06)',
        shadowColor: '#8B0000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    catCardActive: {
        backgroundColor: MyColors.primary,
        borderColor: MyColors.primary,
    },
    catIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(139, 0, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    catIconActive: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    catName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    catNameActive: {
        color: '#fff',
    },
    catCount: {
        fontSize: 11,
        color: '#9A8585',
    },
    catCountActive: {
        color: 'rgba(255,255,255,0.8)',
    },
    productCard: {
        width: CARD_W,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(139, 0, 0, 0.05)',
        shadowColor: '#8B0000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 2,
    },
    imageWrap: {
        width: '100%',
        height: CARD_W * 0.85,
        backgroundColor: '#F3EEEE',
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    outBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: MyColors.primary,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    outBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    cardBody: {
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: 6,
    },
    productBrand: {
        fontSize: 11,
        color: '#9A8585',
        fontWeight: '500',
        marginBottom: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    productName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
        minHeight: 36,
    },
    productPrice: {
        fontSize: 15,
        fontWeight: '800',
        color: MyColors.primary,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 8,
        paddingBottom: 10,
        gap: 4,
    },
    cardActionBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(139, 0, 0, 0.06)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyBox: {
        alignItems: 'center',
        paddingTop: 40,
        paddingHorizontal: 32,
    },
    emptyIconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(139, 0, 0, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 6,
    },
    emptyText: {
        fontSize: 13,
        color: '#8A7A7A',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        maxHeight: '90%',
        paddingBottom: 28,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#f0eaea',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    modalBody: {
        padding: 18,
    },
    inputGroup: {
        marginBottom: 14,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B5555',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: 'rgba(139, 0, 0, 0.12)',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        backgroundColor: '#FAF8F8',
        color: '#1A1A1A',
    },
    inputMultiline: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
    },
    previewImage: {
        marginTop: 10,
        width: '100%',
        height: 140,
        borderRadius: 12,
        backgroundColor: '#F3EEEE',
    },
    submitButton: {
        backgroundColor: MyColors.primary,
        borderRadius: 14,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#8B0000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});