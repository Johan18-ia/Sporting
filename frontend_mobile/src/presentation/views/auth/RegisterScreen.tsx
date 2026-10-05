// src/presentation/views/auth/RegisterScreen.tsx
// Encargado: Registro de Usuario
// Descripción: Pantalla para crear cuentas nuevas y validación inicial
// Archivo: src/presentation/views/auth/RegisterScreen.tsx
// ============================================
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/RootStackParamList';
import { useAuth } from '../../../hooks/useAuth';
import { MyColors } from '../../theme/AppTheme';
import { Ionicons } from '@expo/vector-icons';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

export const RegisterScreen = () => {
    const navigation = useNavigation<RegisterScreenNavigationProp>();
    const { register, loading } = useAuth();
    
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        document: '',
        birth_date: '',
        address: '',
        occupation: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        user_type: 'student',
        category_id: '',
    });
    const [categories, setCategories] = useState<any[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await ApiDelivery.get('/categories');
                const list = Array.isArray(response?.data) ? response.data : response?.data?.data || [];
                setCategories(list);
            } catch (err) {
                console.warn('No se pudieron cargar categorías para registro:', err);
            }
        };
        loadCategories();
    }, []);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (error) setError('');
    };

    const handleRegister = async () => {
        // Normalizar y validar
        const name = (formData.name || '').trim();
        const lastname = (formData.lastname || '').trim();
        const email = (formData.email || '').trim().toLowerCase();
        const password = formData.password || '';
        const confirmPassword = formData.confirmPassword || '';
        const phone = (formData.phone || '').trim();
        const document = (formData.document || '').trim();
        const birthDate = (formData.birth_date || '').trim();
        const address = (formData.address || '').trim();
        const occupation = (formData.occupation || '').trim();
        const emergencyName = (formData.emergency_contact_name || '').trim();
        const emergencyPhone = (formData.emergency_contact_phone || '').trim();
        const userType = formData.user_type === 'parent' ? 'parent' : 'student';

        if (!name || !email || !password) {
            setError('Por favor complete todos los campos obligatorios');
            return;
        }

        if (!document) {
            setError(userType === 'student' ? 'El documento del estudiante es obligatorio' : 'El documento del padre es obligatorio');
            return;
        }

        if (userType === 'student' && !birthDate) {
            setError('La fecha de nacimiento del estudiante es obligatoria');
            return;
        }

        if (userType === 'student' && !formData.category_id) {
            setError('Debe seleccionar una categoría para el estudiante');
            return;
        }

        if (!address) {
            setError('La dirección es obligatoria');
            return;
        }

        if (userType === 'student' && (!emergencyName || !emergencyPhone)) {
            setError('Debe completar el contacto y teléfono de emergencia');
            return;
        }

        // Formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Por favor ingrese un correo electrónico válido');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        const payload = {
            name,
            lastname,
            email,
            password,
            confirmPassword,
            phone,
            document,
            birth_date: birthDate || null,
            address,
            occupation: occupation || null,
            emergency_contact_name: emergencyName || null,
            emergency_contact_phone: emergencyPhone || null,
            category_id: userType === 'student' && formData.category_id ? Number(formData.category_id) : null,
            role: 'user',
            user_type: userType
        };

        const result = await register(payload as any);
        if (result.success) {
            Alert.alert('Registro exitoso', 'Cuenta creada correctamente. Ahora puedes iniciar sesión.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } else {
            const err = (result.error || '').toLowerCase();
            if (err.includes('email') && (err.includes('existe') || err.includes('duplicate') || err.includes('ya registrada'))) {
                setError('El correo electrónico ya está registrado');
            } else if (err.includes('document') || err.includes('dni') || err.includes('cedula')) {
                setError('El número de documento ya está registrado');
            } else {
                setError(result.error || 'Error al registrar usuario');
            }
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={MyColors.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Crear Cuenta</Text>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../../../assets/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.logoText}>SPORTING</Text>
                </View>

                {error && (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={20} color="#dc3545" />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tipo de usuario *</Text>
                        <View style={styles.radioRow}>
                            <TouchableOpacity
                                style={[styles.radioOption, formData.user_type === 'student' && styles.radioOptionSelected]}
                                onPress={() => handleChange('user_type', 'student')}
                            >
                                <Text style={[styles.radioText, formData.user_type === 'student' && styles.radioTextSelected]}>Estudiante</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.radioOption, formData.user_type === 'parent' && styles.radioOptionSelected]}
                                onPress={() => handleChange('user_type', 'parent')}
                            >
                                <Text style={[styles.radioText, formData.user_type === 'parent' && styles.radioTextSelected]}>Padre</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.label}>Nombres *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Tu nombre"
                                value={formData.name}
                                onChangeText={(value) => handleChange('name', value)}
                            />
                        </View>
                        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.label}>Apellidos</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Tu apellido"
                                value={formData.lastname}
                                onChangeText={(value) => handleChange('lastname', value)}
                            />
                        </View>
                    </View>

                    {formData.user_type === 'student' ? (
                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                <Text style={styles.label}>Documento *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Documento"
                                    value={formData.document}
                                    onChangeText={(value) => handleChange('document', value)}
                                    keyboardType="number-pad"
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                <Text style={styles.label}>Fecha de nacimiento *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="YYYY-MM-DD"
                                    value={formData.birth_date}
                                    onChangeText={(value) => handleChange('birth_date', value)}
                                />
                            </View>
                        </View>
                    ) : (
                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                <Text style={styles.label}>Documento del padre *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Documento"
                                    value={formData.document}
                                    onChangeText={(value) => handleChange('document', value)}
                                    keyboardType="number-pad"
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                <Text style={styles.label}>Ocupación</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej: Empresario"
                                    value={formData.occupation}
                                    onChangeText={(value) => handleChange('occupation', value)}
                                />
                            </View>
                        </View>
                    )}

                    {formData.user_type === 'student' && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Categoría *</Text>
                            <View style={styles.pickerWrap}>
                                {categories.map((category) => (
                                    <TouchableOpacity
                                        key={category.id}
                                        style={[styles.optionButton, formData.category_id === String(category.id) && styles.optionButtonSelected]}
                                        onPress={() => handleChange('category_id', String(category.id))}
                                    >
                                        <Text style={[styles.optionButtonText, formData.category_id === String(category.id) && styles.optionButtonTextSelected]}>
                                            {category.category_year || category.name || category.description || `Categoría ${category.id}`}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Correo Electrónico *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="usuario@ejemplo.com"
                            value={formData.email}
                            onChangeText={(value) => handleChange('email', value)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Teléfono</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Número de contacto"
                            value={formData.phone}
                            onChangeText={(value) => handleChange('phone', value)}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Dirección *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Dirección principal"
                            value={formData.address}
                            onChangeText={(value) => handleChange('address', value)}
                        />
                    </View>

                    {formData.user_type === 'student' && (
                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                <Text style={styles.label}>Contacto de emergencia *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nombre"
                                    value={formData.emergency_contact_name}
                                    onChangeText={(value) => handleChange('emergency_contact_name', value)}
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                <Text style={styles.label}>Tel. emergencia *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Número"
                                    value={formData.emergency_contact_phone}
                                    onChangeText={(value) => handleChange('emergency_contact_phone', value)}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>
                    )}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Contraseña *</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Mínimo 6 caracteres"
                                value={formData.password}
                                onChangeText={(value) => handleChange('password', value)}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    size={24}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirmar Contraseña *</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Repite tu contraseña"
                                value={formData.confirmPassword}
                                onChangeText={(value) => handleChange('confirmPassword', value)}
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <Ionicons
                                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                                    size={24}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.registerButtonText}>Registrarse</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.loginLink}>Inicia sesión aquí</Text>
                        </TouchableOpacity>
                    </View>
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
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 80,
        height: 80,
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: MyColors.primary,
        marginTop: 4,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8d7da',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#f5c6cb',
    },
    errorText: {
        color: '#721c24',
        marginLeft: 8,
        fontSize: 14,
        flex: 1,
    },
    form: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    radioRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
    },
    radioOption: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d9d9d9',
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
    },
    radioOptionSelected: {
        borderColor: MyColors.primary,
        backgroundColor: '#fff2f2',
    },
    radioText: {
        color: '#444',
        fontWeight: '600',
    },
    radioTextSelected: {
        color: MyColors.primary,
    },
    inputGroup: {
        marginBottom: 14,
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
    pickerWrap: {
        gap: 8,
    },
    optionButton: {
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    optionButtonSelected: {
        borderColor: MyColors.primary,
        backgroundColor: '#fff2f2',
    },
    optionButtonText: {
        color: '#333',
        fontWeight: '600',
    },
    optionButtonTextSelected: {
        color: MyColors.primary,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 15,
    },
    eyeButton: {
        paddingHorizontal: 12,
    },
    registerButton: {
        backgroundColor: MyColors.primary,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 8,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    loginText: {
        color: '#666',
        fontSize: 14,
    },
    loginLink: {
        color: MyColors.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
});