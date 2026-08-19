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
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/RootStackParamList';
import { MyColors } from '../../theme/AppTheme';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';

type StudentFormNavigationProp = StackNavigationProp<RootStackParamList, 'StudentForm'>;
type StudentFormRouteProp = RouteProp<RootStackParamList, 'StudentForm'>;

interface FormData {
    name: string;
    lastname: string;
    document: string;
    category_id: string;
    birth_date: string;
    phone: string;
    address: string;
    emergency_contact: string;
    emergency_phone: string;
}

export const StudentFormScreen = () => {
    const navigation = useNavigation<StudentFormNavigationProp>();
    const route = useRoute<StudentFormRouteProp>();
    const { student, mode } = route.params || { mode: 'create' };
    
    const [formData, setFormData] = useState<FormData>({
        name: '',
        lastname: '',
        document: '',
        category_id: '',
        birth_date: '',
        phone: '',
        address: '',
        emergency_contact: '',
        emergency_phone: ''
    });
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        loadCategories();
        if (student && mode === 'edit') {
            setFormData({
                name: student.name || '',
                lastname: student.lastname || '',
                document: student.document || '',
                category_id: String(student.category_id || ''),
                birth_date: student.birth_date || '',
                phone: student.phone || '',
                address: student.address || '',
                emergency_contact: student.emergency_contact || '',
                emergency_phone: student.emergency_phone || ''
            });
        }
    }, [student, mode]);

    const loadCategories = async () => {
        try {
            const response = await ApiDelivery.get('/categories');
            const categoriesData = response.data?.data ?? response.data ?? [];
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setLoadingCategories(false);
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }
        if (!formData.lastname.trim()) {
            newErrors.lastname = 'El apellido es requerido';
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
                ...formData,
                category_id: parseInt(formData.category_id)
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
                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.label}>Nombres *</Text>
                            <TextInput
                                style={[styles.input, errors.name && styles.inputError]}
                                placeholder="Nombre del estudiante"
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                            />
                            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                        </View>
                        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.label}>Apellidos *</Text>
                            <TextInput
                                style={[styles.input, errors.lastname && styles.inputError]}
                                placeholder="Apellido del estudiante"
                                value={formData.lastname}
                                onChangeText={(text) => setFormData({ ...formData, lastname: text })}
                            />
                            {errors.lastname && <Text style={styles.errorText}>{errors.lastname}</Text>}
                        </View>
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
                            {loadingCategories ? (
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
                        <Text style={styles.label}>Teléfono</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Número de contacto"
                            value={formData.phone}
                            onChangeText={(text) => setFormData({ ...formData, phone: text })}
                            keyboardType="phone-pad"
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
                                value={formData.emergency_contact}
                                onChangeText={(text) => setFormData({ ...formData, emergency_contact: text })}
                            />
                        </View>
                        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.label}>Teléfono de Emergencia</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Teléfono de emergencia"
                                value={formData.emergency_phone}
                                onChangeText={(text) => setFormData({ ...formData, emergency_phone: text })}
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
});