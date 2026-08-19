// Encargado: Usuarios - Detalle
// Descripción: Muestra información detallada de un usuario y permite acciones (editar, activar/inactivar)
// Archivo: src/presentation/views/users/UserDetailScreen.tsx
// ============================================
// src/presentation/views/users/UserDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/RootStackParamList';
import { MyColors } from '../../theme/AppTheme';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';
import { useAuth } from '../../../hooks/useAuth';

type UserDetailRouteProp = RouteProp<RootStackParamList, 'UserDetail'>;

interface User {
    id: number;
    name: string;
    lastname: string;
    email: string;
    phone?: string;
    role: 'admin' | 'seller' | 'user';
    is_active: number;
    image?: string;
    created_at?: string;
    updated_at?: string;
}

export const UserDetailScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<UserDetailRouteProp>();
    const { userId } = route.params;
    const { user: currentUser } = useAuth();
    
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const response = await ApiDelivery.get(`/users/${userId}`);
            const userData = response.data?.data ?? response.data ?? null;
            setUser(userData);
        } catch (error) {
            Alert.alert('Error', 'No se pudo cargar la información del usuario');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!user) return;
        
        const newStatus = user.is_active === 1 ? 0 : 1;
        try {
            await ApiDelivery.patch(`/users/toggle-status/${user.id}`, { is_active: newStatus });
            setUser({ ...user, is_active: newStatus });
            Alert.alert('Éxito', `Usuario ${newStatus === 1 ? 'activado' : 'desactivado'} correctamente`);
        } catch (error) {
            Alert.alert('Error', 'No se pudo cambiar el estado del usuario');
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={MyColors.primary} />
                <Text style={styles.loadingText}>Cargando usuario...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Usuario no encontrado</Text>
            </View>
        );
    }

    const getRoleText = (role: string) => {
        switch (role) {
            case 'admin': return 'Administrador';
            case 'seller': return 'Vendedor';
            default: return 'Usuario';
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {user.name.charAt(0)}{user.lastname?.charAt(0) || ''}
                    </Text>
                </View>
                <Text style={styles.userName}>{user.name} {user.lastname}</Text>
                <Text style={styles.userRole}>{getRoleText(user.role)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: user.is_active === 1 ? '#28a745' : '#dc3545' }]}>
                    <Text style={styles.statusText}>
                        {user.is_active === 1 ? 'Activo' : 'Inactivo'}
                    </Text>
                </View>
            </View>

            {/* Información */}
            <View style={styles.infoContainer}>
                <Text style={styles.sectionTitle}>Información de Contacto</Text>
                
                <View style={styles.infoRow}>
                    <Ionicons name="mail-outline" size={20} color="#666" />
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{user.email}</Text>
                </View>
                
                <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={20} color="#666" />
                    <Text style={styles.infoLabel}>Teléfono</Text>
                    <Text style={styles.infoValue}>{user.phone || 'No registrado'}</Text>
                </View>
                
                <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={20} color="#666" />
                    <Text style={styles.infoLabel}>Fecha de Registro</Text>
                    <Text style={styles.infoValue}>
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'No disponible'}
                    </Text>
                </View>
            </View>

            {/* Acciones */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('UserForm', { user, mode: 'edit' })}
                >
                    <Ionicons name="create-outline" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Editar</Text>
                </TouchableOpacity>

                {currentUser?.id !== user.id && (
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            { backgroundColor: user.is_active === 1 ? '#dc3545' : '#28a745' }
                        ]}
                        onPress={handleToggleStatus}
                    >
                        <Ionicons name={user.is_active === 1 ? 'eye-off-outline' : 'eye-outline'} size={20} color="#fff" />
                        <Text style={styles.actionButtonText}>
                            {user.is_active === 1 ? 'Desactivar' : 'Activar'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 18,
        color: '#dc3545',
    },
    avatarContainer: {
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingVertical: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: MyColors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    userRole: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    statusBadge: {
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 8,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    infoContainer: {
        backgroundColor: '#fff',
        margin: 12,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        marginLeft: 12,
        flex: 1,
    },
    infoValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
        flex: 1.5,
    },
    actionsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingBottom: 20,
        gap: 10,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: MyColors.primary,
        borderRadius: 8,
        paddingVertical: 12,
        marginHorizontal: 4,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
});