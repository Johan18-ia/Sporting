// src/presentation/views/tournaments/TournamentsScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { MyColors } from '../../theme/AppTheme';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';

const TEAMS_STORAGE_KEY = 'sporting_teams_local';
const MIN_TEAMS = 10;

interface Tournament {
  id: number;
  name: string;
  category?: string;
  category_year?: string;
  status?: string;
  max_teams?: number;
  description?: string;
  teamIds?: number[];
}

interface Category {
  id: number;
  category_year?: string;
  name?: string;
}

interface LocalTeam {
  id: number;
  name: string;
  description?: string;
  studentIds?: number[];
}

export const TournamentsScreen = () => {
  const navigation = useNavigation();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [teams, setTeams] = useState<LocalTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    slogan: '',
    teamIds: [] as number[]
  });

  const loadData = useCallback(async () => {
    try {
      const [tournamentsRes, categoriesRes] = await Promise.all([
        ApiDelivery.get('/tournaments'),
        ApiDelivery.get('/categories')
      ]);

      const tRaw = tournamentsRes.data?.data ?? tournamentsRes.data;
      const cRaw = categoriesRes.data?.data ?? categoriesRes.data;
      setTournaments(Array.isArray(tRaw) ? tRaw : []);
      setCategories(Array.isArray(cRaw) ? cRaw : []);

      try {
        const raw = await AsyncStorage.getItem(TEAMS_STORAGE_KEY);
        const localTeams = raw ? JSON.parse(raw) : [];
        setTeams(Array.isArray(localTeams) ? localTeams : []);
      } catch {
        setTeams([]);
      }
    } catch {
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const resetForm = () => {
    setFormData({ name: '', category: '', slogan: '', teamIds: [] });
    setModalVisible(false);
  };

  const toggleTeam = (teamId: number) => {
    setFormData((prev) => {
      const selected = prev.teamIds.includes(teamId);
      return {
        ...prev,
        teamIds: selected
          ? prev.teamIds.filter((id) => id !== teamId)
          : [...prev.teamIds, teamId]
      };
    });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.category) {
      Alert.alert('Error', 'Nombre y categoría son requeridos');
      return;
    }
    if (formData.teamIds.length < MIN_TEAMS) {
      Alert.alert(
        'Equipos insuficientes',
        `Selecciona al menos ${MIN_TEAMS} equipos (llevas ${formData.teamIds.length}).`
      );
      return;
    }

    try {
      const selectedCategory = categories.find(
        (c) => String(c.id) === formData.category
      );
      await ApiDelivery.post('/tournaments/create', {
        name: formData.name.trim(),
        id_category: selectedCategory?.id,
        max_teams: formData.teamIds.length,
        teamIds: formData.teamIds,
        description: formData.slogan || ''
      });
      resetForm();
      loadData();
      Alert.alert('Éxito', 'Torneo creado correctamente');
    } catch {
      Alert.alert('Error', 'No se pudo crear el torneo');
    }
  };

  const handleDelete = (id: number, name: string) => {
    Alert.alert('Eliminar torneo', `¿Eliminar "${name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await ApiDelivery.delete(`/tournaments/${id}`);
            loadData();
            Alert.alert('Éxito', 'Torneo eliminado');
          } catch {
            Alert.alert('Error', 'No se pudo eliminar');
          }
        }
      }
    ]);
  };
    if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={MyColors.primary} />
        <Text style={styles.loadingText}>Cargando torneos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Torneos</Text>
          <Text style={styles.headerSub}>{tournaments.length} torneo(s)</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tournaments}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadData();
            }}
            colors={[MyColors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="trophy-outline" size={40} color="#c4b0b0" />
            <Text style={styles.emptyTitle}>Sin torneos</Text>
            <Text style={styles.emptyText}>
              Crea un torneo con al menos {MIN_TEAMS} equipos.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.iconWrap}>
                <Ionicons name="trophy" size={22} color={MyColors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardMeta}>
                  {item.category_year || item.category || 'Sin categoría'}
                  {item.max_teams ? ` · ${item.max_teams} equipos` : ''}
                </Text>
                {!!item.description && (
                  <Text style={styles.cardSlogan} numberOfLines={2}>
                    "{item.description}"
                  </Text>
                )}
                <Text style={styles.status}>{item.status || 'Activo'}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleDelete(item.id, item.name)}
                style={styles.actionBtn}
              >
                <Ionicons name="trash-outline" size={20} color="#c82333" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
            <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo torneo</Text>
              <TouchableOpacity onPress={resetForm}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.label}>Nombre *</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre del torneo"
                placeholderTextColor="#aaa"
                value={formData.name}
                onChangeText={(t) => setFormData((p) => ({ ...p, name: t }))}
              />

              <Text style={styles.label}>Categoría *</Text>
              <View style={styles.chips}>
                {categories.map((cat) => {
                  const id = String(cat.id);
                  const selected = formData.category === id;
                  const label = cat.category_year || cat.name || id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.chip, selected && styles.chipOn]}
                      onPress={() =>
                        setFormData((p) => ({ ...p, category: id }))
                      }
                    >
                      <Text
                        style={[styles.chipText, selected && styles.chipTextOn]}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.label}>Eslogan (opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Pasión y entrega"
                placeholderTextColor="#aaa"
                value={formData.slogan}
                onChangeText={(t) =>
                  setFormData((p) => ({ ...p, slogan: t }))
                }
              />

              <View style={styles.selectHeader}>
                <Text style={styles.label}>Equipos * (mín. {MIN_TEAMS})</Text>
                <Text
                  style={[
                    styles.selectedCount,
                    formData.teamIds.length >= MIN_TEAMS && { color: '#0ea371' }
                  ]}
                >
                  {formData.teamIds.length} seleccionados
                </Text>
              </View>

              {teams.length === 0 ? (
                <Text style={styles.hint}>
                  No hay equipos. Créalos primero en la sección Equipos.
                </Text>
              ) : (
                teams.map((team) => {
                  const selected = formData.teamIds.includes(team.id);
                  return (
                    <TouchableOpacity
                      key={team.id}
                      style={[styles.teamRow, selected && styles.teamRowOn]}
                      onPress={() => toggleTeam(team.id)}
                    >
                      <View style={[styles.check, selected && styles.checkOn]}>
                        {selected && (
                          <Ionicons name="checkmark" size={14} color="#fff" />
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.teamName}>{team.name}</Text>
                        {!!team.description && (
                          <Text style={styles.teamDesc}>{team.description}</Text>
                        )}
                        <Text style={styles.teamMeta}>
                          {(team.studentIds || []).length} integrantes
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.submitBtn,
                formData.teamIds.length < MIN_TEAMS && { opacity: 0.5 }
              ]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitBtnText}>Crear torneo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f4f4' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#8a7a7a' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139,0,0,0.06)',
    gap: 8
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f5f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  headerText: { flex: 1, minWidth: 0 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1a1a1a' },
  headerSub: { fontSize: 12, color: '#9a8585', marginTop: 2 },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: MyColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  list: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(139,0,0,0.06)'
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start' },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(139,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#1a1a1a' },
  cardMeta: { fontSize: 13, color: '#8a7a7a', marginTop: 2 },
  cardSlogan: {
    fontSize: 12,
    color: '#9a8585',
    fontStyle: 'italic',
    marginTop: 4
  },
  status: { fontSize: 12, fontWeight: '700', color: '#0ea371', marginTop: 6 },
  actionBtn: { padding: 6 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 12
  },
  emptyText: {
    fontSize: 13,
    color: '#9a8585',
    marginTop: 6,
    textAlign: 'center'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end'
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '92%',
    padding: 20
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#1a1a1a' },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3a2a2a',
    marginBottom: 6,
    marginTop: 12
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(139,0,0,0.12)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1a1a1a',
    backgroundColor: '#faf8f8'
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f0f0',
    borderWidth: 1,
    borderColor: 'rgba(139,0,0,0.1)'
  },
  chipOn: {
    backgroundColor: MyColors.primary,
    borderColor: MyColors.primary
  },
  chipText: { fontSize: 13, fontWeight: '600', color: '#6b5555' },
  chipTextOn: { color: '#fff' },
  selectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4
  },
  selectedCount: { fontSize: 12, fontWeight: '700', color: '#c82333' },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 8,
    backgroundColor: '#faf8f8',
    gap: 10
  },
  teamRowOn: { backgroundColor: 'rgba(139,0,0,0.08)' },
  check: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#c4b0b0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkOn: {
    backgroundColor: MyColors.primary,
    borderColor: MyColors.primary
  },
  teamName: { fontSize: 14, fontWeight: '700', color: '#1a1a1a' },
  teamDesc: { fontSize: 12, color: '#9a8585', marginTop: 2 },
  teamMeta: { fontSize: 11, color: '#8a7a7a', marginTop: 2 },
  hint: { fontSize: 13, color: '#9a8585', marginTop: 8 },
  submitBtn: {
    marginTop: 16,
    backgroundColor: MyColors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center'
  },
  submitBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 }
});

export default TournamentsScreen;