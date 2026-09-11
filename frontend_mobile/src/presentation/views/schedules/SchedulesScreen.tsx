// Encargado: Horarios
// Descripción: Gestión de horarios de entrenamiento por categoría
// Archivo: src/presentation/views/schedules/SchedulesScreen.tsx
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
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MyColors } from '../../theme/AppTheme';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';

interface Schedule {
    id: number;
    id_category: number;
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
const DAY_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

/** Devuelve el día de la semana en español según la fecha actual (0=Lunes ... 6=Domingo). */
const getTodayDayName = (): string => {
    const jsDay = new Date().getDay(); // 0=Domingo ... 6=Sábado
    const map = [6, 0, 1, 2, 3, 4, 5]; // convierte a índice de DAYS
    return DAYS[map[jsDay]];
};

export const SchedulesScreen = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [filterCategory, setFilterCategory] = useState('');
    const [selectedDay, setSelectedDay] = useState<string>(getTodayDayName());
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

    const [formData, setFormData] = useState({
        id_category: '',
        day_of_week: 'Lunes',
        start_time: '08:00',
        end_time: '10:00'
    });

    // ============================================
    // LOGICA DE DATOS — sin cambios funcionales
    // ============================================
    const loadData = async () => {
        try {
            const [schedulesRes, categoriesRes] = await Promise.all([
                ApiDelivery.get('/schedules'),
                ApiDelivery.get('/categories')
            ]);

            const categoriesData = categoriesRes.data?.data || [];
            setCategories(categoriesData);

            const schedulesData = schedulesRes.data?.data || [];
            const enriched = schedulesData.map((s: any) => ({
                ...s,
                category_name:
                    categoriesData.find((c: any) => c.id === s.id_category)?.category_year ||
                    'Sin categoría'
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
        if (!formData.id_category || !formData.day_of_week) {
            Alert.alert('Error', 'Todos los campos son requeridos');
            return;
        }

        try {
            if (editingSchedule) {
                await ApiDelivery.put('/schedules', {
                    id: editingSchedule.id,
                    ...formData,
                    id_category: parseInt(formData.id_category)
                });
            } else {
                await ApiDelivery.post('/schedules/create', {
                    ...formData,
                    id_category: parseInt(formData.id_category)
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
        setFormData({
            id_category: '',
            day_of_week: selectedDay || 'Lunes',
            start_time: '08:00',
            end_time: '10:00'
        });
        setEditingSchedule(null);
        setModalVisible(false);
    };

    const startEdit = (schedule: Schedule) => {
        setFormData({
            id_category: String(schedule.id_category),
            day_of_week: schedule.day_of_week,
            start_time: schedule.start_time,
            end_time: schedule.end_time
        });
        setEditingSchedule(schedule);
        setModalVisible(true);
    };

    // ============================================
    // FILTROS VISUALES — día + categoría
    // ============================================
    const daySchedules = useMemo(() => {
        let list = schedules.filter((s) => s.day_of_week === selectedDay);
        if (filterCategory) {
            list = list.filter((s) => s.id_category === parseInt(filterCategory));
        }
        return list.slice().sort((a, b) =>
            String(a.start_time).localeCompare(String(b.start_time))
        );
    }, [schedules, selectedDay, filterCategory]);

    const countByDay = (day: string) =>
        schedules.filter((s) => {
            if (s.day_of_week !== day) return false;
            if (filterCategory && s.id_category !== parseInt(filterCategory)) return false;
            return true;
        }).length;

    // ============================================
    // PRESENTACION — timeline estilo mock, tonos rojos
    // ============================================
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
            {/* Header suave */}
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Horarios</Text>
                    <Text style={styles.headerSub}>Entrenamientos por categoría</Text>
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

            {/* Selector de días */}
            <View style={styles.daysRow}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.daysScroll}
                >
                    {DAYS.map((day, index) => {
                        const active = selectedDay === day;
                        const count = countByDay(day);
                        return (
                            <TouchableOpacity
                                key={day}
                                style={[styles.dayPill, active && styles.dayPillActive]}
                                onPress={() => setSelectedDay(day)}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.dayPillShort, active && styles.dayPillShortActive]}>
                                    {DAY_SHORT[index]}
                                </Text>
                                <Text style={[styles.dayPillNum, active && styles.dayPillNumActive]}>
                                    {count}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Filtro por categoría */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                        style={[styles.filterChip, !filterCategory && styles.filterChipActive]}
                        onPress={() => setFilterCategory('')}
                    >
                        <Text
                            style={[
                                styles.filterChipText,
                                !filterCategory && styles.filterChipTextActive
                            ]}
                        >
                            Todas
                        </Text>
                    </TouchableOpacity>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[
                                styles.filterChip,
                                filterCategory === String(cat.id) && styles.filterChipActive
                            ]}
                            onPress={() => setFilterCategory(String(cat.id))}
                        >
                            <Text
                                style={[
                                    styles.filterChipText,
                                    filterCategory === String(cat.id) && styles.filterChipTextActive
                                ]}
                            >
                                {cat.category_year}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Título de sección + timeline */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Entrenamientos</Text>
                <Text style={styles.sectionCount}>
                    {daySchedules.length} · {selectedDay}
                </Text>
            </View>

            <FlatList
                data={daySchedules}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.timelineContent}
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
                            <Ionicons name="calendar-outline" size={28} color={MyColors.primary} />
                        </View>
                        <Text style={styles.emptyTitle}>Sin entrenamientos</Text>
                        <Text style={styles.emptyText}>
                            No hay horarios para {selectedDay}
                            {filterCategory ? ' en esta categoría' : ''}.
                        </Text>
                    </View>
                }
                renderItem={({ item, index }) => {
                    const isLast = index === daySchedules.length - 1;
                    return (
                        <View style={styles.timelineRow}>
                            <View style={styles.timeCol}>
                                <Text style={styles.timeLabel}>{item.start_time}</Text>
                                <Text style={styles.timeLabelEnd}>{item.end_time}</Text>
                            </View>

                            <View style={styles.lineCol}>
                                <View style={styles.dot} />
                                {!isLast && <View style={styles.line} />}
                            </View>

                            <TouchableOpacity
                                style={styles.eventCard}
                                onPress={() => startEdit(item)}
                                activeOpacity={0.85}
                            >
                                <View style={styles.eventCardTop}>
                                    <Text style={styles.eventTitle} numberOfLines={1}>
                                        {item.category_name}
                                    </Text>
                                    <View style={styles.eventActions}>
                                        <TouchableOpacity
                                            onPress={() => startEdit(item)}
                                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                            style={styles.eventActionBtn}
                                        >
                                            <Ionicons name="create-outline" size={16} color="#fff" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => handleDelete(item.id)}
                                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                            style={styles.eventActionBtn}
                                        >
                                            <Ionicons name="trash-outline" size={16} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <Text style={styles.eventMeta}>
                                    {item.day_of_week} · {item.start_time} – {item.end_time}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                }}
            />

            {/* Modal crear / editar */}
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
                                {editingSchedule ? 'Editar horario' : 'Nuevo horario'}
                            </Text>
                            <TouchableOpacity onPress={resetForm}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView contentContainerStyle={styles.modalBody}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Categoría *</Text>
                                <View style={styles.categoryGrid}>
                                    {categories.map((cat) => (
                                        <TouchableOpacity
                                            key={cat.id}
                                            style={[
                                                styles.categoryOption,
                                                formData.id_category === String(cat.id) &&
                                                    styles.categoryOptionSelected
                                            ]}
                                            onPress={() =>
                                                setFormData({
                                                    ...formData,
                                                    id_category: String(cat.id)
                                                })
                                            }
                                        >
                                            <Text
                                                style={[
                                                    styles.categoryOptionText,
                                                    formData.id_category === String(cat.id) &&
                                                        styles.categoryOptionTextSelected
                                                ]}
                                            >
                                                {cat.category_year}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Día *</Text>
                                <View style={styles.dayGrid}>
                                    {DAYS.map((day, index) => (
                                        <TouchableOpacity
                                            key={day}
                                            style={[
                                                styles.dayOption,
                                                formData.day_of_week === day && {
                                                    backgroundColor: MyColors.primary,
                                                    borderColor: MyColors.primary
                                                }
                                            ]}
                                            onPress={() =>
                                                setFormData({ ...formData, day_of_week: day })
                                            }
                                        >
                                            <Text
                                                style={[
                                                    styles.dayOptionText,
                                                    formData.day_of_week === day &&
                                                        styles.dayOptionTextSelected
                                                ]}
                                            >
                                                {DAY_SHORT[index]}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                    <Text style={styles.label}>Hora inicio *</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="08:00"
                                        value={formData.start_time}
                                        onChangeText={(text) =>
                                            setFormData({ ...formData, start_time: text })
                                        }
                                    />
                                </View>
                                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                    <Text style={styles.label}>Hora fin *</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="10:00"
                                        value={formData.end_time}
                                        onChangeText={(text) =>
                                            setFormData({ ...formData, end_time: text })
                                        }
                                    />
                                </View>
                            </View>

                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                <Text style={styles.submitButtonText}>
                                    {editingSchedule ? 'Actualizar horario' : 'Crear horario'}
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
    daysRow: {
        paddingTop: 8,
        paddingBottom: 4,
    },
    daysScroll: {
        paddingHorizontal: 16,
        gap: 10,
    },
    dayPill: {
        width: 56,
        paddingVertical: 12,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(139, 0, 0, 0.06)',
        shadowColor: '#8B0000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
    },
    dayPillActive: {
        backgroundColor: MyColors.primary,
        borderColor: 'transparent',
        shadowOpacity: 0.2,
        elevation: 4,
    },
    dayPillShort: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9A8585',
        marginBottom: 4,
    },
    dayPillShortActive: {
        color: 'rgba(255,255,255,0.85)',
    },
    dayPillNum: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    dayPillNumActive: {
        color: '#FFFFFF',
    },
    filterContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    filterChip: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'rgba(139, 0, 0, 0.08)',
    },
    filterChipActive: {
        backgroundColor: MyColors.primary,
        borderColor: MyColors.primary,
    },
    filterChipText: {
        fontSize: 13,
        color: '#6B5555',
        fontWeight: '500',
    },
    filterChipTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 8,
        paddingTop: 4,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
        letterSpacing: -0.2,
    },
    sectionCount: {
        fontSize: 12,
        color: '#9A8585',
        fontWeight: '500',
    },
    timelineContent: {
        paddingHorizontal: 16,
        paddingBottom: 32,
        paddingTop: 4,
        flexGrow: 1,
    },
    timelineRow: {
        flexDirection: 'row',
        minHeight: 88,
    },
    timeCol: {
        width: 52,
        paddingTop: 4,
        alignItems: 'flex-end',
        paddingRight: 10,
    },
    timeLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    timeLabelEnd: {
        fontSize: 11,
        color: '#9A8585',
        marginTop: 2,
    },
    lineCol: {
        width: 16,
        alignItems: 'center',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: MyColors.primary,
        marginTop: 6,
        borderWidth: 2,
        borderColor: 'rgba(139, 0, 0, 0.2)',
    },
    line: {
        flex: 1,
        width: 2,
        backgroundColor: 'rgba(139, 0, 0, 0.12)',
        marginTop: 4,
        marginBottom: 0,
    },
    eventCard: {
        flex: 1,
        backgroundColor: MyColors.primary,
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 14,
        marginBottom: 12,
        marginLeft: 6,
        shadowColor: '#8B0000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 10,
        elevation: 4,
    },
    eventCardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    eventTitle: {
        flex: 1,
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
        marginRight: 8,
    },
    eventMeta: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '500',
    },
    eventActions: {
        flexDirection: 'row',
        gap: 6,
    },
    eventActionBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyBox: {
        alignItems: 'center',
        paddingTop: 48,
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
        lineHeight: 18,
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
        maxHeight: '85%',
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
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B5555',
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryOption: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(139, 0, 0, 0.12)',
        marginBottom: 4,
        backgroundColor: '#FAF8F8',
    },
    categoryOptionSelected: {
        backgroundColor: MyColors.primary,
        borderColor: MyColors.primary,
    },
    categoryOptionText: {
        fontSize: 13,
        color: '#6B5555',
        fontWeight: '500',
    },
    categoryOptionTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    dayGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    dayOption: {
        width: 46,
        height: 46,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(139, 0, 0, 0.12)',
        backgroundColor: '#FAF8F8',
    },
    dayOptionText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B5555',
    },
    dayOptionTextSelected: {
        color: '#fff',
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