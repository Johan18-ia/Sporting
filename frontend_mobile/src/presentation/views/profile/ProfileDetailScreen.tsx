// Encargado: Detalle de Perfil
// Descripción: Muestra los datos del usuario autenticado y permite acceder al formulario de edición del perfil.
// Archivo: src/presentation/views/profile/ProfileDetailScreen.tsx
// ============================================
// NOTAS: Se incluye el nombre, correo y rol del usuario autenticado.
// La navegación hacia UserForm permite editar el propio perfil sin cambiar el rol del usuario.
// ============================================
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/RootStackParamList';
import { useAuth } from '../../../hooks/useAuth';
import { MyColors } from '../../theme/AppTheme';

type ProfileDetailNavigationProp = StackNavigationProp<RootStackParamList, 'ProfileDetail'>;

export const ProfileDetailScreen = () => {
    const { user } = useAuth();
    const navigation = useNavigation<ProfileDetailNavigationProp>();

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.title}>Mi Perfil</Text>
                <TouchableOpacity
                    onPress={() => user && navigation.navigate('UserForm', { user, mode: 'edit' })}
                    disabled={!user}
                >
                    <Text style={{ color: MyColors.primary, fontWeight: '600' }}>Editar</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.card}>
                <Text style={styles.label}>Nombre</Text>
                <Text style={styles.value}>{user?.name} {user?.lastname}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.label}>Correo</Text>
                <Text style={styles.value}>{user?.email}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.label}>Rol</Text>
                <Text style={styles.value}>
                    {user?.role === 'admin' ? 'Administrador' : user?.role === 'seller' ? 'Vendedor' : 'Usuario'}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: MyColors.primary,
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    label: {
        fontSize: 13,
        color: '#888',
        marginBottom: 6,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
});
