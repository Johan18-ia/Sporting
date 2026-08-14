// Encargado: Estudiantes - Formulario
// Descripción: Formulario para crear/editar estudiantes vinculando a usuario existente
// Archivo: src/presentation/views/students/StudentFormScreen.tsx
// ============================================
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    FlatList,
    Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/RootStackParamList';
import { MyColors } from '../../theme/AppTheme';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';

type StudentFormNavigationProp = StackNavigationProp<RootStackParamList, 'StudentForm'>;
type StudentFormRouteProp = RouteProp<RootStackParamList, 'StudentForm'>;

interface User {
    id: number;
    name: string;
    lastname: string;
    email: string;
    role: string;
    is_active: number;
}

interface FormData {
    user_id: string;
    document: string;
    category_id: string;
    birth_date: string;
    address: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    status: 'pending' | 'approved' | 'rejected';
}

export const StudentFormScreen = () => {
    const navigation = useNavigation<StudentFormNavigationProp>();
    const route = useRoute<StudentFormRouteProp>();
    const { student, mode } = route.params || { mode: 'create' };

    const [formData, setFormData] = useState<FormData>({
        user_id: '',
        document: '',
        category_id: '',
        birth_date: '',
        address: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        status: 'pending'
    });

    const [users, setUsers] = useState<User[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showUserPicker, setShowUserPicker] = useState(false);

    const selectedUser = users.find((user) => String(user.id) === formData.user_id) ?? null;

    useEffect(() => {
        loadData();
    }, [student, mode]);

    const loadData = async () => {
        try {
            setLoadingData(true);

            const [usersResponse, studentsResponse, categoriesResponse] = await Promise.all([
                ApiDelivery.get('/users'),
                ApiDelivery.get('/students'),
                ApiDelivery.get('/categories')
            ]);

            const usersData = usersResponse.data?.data ?? usersResponse.data ?? [];
            const studentsData = studentsResponse.data?.data ?? studentsResponse.data ?? [];
            const existingStudentUserIds = new Set(
                Array.isArray(studentsData)
                    ? studentsData
                        .map((s: any) => Number(s.user_id))
                        .filter((id: number) => !Number.isNaN(id))
                    : []
            );

            const eligibleUsers = Array.isArray(usersData)
                ? usersData.filter((u: User) => {
                    const isCurrentStudentUser = Boolean(student && mode === 'edit' && Number(student.user_id) === Number(u.id));
                    return u.role === 'user' && u.is_active === 1 && (!existingStudentUserIds.has(Number(u.id)) || isCurrentStudentUser);
                })
                : [];
            setUsers(eligibleUsers);

            const categoriesData = categoriesResponse.data?.data ?? categoriesResponse.data ?? [];
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);

            if (student && mode === 'edit') {
                setFormData({
                    user_id: String(student.user_id || ''),
                    document: student.document || '',
                    category_id: String(student.category_id || ''),
                    birth_date: student.birth_date || '',
                    address: student.address || '',
                    emergency_contact_name: student.emergency_contact_name || '',
                    emergency_contact_phone: student.emergency_contact_phone || '',
                    status: student.status || 'pending'
                });
            }
        } catch (error) {
            console.error('Error loading users/categories:', error);
            Alert.alert('Error', 'No se pudieron cargar los usuarios y categorías');
        } finally {
            setLoadingData(false);
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.user_id) {
            newErrors.user_id = 'Debe seleccionar un correo registrado';
        }
        if (!formData.document.trim()) {
            newErrors.document = 'El documento es requerido';
        }
        if (!formData.category_id) {
            newErrors.category_id = 'La categoría es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const payload = {
                user_id: Number(formData.user_id),
                document: formData.document,
                category_id: Number(formData.category_id),
                birth_date: formData.birth_date,
                address: formData.address,
                emergency_contact_name: formData.emergency_contact_name,
                emergency_contact_phone: formData.emergency_contact_phone,
                status: formData.status
            };

            if (mode === 'create') {
                await ApiDelivery.post('/students/create', payload);
            } else {
                await ApiDelivery.put('/students', { ...payload, id: student.id });
            }

            Alert.alert(
                'Éxito',
                mode === 'create' ? 'Estudiante creado correctamente' : 'Estudiante actualizado correctamente',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Error al guardar el estudiante');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Correo registrado *</Text>
                        <TouchableOpacity
                            style={[styles.selectorButton, errors.user_id && styles.inputError]}
                            onPress={() => setShowUserPicker(true)}
                            disabled={loadingData}
                        >
                            <Text style={styles.selectorText}>
                                {selectedUser ? selectedUser.email : 'Selecciona un correo'}
                            </Text>
                            <Ionicons name="chevron-down" size={18} color="#666" />
                        </TouchableOpacity>
                        {selectedUser && (
                            <Text style={styles.userInfoText}>
                                {selectedUser.name} {selectedUser.lastname}
                            </Text>
                        )}
                        {errors.user_id && <Text style={styles.errorText}>{errors.user_id}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Documento *</Text>
                        <TextInput
                            style={[styles.input, errors.document && styles.inputError]}
                            placeholder="Número de identificación"
                            value={formData.document}
                            onChangeText={(text) => setFormData({ ...formData, document: text })}
                            keyboardType="numeric"
                        />
                        {errors.document && <Text style={styles.errorText}>{errors.document}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Categoría *</Text>
                        <View style={styles.categoryContainer}>
                            {loadingData ? (
                                <ActivityIndicator color={MyColors.primary} />
                            ) : (
                                categories.map((cat) => (
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
                                ))
                            )}
                        </View>
                        {errors.category_id && <Text style={styles.errorText}>{errors.category_id}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Fecha de Nacimiento</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="YYYY-MM-DD"
                            value={formData.birth_date}
                            onChangeText={(text) => setFormData({ ...formData, birth_date: text })}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Dirección</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Dirección de residencia"
                            value={formData.address}
                            onChangeText={(text) => setFormData({ ...formData, address: text })}
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.label}>Contacto de Emergencia</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre del contacto"
                                value={formData.emergency_contact_name}
                                onChangeText={(text) => setFormData({ ...formData, emergency_contact_name: text })}
                            />
                        </View>
                        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.label}>Teléfono de Emergencia</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Teléfono de emergencia"
                                value={formData.emergency_contact_phone}
                                onChangeText={(text) => setFormData({ ...formData, emergency_contact_phone: text })}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Estado</Text>
                        <View style={styles.statusContainer}>
                            {['pending', 'approved', 'rejected'].map((status) => (
                                <TouchableOpacity
                                    key={status}
                                    style={[
                                        styles.statusOption,
                                        formData.status === status && styles.statusOptionSelected
                                    ]}
                                    onPress={() => setFormData({ ...formData, status: status as 'pending' | 'approved' | 'rejected' })}
                                >
                                    <Text style={[
                                        styles.statusOptionText,
                                        formData.status === status && styles.statusOptionTextSelected
                                    ]}>
                                        {status === 'pending' ? 'Pendiente' : status === 'approved' ? 'Aprobado' : 'Rechazado'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitButtonText}>
                                {mode === 'create' ? 'Crear Estudiante' : 'Actualizar Estudiante'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal visible={showUserPicker} transparent animationType="slide">
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Selecciona un correo</Text>
                            <TouchableOpacity onPress={() => setShowUserPicker(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={users}
                            keyExtractor={(item) => String(item.id)}
                            contentContainerStyle={styles.userList}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.userItem,
                                        String(item.id) === formData.user_id && styles.userItemSelected
                                    ]}
                                    onPress={() => {
                                        setFormData({ ...formData, user_id: String(item.id) });
                                        setShowUserPicker(false);
                                    }}
                                >
                                    <Text style={styles.userEmail}>{item.email}</Text>
                                    <Text style={styles.userName}>{item.name} {item.lastname}</Text>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>No hay correos registrados disponibles.</Text>
                            }
                        />
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        padding: 20,
    },
    form: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
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
    selectorButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: '#f8f9fa',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectorText: {
        color: '#333',
        fontSize: 15,
    },
    userInfoText: {
        color: '#666',
        fontSize: 12,
        marginTop: 6,
    },
    inputError: {
        borderColor: '#dc3545',
    },
    errorText: {
        color: '#dc3545',
        fontSize: 12,
        marginTop: 4,
    },
    categoryContainer: {
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
    statusContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    statusOption: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    statusOptionSelected: {
        backgroundColor: MyColors.primary,
        borderColor: MyColors.primary,
    },
    statusOptionText: {
        fontSize: 13,
        color: '#666',
    },
    statusOptionTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: MyColors.primary,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        maxHeight: '70%',
        overflow: 'hidden',
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
        fontWeight: '700',
        color: '#333',
    },
    userList: {
        padding: 12,
    },
    userItem: {
        padding: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e5e5',
        marginBottom: 8,
        backgroundColor: '#fafafa',
    },
    userItemSelected: {
        backgroundColor: '#eaf4ff',
        borderColor: '#7aa7ff',
    },
    userEmail: {
        fontSize: 14,
        color: '#1f2937',
        fontWeight: '600',
    },
    userName: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 4,
    },
    emptyText: {
        color: '#666',
        textAlign: 'center',
        paddingVertical: 20,
    },
});