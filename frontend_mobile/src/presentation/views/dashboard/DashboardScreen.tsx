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
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/RootStackParamList';
import { useAuth } from '../../../hooks/useAuth';
import { MyColors } from '../../theme/AppTheme';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';

type DashboardNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

interface DashboardStats {
    students: number;
    tournaments: number;
    activeTournaments: number;
    products: number;
    categories: number;
    schedules: number;
    teams: number;
    users: number;
}

export const DashboardScreen = () => {
    const navigation = useNavigation<DashboardNavigationProp>();
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        students: 0,
        tournaments: 0,
        activeTournaments: 0,
        products: 0,
        categories: 0,
        schedules: 0,
        teams: 0,
        users: 0
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadStats = async () => {
        try {
            const [students, tournaments, products, categories, schedules, users] = await Promise.all([
                ApiDelivery.get('/students'),
                ApiDelivery.get('/tournaments'),
                ApiDelivery.get('/products'),
                ApiDelivery.get('/categories'),
                ApiDelivery.get('/schedules'),
                ApiDelivery.get('/users')
            ]);

            const tournamentsData = tournaments.data || [];
            setStats({
                students: students.data?.length || 0,
                tournaments: tournamentsData.length,
                activeTournaments: tournamentsData.filter((t: any) => t.status === 'Activo').length,
                products: products.data?.length || 0,
                categories: categories.data?.length || 0,
                schedules: schedules.data?.length || 0,
                teams: 0,
                users: users.data?.length || 0
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

    const StatCard = ({ icon, label, value, color = MyColors.primary, onPress }: any) => (
        <TouchableOpacity 
            style={[styles.statCard, { borderLeftColor: color }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.statIconContainer}>
                <Ionicons name={icon} size={28} color={color} />
            </View>
            <View style={styles.statContent}>
                <Text style={styles.statValue}>{loading ? '...' : value}</Text>
                <Text style={styles.statLabel}>{label}</Text>
            </View>
        </TouchableOpacity>
    );

    const QuickAction = ({ icon, label, onPress, color = MyColors.primary }: any) => (
        <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon} size={24} color={color} />
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
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>¡Hola, {user?.name || 'Usuario'}!</Text>
                    <Text style={styles.greetingSub}>Bienvenido a Sporting Club</Text>
                </View>
                <TouchableOpacity 
                    style={styles.profileButton}
                    onPress={() => navigation.navigate('Profile' as never)}
                >
                    <Ionicons name="person-circle" size={40} color={MyColors.primary} />
                </TouchableOpacity>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                <StatCard
                    icon="people"
                    label="Usuarios"
                    value={stats.users}
                    color="#8B0000"
                    onPress={() => navigation.navigate('Users' as never)}
                />
                <StatCard
                    icon="school"
                    label="Estudiantes"
                    value={stats.students}
                    color="#2196F3"
                    onPress={() => navigation.navigate('Students' as never)}
                />
                <StatCard
                    icon="trophy"
                    label="Torneos"
                    value={stats.tournaments}
                    color="#FF9800"
                    onPress={() => navigation.navigate('Tournaments' as never)}
                />
                <StatCard
                    icon="bag"
                    label="Productos"
                    value={stats.products}
                    color="#4CAF50"
                    onPress={() => navigation.navigate('Products' as never)}
                />
                <StatCard
                    icon="pricetag"
                    label="Categorías"
                    value={stats.categories}
                    color="#9C27B0"
                    onPress={() => navigation.navigate('Categories' as never)}
                />
                <StatCard
                    icon="time"
                    label="Horarios"
                    value={stats.schedules}
                    color="#00BCD4"
                    onPress={() => navigation.navigate('Schedules' as never)}
                />
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActionsSection}>
                <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
                <View style={styles.quickActionsGrid}>
                    <QuickAction
                        icon="person-add"
                        label="Nuevo Usuario"
                        onPress={() => navigation.navigate('UserForm' as never, { mode: 'create' })}
                        color="#8B0000"
                    />
                    <QuickAction
                        icon="school-outline"
                        label="Nuevo Estudiante"
                        onPress={() => navigation.navigate('StudentForm' as never, { mode: 'create' })}
                        color="#2196F3"
                    />
                    <QuickAction
                        icon="trophy-outline"
                        label="Nuevo Torneo"
                        onPress={() => navigation.navigate('Tournaments' as never)}
                        color="#FF9800"
                    />
                    <QuickAction
                        icon="calendar-outline"
                        label="Horarios"
                        onPress={() => navigation.navigate('Schedules' as never)}
                        color="#00BCD4"
                    />
                    <QuickAction
                        icon="people-outline"
                        label="Equipos"
                        onPress={() => navigation.navigate('Teams' as never)}
                        color="#4CAF50"
                    />
                    <QuickAction
                        icon="bar-chart-outline"
                        label="Reportes"
                        onPress={() => navigation.navigate('Reports' as never)}
                        color="#9C27B0"
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    greetingSub: {
        fontSize: 14,
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
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statIconContainer: {
        marginRight: 12,
    },
    statContent: {
        flex: 1,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    statLabel: {
        fontSize: 12,
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