// Encargado: Usuarios - Formulario
// Descripción: Formulario para crear/editar usuarios (validaciones y envío al API)
// Archivo: src/presentation/views/users/UserFormScreen.tsx
// ============================================
// src/presentation/views/users/UserFormScreen.tsx
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
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/RootStackParamList';
import { MyColors } from '../../theme/AppTheme';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';
import { useAuth } from '../../../hooks/useAuth';
import { SaveUserLocalUseCase } from '../../../domain/useCases/userLocal/SaveUserLocal';
import { getFieldValidationError } from '../../../utils/validators';

type UserFormRouteProp = RouteProp<RootStackParamList, 'UserForm'>;

const isValidIsoDate = (value: string) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return false;
    const [, yearText, monthText, dayText] = match;
    const year = Number(yearText);
    const month = Number(monthText);
    const day = Number(dayText);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

const formatIsoDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const parseIsoDate = (value: string) => {
    if (!isValidIsoDate(value)) return new Date();
    return new Date(`${value}T00:00:00`);
};

interface FormData {
    name: string;
    lastname: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    role: string;
    user_type: 'student' | 'parent';
    document: string;
    birth_date: string;
    address: string;
    occupation: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    category_id: string;
}

export const UserFormScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<UserFormRouteProp>();
    const { user, mode } = route.params || { mode: 'create' };
    const { user: currentUser, checkAuth } = useAuth();
    const editingUser = user || currentUser;
    
    const [formData, setFormData] = useState<FormData>({
        name: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        role: 'user',
        user_type: 'student',
        document: '',
        birth_date: '',
        address: '',
        occupation: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        category_id: ''
    });
    const [categories, setCategories] = useState<any[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // ============================================
    // CARGAR CATEGORÍAS (mismo endpoint que ya usa
    // CategoriesScreen y StudentFormScreen)
    // ============================================
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await ApiDelivery.get('/categories');
                // El backend envuelve la respuesta como { success, message, data }.
                const categoriesData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
                setCategories(categoriesData);
            } catch (error) {
                console.error('Error loading categories:', error);
            } finally {
                setLoadingCategories(false);
            }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        const editingUser = user || currentUser;
        console.log('UserForm init - route.user:', user ? 'si' : 'no', ' currentUser:', currentUser ? 'si' : 'no', ' mode:', mode);
        if (editingUser && mode === 'edit') {
            setFormData({
                name: editingUser.name || '',
                lastname: editingUser.lastname || '',
                email: editingUser.email || '',
                password: '',
                confirmPassword: '',
                phone: editingUser.phone || '',
                role: editingUser.role || 'user',
                user_type: editingUser.user_type === 'parent' ? 'parent' : 'student',
                document: editingUser.document || '',
                birth_date: editingUser.birth_date || '',
                address: editingUser.address || '',
                occupation: editingUser.occupation || '',
                emergency_contact_name: editingUser.emergency_contact_name || '',
                emergency_contact_phone: editingUser.emergency_contact_phone || '',
                category_id: editingUser.category_id ? String(editingUser.category_id) : ''
            });
        }
    }, [user, mode]);

    const updateField = (field: keyof FormData, value: string) => {
        setFormData((previous) => ({ ...previous, [field]: value }));
        setErrors((previous) => {
            const next = { ...previous };
            delete next[field];
            if (field === 'birth_date') delete next.category_id;
            return next;
        });
    };

    const handleBirthDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (Platform.OS === 'android') setShowBirthDatePicker(false);
        if (event.type === 'set' && selectedDate) {
            updateField('birth_date', formatIsoDate(selectedDate));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        } else if (getFieldValidationError('name', formData.name)) {
            newErrors.name = getFieldValidationError('name', formData.name);
        }
        if (formData.lastname && getFieldValidationError('name', formData.lastname)) {
            newErrors.lastname = getFieldValidationError('name', formData.lastname);
        }
        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }
        if (formData.phone && getFieldValidationError('phone', formData.phone)) {
            newErrors.phone = getFieldValidationError('phone', formData.phone);
        }
        if (mode === 'create' && formData.role === 'user') {
            if (!formData.document.trim()) {
                newErrors.document = 'El documento es requerido';
            } else if (getFieldValidationError('document', formData.document)) {
                newErrors.document = getFieldValidationError('document', formData.document);
            }

            if (formData.user_type === 'student') {
                if (!isValidIsoDate(formData.birth_date)) {
                    newErrors.birth_date = 'Ingresa la fecha con formato AAAA-MM-DD';
                } else {
                    const birthYear = Number(formData.birth_date.slice(0, 4));
                    const selectedCategory = categories.find((category) => String(category.id) === formData.category_id);
                    if (!formData.category_id) {
                        newErrors.category_id = 'Selecciona una categoría';
                    } else if (Number(selectedCategory?.category_year) !== birthYear) {
                        newErrors.category_id = `Selecciona la categoría ${birthYear}`;
                    }
                }

                if (formData.emergency_contact_name && getFieldValidationError('name', formData.emergency_contact_name)) {
                    newErrors.emergency_contact_name = getFieldValidationError('name', formData.emergency_contact_name);
                }
                if (formData.emergency_contact_phone && getFieldValidationError('phone', formData.emergency_contact_phone)) {
                    newErrors.emergency_contact_phone = getFieldValidationError('phone', formData.emergency_contact_phone);
                }
            }
        }
        if (mode === 'create') {
            if (!formData.password) {
                newErrors.password = 'La contraseña es requerida';
            } else if (formData.password.length < 6) {
                newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
            }
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Las contraseñas no coinciden';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const payload = {
                name: formData.name,
                lastname: formData.lastname,
                email: formData.email,
                phone: formData.phone || '',
                role: formData.role,
                category_id: formData.category_id ? Number(formData.category_id) : null,
                ...(mode === 'create' && {
                    password: formData.password,
                    user_type: formData.role === 'user' ? formData.user_type : 'none',
                    ...(formData.role === 'user' && {
                        document: formData.document.trim(),
                        birth_date: formData.user_type === 'student' ? formData.birth_date : null,
                        address: formData.address || null,
                        occupation: formData.user_type === 'parent' ? formData.occupation || null : null,
                        emergency_contact_name: formData.user_type === 'student' ? formData.emergency_contact_name || null : null,
                        emergency_contact_phone: formData.user_type === 'student' ? formData.emergency_contact_phone || null : null,
                        category_id: formData.user_type === 'student' ? Number(formData.category_id) : null
                    })
                })
            };

            let response;
            if (mode === 'create') {
                response = await ApiDelivery.post('/users/create', payload);
            } else {
                const editingUser = user || currentUser;
                if (!editingUser) {
                    throw new Error('Usuario no encontrado');
                }

                // Construir payload de envío
                const sendPayload: any = { ...payload, id: editingUser.id };

                // Si edita su propio perfil, quitar role para evitar rechazos del backend
                if (currentUser && editingUser.id === currentUser.id) {
                    delete sendPayload.role;
                }

                // Si el usuario que realiza la edición NO es admin, impedir cambiar roles
                if (currentUser && currentUser.role !== 'admin') {
                    delete sendPayload.role;
                }

                response = await ApiDelivery.put('/users', sendPayload);
            }

            if (response.data?.success !== false) {
                // Si el usuario editado es el actual, actualizar almacenamiento local y contexto
                const updated = response.data?.data;
                if (mode === 'edit' && updated && currentUser && updated.id === currentUser.id) {
                    try {
                        await SaveUserLocalUseCase({
                            id: updated.id,
                            name: updated.name || formData.name,
                            lastname: updated.lastname || formData.lastname,
                            email: updated.email || formData.email,
                            password: currentUser.password || '',
                            phone: updated.phone || formData.phone || '',
                            role: updated.role || formData.role || currentUser.role,
                            image: updated.image || currentUser.image || '',
                            session_token: currentUser.session_token || ''
                        } as any);
                        // Refrescar contexto de autenticación
                        await checkAuth();
                    } catch (err) {
                        console.warn('No se pudo actualizar usuario local:', err);
                    }
                }

                Alert.alert(
                    'Éxito',
                    mode === 'create' ? 'Usuario creado correctamente' : 'Usuario actualizado correctamente',
                    [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
            } else {
                Alert.alert('Error', response.data?.message || 'No se pudo guardar el usuario');
            }
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Error al guardar el usuario');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Eliminar Usuario',
            `¿Estás seguro de eliminar a "${user?.name}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        if (!user) {
                            setLoading(false);
                            Alert.alert('Error', 'Usuario no encontrado');
                            return;
                        }
                        setLoading(true);
                        try {
                            await ApiDelivery.delete(`/users/delete/${user.id}`);
                            Alert.alert('Éxito', 'Usuario eliminado correctamente');
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar el usuario');
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Rol *</Text>
                        {mode === 'edit' && editingUser && currentUser && editingUser.id === currentUser.id ? (
                            <View style={{ paddingVertical: 8 }}>
                                <Text style={{ fontSize: 15, fontWeight: '600' }}>
                                    {editingUser.role === 'admin' ? 'Administrador' : editingUser.role === 'seller' ? 'Moderador' : 'Usuario'}
                                </Text>
                                <Text style={{ color: '#888', marginTop: 6 }}>El rol no puede ser modificado desde el perfil.</Text>
                            </View>
                        ) : (
                            <View style={styles.roleContainer}>
                                {['user', 'seller', 'admin'].map((role) => (
                                    <TouchableOpacity
                                        key={role}
                                        style={[styles.roleOption, formData.role === role && styles.roleOptionSelected]}
                                        onPress={() => {
                                            setFormData({ ...formData, role, category_id: role === 'user' ? formData.category_id : '' });
                                            setErrors({});
                                        }}
                                        disabled={role === 'admin' && currentUser?.role !== 'admin'}
                                    >
                                        <Text style={[
                                            styles.roleOptionText,
                                            formData.role === role && styles.roleOptionTextSelected,
                                            role === 'admin' && currentUser?.role !== 'admin' ? { color: '#aaa' } : {}
                                        ]}>
                                            {role === 'admin' ? 'Administrador' : role === 'seller' ? 'Moderador' : 'Usuario'}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {mode === 'create' && formData.role === 'user' && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Tipo de usuario *</Text>
                            <View style={styles.roleContainer}>
                                {(['student', 'parent'] as const).map((userType) => (
                                    <TouchableOpacity
                                        key={userType}
                                        style={[styles.roleOption, formData.user_type === userType && styles.roleOptionSelected]}
                                        onPress={() => {
                                            setFormData({ ...formData, user_type: userType, category_id: '' });
                                            setErrors({});
                                        }}
                                    >
                                        <Text style={[styles.roleOptionText, formData.user_type === userType && styles.roleOptionTextSelected]}>
                                            {userType === 'student' ? 'Estudiante' : 'Padre'}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nombres *</Text>
                        <TextInput
                            style={[styles.input, (errors.name || getFieldValidationError('name', formData.name)) && styles.inputError]}
                            placeholder="Nombre completo"
                            value={formData.name}
                            onChangeText={(text) => updateField('name', text)}
                        />
                        {(errors.name || getFieldValidationError('name', formData.name)) && <Text style={styles.errorText}>{errors.name || getFieldValidationError('name', formData.name)}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Apellidos</Text>
                        <TextInput
                            style={[styles.input, (errors.lastname || getFieldValidationError('name', formData.lastname)) && styles.inputError]}
                            placeholder="Apellido"
                            value={formData.lastname}
                            onChangeText={(text) => updateField('lastname', text)}
                        />
                        {(errors.lastname || getFieldValidationError('name', formData.lastname)) && <Text style={styles.errorText}>{errors.lastname || getFieldValidationError('name', formData.lastname)}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Correo Electrónico *</Text>
                        <TextInput
                            style={[styles.input, (errors.email || getFieldValidationError('email', formData.email)) && styles.inputError]}
                            placeholder="usuario@ejemplo.com"
                            value={formData.email}
                            onChangeText={(text) => updateField('email', text)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {(errors.email || getFieldValidationError('email', formData.email)) && <Text style={styles.errorText}>{errors.email || getFieldValidationError('email', formData.email)}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Teléfono</Text>
                        <TextInput
                            style={[styles.input, (errors.phone || getFieldValidationError('phone', formData.phone)) && styles.inputError]}
                            placeholder="Número de contacto"
                            value={formData.phone}
                            onChangeText={(text) => updateField('phone', text)}
                            keyboardType="phone-pad"
                        />
                        {(errors.phone || getFieldValidationError('phone', formData.phone)) && <Text style={styles.errorText}>{errors.phone || getFieldValidationError('phone', formData.phone)}</Text>}
                    </View>

                    {mode === 'create' && formData.role === 'user' && (
                        <>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Documento *</Text>
                                <TextInput
                                    style={[styles.input, (errors.document || getFieldValidationError('document', formData.document)) && styles.inputError]}
                                    placeholder="Número de identificación"
                                    value={formData.document}
                                    onChangeText={(text) => updateField('document', text)}
                                    keyboardType="number-pad"
                                />
                                {(errors.document || getFieldValidationError('document', formData.document)) && <Text style={styles.errorText}>{errors.document || getFieldValidationError('document', formData.document)}</Text>}
                            </View>

                            {formData.user_type === 'parent' ? (
                                <>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Ocupación</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Ej: Docente"
                                            value={formData.occupation}
                                            onChangeText={(text) => updateField('occupation', text)}
                                        />
                                    </View>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Dirección</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Dirección de residencia"
                                            value={formData.address}
                                            onChangeText={(text) => updateField('address', text)}
                                        />
                                    </View>
                                </>
                            ) : (
                                <>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Fecha de nacimiento *</Text>
                                        <TouchableOpacity
                                            style={[styles.input, styles.dateInput, errors.birth_date && styles.inputError]}
                                            onPress={() => setShowBirthDatePicker(true)}
                                            accessibilityRole="button"
                                            accessibilityLabel="Seleccionar fecha de nacimiento"
                                        >
                                            <Text style={formData.birth_date ? styles.dateInputText : styles.dateInputPlaceholder}>
                                                {formData.birth_date || 'Seleccionar fecha'}
                                            </Text>
                                            <Ionicons name="calendar-outline" size={20} color={MyColors.primary} />
                                        </TouchableOpacity>
                                        {errors.birth_date && <Text style={styles.errorText}>{errors.birth_date}</Text>}
                                        {showBirthDatePicker && (
                                            <>
                                                <DateTimePicker
                                                    value={parseIsoDate(formData.birth_date)}
                                                    mode="date"
                                                    display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                                                    maximumDate={new Date()}
                                                    onChange={handleBirthDateChange}
                                                />
                                                {Platform.OS === 'ios' && (
                                                    <TouchableOpacity
                                                        style={styles.datePickerDone}
                                                        onPress={() => setShowBirthDatePicker(false)}
                                                    >
                                                        <Text style={styles.datePickerDoneText}>Listo</Text>
                                                    </TouchableOpacity>
                                                )}
                                            </>
                                        )}
                                    </View>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Categoría (año de nacimiento) *</Text>
                                        <View style={styles.categoryContainer}>
                                            {loadingCategories ? (
                                                <ActivityIndicator color={MyColors.primary} />
                                            ) : categories.map((category) => (
                                                <TouchableOpacity
                                                    key={category.id}
                                                    style={[styles.categoryOption, formData.category_id === String(category.id) && styles.categoryOptionSelected]}
                                                    onPress={() => updateField('category_id', String(category.id))}
                                                >
                                                    <Text style={[styles.categoryOptionText, formData.category_id === String(category.id) && styles.categoryOptionTextSelected]}>
                                                        {category.category_year}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                        {errors.category_id && <Text style={styles.errorText}>{errors.category_id}</Text>}
                                    </View>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Dirección</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Dirección de residencia"
                                            value={formData.address}
                                            onChangeText={(text) => updateField('address', text)}
                                        />
                                    </View>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Contacto de emergencia</Text>
                                        <TextInput
                                            style={[styles.input, (errors.emergency_contact_name || getFieldValidationError('name', formData.emergency_contact_name)) && styles.inputError]}
                                            placeholder="Nombre del contacto"
                                            value={formData.emergency_contact_name}
                                            onChangeText={(text) => updateField('emergency_contact_name', text)}
                                        />
                                        {(errors.emergency_contact_name || getFieldValidationError('name', formData.emergency_contact_name)) && <Text style={styles.errorText}>{errors.emergency_contact_name || getFieldValidationError('name', formData.emergency_contact_name)}</Text>}
                                    </View>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Teléfono de emergencia</Text>
                                        <TextInput
                                            style={[styles.input, (errors.emergency_contact_phone || getFieldValidationError('phone', formData.emergency_contact_phone)) && styles.inputError]}
                                            placeholder="Número de emergencia"
                                            value={formData.emergency_contact_phone}
                                            onChangeText={(text) => updateField('emergency_contact_phone', text)}
                                            keyboardType="phone-pad"
                                        />
                                        {(errors.emergency_contact_phone || getFieldValidationError('phone', formData.emergency_contact_phone)) && <Text style={styles.errorText}>{errors.emergency_contact_phone || getFieldValidationError('phone', formData.emergency_contact_phone)}</Text>}
                                    </View>
                                </>
                            )}
                        </>
                    )}

                    {mode === 'create' && (
                        <>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Contraseña *</Text>
                                <TextInput
                                    style={[styles.input, errors.password && styles.inputError]}
                                    placeholder="Mínimo 6 caracteres"
                                    value={formData.password}
                                    onChangeText={(text) => updateField('password', text)}
                                    secureTextEntry
                                />
                                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Confirmar Contraseña *</Text>
                                <TextInput
                                    style={[styles.input, errors.confirmPassword && styles.inputError]}
                                    placeholder="Repite tu contraseña"
                                    value={formData.confirmPassword}
                                    onChangeText={(text) => updateField('confirmPassword', text)}
                                    secureTextEntry
                                />
                                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                            </View>
                        </>
                    )}

                    {/* ============================================
                        CATEGORÍA (AÑO) — mismo patron visual de chips
                        que ya usa StudentFormScreen para consistencia.
                        Solo aplica a estudiantes (role === 'user'):
                        un admin o moderador no pertenece a una categoria.
                        ============================================ */}
                    {mode === 'edit' && formData.role === 'user' && (
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Categoría (Año)</Text>
                        <View style={styles.categoryContainer}>
                            {loadingCategories ? (
                                <ActivityIndicator color={MyColors.primary} />
                            ) : (
                                <>
                                    <TouchableOpacity
                                        style={[
                                            styles.categoryOption,
                                            formData.category_id === '' && styles.categoryOptionSelected
                                        ]}
                                        onPress={() => updateField('category_id', '')}
                                    >
                                        <Text style={[
                                            styles.categoryOptionText,
                                            formData.category_id === '' && styles.categoryOptionTextSelected
                                        ]}>
                                            Sin categoría
                                        </Text>
                                    </TouchableOpacity>
                                    {categories.map((cat) => (
                                        <TouchableOpacity
                                            key={cat.id}
                                            style={[
                                                styles.categoryOption,
                                                formData.category_id === String(cat.id) && styles.categoryOptionSelected
                                            ]}
                                            onPress={() => updateField('category_id', String(cat.id))}
                                        >
                                            <Text style={[
                                                styles.categoryOptionText,
                                                formData.category_id === String(cat.id) && styles.categoryOptionTextSelected
                                            ]}>
                                                {cat.category_year}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </>
                            )}
                        </View>
                    </View>
                    )}

                    <TouchableOpacity
                        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitButtonText}>
                                {mode === 'create' ? 'Crear Usuario' : 'Actualizar Usuario'}
                            </Text>
                        )}
                    </TouchableOpacity>

                    {mode === 'edit' && editingUser && currentUser && editingUser.id !== currentUser.id && (
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={handleDelete}
                            disabled={loading}
                        >
                            <Ionicons name="trash-outline" size={20} color="#dc3545" />
                            <Text style={styles.deleteButtonText}>Eliminar Usuario</Text>
                        </TouchableOpacity>
                    )}
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
    dateInput: {
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dateInputText: {
        color: '#333',
        fontSize: 15,
    },
    dateInputPlaceholder: {
        color: '#777',
        fontSize: 15,
    },
    datePickerDone: {
        alignSelf: 'flex-end',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    datePickerDoneText: {
        color: MyColors.primary,
        fontSize: 15,
        fontWeight: '700',
    },
    errorText: {
        color: '#dc3545',
        fontSize: 12,
        marginTop: 4,
    },
    roleContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    roleOption: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        marginRight: 8,
    },
    roleOptionSelected: {
        backgroundColor: MyColors.primary,
        borderColor: MyColors.primary,
    },
    roleOptionText: {
        fontSize: 13,
        color: '#666',
    },
    roleOptionTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryOption: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f8f9fa',
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
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#dc3545',
        borderRadius: 8,
    },
    deleteButtonText: {
        color: '#dc3545',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
});