// src/presentation/views/schedules/SchedulesScreen.tsx
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

interface Schedule {
    id: number;
    category_id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    category_name?: string;
}

interface Category {
    id: number;
    category_year: string;
    description: string;
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const SchedulesScreen = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [filterCategory, setFilterCategory] = useState('');
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
    
    const [formData, setFormData] = useState({
        category_id: '',
        day_of_week: 'Lunes',
        start_time: '08:00',
        end_time: '10:00'
    });

    const loadData = async () => {
        try {
            const [schedulesRes, categoriesRes] = await Promise.all([
                ApiDelivery.get('/schedules'),
                ApiDelivery.get('/categories')
            ]);

            const categoriesData = categoriesRes.data || [];
            setCategories(categoriesData);

            const schedulesData = schedulesRes.data || [];
            // Enriquecer con nombre de categoría
            const enriched = schedulesData.map((s: any) => ({
                ...s,
                category_name: categoriesData.find((c: any) => c.id === s.category_id)?.category_year || 'Sin categoría'
            }));
            setSchedules(enriched);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar los horarios');
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
        if (!formData.category_id || !formData.day_of_week) {
            Alert.alert('Error', 'Todos los campos son requeridos');
            return;
        }

        try {
            if (editingSchedule) {
                await ApiDelivery.put('/schedules', { 
                    id: editingSchedule.id,
                    ...formData,
                    category_id: parseInt(formData.category_id)
                });
            } else {
                await ApiDelivery.post('/schedules/create', {
                    ...formData,
                    category_id: parseInt(formData.category_id)
                });
            }
            resetForm();
            loadData();
            Alert.alert('Éxito', editingSchedule ? 'Horario actualizado' : 'Horario creado');
        } catch (error) {
            Alert.alert('Error', 'No se pudo guardar el horario');
        }
    };

    const handleDelete = (id: number) => {
        Alert.alert(
            'Eliminar Horario',
            '¿Estás seguro de eliminar este horario?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await ApiDelivery.delete(`/schedules/delete/${id}`);
                            loadData();
                            Alert.alert('Éxito', 'Horario eliminado');
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar el horario');
                        }
                    }
                }
            ]
        );
    };

    const resetForm = () => {
        setFormData({ category_id: '', day_of_week: 'Lunes', start_time: '08:00', end_time: '10:00' });
        setEditingSchedule(null);
        setModalVisible(false);
    };

    const startEdit = (schedule: Schedule) => {
        setFormData({
            category_id: String(schedule.category_id),
            day_of_week: schedule.day_of_week,
            start_time: schedule.start_time,
            end_time: schedule.end_time
        });
        setEditingSchedule(schedule);
        setModalVisible(true);
    };

    const filteredSchedules = filterCategory
        ? schedules.filter(s => s.category_id === parseInt(filterCategory))
        : schedules;

    const getDayColor = (day: string) => {
        const colors: Record<string, string> = {
            'Lunes': '#2196F3',
            'Martes': '#4CAF50',
            'Miércoles': '#FF9800',
            'Jueves': '#9C27B0',
            'Viernes': '#00BCD4',
            'Sábado': '#8B0000',
            'Domingo': '#dc3545'
        };
        return colors[day] || '#666';
    };

    const renderScheduleItem = ({ item }: { item: Schedule }) => (
        <View style={styles.scheduleCard}>
            <View style={[styles.dayIndicator, { backgroundColor: getDayColor(item.day_of_week) }]}>
                <Text style={styles.dayIndicatorText}>{item.day_of_week.substring(0, 3)}</Text>
            </View>
            <View style={styles.scheduleInfo}>
                <Text style={styles.categoryName}>{item.category_name}</Text>
                <Text style={styles.scheduleTime}>
                    <Ionicons name="time-outline" size={14} color="#666" />
                    {' '}{item.start_time} - {item.end_time}
                </Text>
            </View>
            <View style={styles.scheduleActions}>
                <TouchableOpacity onPress={() => startEdit(item)} style={styles.actionButton}>
                    <Ionicons name="create-outline" size={20} color="#f59e0b" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
                    <Ionicons name="trash-outline" size={20} color="#dc3545" />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={MyColors.primary} />
                <Text style={styles.loadingText}>Cargando horarios...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Horarios de Entrenamiento</Text>
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

            {/* Filter */}
            <View style={styles.filterContainer}>
                <Text style={styles.filterLabel}>Filtrar por categoría:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptions}>
                    <TouchableOpacity
                        style={[styles.filterChip, !filterCategory && styles.filterChipActive]}
                        onPress={() => setFilterCategory('')}
                    >
                        <Text style={[styles.filterChipText, !filterCategory && styles.filterChipTextActive]}>
                            Todos
                        </Text>
                    </TouchableOpacity>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[styles.filterChip, filterCategory === String(cat.id) && styles.filterChipActive]}
                            onPress={() => setFilterCategory(String(cat.id))}
                        >
                            <Text style={[styles.filterChipText, filterCategory === String(cat.id) && styles.filterChipTextActive]}>
                                {cat.category_year}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <Text style={styles.countText}>{filteredSchedules.length} horario(s)</Text>

            <FlatList
                data={filteredSchedules}
                renderItem={renderScheduleItem}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[MyColors.primary]} />
                }
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="calendar-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>No hay horarios registrados</Text>
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
                                {editingSchedule ? 'Editar Horario' : 'Nuevo Horario'}
                            </Text>
                            <TouchableOpacity onPress={resetForm}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView>
                            <View style={styles.modalBody}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Categoría *</Text>
                                    <View style={styles.categoryGrid}>
                                        {categories.map((cat) => (
                                            <TouchableOpacity
                                                key={cat.id}
                                                style={[
                                                    styles.categoryOption,
                                                    formData.category_id === String(cat.id) && styles.categoryOptionSelected
                                                ]}
                                                onPress={() => setFormData({ ...formData, category_id: String(cat.id) })}
                                            >
                                                <Text style={[
                                                    styles.categoryOptionText,
                                                    formData.category_id === String(cat.id) && styles.categoryOptionTextSelected
                                                ]}>
                                                    {cat.category_year}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Día de la Semana *</Text>
                                    <View style={styles.dayGrid}>
                                        {DAYS.map((day) => (
                                            <TouchableOpacity
                                                key={day}
                                                style={[
                                                    styles.dayOption,
                                                    formData.day_of_week === day && styles.dayOptionSelected,
                                                    { backgroundColor: formData.day_of_week === day ? getDayColor(day) : '#f0f0f0' }
                                                ]}
                                                onPress={() => setFormData({ ...formData, day_of_week: day })}
                                            >
                                                <Text style={[
                                                    styles.dayOptionText,
                                                    formData.day_of_week === day && styles.dayOptionTextSelected
                                                ]}>
                                                    {day.substring(0, 3)}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                <View style={styles.row}>
                                    <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                        <Text style={styles.label}>Hora Inicio *</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="08:00"
                                            value={formData.start_time}
                                            onChangeText={(text) => setFormData({ ...formData, start_time: text })}
                                        />
                                    </View>
                                    <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                        <Text style={styles.label}>Hora Fin *</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="10:00"
                                            value={formData.end_time}
                                            onChangeText={(text) => setFormData({ ...formData, end_time: text })}
                                        />
                                    </View>
                                </View>

                                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                    <Text style={styles.submitButtonText}>
                                        {editingSchedule ? 'Actualizar Horario' : 'Crear Horario'}
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
    filterContainer: {
        paddingHorizontal: 12,
        paddingVertical: 10,
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
    },
    filterChip: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
        marginRight: 8,
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
    scheduleCard: {
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
    dayIndicator: {
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    dayIndicatorText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
    },
    scheduleInfo: {
        flex: 1,
    },
    categoryName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    scheduleTime: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    scheduleActions: {
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
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        marginBottom: 4,
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
    dayGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    dayOption: {
        width: 44,
        height: 44,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    dayOptionSelected: {
        borderColor: 'transparent',
    },
    dayOptionText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
    },
    dayOptionTextSelected: {
        color: '#fff',
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