// src/presentation/views/products/ProductsScreen.tsx
import React, { useState, useEffect } from 'react';
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
    ScrollView
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

export const ProductsScreen = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria: '',
        imagen: ''
    });

const loadProducts = async () => {
    try {
        const response = await ApiDelivery.get('/products');
        setProducts(response.data?.data || []);
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
        Alert.alert(
            'Eliminar Producto',
            `¿Estás seguro de eliminar "${nombre}"?`,
            [
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
            ]
        );
    };

    const resetForm = () => {
        setFormData({ nombre: '', descripcion: '', precio: '', stock: '', categoria: '', imagen: '' });
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

    const filteredProducts = products.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.categoria && p.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const renderProductItem = ({ item }: { item: Product }) => (
        <View style={styles.productCard}>
            <View style={styles.productImage}>
                {item.imagen ? (
                    <Text>📷</Text>
                ) : (
                    <Ionicons name="cube-outline" size={32} color="#ccc" />
                )}
            </View>
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.nombre}</Text>
                {item.descripcion && (
                    <Text style={styles.productDescription} numberOfLines={1}>
                        {item.descripcion}
                    </Text>
                )}
                <View style={styles.productMeta}>
                    <Text style={styles.productPrice}>${item.precio.toLocaleString('es-CO')}</Text>
                    {item.categoria && (
                        <View style={styles.categoryTag}>
                            <Text style={styles.categoryTagText}>{item.categoria}</Text>
                        </View>
                    )}
                    <View style={[styles.stockTag, { backgroundColor: item.stock > 0 ? '#d4edda' : '#f8d7da' }]}>
                        <Text style={[styles.stockTagText, { color: item.stock > 0 ? '#155724' : '#721c24' }]}>
                            Stock: {item.stock || 0}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.productActions}>
                <TouchableOpacity onPress={() => startEdit(item)} style={styles.actionButton}>
                    <Ionicons name="create-outline" size={20} color="#f59e0b" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id, item.nombre)} style={styles.actionButton}>
                    <Ionicons name="trash-outline" size={20} color="#dc3545" />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={MyColors.primary} />
                <Text style={styles.loadingText}>Cargando productos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Productos ({products.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        resetForm();
                        setModalVisible(true);
                    }}
                >
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar productos..."
                        placeholderTextColor="#999"
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                    {searchTerm.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchTerm('')}>
                            <Ionicons name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <Text style={styles.countText}>{filteredProducts.length} producto(s)</Text>

            <FlatList
                data={filteredProducts}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[MyColors.primary]} />
                }
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="bag-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>No hay productos registrados</Text>
                    </View>
                }
            />

            {/* Modal para crear/editar */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={resetForm}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                            </Text>
                            <TouchableOpacity onPress={resetForm}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView>
                            <View style={styles.modalBody}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Nombre *</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nombre del producto"
                                        value={formData.nombre}
                                        onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Descripción</Text>
                                    <TextInput
                                        style={[styles.input, styles.textArea]}
                                        placeholder="Descripción del producto"
                                        value={formData.descripcion}
                                        onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
                                        multiline
                                        numberOfLines={3}
                                    />
                                </View>

                                <View style={styles.row}>
                                    <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                        <Text style={styles.label}>Precio *</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="0.00"
                                            value={formData.precio}
                                            onChangeText={(text) => setFormData({ ...formData, precio: text })}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                    <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                        <Text style={styles.label}>Stock</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="0"
                                            value={formData.stock}
                                            onChangeText={(text) => setFormData({ ...formData, stock: text })}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Categoría</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Ej: Calzado, Uniformes..."
                                        value={formData.categoria}
                                        onChangeText={(text) => setFormData({ ...formData, categoria: text })}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>URL de Imagen</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                        value={formData.imagen}
                                        onChangeText={(text) => setFormData({ ...formData, imagen: text })}
                                    />
                                </View>

                                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                    <Text style={styles.submitButtonText}>
                                        {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
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
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    addButton: {
        backgroundColor: MyColors.primary,
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchContainer: {
        padding: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 15,
        color: '#333',
    },
    countText: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        fontSize: 13,
        color: '#666',
        backgroundColor: '#f5f5f5',
    },
    listContent: {
        padding: 12,
    },
    productCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    productDescription: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    productMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: 4,
        gap: 6,
    },
    productPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#28a745',
    },
    categoryTag: {
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    categoryTagText: {
        fontSize: 11,
        color: '#0d47a1',
        fontWeight: '500',
    },
    stockTag: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    stockTagText: {
        fontSize: 11,
        fontWeight: '500',
    },
    productActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        padding: 6,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
        paddingBottom: 30,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    modalBody: {
        padding: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 15,
        backgroundColor: '#f8f9fa',
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    submitButton: {
        backgroundColor: MyColors.primary,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});