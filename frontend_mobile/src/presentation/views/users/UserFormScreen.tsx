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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/RootStackParamList';
import { MyColors } from '../../theme/AppTheme';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';
import { useAuth } from '../../../hooks/useAuth';
import { SaveUserLocalUseCase } from '../../../domain/useCases/userLocal/SaveUserLocal';

type UserFormRouteProp = RouteProp<RootStackParamList, 'UserForm'>;

interface FormData {
    name: string;
    lastname: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    role: string;
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
        category_id: ''
    });
    const [categories, setCategories] = useState<any[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loading, setLoading] = useState(false);
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
                category_id: editingUser.category_id ? String(editingUser.category_id) : ''
            });
        }
    }, [user, mode]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
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
                ...(mode === 'create' && { password: formData.password })
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
                        <Text style={styles.label}>Nombres *</Text>
                        <TextInput
                            style={[styles.input, errors.name && styles.inputError]}
                            placeholder="Nombre completo"
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                        />
                        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Apellidos</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Apellido"
                            value={formData.lastname}
                            onChangeText={(text) => setFormData({ ...formData, lastname: text })}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Correo Electrónico *</Text>
                        <TextInput
                            style={[styles.input, errors.email && styles.inputError]}
                            placeholder="usuario@ejemplo.com"
                            value={formData.email}
                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
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

                    {mode === 'create' && (
                        <>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Contraseña *</Text>
                                <TextInput
                                    style={[styles.input, errors.password && styles.inputError]}
                                    placeholder="Mínimo 6 caracteres"
                                    value={formData.password}
                                    onChangeText={(text) => setFormData({ ...formData, password: text })}
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
                                    onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                                    secureTextEntry
                                />
                                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                            </View>
                        </>
                    )}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Rol</Text>
                        {mode === 'edit' && editingUser && currentUser && editingUser.id === currentUser.id ? (
                            <View style={{ paddingVertical: 8 }}>
                                <Text style={{ fontSize: 15, fontWeight: '600' }}>{
                                    editingUser.role === 'admin' ? 'Administrador' : editingUser.role === 'seller' ? 'Moderador' : 'Usuario'
                                }</Text>
                                <Text style={{ color: '#888', marginTop: 6 }}>El rol no puede ser modificado desde el perfil.</Text>
                            </View>
                        ) : (
                            <View style={styles.roleContainer}>
                                {['user', 'seller', 'admin'].map((role) => (
                                    <TouchableOpacity
                                        key={role}
                                        style={[
                                            styles.roleOption,
                                            formData.role === role && styles.roleOptionSelected
                                        ]}
                                        onPress={() => setFormData({ ...formData, role, category_id: role === 'user' ? formData.category_id : '' })}
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

                    {/* ============================================
                        CATEGORÍA (AÑO) — mismo patron visual de chips
                        que ya usa StudentFormScreen para consistencia.
                        Solo aplica a estudiantes (role === 'user'):
                        un admin o moderador no pertenece a una categoria.
                        ============================================ */}
                    {formData.role === 'user' && (
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
                                        onPress={() => setFormData({ ...formData, category_id: '' })}
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