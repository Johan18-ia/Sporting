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

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoadingData(true);
            
            // Cargar usuarios elegibles (role='user', is_active=1)
            const usersResponse = await ApiDelivery.get('/users');
            const usersData = usersResponse.data?.data ?? usersResponse.data ?? [];
            const eligibleUsers = Array.isArray(usersData) 
                ? usersData.filter((u: User) => u.role === 'user' && u.is_active === 1)
                : [];
            setUsers(eligibleUsers);

            // Cargar categorías
            const categoriesResponse = await ApiDelivery.get('/categories');
            const categoriesData = categoriesResponse.data?.data ?? categoriesResponse.data ?? [];
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);

            // Si está en modo edit, llenar datos
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
            console.error('Error loading data:', error);
            Alert.alert('Error', 'No se pudieron cargar los datos');
        } finally {
            setLoadingData(false);
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.user_id) {
            newErrors.user_id = 'El usuario es requerido';
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
                user_id: parseInt(formData.user_id),
                document: formData.document,
                category_id: parseInt(formData.category_id),
                birth_date: formData.birth_date || null,
                address: formData.address || '',
                emergency_contact_name: formData.emergency_contact_name || '',
                emergency_contact_phone: formData.emergency_contact_phone || '',
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

    const getSelectedUserName = () => {
        const selected = users.find(u => String(u.id) === formData.user_id);
        return selected ? `${selected.name} ${selected.lastname}` : 'Seleccionar usuario';
    };

    if (loadingData) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={MyColors.primary} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.form}>
                    {/* Usuario */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Usuario * (role: user, activo)</Text>
                        <TouchableOpacity
                            style={[styles.userButton, errors.user_id && styles.inputError]}
                            onPress={() => setShowUserPicker(true)}
                        >
                            <Text style={styles.userButtonText}>{getSelectedUserName()}</Text>
                            <Ionicons name="chevron-down" size={20} color={MyColors.primary} />
                        </TouchableOpacity>
                        {errors.user_id && <Text style={styles.errorText}>{errors.user_id}</Text>}
                    </View>

                    {/* Documento */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Documento * (único)</Text>
                        <TextInput
                            style={[styles.input, errors.document && styles.inputError]}
                            placeholder="Número de identificación"
                            value={formData.document}
                            onChangeText={(text) => setFormData({ ...formData, document: text })}
                            keyboardType="numeric"
                        />
                        {errors.document && <Text style={styles.errorText}>{errors.document}</Text>}
                    </View>

                    {/* Categoría */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Categoría *</Text>
                        <View style={styles.categoryContainer}>
                            {categories.map((cat) => (
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
                            ))}
                        </View>
                        {errors.category_id && <Text style={styles.errorText}>{errors.category_id}</Text>}
                    </View>

                    {/* Fecha de Nacimiento */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Fecha de Nacimiento</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="YYYY-MM-DD"
                            value={formData.birth_date}
                            onChangeText={(text) => setFormData({ ...formData, birth_date: text })}
                        />
                    </View>

                    {/* Dirección */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Dirección</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Dirección de residencia"
                            value={formData.address}
                            onChangeText={(text) => setFormData({ ...formData, address: text })}
                        />
                    </View>

                    {/* Contacto de Emergencia */}
                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.label}>Contacto de Emergencia</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre"
                                value={formData.emergency_contact_name}
                                onChangeText={(text) => setFormData({ ...formData, emergency_contact_name: text })}
                            />
                        </View>
                        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.label}>Teléfono</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Teléfono"
                                value={formData.emergency_contact_phone}
                                onChangeText={(text) => setFormData({ ...formData, emergency_contact_phone: text })}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    {/* Estado */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Estado</Text>
                        <View style={styles.statusContainer}>
                            {(['pending', 'approved', 'rejected'] as const).map((status) => (
                                <TouchableOpacity
                                    key={status}
                                    style={[
                                        styles.statusOption,
                                        formData.status === status && styles.statusOptionSelected
                                    ]}
                                    onPress={() => setFormData({ ...formData, status })}
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

                    {/* Botón Submit */}
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

            {/* Modal Seleccionar Usuario */}
            <Modal
                visible={showUserPicker}
                animationType="slide"
                onRequestClose={() => setShowUserPicker(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Seleccionar Usuario</Text>
                        <TouchableOpacity onPress={() => setShowUserPicker(false)}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={users}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.userItem,
                                    formData.user_id === String(item.id) && styles.userItemSelected
                                ]}
                                onPress={() => {
                                    setFormData({ ...formData, user_id: String(item.id) });
                                    setShowUserPicker(false);
                                }}
                            >
                                <View>
                                    <Text style={styles.userName}>
                                        {item.name} {item.lastname}
                                    </Text>
                                    <Text style={styles.userEmail}>{item.email}</Text>
                                </View>
                                {formData.user_id === String(item.id) && (
                                    <Ionicons name="checkmark-circle" size={24} color={MyColors.primary} />
                                )}
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No hay usuarios disponibles</Text>
                            </View>
                        }
                    />
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
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#333',
    },
    inputError: {
        borderColor: '#dc3545',
    },
    errorText: {
        fontSize: 12,
        color: '#dc3545',
        marginTop: 4,
    },
    userButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#fafafa',
    },
    userButtonText: {
        fontSize: 14,
        color: '#333',
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryOption: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
    },
    categoryOptionSelected: {
        borderColor: MyColors.primary,
        backgroundColor: MyColors.primary,
    },
    categoryOptionText: {
        fontSize: 13,
        color: '#666',
    },
    categoryOptionTextSelected: {
        color: '#fff',
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    statusOption: {
        flex: 1,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    statusOptionSelected: {
        borderColor: MyColors.primary,
        backgroundColor: MyColors.primary,
    },
    statusOptionText: {
        fontSize: 12,
        color: '#666',
    },
    statusOptionTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: MyColors.primary,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: Platform.OS === 'ios' ? 20 : 0,
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
        fontWeight: 'bold',
        color: '#333',
    },
    userItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    userItemSelected: {
        backgroundColor: 'rgba(139, 0, 0, 0.05)',
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    userEmail: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
});
