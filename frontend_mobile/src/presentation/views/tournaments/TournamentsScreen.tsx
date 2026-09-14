// Encargado: Torneos
// Descripción: Listado de torneos + detalle/stats (solo visual rediseñado)
// Archivo: src/presentation/views/tournaments/TournamentsScreen.tsx
// ============================================
import React, { useState, useEffect, useMemo } from 'react';
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
import { useAuth } from '../../../hooks/useAuth';

interface Tournament {
    id: number;
    name: string;
    category: string;
    status: string;
    students: any[];
    max_teams?: number;
    created_at?: string;
    id_category?: number;
}

interface Student {
    id: number;
    name: string;
    lastname: string;
    document: string;
}

const STATUS_FILTERS = ['Todos', 'Activo', 'Inscripciones', 'En Progreso', 'Finalizado'];

export const TournamentsScreen = () => {
    const { user } = useAuth();
    const canManageTournaments = user?.role === 'admin' || user?.role === 'seller';
    const isStudent = user?.role === 'user' && (user?.isStudent === true || Boolean(user?.studentProfile));
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [enrollModalVisible, setEnrollModalVisible] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [detailTournament, setDetailTournament] = useState<Tournament | null>(null);
    const [detailTab, setDetailTab] = useState<'stats' | 'lineup' | 'summary'>('stats');

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        max_teams: ''
    });

    // ============================================
    // LOGICA DE DATOS — sin cambios funcionales
    // ============================================
    const loadData = async () => {
        try {
            const [tournamentsRes, studentsRes, categoriesRes] = await Promise.all([
                ApiDelivery.get('/tournaments'),
                ApiDelivery.get('/students'),
                ApiDelivery.get('/categories')
            ]);

            const allTournaments = tournamentsRes.data?.data || [];
            const studentProfileId = user?.studentProfile?.id;
            const visibleTournaments = isStudent && studentProfileId
                ? allTournaments.filter((t: Tournament) =>
                    Array.isArray(t.students) && t.students.some((student: any) =>
                        Number(student.id) === Number(studentProfileId) || Number(student.student_id) === Number(studentProfileId)
                    )
                )
                : allTournaments;
            setTournaments(visibleTournaments);
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
            const selectedCategory = categories.find(
                (category) => String(category.id) === formData.category
            );
            await ApiDelivery.post('/tournaments/create', {
                name: formData.name,
                id_category: selectedCategory?.id,
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
            const student = students.find((s) => s.id === parseInt(selectedStudent));
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
        Alert.alert('Eliminar Torneo', `¿Estás seguro de eliminar "${name}"?`, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await ApiDelivery.delete(`/tournaments/${id}`);
                        setDetailTournament(null);
                        loadData();
                        Alert.alert('Éxito', 'Torneo eliminado');
                    } catch (error) {
                        Alert.alert('Error', 'No se pudo eliminar el torneo');
                    }
                }
            }
        ]);
    };

    const resetForm = () => {
        setFormData({ name: '', category: '', max_teams: '' });
        setModalVisible(false);
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            Activo: '#28a745',
            Inscripciones: '#f59e0b',
            'En Progreso': '#2196F3',
            Finalizado: '#6c757d'
        };
        return colors[status] || '#6c757d';
    };

    const filteredTournaments = useMemo(() => {
        if (statusFilter === 'Todos') return tournaments;
        return tournaments.filter(
            (t) => (t.status || 'Activo').toLowerCase() === statusFilter.toLowerCase()
        );
    }, [tournaments, statusFilter]);

    // ============================================
    // VISTA DETALLE (Stats)
    // ============================================
    if (detailTournament) {
        const t = detailTournament;
        const live = tournaments.find((x) => x.id === t.id) || t;
        const enrolled = live.students?.length || 0;
        const maxTeams = live.max_teams || 4;
        const occupancy = Math.min(100, Math.round((enrolled / Math.max(maxTeams, 1)) * 100));
        const freeSlots = Math.max(0, maxTeams - enrolled);
        const status = live.status || 'Activo';

        const StatBar = ({
            left,
            right,
            label,
            leftVal,
            rightVal
        }: {
            left: number;
            right: number;
            label: string;
            leftVal: string | number;
            rightVal: string | number;
        }) => {
            const total = left + right || 1;
            const leftPct = (left / total) * 100;
            return (
                <View style={styles.statRow}>
                    <Text style={styles.statLeftNum}>{leftVal}</Text>
                    <View style={styles.statMiddle}>
                        <Text style={styles.statLabel}>{label}</Text>
                        <View style={styles.statBarTrack}>
                            <View style={[styles.statBarLeft, { width: `${leftPct}%` as any }]} />
                            <View style={[styles.statBarRight, { width: `${100 - leftPct}%` as any }]} />
                        </View>
                    </View>
                    <Text style={styles.statRightNum}>{rightVal}</Text>
                </View>
            );
        };

        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                    <View style={styles.detailTop}>
                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={() => {
                                setDetailTournament(null);
                                setDetailTab('stats');
                            }}
                        >
                            <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
                        </TouchableOpacity>
                        <Text style={styles.detailNavTitle} numberOfLines={1}>
                            {live.name}
                        </Text>
                        {canManageTournaments ? (
                            <TouchableOpacity
                                style={styles.backBtn}
                                onPress={() => handleDelete(live.id, live.name)}
                            >
                                <Ionicons name="trash-outline" size={20} color={MyColors.primary} />
                            </TouchableOpacity>
                        ) : <View style={styles.backBtn} />}
                    </View>

                    <View style={styles.scoreCard}>
                        <Text style={styles.scoreVenue}>{live.category || 'Sin categoría'}</Text>
                        <Text style={styles.scoreWeek}>{status}</Text>
                        <View style={styles.scoreRow}>
                            <View style={styles.scoreSide}>
                                <View style={styles.scoreAvatar}>
                                    <Ionicons name="people" size={22} color={MyColors.primary} />
                                </View>
                                <Text style={styles.scoreSideLabel}>Inscritos</Text>
                                <Text style={styles.scoreSideSub}>Home</Text>
                            </View>
                            <View style={styles.scoreCenter}>
                                <Text style={styles.scoreNumbers}>
                                    {enrolled}
                                    <Text style={styles.scoreColon}> : </Text>
                                    {maxTeams}
                                </Text>
                                <View style={styles.scoreMinuteBadge}>
                                    <Text style={styles.scoreMinuteText}>{occupancy}%</Text>
                                </View>
                            </View>
                            <View style={styles.scoreSide}>
                                <View style={styles.scoreAvatar}>
                                    <Ionicons name="trophy" size={22} color={MyColors.primary} />
                                </View>
                                <Text style={styles.scoreSideLabel}>Cupo</Text>
                                <Text style={styles.scoreSideSub}>Máx</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.tabsRow}>
                        {(
                            [
                                { id: 'stats', label: 'Stats' },
                                { id: 'lineup', label: 'Inscritos' },
                                { id: 'summary', label: 'Resumen' }
                            ] as const
                        ).map((tab) => (
                            <TouchableOpacity
                                key={tab.id}
                                style={[styles.tabChip, detailTab === tab.id && styles.tabChipActive]}
                                onPress={() => setDetailTab(tab.id)}
                            >
                                <Text
                                    style={[
                                        styles.tabChipText,
                                        detailTab === tab.id && styles.tabChipTextActive
                                    ]}
                                >
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.tabBody}>
                        {detailTab === 'stats' && (
                            <>
                                <StatBar
                                    left={enrolled}
                                    right={freeSlots}
                                    label="Cupos ocupados"
                                    leftVal={enrolled}
                                    rightVal={freeSlots}
                                />
                                <StatBar
                                    left={occupancy}
                                    right={100 - occupancy}
                                    label="Ocupación %"
                                    leftVal={`${occupancy}%`}
                                    rightVal={`${100 - occupancy}%`}
                                />
                                <StatBar
                                    left={status === 'Activo' || status === 'En Progreso' ? 1 : 0}
                                    right={status === 'Finalizado' ? 1 : 0}
                                    label="Estado activo"
                                    leftVal={status === 'Finalizado' ? 'No' : 'Sí'}
                                    rightVal={status === 'Finalizado' ? 'Fin' : '—'}
                                />
                                <StatBar
                                    left={maxTeams}
                                    right={Math.max(1, enrolled)}
                                    label="Capacidad vs inscritos"
                                    leftVal={maxTeams}
                                    rightVal={enrolled}
                                />
                            </>
                        )}

                        {detailTab === 'lineup' && (
                            <View>
                                {(live.students || []).length === 0 ? (
                                    <Text style={styles.emptyLineup}>No hay estudiantes inscritos</Text>
                                ) : (
                                    (live.students || []).map((s: any, index: number) => (
                                        <View key={index} style={styles.lineupRow}>
                                            <View style={styles.lineupNum}>
                                                <Text style={styles.lineupNumText}>{index + 1}</Text>
                                            </View>
                                            <View style={styles.lineupInfo}>
                                                <Text style={styles.lineupName}>
                                                    {s.name ||
                                                        s.studentName ||
                                                        `${s.name || ''} ${s.lastname || ''}`.trim() ||
                                                        `Estudiante ${index + 1}`}
                                                </Text>
                                                <Text style={styles.lineupDoc}>
                                                    {s.document || s.studentDocument || '—'}
                                                </Text>
                                            </View>
                                        </View>
                                    ))
                                )}
                            </View>
                        )}

                        {detailTab === 'summary' && (
                            <View style={styles.summaryBox}>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryKey}>Nombre</Text>
                                    <Text style={styles.summaryVal}>{live.name}</Text>
                                </View>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryKey}>Categoría</Text>
                                    <Text style={styles.summaryVal}>{live.category || 'N/A'}</Text>
                                </View>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryKey}>Estado</Text>
                                    <Text style={styles.summaryVal}>{status}</Text>
                                </View>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryKey}>Inscritos</Text>
                                    <Text style={styles.summaryVal}>
                                        {enrolled} / {maxTeams}
                                    </Text>
                                </View>
                                {live.created_at ? (
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryKey}>Creado</Text>
                                        <Text style={styles.summaryVal}>
                                            {String(live.created_at).slice(0, 10)}
                                        </Text>
                                    </View>
                                ) : null}
                            </View>
                        )}
                    </View>

                    {canManageTournaments && (
                        <View style={styles.detailActions}>
                            <TouchableOpacity
                                style={styles.detailPrimaryBtn}
                                onPress={() => {
                                    setSelectedTournament(live);
                                    setEnrollModalVisible(true);
                                }}
                            >
                                <Ionicons name="person-add" size={18} color="#fff" />
                                <Text style={styles.detailPrimaryBtnText}>Inscribir estudiante</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>

                <Modal
                    visible={enrollModalVisible}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setEnrollModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Inscribir estudiante</Text>
                                <TouchableOpacity onPress={() => setEnrollModalVisible(false)}>
                                    <Ionicons name="close" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView contentContainerStyle={styles.modalBody}>
                                <Text style={styles.label}>
                                    Torneo: {selectedTournament?.name || live.name}
                                </Text>
                                <Text style={[styles.label, { marginTop: 12 }]}>Estudiante *</Text>
                                <View style={styles.categoryGrid}>
                                    {students.map((s) => (
                                        <TouchableOpacity
                                            key={s.id}
                                            style={[
                                                styles.categoryOption,
                                                selectedStudent === String(s.id) &&
                                                    styles.categoryOptionSelected
                                            ]}
                                            onPress={() => setSelectedStudent(String(s.id))}
                                        >
                                            <Text
                                                style={[
                                                    styles.categoryOptionText,
                                                    selectedStudent === String(s.id) &&
                                                        styles.categoryOptionTextSelected
                                                ]}
                                            >
                                                {s.name} {s.lastname}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <TouchableOpacity
                                    style={styles.submitButton}
                                    onPress={handleEnrollStudent}
                                >
                                    <Text style={styles.submitButtonText}>Inscribir</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    // ============================================
    // LISTADO
    // ============================================
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
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Torneos</Text>
                    <Text style={styles.headerSub}>{tournaments.length} registrados</Text>
                </View>
                {canManageTournaments && (
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
                )}
            </View>

            <View style={styles.filterRow}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScroll}
                >
                    {STATUS_FILTERS.map((f) => (
                        <TouchableOpacity
                            key={f}
                            style={[styles.leagueChip, statusFilter === f && styles.leagueChipActive]}
                            onPress={() => setStatusFilter(f)}
                        >
                            <Text
                                style={[
                                    styles.leagueChipText,
                                    statusFilter === f && styles.leagueChipTextActive
                                ]}
                            >
                                {f}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredTournaments}
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
                            <Ionicons name="trophy-outline" size={28} color={MyColors.primary} />
                        </View>
                        <Text style={styles.emptyTitle}>Sin torneos</Text>
                        <Text style={styles.emptyText}>
                            No hay torneos{statusFilter !== 'Todos' ? ` en “${statusFilter}”` : ''}.
                        </Text>
                    </View>
                }
                renderItem={({ item }) => {
                    const enrolled = item.students?.length || 0;
                    const maxTeams = item.max_teams || 4;
                    const status = item.status || 'Activo';
                    return (
                        <TouchableOpacity
                            style={styles.matchCard}
                            activeOpacity={0.85}
                            onPress={() => {
                                setDetailTournament(item);
                                setDetailTab('stats');
                            }}
                        >
                            <View style={styles.matchLeft}>
                                <View style={styles.matchBadge}>
                                    <Text style={styles.matchBadgeText} numberOfLines={1}>
                                        {(item.category || 'SC').toString().slice(0, 6)}
                                    </Text>
                                </View>
                                <Text style={styles.matchTeamName} numberOfLines={2}>
                                    {item.name}
                                </Text>
                            </View>

                            <View style={styles.matchCenter}>
                                <Text style={styles.matchTime}>
                                    {enrolled}:{maxTeams}
                                </Text>
                                <Text style={styles.matchDate}>{status}</Text>
                            </View>

                            <View style={styles.matchRight}>
                                {canManageTournaments && (
                                    <>
                                        <TouchableOpacity
                                            style={styles.matchIconBtn}
                                            onPress={() => {
                                                setSelectedTournament(item);
                                                setEnrollModalVisible(true);
                                            }}
                                            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                                        >
                                            <Ionicons name="person-add-outline" size={18} color={MyColors.primary} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.matchIconBtn}
                                            onPress={() => handleDelete(item.id, item.name)}
                                            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                                        >
                                            <Ionicons name="trash-outline" size={18} color="#C45C5C" />
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={resetForm}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Nuevo torneo</Text>
                            <TouchableOpacity onPress={resetForm}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={styles.modalBody}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Nombre *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nombre del torneo"
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
                                                formData.category === String(cat.id) &&
                                                    styles.categoryOptionSelected
                                            ]}
                                            onPress={() =>
                                                setFormData({
                                                    ...formData,
                                                    category: String(cat.id)
                                                })
                                            }
                                        >
                                            <Text
                                                style={[
                                                    styles.categoryOptionText,
                                                    formData.category === String(cat.id) &&
                                                        styles.categoryOptionTextSelected
                                                ]}
                                            >
                                                {cat.category_year || cat.name || cat.id}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Cupo máximo</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="4"
                                    keyboardType="number-pad"
                                    value={formData.max_teams}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, max_teams: text })
                                    }
                                />
                            </View>
                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                <Text style={styles.submitButtonText}>Crear torneo</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={enrollModalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setEnrollModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Inscribir estudiante</Text>
                            <TouchableOpacity onPress={() => setEnrollModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={styles.modalBody}>
                            <Text style={styles.label}>
                                Torneo: {selectedTournament?.name || '—'}
                            </Text>
                            <Text style={[styles.label, { marginTop: 12 }]}>Estudiante *</Text>
                            <View style={styles.categoryGrid}>
                                {students.map((s) => (
                                    <TouchableOpacity
                                        key={s.id}
                                        style={[
                                            styles.categoryOption,
                                            selectedStudent === String(s.id) &&
                                                styles.categoryOptionSelected
                                        ]}
                                        onPress={() => setSelectedStudent(String(s.id))}
                                    >
                                        <Text
                                            style={[
                                                styles.categoryOptionText,
                                                selectedStudent === String(s.id) &&
                                                    styles.categoryOptionTextSelected
                                            ]}
                                        >
                                            {s.name} {s.lastname}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={handleEnrollStudent}
                            >
                                <Text style={styles.submitButtonText}>Inscribir</Text>
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
    filterRow: {
        paddingVertical: 10,
    },
    filterScroll: {
        paddingHorizontal: 16,
    },
    leagueChip: {
        paddingHorizontal: 16,
        paddingVertical: 9,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'rgba(139, 0, 0, 0.08)',
    },
    leagueChipActive: {
        backgroundColor: MyColors.primary,
        borderColor: MyColors.primary,
    },
    leagueChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B5555',
    },
    leagueChipTextActive: {
        color: '#fff',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 28,
        paddingTop: 4,
    },
    matchCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 14,
        marginBottom: 10,
        shadowColor: '#8B0000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(139, 0, 0, 0.04)',
    },
    matchLeft: {
        flex: 1.3,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    matchBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(139, 0, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    matchBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: MyColors.primary,
    },
    matchTeamName: {
        flex: 1,
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    matchCenter: {
        alignItems: 'center',
        paddingHorizontal: 8,
        minWidth: 72,
    },
    matchTime: {
        fontSize: 16,
        fontWeight: '800',
        color: MyColors.primary,
        letterSpacing: -0.3,
    },
    matchDate: {
        fontSize: 10,
        color: '#9A8585',
        marginTop: 2,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    matchRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    matchIconBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'rgba(139, 0, 0, 0.06)',
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
    },
    detailTop: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 8,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    detailNavTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginHorizontal: 8,
    },
    scoreCard: {
        marginHorizontal: 16,
        marginTop: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 16,
        shadowColor: '#8B0000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(139, 0, 0, 0.05)',
    },
    scoreVenue: {
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '600',
        color: '#8A7A7A',
    },
    scoreWeek: {
        textAlign: 'center',
        fontSize: 12,
        color: MyColors.primary,
        fontWeight: '700',
        marginTop: 2,
        marginBottom: 16,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    scoreSide: {
        alignItems: 'center',
        flex: 1,
    },
    scoreAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(139, 0, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    scoreSideLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    scoreSideSub: {
        fontSize: 11,
        color: '#9A8585',
        marginTop: 2,
    },
    scoreCenter: {
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    scoreNumbers: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1A1A1A',
        letterSpacing: -1,
    },
    scoreColon: {
        color: '#9A8585',
        fontWeight: '600',
    },
    scoreMinuteBadge: {
        marginTop: 6,
        backgroundColor: MyColors.primary,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 10,
    },
    scoreMinuteText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
    tabsRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 18,
        gap: 8,
    },
    tabChip: {
        paddingHorizontal: 18,
        paddingVertical: 9,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'rgba(139, 0, 0, 0.08)',
    },
    tabChipActive: {
        backgroundColor: MyColors.primary,
        borderColor: MyColors.primary,
    },
    tabChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B5555',
    },
    tabChipTextActive: {
        color: '#fff',
    },
    tabBody: {
        marginTop: 16,
        marginHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 16,
        shadowColor: '#8B0000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    statLeftNum: {
        width: 44,
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A1A',
        textAlign: 'left',
    },
    statRightNum: {
        width: 44,
        fontSize: 14,
        fontWeight: '700',
        color: MyColors.primary,
        textAlign: 'right',
    },
    statMiddle: {
        flex: 1,
        paddingHorizontal: 10,
    },
    statLabel: {
        fontSize: 12,
        color: '#8A7A7A',
        textAlign: 'center',
        marginBottom: 6,
        fontWeight: '500',
    },
    statBarTrack: {
        height: 6,
        borderRadius: 3,
        flexDirection: 'row',
        overflow: 'hidden',
        backgroundColor: '#F0EAEA',
    },
    statBarLeft: {
        height: 6,
        backgroundColor: '#1A1A1A',
    },
    statBarRight: {
        height: 6,
        backgroundColor: MyColors.primary,
    },
    emptyLineup: {
        textAlign: 'center',
        color: '#8A7A7A',
        paddingVertical: 20,
        fontSize: 14,
    },
    lineupRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0EAEA',
    },
    lineupNum: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(139, 0, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    lineupNumText: {
        fontSize: 12,
        fontWeight: '700',
        color: MyColors.primary,
    },
    lineupInfo: {
        flex: 1,
    },
    lineupName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    lineupDoc: {
        fontSize: 12,
        color: '#9A8585',
        marginTop: 2,
    },
    summaryBox: {
        gap: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F0F0',
    },
    summaryKey: {
        fontSize: 13,
        color: '#8A7A7A',
        fontWeight: '500',
    },
    summaryVal: {
        fontSize: 13,
        color: '#1A1A1A',
        fontWeight: '700',
        maxWidth: '60%',
        textAlign: 'right',
    },
    detailActions: {
        paddingHorizontal: 16,
        marginTop: 18,
    },
    detailPrimaryBtn: {
        backgroundColor: MyColors.primary,
        borderRadius: 14,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#8B0000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    detailPrimaryBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
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