// src/presentation/views/dashboard/DashboardScreen.tsx
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [myTournaments, setMyTournaments] = useState<any[]>([]);
  const [mySchedules, setMySchedules] = useState<any[]>([]);
  const [studentError, setStudentError] = useState<string | null>(null);
  const [studentLoading, setStudentLoading] = useState(false);

  const isStudent = user?.role === 'user';

  const extractArray = (result: PromiseSettledResult<any>, label: string): any[] => {
    if (result.status === 'rejected') {
      console.error(`Error cargando ${label}:`, result.reason?.message || result.reason);
      return [];
    }
    const data = result.value?.data;
    return Array.isArray(data) ? data : data?.data || [];
  };

  const loadStats = async () => {
    try {
      const [studentsRes, tournamentsRes, productsRes, categoriesRes, schedulesRes] =
        await Promise.allSettled([
          ApiDelivery.get('/students'),
          ApiDelivery.get('/tournaments'),
          ApiDelivery.get('/products'),
          ApiDelivery.get('/categories'),
          ApiDelivery.get('/schedules')
        ]);

      const tournamentsData = extractArray(tournamentsRes, 'torneos');

      let teamsCount = 0;
      try {
        const raw = await AsyncStorage.getItem('sporting_teams_local');
        const localTeams = raw ? JSON.parse(raw) : [];
        teamsCount = Array.isArray(localTeams) ? localTeams.length : 0;
      } catch {
        teamsCount = 0;
      }

      setStats({
        students: extractArray(studentsRes, 'estudiantes').length,
        tournaments: tournamentsData.length,
        activeTournaments: tournamentsData.filter(
          (t: any) => (t.status || 'Activo') === 'Activo'
        ).length,
        products: extractArray(productsRes, 'productos').length,
        categories: extractArray(categoriesRes, 'categorías').length,
        schedules: extractArray(schedulesRes, 'horarios').length,
        teams: teamsCount
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
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
        : tournamentsRes.data?.data || [];

      const schedulesData = Array.isArray(schedulesRes.data)
        ? schedulesRes.data
        : schedulesRes.data?.data || [];

      const userId = user?.id;
      const categoryId = user?.category_id;

      const myTournamentsData = tournamentsData.filter((t: any) =>
        Array.isArray(t.students) && userId
          ? t.students.some(
              (s: any) => s?.id === userId || s?.student_id === userId
            )
          : false
      );

      const mySchedulesData = categoryId
        ? schedulesData.filter(
            (s: any) =>
              s?.id_category === categoryId || s?.category_id === categoryId
          )
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

  useEffect(() => {
    if (isStudent) loadStudentData();
    else loadStats();
  }, [isStudent]);

  const onRefresh = () => {
    setRefreshing(true);
    if (isStudent) loadStudentData();
    else loadStats();
  };

  const isLoading = isStudent ? studentLoading : loading;

  const StatCard = ({ icon, label, value, onPress }: any) => (
    <TouchableOpacity
      style={styles.statCard}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={isStudent}
    >
      <View style={styles.statIconBox}>
        <Ionicons name={icon} size={22} color={MyColors.primary} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{isLoading ? '—' : value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      {!isStudent && (
        <Ionicons name="chevron-forward" size={18} color="#c4b0b0" />
      )}
    </TouchableOpacity>
  );

  const QuickAction = ({ icon, label, onPress }: any) => (
    <TouchableOpacity
      style={styles.quickAction}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.quickActionIcon}>
        <Ionicons name={icon} size={22} color={MyColors.primary} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  if (isStudent) {
    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[MyColors.primary]}
          />
        }
      >
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>
              Hola, {user?.name || 'Estudiante'}
            </Text>
            <Text style={styles.greetingSub}>
              Panel de estudiante de Sporting Club
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle" size={38} color={MyColors.primary} />
          </TouchableOpacity>
        </View>

        {studentError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{studentError}</Text>
          </View>
        ) : null}

        <View style={styles.statsGrid}>
          <StatCard
            icon="school-outline"
            label="Categoría"
            value={user?.category_id || 'Sin asignar'}
            onPress={() => {}}
          />
          <StatCard
            icon="time-outline"
            label="Mis Horarios"
            value={mySchedules.length}
            onPress={() => {}}
          />
          <StatCard
            icon="trophy-outline"
            label="Mis Torneos"
            value={myTournaments.length}
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[MyColors.primary]}
        />
      }
    >
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>
            Bienvenido, {user?.name || 'Usuario'}
          </Text>
          <Text style={styles.greetingSub}>
            Panel de administración de Sporting Club
          </Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-circle" size={38} color={MyColors.primary} />
        </TouchableOpacity>
      </View>

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
          icon="shield-outline"
          label="Equipos"
          value={stats.teams}
          onPress={() => navigation.navigate('Teams')}
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
    backgroundColor: '#f7f4f4'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a'
  },
  greetingSub: {
    fontSize: 13,
    color: '#8a7a7a',
    marginTop: 4
  },
  profileButton: {
    marginLeft: 12
  },
  errorBox: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#fde8e8',
    borderRadius: 12
  },
  errorText: {
    color: '#c82333',
    fontSize: 13
  },
  statsGrid: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 10
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(139,0,0,0.06)',
    shadowColor: '#8B0000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(139,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  statContent: {
    flex: 1
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a1a'
  },
  statLabel: {
    fontSize: 13,
    color: '#8a7a7a',
    marginTop: 2,
    fontWeight: '600'
  },
  quickActionsSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 12
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  quickAction: {
    width: '30%',
    flexGrow: 1,
    minWidth: 100,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139,0,0,0.06)'
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(139,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3a2a2a',
    textAlign: 'center'
  }
});

export default DashboardScreen;