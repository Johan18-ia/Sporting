// src/presentation/views/dashboard/DashboardScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../hooks/useAuth';
import { MyColors } from '../../theme/AppTheme';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';

interface DashboardStats {
    students: number;
    tournaments: number;
    activeTournaments: number;
    products: number;
    categories: number;
    schedules: number;
}

export const DashboardScreen = () => {
    const navigation = useNavigation<any>();
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        students: 0,
        tournaments: 0,
        activeTournaments: 0,
        products: 0,
        categories: 0,
        schedules: 0
    });
    const [loading, setLoading] = useState(true);
    const [studentLoading, setStudentLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [myTournaments, setMyTournaments] = useState<any[]>([]);
    const [mySchedules, setMySchedules] = useState<any[]>([]);
    const [availableTournaments, setAvailableTournaments] = useState<any[]>([]);
    const [studentError, setStudentError] = useState<string | null>(null);

    const isStudent = user?.role === 'user' && (user?.isStudent === true || Boolean(user?.studentProfile));
    const isRegularUser = user?.role === 'user' && !isStudent;
    const extractArray = (result: PromiseSettledResult<any>, label: string): any[] => {
        if (result.status === 'rejected') {
            console.error(`Error cargando ${label}:`, result.reason?.message || result.reason);
            return [];
        }
        const data = result.value?.data;
        return Array.isArray(data) ? data : (data?.data || []);
    };

    const loadStats = async () => {
        try {
            const [studentsRes, tournamentsRes, productsRes, categoriesRes, schedulesRes] = await Promise.allSettled([
                ApiDelivery.get('/students'),
                ApiDelivery.get('/tournaments'),
                ApiDelivery.get('/products'),
                ApiDelivery.get('/categories'),
                ApiDelivery.get('/schedules')
            ]);

            const tournamentsData = extractArray(tournamentsRes, 'torneos');
            setStats({
                students: extractArray(studentsRes, 'estudiantes').length,
                tournaments: tournamentsData.length,
                activeTournaments: tournamentsData.filter((t: any) => (t.status || 'Activo') === 'Activo').length,
                products: extractArray(productsRes, 'productos').length,
                categories: extractArray(categoriesRes, 'categorías').length,
                schedules: extractArray(schedulesRes, 'horarios').length
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (isStudent) {
            loadStudentData();
        } else if (isRegularUser) {
            loadRegularUserData();
        } else {
            loadStats();
        }
    }, [isStudent, isRegularUser]);

    const onRefresh = () => {
        setRefreshing(true);
        if (isStudent) {
            loadStudentData();
        } else if (isRegularUser) {
            loadRegularUserData();
        } else {
            loadStats();
        }
    };

    const loadStudentData = async () => {
        setStudentError(null);
        setStudentLoading(true);
        try {
            const [tournamentsRes, schedulesRes] = await Promise.all([
                ApiDelivery.get('/tournaments'),
                ApiDelivery.get('/schedules')
            ]);

            const tournamentsData = Array.isArray(tournamentsRes.data)
                ? tournamentsRes.data
                : (tournamentsRes.data?.data || []);

            const schedulesData = Array.isArray(schedulesRes.data)
                ? schedulesRes.data
                : (schedulesRes.data?.data || []);

            const userId = user?.id;
            const categoryId = user?.studentProfile?.category_id || user?.category_id;

            const myTournamentsData = tournamentsData.filter((t: any) =>
                Array.isArray(t.students) && userId
                    ? t.students.some((s: any) => s?.id === userId || s?.student_id === userId)
                    : false
            );

            const mySchedulesData = categoryId
                ? schedulesData.filter((s: any) => s?.id_category === categoryId || s?.category_id === categoryId)
                : [];

            setMyTournaments(myTournamentsData);
            setMySchedules(mySchedulesData);
        } catch (error) {
            console.error('Error loading student data:', error);
            setStudentError('No se pudieron cargar los datos del estudiante');
        } finally {
            setStudentLoading(false);
            setRefreshing(false);
        }
    };

    const loadRegularUserData = async () => {
        setLoading(true);
        try {
            const [tournamentsRes, productsRes] = await Promise.all([
                ApiDelivery.get('/tournaments'),
                ApiDelivery.get('/products')
            ]);
            const tournaments = tournamentsRes.data?.data || tournamentsRes.data || [];
            const products = productsRes.data?.data || productsRes.data || [];
            const tournamentList = Array.isArray(tournaments) ? tournaments : [];
            setAvailableTournaments(tournamentList);
            setStats((previous) => ({
                ...previous,
                tournaments: tournamentList.length,
                activeTournaments: tournamentList.filter((t: any) => (t.status || 'Activo') === 'Activo').length,
                products: Array.isArray(products) ? products.length : 0
            }));
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const isLoading = isStudent ? studentLoading : loading;

    const StatCard = ({ icon, label, value, onPress, note, accent }: any) => (
        <TouchableOpacity
            style={[styles.statCard, accent && styles.statCardAccent]}
            onPress={onPress}
            activeOpacity={0.75}
            disabled={isStudent}
        >
            <View style={[styles.statIconCircle, accent && styles.statIconCircleAccent]}>
                <Ionicons name={icon} size={20} color={accent ? '#FFFFFF' : MyColors.primary} />
            </View>
            <View style={styles.statContent}>
                <Text style={[styles.statLabel, accent && styles.statLabelOnAccent]}>
                    {label}{note ? ` (${note})` : ''}
                </Text>
                <Text style={[styles.statValue, accent && styles.statValueOnAccent]}>
                    {isLoading ? '—' : value}
                </Text>
            </View>
            <View style={[styles.statChevron, accent && styles.statChevronOnAccent]}>
                <Ionicons name="chevron-forward" size={16} color={accent ? 'rgba(255,255,255,0.7)' : '#C4A8A8'} />
            </View>
        </TouchableOpacity>
    );

    const QuickAction = ({ icon, label, onPress }: any) => (
        <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.quickActionIcon}>
                <Ionicons name={icon} size={22} color={MyColors.primary} />
            </View>
            <Text style={styles.quickActionLabel}>{label}</Text>
        </TouchableOpacity>
    );

    const activeTournaments = myTournaments.filter((t) => (t.status || 'Activo') === 'Activo').length;

    if (isStudent) {
        return (
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[MyColors.primary]} />
                }
            >
                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.greeting}>Hola, {user?.name || 'Estudiante'}</Text>
                        <Text style={styles.greetingSub}>Panel de estudiante</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.profileButton}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <View style={styles.profileAvatar}>
                            <Ionicons name="person" size={20} color={MyColors.primary} />
                        </View>
                    </TouchableOpacity>
                </View>

                {studentError ? (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{studentError}</Text>
                    </View>
                ) : null}

                <View style={styles.statsList}>
                    <StatCard icon="school-outline" label="Categoría" value={user?.studentProfile?.category_year || user?.category_id || 'Sin asignar'} onPress={() => {}} accent />
                    <StatCard icon="time-outline" label="Mis Horarios" value={mySchedules.length} onPress={() => {}} />
                    <StatCard icon="trophy-outline" label="Mis Torneos" value={myTournaments.length} onPress={() => {}} />
                    <StatCard icon="checkmark-circle-outline" label="Activos" value={activeTournaments} onPress={() => {}} />
                </View>

                <View style={styles.quickActionsSection}>
                    <Text style={styles.sectionTitle}>Accesos</Text>
                    <View style={styles.quickActionsGrid}>
                        <QuickAction
                            icon="calendar-outline"
                            label="Horarios"
                            onPress={() => navigation.navigate('Schedules')}
                        />
                        <QuickAction
                            icon="trophy-outline"
                            label="Torneos"
                            onPress={() => navigation.navigate('Tournaments')}
                        />
                        <QuickAction
                            icon="person-outline"
                            label="Perfil"
                            onPress={() => navigation.navigate('Profile')}
                        />
                    </View>
                </View>

                <View style={styles.quickActionsSection}>
                    <Text style={styles.sectionTitle}>Mis horarios</Text>
                    {mySchedules.length === 0 ? (
                        <Text style={styles.emptyText}>No tienes horarios asignados todavía.</Text>
                    ) : mySchedules.map((schedule) => (
                        <View key={schedule.id} style={styles.listItem}>
                            <Text style={styles.listItemTitle}>{schedule.day_of_week}</Text>
                            <Text style={styles.listItemText}>
                                {schedule.start_time} - {schedule.end_time}{schedule.field_name ? ` · ${schedule.field_name}` : ''}
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={styles.quickActionsSection}>
                    <Text style={styles.sectionTitle}>Mis torneos</Text>
                    {myTournaments.length === 0 ? (
                        <Text style={styles.emptyText}>No participas en torneos actualmente.</Text>
                    ) : myTournaments.map((tournament) => (
                        <View key={tournament.id} style={styles.listItem}>
                            <Text style={styles.listItemTitle}>{tournament.name}</Text>
                            <Text style={styles.listItemText}>
                                {tournament.category || 'Sin categoría'} · {tournament.status || 'Activo'} · {tournament.students?.length || 0} participantes
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        );
    }

    if (isRegularUser) {
        return (
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[MyColors.primary]} />}
            >
                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.greeting}>¡Bienvenido! {user?.name || 'Usuario'}</Text>
                        <Text style={styles.greetingSub}>Consulta torneos y productos del club</Text>
                    </View>
                    <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
                        <View style={styles.profileAvatar}><Ionicons name="person" size={20} color={MyColors.primary} /></View>
                    </TouchableOpacity>
                </View>

                <View style={styles.statsList}>
                    <StatCard icon="trophy-outline" label="Torneos disponibles" value={stats.tournaments} onPress={() => navigation.navigate('Tournaments')} accent />
                    <StatCard icon="checkmark-circle-outline" label="Torneos activos" value={stats.activeTournaments} onPress={() => navigation.navigate('Tournaments')} />
                    <StatCard icon="bag-outline" label="Productos en catálogo" value={stats.products} onPress={() => navigation.navigate('Products')} />
                </View>

                <View style={styles.quickActionsSection}>
                    <Text style={styles.sectionTitle}>Torneos disponibles</Text>
                    {availableTournaments.length === 0 ? (
                        <Text style={styles.emptyText}>No hay torneos disponibles.</Text>
                    ) : availableTournaments.slice(0, 5).map((tournament) => (
                        <View key={tournament.id} style={styles.listItem}>
                            <Text style={styles.listItemTitle}>{tournament.name}</Text>
                            <Text style={styles.listItemText}>
                                {tournament.category || 'Sin categoría'} · {tournament.status || 'Activo'} · {tournament.students?.length || 0} participantes
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[MyColors.primary]} />
            }
        >
            {/* Header — tipografía limpia, sin barra gruesa extra */}
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.greeting}>¡Bienvenido! {user?.name || 'Usuario'}</Text>
                    <Text style={styles.greetingSub}>Panel de administración.</Text>
                </View>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <View style={styles.profileAvatar}>
                        <Ionicons name="person" size={20} color={MyColors.primary} />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Stats en lista de cards suaves (estilo mock) */}
            <View style={styles.statsList}>
                <StatCard
                    icon="school-outline"
                    label="Estudiantes"
                    value={stats.students}
                    onPress={() => navigation.navigate('Students')}
                    accent
                />
                <StatCard
                    icon="pricetag-outline"
                    label="Categorías"
                    value={stats.categories}
                    onPress={() => navigation.navigate('Categories')}
                />
                <StatCard
                    icon="time-outline"
                    label="Horarios"
                    value={stats.schedules}
                    onPress={() => navigation.navigate('Schedules')}
                />
                <StatCard
                    icon="trophy-outline"
                    label="Torneos"
                    value={stats.tournaments}
                    onPress={() => navigation.navigate('Tournaments')}
                    accent
                />
                <StatCard
                    icon="checkmark-circle-outline"
                    label="Torneos Activos"
                    value={stats.activeTournaments}
                    onPress={() => navigation.navigate('Tournaments')}
                />
                <StatCard
                    icon="bag-outline"
                    label="Productos"
                    value={stats.products}
                    onPress={() => navigation.navigate('Products')}
                />
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F4F4',
    },
    scrollContent: {
        paddingBottom: 28,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 14,
        backgroundColor: 'transparent',
    },
    greeting: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        letterSpacing: -0.3,
    },
    greetingSub: {
        fontSize: 13,
        color: '#8A7A7A',
        marginTop: 4,
    },
    profileButton: {
        padding: 2,
    },
    profileAvatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: 'rgba(139, 0, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(139, 0, 0, 0.18)',
    },
    // Lista vertical de cards (como el mock)
    statsList: {
        paddingHorizontal: 16,
        paddingTop: 4,
        gap: 12,
    },
    statCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        paddingVertical: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#8B0000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(139, 0, 0, 0.04)',
    },
    statCardAccent: {
        backgroundColor: MyColors.primary,
        borderColor: 'transparent',
        shadowOpacity: 0.18,
        shadowRadius: 14,
        elevation: 5,
    },
    statIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(139, 0, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    statIconCircleAccent: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    statContent: {
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        color: '#9A8585',
        fontWeight: '500',
        marginBottom: 2,
        letterSpacing: 0.2,
    },
    statLabelOnAccent: {
        color: 'rgba(255, 255, 255, 0.75)',
    },
    statValue: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        letterSpacing: -0.4,
    },
    statValueOnAccent: {
        color: '#FFFFFF',
    },
    statChevron: {
        marginLeft: 8,
        opacity: 0.9,
    },
    statChevronOnAccent: {
        opacity: 1,
    },
    quickActionsSection: {
        marginTop: 20,
        marginHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 18,
        shadowColor: '#8B0000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(139, 0, 0, 0.04)',
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 16,
        letterSpacing: -0.2,
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    quickAction: {
        width: '30%',
        alignItems: 'center',
        marginBottom: 14,
    },
    quickActionIcon: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: 'rgba(139, 0, 0, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    quickActionLabel: {
        fontSize: 11,
        color: '#6B5555',
        textAlign: 'center',
        fontWeight: '500',
    },
    // Conservados por si se usan en otros flujos del mismo archivo
    profileCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 18,
        marginTop: 12,
        shadowColor: '#8B0000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    profileItem: {
        color: '#333',
        marginBottom: 8,
        fontSize: 14,
    },
    listItem: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 18,
        marginTop: 10,
        shadowColor: '#8B0000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    listItemTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    listItemText: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
    emptyText: {
        color: '#666',
        fontSize: 13,
        paddingTop: 12,
    },
    errorBox: {
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 14,
        backgroundColor: '#f8d7da',
        padding: 12,
        borderWidth: 1,
        borderColor: '#f5c6cb',
    },
    errorText: {
        color: '#721c24',
        fontSize: 14,
    },
});