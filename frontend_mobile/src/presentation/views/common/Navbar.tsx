// Encargado: Componente - Navbar
// Descripción: Barra de navegación superior reutilizable (títulos y accesos rápidos)
// Archivo: src/presentation/views/common/Navbar.tsx
// ============================================
// src/presentation/views/common/Navbar.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/RootStackParamList';
import { useAuth } from '../../../hooks/useAuth';
import { MyColors } from '../../theme/AppTheme';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface NavbarProps {
    showBack?: boolean;
    title?: string;
    rightComponent?: React.ReactNode;
}

export const Navbar = ({ showBack = false, title, rightComponent }: NavbarProps) => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute();
    const { user } = useAuth();

    const getScreenTitle = () => {
        if (title) return title;

        const routeName = route.name;
        const titles: Record<string, string> = {
            Dashboard: 'Dashboard',
            Users: 'Usuarios',
            UserDetail: 'Detalles',
            UserForm: 'Formulario',
            Categories: 'Categorías',
            Schedules: 'Horarios',
            Products: 'Productos',
            Students: 'Estudiantes',
            StudentForm: 'Estudiante',
            Tournaments: 'Torneos',
            Teams: 'Equipos',
            Reports: 'Reportes',
            Profile: 'Mi Perfil',
            Login: 'Iniciar Sesión',
            Register: 'Registro',
        };

        return titles[routeName] || routeName;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.leftSection}>
                    {showBack ? (
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.logoButton}
                            onPress={() => navigation.navigate('Dashboard')}
                            activeOpacity={0.7}
                        >
                            <Image
                                source={require('../../../../assets/logo.png')}
                                style={styles.logoImage}
                                resizeMode="contain"
                            />
                            <Text style={styles.logoText}>SPORTING</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.centerSection}>
                    <Text style={styles.title} numberOfLines={1}>
                        {getScreenTitle()}
                    </Text>
                </View>

                <View style={styles.rightSection}>
                    {rightComponent ? (
                        rightComponent
                    ) : (
                        <TouchableOpacity
                            style={styles.profileButton}
                            onPress={() => navigation.navigate('Profile')}
                            activeOpacity={0.7}
                        >
                            <View style={styles.profileAvatar}>
                                <Text style={styles.profileAvatarText}>
                                    {user?.name?.charAt(0) || 'U'}
                                    {user?.lastname?.charAt(0) || ''}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: MyColors.primary,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        minHeight: 56,
        backgroundColor: MyColors.primary,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 60,
    },
    backButton: {
        padding: 4,
    },
    logoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logoImage: {
        width: 32,
        height: 32,
    },
    logoText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 1,
    },
    centerSection: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 17,
        fontWeight: '600',
        color: '#fff',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 60,
        justifyContent: 'flex-end',
    },
    profileButton: {
        padding: 2,
    },
    profileAvatar: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    profileAvatarText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#fff',
    },
});
