// src/presentation/views/auth/RegisterScreen.tsx
// Encargado: Registro de Usuario
// Descripción: Pantalla para crear cuentas nuevas y validación inicial
// Archivo: src/presentation/views/auth/RegisterScreen.tsx
// ============================================
import React, { useState, useEffect, useMemo } from 'react';
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
    Alert,
    Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/RootStackParamList';
import { useAuth } from '../../../hooks/useAuth';
import { MyColors } from '../../theme/AppTheme';
import { Ionicons } from '@expo/vector-icons';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const formatDateForForm = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const parseFormDate = (value: string) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return new Date();

    const [, year, month, day] = match;
    return new Date(Number(year), Number(month) - 1, Number(day));
};

const hasInvalidNameCharacters = (value: string) => /[^A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\u0300-\u036F '\u2019-]/.test(value);
const hasInvalidDocumentCharacters = (value: string) => /[^0-9]/.test(value);
const hasInvalidPhone = (value: string) => Boolean(value) && !/^\d{7,15}$/.test(value);
const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validName = /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\u0300-\u036F]+(?:[ '\u2019-][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\u0300-\u036F]+)*$/;

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
    });
    const [categories, setCategories] = useState<any[]>([]);
    const [categoriesLoaded, setCategoriesLoaded] = useState(false);
    const [categoriesLoadError, setCategoriesLoadError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateDraft, setDateDraft] = useState(new Date());
    const [calendarMonth, setCalendarMonth] = useState(new Date());
    const [showYearList, setShowYearList] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await ApiDelivery.get('/categories');
                const list = Array.isArray(response?.data) ? response.data : response?.data?.data || [];
                setCategories(list);
            } catch (err) {
                console.warn('No se pudieron cargar categorías para registro:', err);
                setCategoriesLoadError(true);
            } finally {
                setCategoriesLoaded(true);
            }
        };
        loadCategories();
    }, []);

    // Deriva el año de nacimiento y busca la categoría que le corresponde.
    const birthYear = useMemo(() => {
        if (!formData.birth_date) return null;
        const year = formData.birth_date.slice(0, 4);
        return /^\d{4}$/.test(year) ? year : null;
    }, [formData.birth_date]);

    const autoCategory = useMemo(() => {
        if (!birthYear || !categories.length) return null;
        return categories.find(
            category => String(category.category_year || category.name_year) === birthYear
        ) || null;
    }, [birthYear, categories]);

    const autoCategoryId = autoCategory?.id == null ? '' : String(autoCategory.id);
    const autoCategoryYear = autoCategory?.category_year || autoCategory?.name_year;
    const autoCategoryLabel = autoCategory ? `Categoría ${autoCategoryYear}` : '';

    const calendarDays = useMemo(() => {
        const year = calendarMonth.getFullYear();
        const month = calendarMonth.getMonth();
        const leadingDays = (new Date(year, month, 1).getDay() + 6) % 7;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return [
            ...Array.from({ length: leadingDays }, () => null),
            ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
        ];
    }, [calendarMonth]);

    const calendarYears = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: currentYear - 1899 }, (_, index) => currentYear - index);
    }, []);

    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const canShowNextMonth = calendarMonth < currentMonth;
    const monthLabel = calendarMonth.toLocaleDateString('es-ES', { month: 'long' });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (error) setError('');
    };

    const handleBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.replace('Welcome');
        }
    };

    const openBirthDatePicker = () => {
        const value = formData.birth_date ? parseFormDate(formData.birth_date) : new Date();
        setDateDraft(value);
        setCalendarMonth(new Date(value.getFullYear(), value.getMonth(), 1));
        setShowYearList(false);
        setShowDatePicker(true);
    };

    const confirmBirthDate = () => {
        handleChange('birth_date', formatDateForForm(dateDraft));
        setShowDatePicker(false);
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

        if (!validName.test(name)) {
            setError('El nombre solo puede contener letras, espacios, guiones y apóstrofes');
            return;
        }

        if (lastname && !validName.test(lastname)) {
            setError('El apellido solo puede contener letras, espacios, guiones y apóstrofes');
            return;
        }

        if (!validEmail.test(email)) {
            setError('Por favor ingrese un correo electrónico válido');
            return;
        }

        if (phone && hasInvalidPhone(phone)) {
            setError('El teléfono debe contener entre 7 y 15 números');
            return;
        }

        if (emergencyName && !validName.test(emergencyName)) {
            setError('El contacto de emergencia solo puede contener letras, espacios, guiones y apóstrofes');
            return;
        }

        if (emergencyPhone && hasInvalidPhone(emergencyPhone)) {
            setError('El teléfono de emergencia debe contener entre 7 y 15 números');
            return;
        }

        if (!document) {
            setError(userType === 'student' ? 'El documento del estudiante es obligatorio' : 'El documento del padre es obligatorio');
            return;
        }

        if (hasInvalidDocumentCharacters(document)) {
            setError('El documento solo puede contener números');
            return;
        }

        if (userType === 'student' && !birthDate) {
            setError('La fecha de nacimiento del estudiante es obligatoria');
            return;
        }

        if (userType === 'student') {
            if (!categoriesLoaded || categoriesLoadError) {
                setError('No se pudieron cargar las categorías. Inténtalo nuevamente.');
                return;
            }
            if (!birthYear || !autoCategoryId) {
                setError(`No existe una categoría para el año ${birthYear || 'indicado'}`);
                return;
            }
        }

        if (!address) {
            setError('La dirección es obligatoria');
            return;
        }

        if (userType === 'student' && (!emergencyName || !emergencyPhone)) {
            setError('Debe completar el contacto y teléfono de emergencia');
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
            category_id: userType === 'student' && autoCategoryId ? Number(autoCategoryId) : null,
            role: 'user',
            user_type: userType
        };

        // Registra el contenido enviado sin exponer credenciales en la consola.
        console.log('Payload de registro:', JSON.stringify({
            ...payload,
            password: '[REDACTED]',
            confirmPassword: '[REDACTED]',
        }, null, 2));
        console.log('Tipo de category_id:', typeof payload.category_id);

        const result = await register(payload as any);
        if (result.success) {
            Alert.alert('Registro exitoso', 'Cuenta creada correctamente. Ahora puedes iniciar sesión.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } else {
            const err = (result.error || '').toLowerCase();
            if (err.includes('email') && (err.includes('existe') || err.includes('duplicate') || err.includes('registrad'))) {
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
                    <TouchableOpacity
                        onPress={handleBack}
                        style={styles.backButton}
                        accessibilityRole="button"
                        accessibilityLabel="Volver"
                        hitSlop={12}
                    >
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
                                style={[styles.input, hasInvalidNameCharacters(formData.name) && styles.inputInvalid]}
                                placeholder="Tu nombre"
                                value={formData.name}
                                onChangeText={(value) => handleChange('name', value)}
                                autoCapitalize="words"
                                autoCorrect={false}
                                maxLength={80}
                            />
                            {hasInvalidNameCharacters(formData.name) && (
                                <Text style={styles.fieldErrorText}>No se permiten números ni caracteres especiales.</Text>
                            )}
                        </View>
                        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.label}>Apellidos</Text>
                            <TextInput
                                style={[styles.input, hasInvalidNameCharacters(formData.lastname) && styles.inputInvalid]}
                                placeholder="Tu apellido"
                                value={formData.lastname}
                                onChangeText={(value) => handleChange('lastname', value)}
                                autoCapitalize="words"
                                autoCorrect={false}
                                maxLength={80}
                            />
                            {hasInvalidNameCharacters(formData.lastname) && (
                                <Text style={styles.fieldErrorText}>No se permiten números ni caracteres especiales.</Text>
                            )}
                        </View>
                    </View>

                    {formData.user_type === 'student' ? (
                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                <Text style={styles.label}>Documento *</Text>
                                <TextInput
                                    style={[styles.input, hasInvalidDocumentCharacters(formData.document) && styles.inputInvalid]}
                                    placeholder="Documento"
                                    value={formData.document}
                                    onChangeText={(value) => handleChange('document', value)}
                                    keyboardType="number-pad"
                                />
                                {hasInvalidDocumentCharacters(formData.document) && (
                                    <Text style={styles.fieldErrorText}>No se permiten letras ni símbolos. Usa solo números.</Text>
                                )}
                            </View>
                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                <Text style={styles.label}>Fecha de nacimiento *</Text>
                                <TouchableOpacity
                                    style={styles.dateInput}
                                    onPress={openBirthDatePicker}
                                    accessibilityRole="button"
                                    accessibilityLabel="Seleccionar fecha de nacimiento"
                                >
                                    <Text
                                        numberOfLines={1}
                                        style={formData.birth_date ? styles.dateInputText : styles.dateInputPlaceholder}
                                    >
                                        {formData.birth_date || 'Elegir fecha'}
                                    </Text>
                                    <Ionicons name="calendar-outline" size={20} color={MyColors.primary} style={styles.dateInputIcon} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                <Text style={styles.label}>Documento del padre *</Text>
                                <TextInput
                                    style={[styles.input, hasInvalidDocumentCharacters(formData.document) && styles.inputInvalid]}
                                    placeholder="Documento"
                                    value={formData.document}
                                    onChangeText={(value) => handleChange('document', value)}
                                    keyboardType="number-pad"
                                />
                                {hasInvalidDocumentCharacters(formData.document) && (
                                    <Text style={styles.fieldErrorText}>No se permiten letras ni símbolos. Usa solo números.</Text>
                                )}
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
                            <Text style={styles.label}>Categoría asignada</Text>
                            <View style={styles.readonlyField}>
                                <Text style={styles.readonlyFieldText}>
                                    {autoCategoryLabel || 'Se asigna al ingresar la fecha de nacimiento'}
                                </Text>
                            </View>
                            {birthYear && categoriesLoaded && !categoriesLoadError && !autoCategoryId && (
                                <Text style={styles.hintError}>
                                    No existe una categoría para el año {birthYear}. Contacta al administrador.
                                </Text>
                            )}
                            {categoriesLoadError && (
                                <Text style={styles.hintError}>No se pudieron cargar las categorías.</Text>
                            )}
                        </View>
                    )}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Correo Electrónico *</Text>
                        <TextInput
                            style={[styles.input, formData.email.length > 0 && !validEmail.test(formData.email.trim()) && styles.inputInvalid]}
                            placeholder="usuario@ejemplo.com"
                            value={formData.email}
                            onChangeText={(value) => handleChange('email', value)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {formData.email.length > 0 && !validEmail.test(formData.email.trim()) && (
                            <Text style={styles.fieldErrorText}>Ingresa un correo electrónico válido.</Text>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Teléfono</Text>
                        <TextInput
                            style={[styles.input, hasInvalidPhone(formData.phone) && styles.inputInvalid]}
                            placeholder="Número de contacto"
                            value={formData.phone}
                            onChangeText={(value) => handleChange('phone', value)}
                            keyboardType="phone-pad"
                        />
                        {hasInvalidPhone(formData.phone) && (
                            <Text style={styles.fieldErrorText}>Usa entre 7 y 15 dígitos, sin letras ni símbolos.</Text>
                        )}
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
                                <Text style={styles.label}>Contacto emergencia *</Text>
                                <TextInput
                                    style={[styles.input, hasInvalidNameCharacters(formData.emergency_contact_name) && styles.inputInvalid]}
                                    placeholder="Nombre"
                                    value={formData.emergency_contact_name}
                                    onChangeText={(value) => handleChange('emergency_contact_name', value)}
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                />
                                {hasInvalidNameCharacters(formData.emergency_contact_name) && (
                                    <Text style={styles.fieldErrorText}>El contacto solo puede contener letras y separadores de nombres.</Text>
                                )}
                            </View>
                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                <Text style={styles.label}>Tel. emergencia *</Text>
                                <TextInput
                                    style={[styles.input, hasInvalidPhone(formData.emergency_contact_phone) && styles.inputInvalid]}
                                    placeholder="Número"
                                    value={formData.emergency_contact_phone}
                                    onChangeText={(value) => handleChange('emergency_contact_phone', value)}
                                    keyboardType="phone-pad"
                                />
                                {hasInvalidPhone(formData.emergency_contact_phone) && (
                                    <Text style={styles.fieldErrorText}>Usa entre 7 y 15 dígitos, sin letras ni símbolos.</Text>
                                )}
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

            <Modal
                visible={showDatePicker}
                transparent
                animationType="fade"
                onRequestClose={() => setShowDatePicker(false)}
            >
                <View style={styles.datePickerOverlay}>
                    <View style={styles.datePickerModal}>
                        <Text style={styles.datePickerTitle}>Fecha de nacimiento</Text>
                        <View style={styles.calendarHeader}>
                            <TouchableOpacity
                                style={styles.calendarNavButton}
                                onPress={() => setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                                accessibilityRole="button"
                                accessibilityLabel="Mes anterior"
                            >
                                <Ionicons name="chevron-back" size={20} color={MyColors.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.calendarMonthButton}
                                onPress={() => setShowYearList(prev => !prev)}
                                accessibilityRole="button"
                                accessibilityLabel="Seleccionar año"
                            >
                                <Text style={styles.calendarMonthText}>
                                    {monthLabel} {calendarMonth.getFullYear()}
                                </Text>
                                <Ionicons name={showYearList ? 'chevron-up' : 'chevron-down'} size={16} color={MyColors.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.calendarNavButton, !canShowNextMonth && styles.calendarNavButtonDisabled]}
                                disabled={!canShowNextMonth}
                                onPress={() => setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                                accessibilityRole="button"
                                accessibilityLabel="Mes siguiente"
                            >
                                <Ionicons name="chevron-forward" size={20} color={canShowNextMonth ? MyColors.primary : '#bbb'} />
                            </TouchableOpacity>
                        </View>

                        {showYearList ? (
                            <ScrollView style={styles.calendarYearList} contentContainerStyle={styles.calendarYearGrid}>
                                {calendarYears.map(year => (
                                    <TouchableOpacity
                                        key={year}
                                        style={[
                                            styles.calendarYearButton,
                                            year === calendarMonth.getFullYear() && styles.calendarYearButtonSelected,
                                        ]}
                                        onPress={() => {
                                            const selectedMonth = calendarMonth.getMonth();
                                            const nextMonth = new Date(year, selectedMonth, 1);
                                            setCalendarMonth(nextMonth > currentMonth ? currentMonth : nextMonth);
                                            setShowYearList(false);
                                        }}
                                    >
                                        <Text style={[
                                            styles.calendarYearText,
                                            year === calendarMonth.getFullYear() && styles.calendarYearTextSelected,
                                        ]}>
                                            {year}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        ) : (
                            <>
                                <View style={styles.calendarWeekdays}>
                                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((weekday, index) => (
                                        <Text key={`${weekday}-${index}`} style={styles.calendarWeekday}>
                                            {weekday}
                                        </Text>
                                    ))}
                                </View>
                                <View style={styles.calendarGrid}>
                                    {calendarDays.map((day, index) => {
                                        if (day === null) {
                                            return <View key={`empty-${index}`} style={styles.calendarDayCell} />;
                                        }

                                        const candidate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
                                        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                                        const isFuture = candidate > todayStart;
                                        const isSelected = candidate.getFullYear() === dateDraft.getFullYear() &&
                                            candidate.getMonth() === dateDraft.getMonth() &&
                                            candidate.getDate() === dateDraft.getDate();

                                        return (
                                            <TouchableOpacity
                                                key={`day-${day}`}
                                                style={[
                                                    styles.calendarDayCell,
                                                    isSelected && styles.calendarDaySelected,
                                                ]}
                                                disabled={isFuture}
                                                onPress={() => setDateDraft(candidate)}
                                                accessibilityRole="button"
                                                accessibilityLabel={`${day} de ${monthLabel} de ${calendarMonth.getFullYear()}`}
                                                accessibilityState={{ selected: isSelected, disabled: isFuture }}
                                            >
                                                <Text style={[
                                                    styles.calendarDayText,
                                                    isSelected && styles.calendarDayTextSelected,
                                                    isFuture && styles.calendarDayTextDisabled,
                                                ]}>
                                                    {day}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </>
                        )}

                        <View style={styles.datePickerActions}>
                            <TouchableOpacity
                                style={styles.datePickerAction}
                                onPress={() => setShowDatePicker(false)}
                            >
                                <Text style={styles.datePickerCancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.datePickerAction, styles.datePickerConfirm]}
                                onPress={confirmBirthDate}
                            >
                                <Text style={styles.datePickerConfirmText}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
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
    inputInvalid: {
        borderColor: '#dc3545',
        backgroundColor: '#fff5f5',
    },
    fieldErrorText: {
        color: '#b42318',
        fontSize: 12,
        marginTop: 4,
    },
    dateInput: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingLeft: 10,
        paddingRight: 18,
        backgroundColor: '#f8f9fa',
    },
    dateInputText: {
        flex: 1,
        fontSize: 15,
        color: '#333',
    },
    dateInputPlaceholder: {
        flex: 1,
        fontSize: 14,
        color: '#888',
    },
    dateInputIcon: {
        marginLeft: 6,
    },
    datePickerOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
    },
    datePickerModal: {
        width: '100%',
        maxWidth: 380,
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    datePickerTitle: {
        marginBottom: 8,
        color: '#333',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },
    calendarHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    calendarNavButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },
    calendarNavButtonDisabled: {
        opacity: 0.5,
    },
    calendarMonthButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    calendarMonthText: {
        color: '#333',
        fontSize: 15,
        fontWeight: '700',
        textTransform: 'capitalize',
    },
    calendarWeekdays: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    calendarWeekday: {
        width: '14.2857%',
        paddingVertical: 8,
        color: '#777',
        fontSize: 12,
        fontWeight: '700',
        textAlign: 'center',
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    calendarDayCell: {
        width: '14.2857%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
    },
    calendarDaySelected: {
        backgroundColor: MyColors.primary,
    },
    calendarDayText: {
        color: '#333',
        fontSize: 14,
    },
    calendarDayTextSelected: {
        color: '#fff',
        fontWeight: '700',
    },
    calendarDayTextDisabled: {
        color: '#bbb',
    },
    calendarYearList: {
        maxHeight: 300,
    },
    calendarYearGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    calendarYearButton: {
        width: '25%',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 8,
    },
    calendarYearButtonSelected: {
        backgroundColor: '#fff2f2',
    },
    calendarYearText: {
        color: '#444',
        fontSize: 14,
    },
    calendarYearTextSelected: {
        color: MyColors.primary,
        fontWeight: '700',
    },
    datePickerActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 8,
    },
    datePickerAction: {
        minWidth: 92,
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    datePickerConfirm: {
        backgroundColor: MyColors.primary,
    },
    datePickerCancelText: {
        color: '#555',
        fontSize: 14,
        fontWeight: '600',
    },
    datePickerConfirmText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    readonlyField: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: '#f0f0f0',
    },
    readonlyFieldText: {
        fontSize: 15,
        color: '#555',
    },
    hintError: {
        color: '#dc3545',
        fontSize: 12,
        marginTop: 4,
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