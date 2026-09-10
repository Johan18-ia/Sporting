// Encargado: Detalle de Perfil
// Descripción: Vista para mostrar los datos del usuario autenticado
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

    if (!user) {
        return null;
    }

    const handleEdit = () => {
        navigation.navigate('UserForm', { user, mode: 'edit' });
    };

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.title}>Mi Perfil</Text>
                <TouchableOpacity onPress={handleEdit}>
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
                    {user?.role === 'admin' ? 'Administrador' : user?.role === 'seller' ? 'Moderador' : 'Usuario'}
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
