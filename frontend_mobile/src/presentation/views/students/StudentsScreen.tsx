// Encargado: Estudiantes
// Descripción: Listado de estudiantes con filtros visuales alineados al resto de la app
// Archivo: src/presentation/views/students/StudentsScreen.tsx
// ============================================
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
    ScrollView
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
                category_name:
                    categoriesData.find((c: any) => c.id === s.category_id)?.category_year ||
                    'Sin categoría'
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
            filtered = filtered.filter(
                (s) =>
                    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    s.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    s.document.includes(searchTerm)
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter((s) => s.category_id === parseInt(selectedCategory));
        }

        setFilteredStudents(filtered);
    }, [searchTerm, selectedCategory, students]);

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const handleDelete = (id: number, name: string) => {
        Alert.alert('Eliminar Estudiante', `¿Estás seguro de eliminar a "${name}"?`, [
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
        ]);
    };

    const countByCategory = (catId: number) =>
        students.filter((s) => s.category_id === catId).length;

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
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Estudiantes</Text>
                    <Text style={styles.headerSub}>{students.length} registrados</Text>
                </View>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('StudentForm', { mode: 'create' })}
                    activeOpacity={0.8}
                >
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchWrap}>
                <Ionicons name="search" size={18} color="#9A8585" style={{ marginRight: 8 }} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar estudiantes..."
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

            <View style={styles.filterBlock}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Por categoría</Text>
                    {selectedCategory ? (
                        <TouchableOpacity onPress={() => setSelectedCategory('')}>
                            <Text style={styles.sectionLink}>Ver todas</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.catScroll}
                >
                    <TouchableOpacity
                        style={[styles.catCard, !selectedCategory && styles.catCardActive]}
                        onPress={() => setSelectedCategory('')}
                        activeOpacity={0.85}
                    >
                        <View style={[styles.catIcon, !selectedCategory && styles.catIconActive]}>
                            <Ionicons
                                name="people"
                                size={18}
                                color={!selectedCategory ? '#fff' : MyColors.primary}
                            />
                        </View>
                        <Text style={[styles.catName, !selectedCategory && styles.catNameActive]}>
                            Todos
                        </Text>
                        <Text style={[styles.catCount, !selectedCategory && styles.catCountActive]}>
                            {students.length} estudiante{students.length !== 1 ? 's' : ''}
                        </Text>
                    </TouchableOpacity>

                    {categories.map((cat) => {
                        const active = selectedCategory === String(cat.id);
                        const count = countByCategory(cat.id);
                        return (
                            <TouchableOpacity
                                key={cat.id}
                                style={[styles.catCard, active && styles.catCardActive]}
                                onPress={() => setSelectedCategory(active ? '' : String(cat.id))}
                                activeOpacity={0.85}
                            >
                                <View style={[styles.catIcon, active && styles.catIconActive]}>
                                    <Ionicons
                                        name="pricetag"
                                        size={18}
                                        color={active ? '#fff' : MyColors.primary}
                                    />
                                </View>
                                <Text
                                    style={[styles.catName, active && styles.catNameActive]}
                                    numberOfLines={1}
                                >
                                    {cat.category_year}
                                </Text>
                                <Text style={[styles.catCount, active && styles.catCountActive]}>
                                    {count} estudiante{count !== 1 ? 's' : ''}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <Text style={styles.countText}>
                {filteredStudents.length} estudiante
                {filteredStudents.length !== 1 ? 's' : ''} encontrado
                {filteredStudents.length !== 1 ? 's' : ''}
            </Text>

            <FlatList
                data={filteredStudents}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[MyColors.primary]}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyBox}>
                        <View style={styles.emptyIconCircle}>
                            <Ionicons name="school-outline" size={28} color={MyColors.primary} />
                        </View>
                        <Text style={styles.emptyTitle}>Sin estudiantes</Text>
                        <Text style={styles.emptyText}>
                            {searchTerm || selectedCategory
                                ? 'No hay resultados con ese filtro.'
                                : 'Aún no hay estudiantes registrados.'}
                        </Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.studentCard}
                        onPress={() =>
                            navigation.navigate('StudentForm', { student: item, mode: 'edit' })
                        }
                        activeOpacity={0.85}
                    >
                        <View style={styles.studentAvatar}>
                            <Text style={styles.studentAvatarText}>
                                {item.name?.charAt(0) || ''}
                                {item.lastname?.charAt(0) || ''}
                            </Text>
                        </View>
                        <View style={styles.studentInfo}>
                            <Text style={styles.studentName}>
                                {item.name} {item.lastname}
                            </Text>
                            <Text style={styles.studentDocument}>Doc: {item.document}</Text>
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryBadgeText}>{item.category_name}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDelete(item.id, item.name)}
                        >
                            <Ionicons name="trash-outline" size={18} color="#C45C5C" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F6F4F4' },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F6F4F4',
    },
    loadingText: { marginTop: 12, fontSize: 15, color: '#8A7A7A' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 4,
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
    headerSub: { fontSize: 13, color: '#8A7A7A', marginTop: 2 },
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
        marginTop: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: 'rgba(139, 0, 0, 0.06)',
    },
    searchInput: { flex: 1, fontSize: 14, color: '#1A1A1A', padding: 0 },
    filterBlock: { paddingTop: 4, marginBottom: 4 },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
    sectionLink: { fontSize: 13, fontWeight: '600', color: MyColors.primary },
    catScroll: { paddingHorizontal: 16, paddingBottom: 4 },
    catCard: {
        width: 130,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(139, 0, 0, 0.06)',
        shadowColor: '#8B0000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    catCardActive: { backgroundColor: MyColors.primary, borderColor: MyColors.primary },
    catIcon: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'rgba(139, 0, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    catIconActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
    catName: { fontSize: 13, fontWeight: '700', color: '#1A1A1A', marginBottom: 2 },
    catNameActive: { color: '#fff' },
    catCount: { fontSize: 11, color: '#9A8585' },
    catCountActive: { color: 'rgba(255,255,255,0.8)' },
    countText: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        fontSize: 12,
        color: '#9A8585',
        fontWeight: '500',
    },
    listContent: { paddingHorizontal: 16, paddingBottom: 28 },
    studentCard: {
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
    studentAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(139, 0, 0, 0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    studentAvatarText: { fontSize: 16, fontWeight: '700', color: MyColors.primary },
    studentInfo: { flex: 1 },
    studentName: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
    studentDocument: { fontSize: 12, color: '#8A7A7A', marginTop: 2 },
    categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(139, 0, 0, 0.08)',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 10,
        marginTop: 6,
    },
    categoryBadgeText: { fontSize: 11, color: MyColors.primary, fontWeight: '600' },
    deleteButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(139, 0, 0, 0.06)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyBox: { alignItems: 'center', paddingTop: 40, paddingHorizontal: 32 },
    emptyIconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(139, 0, 0, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    emptyTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 6 },
    emptyText: { fontSize: 13, color: '#8A7A7A', textAlign: 'center' },
});