// src/presentation/views/profile/ProfileScreen.tsx
// Encargado: Pantalla de Perfil
// Descripción: Muestra información del usuario y acceso a opciones (Mi Perfil, Configuración, Notificaciones)
// ============================================
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/RootStackParamList';
import { useAuth } from '../../../hooks/useAuth';
import { MyColors } from '../../theme/AppTheme';

type ProfileNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

export const ProfileScreen = () => {
    const navigation = useNavigation<ProfileNavigationProp>();
    const { user, logout, loading } = useAuth();
    const canManageAdmin = user?.role === 'admin' || user?.role === 'seller';
    const [logoutLoading, setLogoutLoading] = useState(false);

    const handleLogout = () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro de que deseas cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Cerrar Sesión',
                    style: 'destructive',
                    onPress: async () => {
                        setLogoutLoading(true);
                        await logout();
                        setLogoutLoading(false);
                        // Al cambiar isAuthenticated a false, AppNavigator
                        // vuelve a renderizar el stack de auth.
                    }
                }
            ]
        );
    };

    // ============================================
    // ITEM DEL MENÚ
    // ============================================
    const MenuItem = ({ icon, label, onPress, color = '#333', showArrow = true }: any) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
                <Ionicons name={icon} size={24} color={color} style={styles.menuIcon} />
                <Text style={styles.menuLabel}>{label}</Text>
            </View>
            {showArrow && <Ionicons name="chevron-forward" size={20} color="#ccc" />}
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user?.name?.charAt(0) || 'U'}
                            {user?.lastname?.charAt(0) || ''}
                        </Text>
                    </View>
                </View>
                <Text style={styles.userName}>{user?.name} {user?.lastname}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
                <View style={styles.roleBadge}>
                    <Text style={styles.roleText}>
                        {user?.role === 'admin' ? 'Administrador' :
                         user?.role === 'seller' ? 'Vendedor' : 'Usuario'}
                    </Text>
                </View>
            </View>

            {/* Menú */}
            <View style={styles.menuContainer}>
                <Text style={styles.menuTitle}>General</Text>
                
                <MenuItem
                    icon="person-outline"
                    label="Mi Perfil"
                    onPress={() => navigation.navigate('ProfileDetail')}
                />
                <MenuItem
                    icon="settings-outline"
                    label="Configuración"
                    onPress={() => navigation.navigate('Settings')}
                />
                <MenuItem
                    icon="notifications-outline"
                    label="Notificaciones"
                    onPress={() => Alert.alert('Notificaciones', 'Esta funcionalidad estará disponible pronto.')}
                />

                {canManageAdmin && (
                    <>
                        <View style={styles.divider} />

                        <Text style={styles.menuTitle}>Administración</Text>

                        <MenuItem
                            icon="people-outline"
                            label="Usuarios"
                            onPress={() => navigation.navigate('Users')}
                        />
                        <MenuItem
                            icon="school-outline"
                            label="Estudiantes"
                            onPress={() => navigation.navigate('Students')}
                        />
                        <MenuItem
                            icon="trophy-outline"
                            label="Torneos"
                            onPress={() => navigation.navigate('Tournaments')}
                        />
                        <MenuItem
                            icon="calendar-outline"
                            label="Horarios"
                            onPress={() => navigation.navigate('Schedules')}
                        />
                    </>
                )}

                <View style={styles.divider} />

                <MenuItem
                    icon="log-out-outline"
                    label="Cerrar Sesión"
                    color="#dc3545"
                    showArrow={false}
                    onPress={handleLogout}
                />
            </View>

            {(loading || logoutLoading) && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={MyColors.primary} />
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingVertical: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatarContainer: {
        marginBottom: 12,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: MyColors.primary,
        alignItems: 'center',
        justifyContent: 'center',
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
    userEmail: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    roleBadge: {
        backgroundColor: MyColors.primary + '20',
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 8,
    },
    roleText: {
        color: MyColors.primary,
        fontSize: 12,
        fontWeight: '600',
    },
    menuContainer: {
        backgroundColor: '#fff',
        margin: 12,
        borderRadius: 12,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    menuTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#999',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIcon: {
        marginRight: 14,
    },
    menuLabel: {
        fontSize: 15,
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 4,
        marginHorizontal: 16,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.7)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});