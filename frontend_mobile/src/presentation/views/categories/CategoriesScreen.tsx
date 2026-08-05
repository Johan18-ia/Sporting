// src/presentation/views/categories/CategoriesScreen.tsx
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
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MyColors } from '../../theme/AppTheme';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';

interface Category {
    id: number;
    category_year: string;
    description: string;
    created_at?: string;
}

export const CategoriesScreen = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ category_year: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

const loadCategories = async () => {
    try {
        const response = await ApiDelivery.get('/categories');
        setCategories(response.data?.data || []);
    } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar las categorías');
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
};

    useEffect(() => {
        loadCategories();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadCategories();
    };

    const handleSubmit = async () => {
        if (!formData.category_year.trim()) {
            Alert.alert('Error', 'El año de la categoría es requerido');
            return;
        }

        try {
            if (isEditing && editingId) {
                await ApiDelivery.put('/categories', { 
                    id: editingId, 
                    category_year: formData.category_year,
                    description: formData.description 
                });
            } else {
                await ApiDelivery.post('/categories/create', formData);
            }
            resetForm();
            loadCategories();
            Alert.alert('Éxito', isEditing ? 'Categoría actualizada' : 'Categoría creada');
        } catch (error) {
            Alert.alert('Error', 'No se pudo guardar la categoría');
        }
    };

    const handleDelete = (id: number, name: string) => {
        Alert.alert(
            'Eliminar Categoría',
            `¿Estás seguro de eliminar "${name}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await ApiDelivery.delete(`/categories/delete/${id}`);
                            loadCategories();
                            Alert.alert('Éxito', 'Categoría eliminada');
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar la categoría');
                        }
                    }
                }
            ]
        );
    };

    const resetForm = () => {
        setFormData({ category_year: '', description: '' });
        setIsEditing(false);
        setEditingId(null);
        setShowForm(false);
    };

    const startEdit = (category: Category) => {
        setFormData({ category_year: category.category_year, description: category.description || '' });
        setIsEditing(true);
        setEditingId(category.id);
        setShowForm(true);
    };

    const renderCategoryItem = ({ item }: { item: Category }) => (
        <View style={styles.categoryCard}>
            <View style={styles.categoryInfo}>
                <Text style={styles.categoryYear}>{item.category_year}</Text>
                {item.description && (
                    <Text style={styles.categoryDescription}>{item.description}</Text>
                )}
            </View>
            <View style={styles.categoryActions}>
                <TouchableOpacity onPress={() => startEdit(item)} style={styles.actionButton}>
                    <Ionicons name="create-outline" size={20} color="#f59e0b" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id, item.category_year)} style={styles.actionButton}>
                    <Ionicons name="trash-outline" size={20} color="#dc3545" />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={MyColors.primary} />
                <Text style={styles.loadingText}>Cargando categorías...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Categorías ({categories.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        resetForm();
                        setShowForm(!showForm);
                    }}
                >
                    <Ionicons name={showForm ? 'close' : 'add'} size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {showForm && (
                <View style={styles.formContainer}>
                    <View style={styles.formRow}>
                        <TextInput
                            style={[styles.formInput, { flex: 1, marginRight: 8 }]}
                            placeholder="Año (ej: 2014)"
                            placeholderTextColor="#999"
                            value={formData.category_year}
                            onChangeText={(text) => setFormData({ ...formData, category_year: text })}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={[styles.formInput, { flex: 1.5 }]}
                            placeholder="Descripción"
                            placeholderTextColor="#999"
                            value={formData.description}
                            onChangeText={(text) => setFormData({ ...formData, description: text })}
                        />
                    </View>
                    <TouchableOpacity style={styles.formSubmit} onPress={handleSubmit}>
                        <Text style={styles.formSubmitText}>
                            {isEditing ? 'Actualizar' : 'Crear'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[MyColors.primary]} />
                }
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="pricetag-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>No hay categorías registradas</Text>
                    </View>
                }
            />
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
    formContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    formRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    formInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
        backgroundColor: '#f8f9fa',
    },
    formSubmit: {
        backgroundColor: MyColors.primary,
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
    },
    formSubmitText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    listContent: {
        padding: 12,
    },
    categoryCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    categoryInfo: {
        flex: 1,
    },
    categoryYear: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    categoryDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    categoryActions: {
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
});