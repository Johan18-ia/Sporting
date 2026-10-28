import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';
import { RootStackParamList } from '../../../navigation/RootStackParamList';
import { useAuth } from '../../../hooks/useAuth';
import { MyColors } from '../../theme/AppTheme';

type ChangePasswordNavigationProp = StackNavigationProp<RootStackParamList, 'ChangePassword'>;
type PasswordField = 'currentPassword' | 'newPassword' | 'confirmPassword';

const fieldLabels: Record<PasswordField, string> = {
    currentPassword: 'Contraseña actual',
    newPassword: 'Nueva contraseña',
    confirmPassword: 'Confirmar nueva contraseña'
};

export const ChangePasswordScreen = () => {
    const navigation = useNavigation<ChangePasswordNavigationProp>();
    const { logout } = useAuth();
    const [formData, setFormData] = useState<Record<PasswordField, string>>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [visibleFields, setVisibleFields] = useState<Record<PasswordField, boolean>>({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<PasswordField, string>>>({});

    const updateField = (field: PasswordField, value: string) => {
        setFormData((previous) => ({ ...previous, [field]: value }));
        setErrors((previous) => ({ ...previous, [field]: undefined }));
    };

    const validateForm = () => {
        const nextErrors: Partial<Record<PasswordField, string>> = {};

        if (!formData.currentPassword) nextErrors.currentPassword = 'Ingresa tu contraseña actual';
        if (!formData.newPassword) {
            nextErrors.newPassword = 'Ingresa una contraseña nueva';
        } else if (formData.newPassword.length < 6) {
            nextErrors.newPassword = 'Debe tener al menos 6 caracteres';
        }
        if (!formData.confirmPassword) {
            nextErrors.confirmPassword = 'Confirma la contraseña nueva';
        } else if (formData.newPassword !== formData.confirmPassword) {
            nextErrors.confirmPassword = 'Las contraseñas no coinciden';
        }
        if (formData.currentPassword && formData.currentPassword === formData.newPassword) {
            nextErrors.newPassword = 'Debe ser diferente a la contraseña actual';
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await ApiDelivery.put('/users/change-password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });

            Alert.alert(
                'Contraseña actualizada',
                response.data?.message || 'Vuelve a iniciar sesión con tu nueva contraseña.',
                [{
                    text: 'Iniciar sesión',
                    onPress: async () => {
                        const logoutResult = await logout();
                        if (logoutResult.success) {
                            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                        } else {
                            Alert.alert('Sesión activa', 'Cierra sesión y vuelve a ingresar con tu nueva contraseña.');
                        }
                    }
                }]
            );
        } catch (error: any) {
            Alert.alert('No se pudo cambiar la contraseña', error.response?.data?.message || 'Inténtalo nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <Text style={styles.description}>Confirma tu contraseña actual y define una nueva.</Text>

                <View style={styles.form}>
                    {(['currentPassword', 'newPassword', 'confirmPassword'] as PasswordField[]).map((field) => (
                        <View style={styles.inputGroup} key={field}>
                            <Text style={styles.label}>{fieldLabels[field]} *</Text>
                            <View style={[styles.passwordInputWrap, errors[field] && styles.inputError]}>
                                <TextInput
                                    style={styles.input}
                                    value={formData[field]}
                                    onChangeText={(value) => updateField(field, value)}
                                    placeholder={field === 'currentPassword' ? 'Ingresa tu contraseña actual' : 'Mínimo 6 caracteres'}
                                    placeholderTextColor="#888"
                                    secureTextEntry={!visibleFields[field]}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    autoComplete={field === 'currentPassword' ? 'current-password' : 'new-password'}
                                    editable={!loading}
                                />
                                <TouchableOpacity
                                    style={styles.visibilityButton}
                                    onPress={() => setVisibleFields((previous) => ({ ...previous, [field]: !previous[field] }))}
                                    accessibilityRole="button"
                                    accessibilityLabel={visibleFields[field] ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    disabled={loading}
                                >
                                    <Ionicons name={visibleFields[field] ? 'eye-off-outline' : 'eye-outline'} size={21} color="#666" />
                                </TouchableOpacity>
                            </View>
                            {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
                        </View>
                    ))}

                    <TouchableOpacity
                        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                        accessibilityRole="button"
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitButtonText}>Cambiar contraseña</Text>
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
        backgroundColor: '#f5f5f5'
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20
    },
    description: {
        color: '#666',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 20
    },
    form: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 18
    },
    inputGroup: {
        marginBottom: 16
    },
    label: {
        color: '#333',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6
    },
    passwordInputWrap: {
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderColor: '#ddd',
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: 'row'
    },
    inputError: {
        borderColor: '#dc3545',
        backgroundColor: '#fff5f5'
    },
    input: {
        color: '#222',
        flex: 1,
        fontSize: 15,
        minHeight: 46,
        paddingHorizontal: 12,
        paddingVertical: 10
    },
    visibilityButton: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44,
        minWidth: 44
    },
    errorText: {
        color: '#b42318',
        fontSize: 12,
        marginTop: 5
    },
    submitButton: {
        alignItems: 'center',
        backgroundColor: MyColors.primary,
        borderRadius: 8,
        justifyContent: 'center',
        marginTop: 4,
        minHeight: 48,
        paddingHorizontal: 16,
        paddingVertical: 12
    },
    submitButtonDisabled: {
        opacity: 0.65
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700'
    }
});