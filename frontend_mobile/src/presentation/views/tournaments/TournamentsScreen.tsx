// Encargado: Torneos
// Descripción: Gestión de torneos, inscripción de estudiantes y control de estado
// Archivo: src/presentation/views/tournaments/TournamentsScreen.tsx
// ============================================
// src/presentation/views/tournaments/TournamentsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MyColors } from '../../theme/AppTheme';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';

interface Tournament {
    id: number;
    name: string;
    category: string;
    status: string;
    students: any[];
    max_teams?: number;
    created_at?: string;
}

interface Student {
    id: number;
    name: string;
    lastname: string;
    document: string;
}

export const TournamentsScreen = () => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [enrollModalVisible, setEnrollModalVisible] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
    const [selectedStudent, setSelectedStudent] = useState('');
    
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        max_teams: ''
    });

    const loadData = async () => {
        try {
            const [tournamentsRes, studentsRes, categoriesRes] = await Promise.all([
                ApiDelivery.get('/tournaments'),
                ApiDelivery.get('/students'),
                ApiDelivery.get('/categories')
            ]);

            setTournaments(tournamentsRes.data?.data || []);
            setStudents(studentsRes.data?.data || []);
            setCategories(categoriesRes.data?.data || []);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar los datos');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
};

    useEffect(() => {
        loadData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.category) {
            Alert.alert('Error', 'Nombre y categoría son requeridos');
            return;
        }

        try {
            await ApiDelivery.post('/tournaments/create', {
                name: formData.name,
                category: formData.category,
                max_teams: parseInt(formData.max_teams) || 4
            });
            resetForm();
            loadData();
            Alert.alert('Éxito', 'Torneo creado correctamente');
        } catch (error) {
            Alert.alert('Error', 'No se pudo crear el torneo');
        }
    };

    const handleEnrollStudent = async () => {
        if (!selectedTournament || !selectedStudent) {
            Alert.alert('Error', 'Selecciona un torneo y un estudiante');
            return;
        }

        try {
            const student = students.find(s => s.id === parseInt(selectedStudent));
            await ApiDelivery.post(`/tournaments/${selectedTournament.id}/enroll`, {
                studentId: parseInt(selectedStudent),
                studentName: `${student?.name} ${student?.lastname}`,
                studentDocument: student?.document
            });
            setEnrollModalVisible(false);
            setSelectedStudent('');
            loadData();
            Alert.alert('Éxito', 'Estudiante inscrito en el torneo');
        } catch (error) {
            Alert.alert('Error', 'No se pudo inscribir al estudiante');
        }
    };

    const handleDelete = (id: number, name: string) => {
        Alert.alert(
            'Eliminar Torneo',
            `¿Estás seguro de eliminar "${name}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await ApiDelivery.delete(`/tournaments/${id}`);
                            loadData();
                            Alert.alert('Éxito', 'Torneo eliminado');
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar el torneo');
                        }
                    }
                }
            ]
        );
    };

    const resetForm = () => {
        setFormData({ name: '', category: '', max_teams: '' });
        setModalVisible(false);
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'Activo': '#28a745',
            'Inscripciones': '#f59e0b',
            'En Progreso': '#2196F3',
            'Finalizado': '#6c757d'
        };
        return colors[status] || '#6c757d';
    };

    const renderTournamentItem = ({ item }: { item: Tournament }) => (
        <View style={styles.tournamentCard}>
            <View style={styles.tournamentHeader}>
                <View style={styles.tournamentTitle}>
                    <Text style={styles.tournamentName}>{item.name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status || 'Activo') }]}>
                        <Text style={styles.statusText}>{item.status || 'Activo'}</Text>
                    </View>
                </View>
                <View style={styles.tournamentActions}>
                    <TouchableOpacity
                        style={styles.enrollButton}
                        onPress={() => {
                            setSelectedTournament(item);
                            setEnrollModalVisible(true);
                        }}
                    >
                        <Ionicons name="person-add" size={18} color="#fff" />
                        <Text style={styles.enrollButtonText}>Inscribir</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id, item.name)} style={styles.actionButton}>
                        <Ionicons name="trash-outline" size={20} color="#dc3545" />
                    </TouchableOpacity>
                </View>
            </View>
            
            <View style={styles.tournamentInfo}>
                <Text style={styles.tournamentCategory}>
                    <Ionicons name="pricetag-outline" size={14} color="#666" />
                    {' '}Categoría: {item.category || 'N/A'}
                </Text>
                <Text style={styles.tournamentStudents}>
                    <Ionicons name="people-outline" size={14} color="#666" />
                    {' '}{item.students?.length || 0} estudiantes inscritos
                </Text>
            </View>

            {item.students && item.students.length > 0 && (
                <View style={styles.studentsList}>
                    <Text style={styles.studentsTitle}>Estudiantes inscritos:</Text>
                    <View style={styles.studentsChips}>
                        {item.students.map((s, index) => (
                            <View key={index} style={styles.studentChip}>
                                <Text style={styles.studentChipText}>
                                    {s.name || `Estudiante ${index + 1}`}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={MyColors.primary} />
                <Text style={styles.loadingText}>Cargando torneos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Torneos ({tournaments.length})</Text>
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

            <FlatList
                data={tournaments}
                renderItem={renderTournamentItem}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[MyColors.primary]} />
                }
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="trophy-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>No hay torneos registrados</Text>
                    </View>
                }
            />

            {/* Modal para crear torneo */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={resetForm}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Nuevo Torneo</Text>
                            <TouchableOpacity onPress={resetForm}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView>
                            <View style={styles.modalBody}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Nombre del Torneo *</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Ej: Copa Sporting 2026"
                                        value={formData.name}
                                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Categoría *</Text>
                                    <View style={styles.categoryGrid}>
                                        {categories.map((cat) => (
                                            <TouchableOpacity
                                                key={cat.id}
                                                style={[
                                                    styles.categoryOption,
                                                    formData.category === String(cat.id) && styles.categoryOptionSelected
                                                ]}
                                                onPress={() => setFormData({ ...formData, category: String(cat.id) })}
                                            >
                                                <Text style={[
                                                    styles.categoryOptionText,
                                                    formData.category === String(cat.id) && styles.categoryOptionTextSelected
                                                ]}>
                                                    {cat.category_year}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Número de Equipos</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="4"
                                        value={formData.max_teams}
                                        onChangeText={(text) => setFormData({ ...formData, max_teams: text })}
                                        keyboardType="numeric"
                                    />
                                </View>

                                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                    <Text style={styles.submitButtonText}>Crear Torneo</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Modal para inscribir estudiante */}
            <Modal
                visible={enrollModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    setEnrollModalVisible(false);
                    setSelectedStudent('');
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                Inscribir Estudiante
                                {selectedTournament && ` - ${selectedTournament.name}`}
                            </Text>
                            <TouchableOpacity onPress={() => {
                                setEnrollModalVisible(false);
                                setSelectedStudent('');
                            }}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Seleccionar Estudiante *</Text>
                                <ScrollView style={styles.studentList}>
                                    {students.map((student) => (
                                        <TouchableOpacity
                                            key={student.id}
                                            style={[
                                                styles.studentOption,
                                                selectedStudent === String(student.id) && styles.studentOptionSelected
                                            ]}
                                            onPress={() => setSelectedStudent(String(student.id))}
                                        >
                                            <Text style={[
                                                styles.studentOptionText,
                                                selectedStudent === String(student.id) && styles.studentOptionTextSelected
                                            ]}>
                                                {student.name} {student.lastname} - {student.document}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                    {students.length === 0 && (
                                        <Text style={styles.noStudentsText}>No hay estudiantes registrados</Text>
                                    )}
                                </ScrollView>
                            </View>

                            <TouchableOpacity style={styles.submitButton} onPress={handleEnrollStudent}>
                                <Text style={styles.submitButtonText}>Inscribir Estudiante</Text>
                            </TouchableOpacity>
                        </View>
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
    listContent: {
        padding: 12,
    },
    tournamentCard: {
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
    tournamentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    tournamentTitle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
    },
    tournamentName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 11,
        color: '#fff',
        fontWeight: '600',
    },
    tournamentActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    enrollButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2196F3',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    enrollButtonText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
    },
    actionButton: {
        padding: 4,
    },
    tournamentInfo: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 10,
    },
    tournamentCategory: {
        fontSize: 13,
        color: '#666',
    },
    tournamentStudents: {
        fontSize: 13,
        color: '#666',
    },
    studentsList: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    },
    studentsTitle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
        fontWeight: '500',
    },
    studentsChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    studentChip: {
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    studentChipText: {
        fontSize: 12,
        color: '#0d47a1',
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
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryOption: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    categoryOptionSelected: {
        backgroundColor: MyColors.primary,
        borderColor: MyColors.primary,
    },
    categoryOptionText: {
        fontSize: 13,
        color: '#666',
    },
    categoryOptionTextSelected: {
        color: '#fff',
        fontWeight: '600',
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
    studentList: {
        maxHeight: 250,
    },
    studentOption: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    studentOptionSelected: {
        backgroundColor: MyColors.primary + '20',
    },
    studentOptionText: {
        fontSize: 14,
        color: '#333',
    },
    studentOptionTextSelected: {
        color: MyColors.primary,
        fontWeight: '600',
    },
    noStudentsText: {
        textAlign: 'center',
        color: '#999',
        paddingVertical: 20,
    },
});