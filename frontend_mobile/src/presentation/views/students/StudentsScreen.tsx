// Encargado: Estudiantes - Listado
// Descripción: Lista y búsqueda de estudiantes; filtrado por categoría
// Archivo: src/presentation/views/students/StudentsScreen.tsx
// ============================================
// src/presentation/views/students/StudentsScreen.tsx
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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/RootStackParamList';
import { MyColors } from '../../theme/AppTheme';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';

type StudentsNavigationProp = StackNavigationProp<RootStackParamList, 'Students'>;

interface Student {
    id: number;
    name: string;
    lastname: string;
    document: string;
    category_id: number;
    phone?: string;
    birth_date?: string;
    category_name?: string;
}

export const StudentsScreen = () => {
    const navigation = useNavigation<StudentsNavigationProp>();
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            const [studentsRes, categoriesRes] = await Promise.all([
                ApiDelivery.get('/students'),
                ApiDelivery.get('/categories')
            ]);

            const studentsData = studentsRes.data?.data ?? studentsRes.data ?? [];
            const categoriesData = categoriesRes.data?.data ?? categoriesRes.data ?? [];

            setCategories(categoriesData);

            const enrichedStudents = studentsData.map((s: any) => ({
                ...s,
                category_name: categoriesData.find((c: any) => c.id === s.category_id)?.category_year || 'Sin categoría'
            }));

            setStudents(enrichedStudents);
            setFilteredStudents(enrichedStudents);
        } catch (error) {
            console.error('Error loading students:', error);
            Alert.alert('Error', 'No se pudieron cargar los estudiantes');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        let filtered = students;
        
        if (searchTerm.trim()) {
            filtered = filtered.filter(s =>
                s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.document.includes(searchTerm)
            );
        }
        
        if (selectedCategory) {
            filtered = filtered.filter(s => s.category_id === parseInt(selectedCategory));
        }
        
        setFilteredStudents(filtered);
    }, [searchTerm, selectedCategory, students]);

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const handleDelete = (id: number, name: string) => {
        Alert.alert(
            'Eliminar Estudiante',
            `¿Estás seguro de eliminar a "${name}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await ApiDelivery.delete(`/students/delete/${id}`);
                            loadData();
                            Alert.alert('Éxito', 'Estudiante eliminado correctamente');
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar el estudiante');
                        }
                    }
                }
            ]
        );
    };

    const renderStudentItem = ({ item }: { item: Student }) => (
        <TouchableOpacity
            style={styles.studentCard}
            onPress={() => navigation.navigate('StudentForm', { student: item, mode: 'edit' })}
            activeOpacity={0.7}
        >
            <View style={styles.studentAvatar}>
                <Text style={styles.studentAvatarText}>
                    {item.name.charAt(0)}{item.lastname.charAt(0)}
                </Text>
            </View>
            <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{item.name} {item.lastname}</Text>
                <Text style={styles.studentDocument}>Doc: {item.document}</Text>
                <View style={styles.studentMeta}>
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{item.category_name}</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id, item.name)}
            >
                <Ionicons name="trash-outline" size={20} color="#dc3545" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={MyColors.primary} />
                <Text style={styles.loadingText}>Cargando estudiantes...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar estudiantes..."
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
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('StudentForm', { mode: 'create' })}
                >
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.filterContainer}>
                <Text style={styles.filterLabel}>Filtrar por:</Text>
                <View style={styles.filterOptions}>
                    <TouchableOpacity
                        style={[styles.filterChip, !selectedCategory && styles.filterChipActive]}
                        onPress={() => setSelectedCategory('')}
                    >
                        <Text style={[styles.filterChipText, !selectedCategory && styles.filterChipTextActive]}>
                            Todos
                        </Text>
                    </TouchableOpacity>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[styles.filterChip, selectedCategory === String(cat.id) && styles.filterChipActive]}
                            onPress={() => setSelectedCategory(String(cat.id))}
                        >
                            <Text style={[styles.filterChipText, selectedCategory === String(cat.id) && styles.filterChipTextActive]}>
                                {cat.category_year}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <Text style={styles.countText}>{filteredStudents.length} estudiantes encontrados</Text>

            <FlatList
                data={filteredStudents}
                renderItem={renderStudentItem}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[MyColors.primary]} />
                }
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="school-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>No se encontraron estudiantes</Text>
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
    searchContainer: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginRight: 10,
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
    addButton: {
        backgroundColor: MyColors.primary,
        width: 44,
        height: 44,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterContainer: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    filterLabel: {
        fontSize: 13,
        color: '#666',
        marginBottom: 6,
    },
    filterOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    filterChip: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        marginRight: 6,
        marginBottom: 4,
    },
    filterChipActive: {
        backgroundColor: MyColors.primary,
    },
    filterChipText: {
        fontSize: 13,
        color: '#666',
    },
    filterChipTextActive: {
        color: '#fff',
        fontWeight: '600',
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
    studentCard: {
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
    studentAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#2196F3',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    studentAvatarText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    studentInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    studentDocument: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    studentMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    categoryBadge: {
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 12,
    },
    categoryBadgeText: {
        fontSize: 11,
        color: '#0d47a1',
        fontWeight: '500',
    },
    deleteButton: {
        padding: 8,
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