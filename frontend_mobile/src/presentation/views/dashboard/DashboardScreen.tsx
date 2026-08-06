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
    teams: number;
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
        schedules: 0,
        teams: 0
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // ============================================
    // LOGICA DE DATOS SIN CAMBIOS — mismos endpoints
    // ============================================
    // Extrae el array real de la respuesta, sin importar si el
    // backend lo manda envuelto como { success, message, data } o directo.
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
            // Promise.allSettled en vez de Promise.all: si UN endpoint falla
            // (ej. Horarios o Torneos con error 501 del backend), los demas
            // igual cargan en vez de tumbar todo el dashboard.
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
                schedules: extractArray(schedulesRes, 'horarios').length,
                teams: 0 // no existe todavia un endpoint de Equipos en el backend
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadStats();
    };

    // ============================================
    // PRESENTACION — icono en caja roja tenue,
    // igual al estilo que ya usa la web (stat-card-icon)
    // ============================================
    const StatCard = ({ icon, label, value, onPress, note }: any) => (
        <TouchableOpacity
            style={styles.statCard}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.statIconBox}>
                <Ionicons name={icon} size={22} color={MyColors.primary} />
            </View>
            <View style={styles.statContent}>
                <Text style={styles.statValue}>{loading ? '—' : value}</Text>
                <Text style={styles.statLabel}>
                    {label}{note ? ` (${note})` : ''}
                </Text>
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

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[MyColors.primary]} />
            }
        >
            {/* Header — mismo texto que usa la web */}
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.greeting}>Bienvenido, {user?.name || 'Usuario'}</Text>
                    <Text style={styles.greetingSub}>Panel de administración de Sporting Club</Text>
                </View>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Ionicons name="person-circle" size={38} color={MyColors.primary} />
                </TouchableOpacity>
            </View>

            {/* Stats Grid — mismo set de 7 metricas que la web */}
            <View style={styles.statsGrid}>
                <StatCard
                    icon="school-outline"
                    label="Estudiantes"
                    value={stats.students}
                    onPress={() => navigation.navigate('Students')}
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
                <StatCard
                    icon="shield-outline"
                    label="Equipos"
                    value="—"
                    note="próx."
                    onPress={() => navigation.navigate('Teams')}
                />
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActionsSection}>
                <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
                <View style={styles.quickActionsGrid}>
                    <QuickAction
                        icon="person-add-outline"
                        label="Nuevo Usuario"
                        onPress={() => navigation.navigate('UserForm', { mode: 'create' })}
                    />
                    <QuickAction
                        icon="school-outline"
                        label="Nuevo Estudiante"
                        onPress={() => navigation.navigate('StudentForm', { mode: 'create' })}
                    />
                    <QuickAction
                        icon="trophy-outline"
                        label="Torneos"
                        onPress={() => navigation.navigate('Tournaments')}
                    />
                    <QuickAction
                        icon="calendar-outline"
                        label="Horarios"
                        onPress={() => navigation.navigate('Schedules')}
                    />
                    <QuickAction
                        icon="people-outline"
                        label="Equipos"
                        onPress={() => navigation.navigate('Teams')}
                    />
                    <QuickAction
                        icon="bar-chart-outline"
                        label="Reportes"
                        onPress={() => navigation.navigate('Reports')}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    greeting: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#333',
    },
    greetingSub: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    profileButton: {
        padding: 4,
    },
    statsGrid: {
        padding: 12,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        width: '48%',
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statIconBox: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: 'rgba(139, 0, 0, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    statContent: {
        flex: 1,
    },
    statValue: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#333',
    },
    statLabel: {
        fontSize: 11.5,
        color: '#666',
        marginTop: 2,
    },
    quickActionsSection: {
        padding: 16,
        backgroundColor: '#fff',
        marginTop: 8,
        marginHorizontal: 12,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    quickAction: {
        width: '30%',
        alignItems: 'center',
        marginBottom: 12,
    },
    quickActionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(139, 0, 0, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    quickActionLabel: {
        fontSize: 11,
        color: '#555',
        textAlign: 'center',
    },
});