// Encargado: Categorías
// Descripción: Gestión de categorías (año de nacimiento) y selección para estudiantes
// Archivo: src/presentation/views/categories/CategoriesScreen.tsx
// ============================================
// src/presentation/views/categories/CategoriesScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    Alert,
    Modal
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

// ============================================
// Rango de años disponibles para elegir al crear una
// categoría (años de nacimiento de los estudiantes).
// Ajusta CURRENT_YEAR o el rango si tu escuela maneja
// otras edades.
// ============================================
const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 2005;
const YEAR_OPTIONS = Array.from(
    { length: CURRENT_YEAR - MIN_YEAR + 1 },
    (_, i) => String(MIN_YEAR + i)
);

export const CategoriesScreen = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ category_year: '', description: '' });
    const [showCustomYearInput, setShowCustomYearInput] = useState(false);
    const [customYear, setCustomYear] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const loadCategories = async () => {
        try {
            const response = await ApiDelivery.get('/categories');
            // El backend envuelve la respuesta como { success, message, data }.
            // Antes se asumia que response.data YA era el array.
            const categoriesData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setCategories(categoriesData);
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

    // Años ya usados por otra categoría (para no dejar crear duplicados).
    // Si se esta editando, el año actual de esa categoría sigue disponible.
    const usedYears = categories
        .filter((c) => !(isEditing && c.id === editingId))
        .map((c) => c.category_year);

    const handleSubmit = async () => {
        if (!formData.category_year) {
            Alert.alert('Error', 'Selecciona el año de la categoría');
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
        setCustomYear('');
        setShowCustomYearInput(false);
        setIsEditing(false);
        setEditingId(null);
        setShowForm(false);
    };

    const selectCustomYear = () => {
        const normalizedYear = customYear.trim();
        if (!/^\d{4}$/.test(normalizedYear)) {
            Alert.alert('Error', 'Escribe un año válido de cuatro dígitos');
            return;
        }

        if (usedYears.includes(normalizedYear)) {
            Alert.alert('Error', 'Ese año ya está registrado');
            return;
        }

        setFormData({ ...formData, category_year: normalizedYear });
        setCustomYear('');
        setShowCustomYearInput(false);
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
                    <Text style={styles.formLabel}>Año de nacimiento</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.yearScroll}>
                        <View style={styles.yearContainer}>
                            <TouchableOpacity
                                style={styles.addYearChip}
                                onPress={() => setShowCustomYearInput(true)}
                                accessibilityLabel="Agregar otro año"
                            >
                                <Ionicons name="add" size={20} color={MyColors.primary} />
                            </TouchableOpacity>
                            {YEAR_OPTIONS.map((year) => {
                                const disabled = usedYears.includes(year);
                                const selected = formData.category_year === year;
                                return (
                                    <TouchableOpacity
                                        key={year}
                                        style={[
                                            styles.yearChip,
                                            selected && styles.yearChipSelected,
                                            disabled && !selected && styles.yearChipDisabled
                                        ]}
                                        disabled={disabled}
                                        onPress={() => setFormData({ ...formData, category_year: year })}
                                    >
                                        <Text style={[
                                            styles.yearChipText,
                                            selected && styles.yearChipTextSelected,
                                            disabled && !selected && styles.yearChipTextDisabled
                                        ]}>
                                            {year}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </ScrollView>

                    <Modal
                        visible={showCustomYearInput}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setShowCustomYearInput(false)}
                    >
                        <View style={styles.customYearOverlay}>
                            <View style={styles.customYearModal}>
                                <Text style={styles.customYearTitle}>Agregar otro año</Text>
                                <TextInput
                                    style={styles.formInput}
                                    placeholder="Ej: 2004"
                                    placeholderTextColor="#999"
                                    keyboardType="number-pad"
                                    maxLength={4}
                                    value={customYear}
                                    onChangeText={setCustomYear}
                                    autoFocus
                                />
                                <View style={styles.customYearActions}>
                                    <TouchableOpacity
                                        style={styles.customYearCancel}
                                        onPress={() => setShowCustomYearInput(false)}
                                    >
                                        <Text style={styles.customYearCancelText}>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.formSubmit} onPress={selectCustomYear}>
                                        <Text style={styles.formSubmitText}>Agregar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    <Text style={styles.formLabel}>Descripción</Text>
                    <TextInput
                        style={styles.formInput}
                        placeholder="Ej: Categoría Benjamín"
                        placeholderTextColor="#999"
                        value={formData.description}
                        onChangeText={(text) => setFormData({ ...formData, description: text })}
                    />

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
    formLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    yearScroll: {
        marginBottom: 14,
    },
    yearContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    yearChip: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f8f9fa',
        marginRight: 8,
    },
    yearChipSelected: {
        backgroundColor: MyColors.primary,
        borderColor: MyColors.primary,
    },
    yearChipDisabled: {
        opacity: 0.4,
    },
    yearChipText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    yearChipTextSelected: {
        color: '#fff',
        fontWeight: '700',
    },
    yearChipTextDisabled: {
        color: '#999',
    },
    addYearChip: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: MyColors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    customYearOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        padding: 20,
    },
    customYearModal: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '90%',
        maxWidth: 360,
    },
    customYearTitle: {
        color: '#333',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    customYearActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 10,
    },
    customYearCancel: {
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    customYearCancelText: {
        color: '#666',
        fontWeight: '600',
    },
    formInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
        backgroundColor: '#f8f9fa',
        marginBottom: 14,
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