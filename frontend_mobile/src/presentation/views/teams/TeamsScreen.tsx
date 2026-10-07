// src/presentation/views/teams/TeamsScreen.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { MyColors } from '../../theme/AppTheme';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';
import { useAuth } from '../../../hooks/useAuth';

const MIN_MEMBERS = 4;

interface Team {
  id: number;
  name: string;
  description?: string;
  members?: TeamMember[];
  category_id?: number | null;
  coach_id?: number | null;
}

interface TeamMember {
  id?: number;
  student_id?: number;
  name?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  document?: string;
}

interface Student {
  id: number;
  name: string;
  lastname: string;
  document?: string;
}

const normalizeArray = (payload: any): any[] => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
};

export const TeamsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
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

  const loadData = useCallback(async () => {
    try {
      const [teamsRes, studentsRes] = await Promise.all([
        ApiDelivery.get('/teams').catch(() => ({ data: { data: [] } })),
        ApiDelivery.get('/students').catch(() => ({ data: { data: [] } }))
      ]);

      const teamList = normalizeArray(teamsRes.data);
      const studentList = normalizeArray(studentsRes.data);

      const memberMap: Record<number, TeamMember[]> = {};
      await Promise.all(
        teamList.map(async (team: any) => {
          try {
            const membersRes = await ApiDelivery.get(`/teams/${team.id}/members`);
            memberMap[team.id] = normalizeArray(membersRes.data);
          } catch {
            memberMap[team.id] = [];
          }
        })
      );

      setTeams(
        teamList.map((team: any) => ({
          ...team,
          description: team.description || '',
          members: memberMap[team.id] || []
        }))
      );
      setStudents(studentList);
    } catch (error) {
      console.error('Error cargando equipos:', error);
      Alert.alert('Error', 'No se pudieron cargar los equipos desde el backend');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;
    const q = searchTerm.trim().toLowerCase();
    return students.filter((s) => {
      const full = `${s.name || ''} ${s.lastname || ''}`.toLowerCase();
      return full.includes(q) || String(s.document || '').includes(q);
    });
  }, [students, searchTerm]);

  const toggleStudent = (studentId: number) => {
    setFormData((prev) => {
      const selected = prev.studentIds.includes(studentId);
      return {
        ...prev,
        studentIds: selected
          ? prev.studentIds.filter((id) => id !== studentId)
          : [...prev.studentIds, studentId]
      };
    });
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', studentIds: [] });
    setEditingTeam(null);
    setSearchTerm('');
    setModalVisible(false);
  };

  const syncMembers = async (teamId: number, nextMemberIds: number[]) => {
    const currentMembers = teams.find((team) => team.id === teamId)?.members || [];
    const currentMemberIds = currentMembers
      .map((member) => Number(member.student_id ?? member.id))
      .filter((value) => !Number.isNaN(value));

    const toAdd = nextMemberIds.filter((id) => !currentMemberIds.includes(id));
    const toRemove = currentMemberIds.filter((id) => !nextMemberIds.includes(id));

    for (const studentId of toAdd) {
      await ApiDelivery.post(`/teams/${teamId}/members`, { student_id: studentId });
    }

    for (const studentId of toRemove) {
      await ApiDelivery.delete(`/teams/${teamId}/members/${studentId}`);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'El nombre del equipo es requerido');
      return;
    }
    if (formData.studentIds.length < MIN_MEMBERS) {
      Alert.alert(
        'Integrantes insuficientes',
        `Selecciona al menos ${MIN_MEMBERS} estudiantes (llevas ${formData.studentIds.length}).`
      );
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category_id: null,
        coach_id: user?.id ?? null,
        is_active: 1
      };

      if (editingTeam) {
        await ApiDelivery.put(`/teams/${editingTeam.id}`, payload);
        await syncMembers(editingTeam.id, formData.studentIds);
        Alert.alert('Éxito', 'Equipo actualizado');
      } else {
        const createdResponse = await ApiDelivery.post('/teams', payload);
        const createdTeam = createdResponse.data?.data || createdResponse.data || {};
        const createdId = createdTeam.id;
        if (createdId) {
          await syncMembers(createdId, formData.studentIds);
        }
        Alert.alert('Éxito', 'Equipo creado');
      }

      resetForm();
      await loadData();
    } catch (error: any) {
      console.error('Error guardando equipo:', error);
      Alert.alert('Error', error?.response?.data?.message || 'No se pudo guardar el equipo');
    }
  };

  const handleDelete = (id: number, name: string) => {
    Alert.alert('Eliminar equipo', `¿Eliminar "${name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await ApiDelivery.delete(`/teams/${id}`);
            await loadData();
            Alert.alert('Éxito', 'Equipo eliminado');
          } catch (error: any) {
            console.error('Error eliminando equipo:', error);
            Alert.alert('Error', error?.response?.data?.message || 'No se pudo eliminar');
          }
        }
      }
    ]);
  };

  const startEdit = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      description: team.description || '',
      studentIds: (team.members || []).map((member) => Number(member.student_id ?? member.id)).filter((id) => !Number.isNaN(id))
    });
    setModalVisible(true);
  };

  const getTeamStudents = (team: Team) => team.members || [];

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={MyColors.primary} />
        <Text style={styles.loadingText}>Cargando equipos...</Text>
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
          <Text style={styles.headerTitle}>Equipos</Text>
          <Text style={styles.headerSub}>{teams.length} equipo(s)</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            setEditingTeam(null);
            setFormData({ name: '', description: '', studentIds: [] });
            setModalVisible(true);
          }}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={teams}
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
            <Ionicons name="shield-outline" size={40} color="#c4b0b0" />
            <Text style={styles.emptyTitle}>Sin equipos</Text>
            <Text style={styles.emptyText}>
              Crea un equipo con al menos {MIN_MEMBERS} estudiantes.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const members = getTeamStudents(item);
          return (
            <View style={styles.teamCard}>
              <View style={styles.teamHeader}>
                <View style={styles.teamIconWrap}>
                  <Ionicons name="shield" size={22} color={MyColors.primary} />
                </View>
                <View style={styles.teamTitleCol}>
                  <Text style={styles.teamName}>{item.name}</Text>
                  {!!item.description && (
                    <Text style={styles.teamSlogan} numberOfLines={2}>
                      "{item.description}"
                    </Text>
                  )}
                  <Text style={styles.memberCountText}>{members.length} integrantes</Text>
                </View>
                <TouchableOpacity onPress={() => startEdit(item)} style={styles.actionBtn}>
                  <Ionicons name="create-outline" size={20} color="#A52A2A" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id, item.name)}
                  style={styles.actionBtn}
                >
                  <Ionicons name="trash-outline" size={20} color="#c82333" />
                </TouchableOpacity>
              </View>
              {members.length > 0 && (
                <View style={styles.membersWrap}>
                  {members.map((member, index) => (
                    <View key={`${member.student_id ?? member.id ?? index}`} style={styles.memberChip}>
                      <Text style={styles.memberChipText}>
                        {member.name || ''} {member.lastname || ''}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        }}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingTeam ? 'Editar equipo' : 'Nuevo equipo'}
              </Text>
              <TouchableOpacity onPress={resetForm}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.label}>Nombre del equipo *</Text>
              <TextInput
                style={[styles.input, !formData.name.trim() && formData.name.length > 0 && styles.inputError]}
                value={formData.name}
                onChangeText={(t) => setFormData((p) => ({ ...p, name: t }))}
                placeholder="Ej: Leones 2015"
                placeholderTextColor="#aaa"
              />
              {!formData.name.trim() && formData.name.length > 0 && <Text style={styles.errorText}>El nombre no puede contener solo espacios.</Text>}

              <Text style={styles.label}>Eslogan (opcional)</Text>
              <TextInput
                style={[styles.input, { minHeight: 64, textAlignVertical: 'top' }]}
                value={formData.description}
                onChangeText={(t) => setFormData((p) => ({ ...p, description: t }))}
                placeholder="Ej: Fuerza y disciplina"
                placeholderTextColor="#aaa"
                multiline
              />

              <View style={styles.selectHeader}>
                <Text style={styles.label}>Estudiantes * (mín. {MIN_MEMBERS})</Text>
                <Text
                  style={[
                    styles.selectedCount,
                    formData.studentIds.length >= MIN_MEMBERS && { color: '#0ea371' }
                  ]}
                >
                  {formData.studentIds.length} seleccionados
                </Text>
              </View>
              {formData.studentIds.length < MIN_MEMBERS && <Text style={styles.errorText}>Selecciona al menos {MIN_MEMBERS} estudiantes.</Text>}

              <TextInput
                style={styles.input}
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="Buscar estudiante..."
                placeholderTextColor="#aaa"
              />

              {students.length === 0 ? (
                <Text style={styles.hint}>No hay estudiantes. Regístralos primero.</Text>
              ) : (
                filteredStudents.map((s) => {
                  const selected = formData.studentIds.includes(s.id);
                  return (
                    <TouchableOpacity
                      key={s.id}
                      style={[styles.studentRow, selected && styles.studentRowOn]}
                      onPress={() => toggleStudent(s.id)}
                    >
                      <View style={[styles.check, selected && styles.checkOn]}>
                        {selected && <Ionicons name="checkmark" size={14} color="#fff" />}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.studentName}>
                          {s.name} {s.lastname}
                        </Text>
                        {!!s.document && <Text style={styles.studentDoc}>{s.document}</Text>}
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.submitBtn,
                formData.studentIds.length < MIN_MEMBERS && { opacity: 0.5 }
              ]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitBtnText}>
                {editingTeam ? 'Guardar cambios' : 'Crear equipo'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  teamCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(139,0,0,0.06)'
  },
  teamHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  teamIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(139,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  teamTitleCol: { flex: 1, marginLeft: 12 },
  teamName: { fontSize: 16, fontWeight: '800', color: '#1a1a1a' },
  teamSlogan: { fontSize: 13, color: '#8a7a7a', fontStyle: 'italic', marginTop: 2 },
  memberCountText: { fontSize: 12, color: '#8a7a7a', fontWeight: '600', marginTop: 6 },
  actionBtn: { padding: 6 },
  membersWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0eaea'
  },
  memberChip: {
    backgroundColor: 'rgba(139,0,0,0.06)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16
  },
  memberChipText: { fontSize: 12, color: '#8B0000', fontWeight: '600' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginTop: 12 },
  emptyText: { fontSize: 13, color: '#9a8585', marginTop: 6, textAlign: 'center' },
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
    marginTop: 10
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
  inputError: { borderColor: '#c82333', backgroundColor: '#fff5f5' },
  errorText: { color: '#b42318', fontSize: 12, marginTop: 4, marginBottom: 8 },
  selectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4
  },
  selectedCount: { fontSize: 12, fontWeight: '700', color: '#c82333' },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: 6,
    backgroundColor: '#faf8f8',
    gap: 12
  },
  studentRowOn: { backgroundColor: 'rgba(139,0,0,0.06)' },
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
  studentName: { fontSize: 14, fontWeight: '700', color: '#1a1a1a' },
  studentDoc: { fontSize: 12, color: '#9a8585', marginTop: 2 },
  hint: { fontSize: 13, color: '#9a8585', marginTop: 12, textAlign: 'center' },
  submitBtn: {
    marginTop: 16,
    backgroundColor: MyColors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center'
  },
  submitBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 }
});

export default TeamsScreen;