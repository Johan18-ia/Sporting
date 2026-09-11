// Encargado: Categorías
// Descripción: CRUD de categorías (año de nacimiento) — UI alineada al resto
// Archivo: src/presentation/views/categories/CategoriesScreen.tsx
// ============================================
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
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { MyColors } from '../../theme/AppTheme';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';

interface Category {
    id: number;
    category_year: string;
    description: string;
    created_at?: string;
}

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 2005;
const YEAR_OPTIONS = Array.from(
    { length: CURRENT_YEAR - MIN_YEAR + 1 },
    (_, i) => String(MIN_YEAR + i)
);

export const CategoriesScreen = () => {
    const navigation = useNavigation<any>();
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
            const categoriesData = Array.isArray(response.data)
                ? response.data
                : response.data?.data || [];
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
        Alert.alert('Eliminar Categoría', `¿Estás seguro de eliminar "${name}"?`, [
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
        ]);
    };

    const resetForm = () => {
        setFormData({ category_year: '', description: '' });
        setIsEditing(false);
        setEditingId(null);
        setShowForm(false);
    };

    const startEdit = (category: Category) => {
        setFormData({
            category_year: category.category_year,
            description: category.description || ''
        });
        setIsEditing(true);
        setEditingId(category.id);
        setShowForm(true);
    };

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
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Categorías</Text>
                    <Text style={styles.headerSub}>{categories.length} registradas</Text>
                </View>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        if (showForm) {
                            resetForm();
                        } else {
                            resetForm();
                            setShowForm(true);
                        }
                    }}
                    activeOpacity={0.8}
                >
                    <Ionicons name={showForm ? 'close' : 'add'} size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {showForm && (
                <View style={styles.formCard}>
                    <Text style={styles.formTitle}>
                        {isEditing ? 'Editar categoría' : 'Nueva categoría'}
                    </Text>

                    <Text style={styles.formLabel}>Año de nacimiento</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.yearScroll}
                    >
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
                                    onPress={() =>
                                        setFormData({ ...formData, category_year: year })
                                    }
                                    activeOpacity={0.85}
                                >
                                    <Text
                                        style={[
                                            styles.yearChipText,
                                            selected && styles.yearChipTextSelected,
                                            disabled && !selected && styles.yearChipTextDisabled
                                        ]}
                                    >
                                        {year}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    <Text style={styles.formLabel}>Descripción</Text>
                    <TextInput
                        style={styles.formInput}
                        placeholder="Ej: Categoría Benjamín"
                        placeholderTextColor="#B0A0A0"
                        value={formData.description}
                        onChangeText={(text) =>
                            setFormData({ ...formData, description: text })
                        }
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
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[MyColors.primary]}
                    />
                }
                ListHeaderComponent={
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Listado</Text>
                        <Text style={styles.sectionCount}>
                            {categories.length} categorí
                            {categories.length !== 1 ? 'as' : 'a'}
                        </Text>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyBox}>
                        <View style={styles.emptyIconCircle}>
                            <Ionicons name="pricetag-outline" size={28} color={MyColors.primary} />
                        </View>
                        <Text style={styles.emptyTitle}>Sin categorías</Text>
                        <Text style={styles.emptyText}>
                            Crea la primera con el botón +.
                        </Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.categoryCard}>
                        <View style={styles.catAvatar}>
                            <Text style={styles.catAvatarText}>
                                {String(item.category_year).slice(-2)}
                            </Text>
                        </View>
                        <View style={styles.categoryInfo}>
                            <Text style={styles.categoryYear}>{item.category_year}</Text>
                            {!!item.description && (
                                <Text style={styles.categoryDescription} numberOfLines={2}>
                                    {item.description}
                                </Text>
                            )}
                        </View>
                        <View style={styles.categoryActions}>
                            <TouchableOpacity
                                style={styles.actionBtn}
                                onPress={() => startEdit(item)}
                            >
                                <Ionicons name="create-outline" size={16} color={MyColors.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.actionBtn}
                                onPress={() => handleDelete(item.id, item.category_year)}
                            >
                                <Ionicons name="trash-outline" size={16} color="#C45C5C" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
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
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 8,
        gap: 8,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
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
    formCard: {
        marginHorizontal: 16,
        marginBottom: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(139, 0, 0, 0.06)',
        shadowColor: '#8B0000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 2,
    },
    formTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 14,
    },
    formLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B5555',
        marginBottom: 8,
    },
    yearScroll: {
        paddingBottom: 14,
        gap: 8,
    },
    yearChip: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(139, 0, 0, 0.1)',
        backgroundColor: '#FAF8F8',
        marginRight: 8,
    },
    yearChipSelected: {
        backgroundColor: MyColors.primary,
        borderColor: MyColors.primary,
    },
    yearChipDisabled: {
        opacity: 0.35,
    },
    yearChipText: {
        fontSize: 14,
        color: '#6B5555',
        fontWeight: '600',
    },
    yearChipTextSelected: {
        color: '#fff',
        fontWeight: '700',
    },
    yearChipTextDisabled: {
        color: '#999',
    },
    formInput: {
        borderWidth: 1,
        borderColor: 'rgba(139, 0, 0, 0.12)',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        backgroundColor: '#FAF8F8',
        color: '#1A1A1A',
        marginBottom: 14,
    },
    formSubmit: {
        backgroundColor: MyColors.primary,
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
        shadowColor: '#8B0000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    formSubmitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    sectionCount: {
        fontSize: 12,
        color: '#9A8585',
        fontWeight: '500',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 28,
        paddingTop: 4,
    },
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(139, 0, 0, 0.04)',
        shadowColor: '#8B0000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    catAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(139, 0, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    catAvatarText: {
        fontSize: 14,
        fontWeight: '800',
        color: MyColors.primary,
    },
    categoryInfo: {
        flex: 1,
    },
    categoryYear: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    categoryDescription: {
        fontSize: 13,
        color: '#8A7A7A',
        marginTop: 2,
    },
    categoryActions: {
        flexDirection: 'row',
        gap: 6,
    },
    actionBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
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
});