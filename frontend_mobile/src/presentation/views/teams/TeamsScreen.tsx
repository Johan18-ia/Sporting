// src/presentation/views/teams/TeamsScreen.tsx
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

interface Team {
    id: number;
    name: string;
    description: string;
    studentIds: number[];
    students?: any[];
    created_at?: string;
}

interface Student {
    id: number;
    name: string;
    lastname: string;
    document: string;
}

const MIN_MEMBERS = 4;

export const TeamsScreen = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingTeam, setEditingTeam] = useState<Team | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        studentIds: [] as number[]
    });

    const loadData = async () => {
        try {
            const [teamsRes, studentsRes] = await Promise.all([
                ApiDelivery.get('/teams'),
                ApiDelivery.get('/students')
            ]);

            setTeams(teamsRes.data?.data || []);
            setStudents(studentsRes.data?.data || []);
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

    const toggleStudent = (studentId: number) => {
        setFormData(prev => {
            const isSelected = prev.studentIds.includes(studentId);
            return {
                ...prev,
                studentIds: isSelected
                    ? prev.studentIds.filter(id => id !== studentId)
                    : [...prev.studentIds, studentId]
            };
        });
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            Alert.alert('Error', 'El nombre del equipo es requerido');
            return;
        }

        if (formData.studentIds.length < MIN_MEMBERS) {
            Alert.alert('Error', `Selecciona al menos ${MIN_MEMBERS} estudiantes`);
            return;
        }

        try {
            const payload = {
                name: formData.name,
                description: formData.description || '',
                studentIds: formData.studentIds
            };

            if (editingTeam) {
                await ApiDelivery.put('/teams', { ...payload, id: editingTeam.id });
            } else {
                await ApiDelivery.post('/teams/create', payload);
            }
            resetForm();
            loadData();
            Alert.alert('Éxito', editingTeam ? 'Equipo actualizado' : 'Equipo creado');
        } catch (error) {
            Alert.alert('Error', 'No se pudo guardar el equipo');
        }
    };

    const handleDelete = (id: number, name: string) => {
        Alert.alert(
            'Eliminar Equipo',
            `¿Estás seguro de eliminar "${name}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await ApiDelivery.delete(`/teams/${id}`);
                            loadData();
                            Alert.alert('Éxito', 'Equipo eliminado');
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar el equipo');
                        }
                    }
                }
            ]
        );
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', studentIds: [] });
        setEditingTeam(null);
        setModalVisible(false);
    };

    const startEdit = (team: Team) => {
        setFormData({
            name: team.name,
            description: team.description || '',
            studentIds: team.studentIds || []
        });
        setEditingTeam(team);
        setModalVisible(true);
    };

    const filteredStudents = students.filter(s => {
        const term = searchTerm.toLowerCase();
        return (
            s.name.toLowerCase().includes(term) ||
            s.lastname.toLowerCase().includes(term) ||
            s.document.includes(term)
        );
    });

    const renderTeamItem = ({ item }: { item: Team }) => {
        const teamStudents: Student[] = item.studentIds?.map(id => 
            students.find(s => s.id === id)
        ).filter((s): s is Student => Boolean(s)) || [];

        return (
            <View style={styles.teamCard}>
                <View style={styles.teamHeader}>
                    <View style={styles.teamTitle}>
                        <Text style={styles.teamName}>{item.name}</Text>
                        <View style={styles.memberCount}>
                            <Ionicons name="people" size={16} color="#666" />
                            <Text style={styles.memberCountText}>
                                {teamStudents.length} integrantes
                            </Text>
                        </View>
                    </View>
                    <View style={styles.teamActions}>
                        <TouchableOpacity onPress={() => startEdit(item)} style={styles.actionButton}>
                            <Ionicons name="create-outline" size={20} color="#f59e0b" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(item.id, item.name)} style={styles.actionButton}>
                            <Ionicons name="trash-outline" size={20} color="#dc3545" />
                        </TouchableOpacity>
                    </View>
                </View>

                {item.description && (
                    <Text style={styles.teamDescription}>{item.description}</Text>
                )}

                {teamStudents.length > 0 && (
                    <View style={styles.membersList}>
                        <Text style={styles.membersTitle}>Integrantes:</Text>
                        <View style={styles.membersChips}>
                            {teamStudents.map((student, index) => (
                                <View key={index} style={styles.memberChip}>
                                    <Text style={styles.memberChipText}>
                                        {student.name} {student.lastname}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={MyColors.primary} />
                <Text style={styles.loadingText}>Cargando equipos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Equipos ({teams.length})</Text>
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
                data={teams}
                renderItem={renderTeamItem}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[MyColors.primary]} />
                }
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="people-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>No hay equipos registrados</Text>
                        <Text style={styles.emptySubtext}>
                            Crea un equipo seleccionando al menos {MIN_MEMBERS} estudiantes
                        </Text>
                    </View>
                }
            />

            {/* Modal para crear/editar equipo */}
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
                                {editingTeam ? 'Editar Equipo' : 'Nuevo Equipo'}
                            </Text>
                            <TouchableOpacity onPress={resetForm}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView>
                            <View style={styles.modalBody}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Nombre del Equipo *</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Ej: Los Halcones"
                                        value={formData.name}
                                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Descripción</Text>
                                    <TextInput
                                        style={[styles.input, styles.textArea]}
                                        placeholder="Descripción del equipo"
                                        value={formData.description}
                                        onChangeText={(text) => setFormData({ ...formData, description: text })}
                                        multiline
                                        numberOfLines={2}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>
                                        Seleccionar Estudiantes ({formData.studentIds.length} seleccionados - mínimo {MIN_MEMBERS})
                                    </Text>
                                    <TextInput
                                        style={styles.searchInput}
                                        placeholder="Buscar estudiante..."
                                        value={searchTerm}
                                        onChangeText={setSearchTerm}
                                    />
                                    <ScrollView style={styles.studentList}>
                                        {filteredStudents.map((student) => {
                                            const isSelected = formData.studentIds.includes(student.id);
                                            return (
                                                <TouchableOpacity
                                                    key={student.id}
                                                    style={[
                                                        styles.studentOption,
                                                        isSelected && styles.studentOptionSelected
                                                    ]}
                                                    onPress={() => toggleStudent(student.id)}
                                                >
                                                    <View style={styles.studentCheck}>
                                                        <View style={[
                                                            styles.checkbox,
                                                            isSelected && styles.checkboxChecked
                                                        ]}>
                                                            {isSelected && (
                                                                <Ionicons name="checkmark" size={16} color="#fff" />
                                                            )}
                                                        </View>
                                                        <View>
                                                            <Text style={[
                                                                styles.studentOptionText,
                                                                isSelected && styles.studentOptionTextSelected
                                                            ]}>
                                                                {student.name} {student.lastname}
                                                            </Text>
                                                            <Text style={styles.studentDocument}>
                                                                {student.document}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        })}
                                        {filteredStudents.length === 0 && (
                                            <Text style={styles.noStudentsText}>
                                                {searchTerm ? 'No se encontraron estudiantes' : 'No hay estudiantes registrados'}
                                            </Text>
                                        )}
                                    </ScrollView>
                                    <Text style={styles.selectionInfo}>
                                        Seleccionados: {formData.studentIds.length} estudiante(s)
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.submitButton,
                                        formData.studentIds.length < MIN_MEMBERS && styles.submitButtonDisabled
                                    ]}
                                    onPress={handleSubmit}
                                    disabled={formData.studentIds.length < MIN_MEMBERS}
                                >
                                    <Text style={styles.submitButtonText}>
                                        {editingTeam ? 'Actualizar Equipo' : 'Crear Equipo'}
                                    </Text>
                                </TouchableOpacity>
                                {formData.studentIds.length < MIN_MEMBERS && (
                                    <Text style={styles.warningText}>
                                        ⚠️ Selecciona al menos {MIN_MEMBERS} estudiantes
                                    </Text>
                                )}
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
    listContent: {
        padding: 12,
    },
    teamCard: {
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
    teamHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    teamTitle: {
        flex: 1,
    },
    teamName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    memberCount: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    memberCountText: {
        fontSize: 12,
        color: '#666',
    },
    teamActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        padding: 4,
    },
    teamDescription: {
        fontSize: 13,
        color: '#666',
        marginBottom: 10,
    },
    membersList: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    },
    membersTitle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
        fontWeight: '500',
    },
    membersChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    memberChip: {
        backgroundColor: '#e8f5e9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    memberChipText: {
        fontSize: 12,
        color: '#2e7d32',
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
    emptySubtext: {
        fontSize: 13,
        color: '#ccc',
        marginTop: 4,
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
        minHeight: 60,
        textAlignVertical: 'top',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
        fontSize: 14,
        backgroundColor: '#f8f9fa',
        marginBottom: 8,
    },
    studentList: {
        maxHeight: 200,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
    },
    studentOption: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    studentOptionSelected: {
        backgroundColor: MyColors.primary + '15',
    },
    studentCheck: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: MyColors.primary,
        borderColor: MyColors.primary,
    },
    studentOptionText: {
        fontSize: 14,
        color: '#333',
    },
    studentOptionTextSelected: {
        color: MyColors.primary,
        fontWeight: '600',
    },
    studentDocument: {
        fontSize: 12,
        color: '#999',
    },
    noStudentsText: {
        textAlign: 'center',
        color: '#999',
        paddingVertical: 20,
        fontSize: 14,
    },
    selectionInfo: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
        textAlign: 'right',
    },
    submitButton: {
        backgroundColor: MyColors.primary,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    warningText: {
        color: '#dc3545',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 8,
    },
});