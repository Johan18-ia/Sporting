// Encargado: Estudiantes - Formulario
// Descripción: Formulario para crear/editar estudiantes y sus datos personales
// Archivo: src/presentation/views/students/StudentFormScreen.tsx
// ============================================
// src/presentation/views/students/StudentFormScreen.tsx
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
import { useAuth } from '../../../hooks/useAuth';

type StudentFormNavigationProp = StackNavigationProp<RootStackParamList, 'StudentForm'>;
type StudentFormRouteProp = RouteProp<RootStackParamList, 'StudentForm'>;

interface User {
    id: number;
    name: string;
    lastname: string;
    email: string;
    role: 'admin' | 'seller' | 'user';
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
    const { user: authenticatedUser } = useAuth();
    const { student, mode } = route.params || { mode: 'create' };
    const isSelfRegistration = authenticatedUser?.role === 'user' && route.params?.selfRegister === true;
    
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

    useEffect(() => {
        loadData();
        if (isSelfRegistration && authenticatedUser?.id) {
            setFormData((previous) => ({ ...previous, user_id: String(authenticatedUser.id) }));
        }
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
    }, [student, mode, isSelfRegistration, authenticatedUser?.id]);

    const loadData = async () => {
        try {
            const requests = [ApiDelivery.get('/students'), ApiDelivery.get('/categories')];
            if (!isSelfRegistration) requests.unshift(ApiDelivery.get('/users'));
            const responses = await Promise.all(requests);
            const usersResponse = isSelfRegistration ? null : responses[0];
            const studentsResponse = isSelfRegistration ? responses[0] : responses[1];
            const categoriesResponse = isSelfRegistration ? responses[1] : responses[2];
            const usersData = usersResponse?.data?.data ?? usersResponse?.data ?? [];
            const studentsData = studentsResponse.data?.data ?? studentsResponse.data ?? [];
            const existingIds = new Set((Array.isArray(studentsData) ? studentsData : []).map((item: any) => Number(item.user_id)));
            const usersAvailable = (Array.isArray(usersData) ? usersData : []).filter((item: User) => {
                const current = mode === 'edit' && Number(item.id) === Number(student?.user_id);
                return item.role === 'user' && Number(item.is_active) === 1 && (!existingIds.has(Number(item.id)) || current);
            });
            setUsers(isSelfRegistration ? [] : usersAvailable);
            const categoriesData = categoriesResponse.data?.data ?? categoriesResponse.data ?? [];
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        } catch (error) {
            console.error('Error loading users and categories:', error);
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
                birth_date: formData.birth_date || null,
                address: formData.address || null,
                emergency_contact_name: formData.emergency_contact_name || null,
                emergency_contact_phone: formData.emergency_contact_phone || null,
                status: formData.status
            };

            let response;
            if (mode === 'create') {
                response = await ApiDelivery.post('/students/create', payload);
            } else {
                response = await ApiDelivery.put('/students', { ...payload, id: student.id });
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
                    {isSelfRegistration ? (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Correo registrado *</Text>
                            <View style={styles.selectorButton}>
                                <Text style={styles.selectorText}>{authenticatedUser?.email}</Text>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Correo registrado *</Text>
                            <TouchableOpacity
                                style={[styles.selectorButton, errors.user_id && styles.inputError]}
                                onPress={() => setShowUserPicker(true)}
                                disabled={loadingData}
                            >
                                <Text style={styles.selectorText}>
                                    {users.find((item) => String(item.id) === formData.user_id)?.email || 'Selecciona un correo'}
                                </Text>
                                <Ionicons name="chevron-down" size={18} color="#666" />
                            </TouchableOpacity>
                            {errors.user_id && <Text style={styles.errorText}>{errors.user_id}</Text>}
                        </View>
                    )}

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

            <Modal visible={showUserPicker} transparent animationType="slide" onRequestClose={() => setShowUserPicker(false)}>
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
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.userOption}
                                    onPress={() => {
                                        setFormData({ ...formData, user_id: String(item.id) });
                                        setShowUserPicker(false);
                                    }}
                                >
                                    <Text style={styles.userOptionEmail}>{item.email}</Text>
                                    <Text style={styles.userOptionName}>{item.name} {item.lastname}</Text>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={<Text style={styles.emptyText}>No hay correos disponibles</Text>}
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
        marginBottom: 4,
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
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContainer: {
        maxHeight: '70%',
        backgroundColor: '#fff',
        borderRadius: 12,
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
    userOption: {
        padding: 14,
        marginHorizontal: 12,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 8,
    },
    userOptionEmail: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    userOptionName: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        padding: 20,
    },
});