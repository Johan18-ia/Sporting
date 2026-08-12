// Encargado: Usuarios - Listado
// Descripción: Pantalla para listar y buscar usuarios; incluye refresco y navegación a detalle/edición
// Archivo: src/presentation/views/users/UsersScreen.tsx
// ============================================
// src/presentation/views/users/UsersScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    RefreshControl,
    ActivityIndicator,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useAuth } from '../../../hooks/useAuth';
import { MyColors } from '../../theme/AppTheme';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';

interface User {
    id: number;
    name: string;
    lastname: string;
    email: string;
    role: 'admin' | 'seller' | 'user';
    phone?: string;
    is_active: number;
    image?: string;
}

export const UsersScreen = () => {
    const navigation = useNavigation<any>();
    const isFocused = useIsFocused();
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadUsers = async () => {
        try {
            const response = await ApiDelivery.get('/users');
            // El backend envuelve la respuesta como { success, message, data }.
            // Antes se asumia que response.data YA era el array.
            const usersData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setUsers(usersData);
            setFilteredUsers(usersData);
        } catch (error) {
            console.error('Error loading users:', error);
            Alert.alert('Error', 'No se pudieron cargar los usuarios');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            loadUsers();
        }
    }, [isFocused]);

    useEffect(() => {
        if (searchTerm.trim()) {
            const filtered = users.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    }, [searchTerm, users]);

    const onRefresh = () => {
        setRefreshing(true);
        loadUsers();
    };

    const handleDeleteUser = (id: number, name: string) => {
        Alert.alert(
            'Eliminar Usuario',
            `¿Estás seguro de eliminar a "${name}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await ApiDelivery.delete(`/users/delete/${id}`);
                            loadUsers();
                            Alert.alert('Éxito', 'Usuario eliminado correctamente');
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar el usuario');
                        }
                    }
                }
            ]
        );
    };

    const getRoleBadge = (role: string) => {
        const colors = {
            admin: { bg: '#8B0000', text: '#fff' },
            seller: { bg: '#f59e0b', text: '#fff' },
            user: { bg: '#6b7280', text: '#fff' }
        };
        const color = colors[role as keyof typeof colors] || colors.user;
        return { backgroundColor: color.bg, color: color.text };
    };

    const renderUserItem = ({ item }: { item: User }) => {
        const roleBadge = getRoleBadge(item.role);
        const isCurrentUser = currentUser?.id === item.id;

        return (
            <TouchableOpacity
                style={[
                    styles.userCard,
                    isCurrentUser && styles.currentUserCard
                ]}
                onPress={() => navigation.navigate('UserDetail', { userId: item.id })}
                activeOpacity={0.7}
            >
                <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>
                        {item.name.charAt(0)}{item.lastname?.charAt(0) || ''}
                    </Text>
                </View>
                <View style={styles.userInfo}>
                    <View style={styles.userNameRow}>
                        <Text style={styles.userName}>{item.name} {item.lastname}</Text>
                        {isCurrentUser && (
                            <View style={styles.currentUserBadge}>
                                <Text style={styles.currentUserBadgeText}>Tú</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.userEmail}>{item.email}</Text>
                    <View style={styles.userMeta}>
                        <View style={[styles.roleBadge, { backgroundColor: roleBadge.backgroundColor }]}>
                            <Text style={[styles.roleBadgeText, { color: roleBadge.color }]}>
                                {item.role === 'admin' ? 'Administrador' :
                                 item.role === 'seller' ? 'Vendedor' : 'Usuario'}
                            </Text>
                        </View>
                        {item.is_active === 0 && (
                            <View style={styles.inactiveBadge}>
                                <Text style={styles.inactiveBadgeText}>Inactivo</Text>
                            </View>
                        )}
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.userActions}
                    onPress={() => navigation.navigate('UserForm', { user: item, mode: 'edit' })}
                >
                    <Ionicons name="ellipsis-vertical" size={20} color="#666" />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={MyColors.primary} />
                <Text style={styles.loadingText}>Cargando usuarios...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar usuarios..."
                        placeholderTextColor="#999"
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                    {searchTerm.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchTerm('')}>
                            <Ionicons name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('UserForm', { mode: 'create' })}
                >
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* User Count */}
            <Text style={styles.userCount}>{filteredUsers.length} usuarios encontrados</Text>

            {/* User List */}
            <FlatList
                data={filteredUsers}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[MyColors.primary]} />
                }
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="people-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>No se encontraron usuarios</Text>
                    </View>
                }
            />
        </View>
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
    searchContainer: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 15,
        color: '#333',
    },
    addButton: {
        backgroundColor: MyColors.primary,
        width: 44,
        height: 44,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userCount: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        fontSize: 13,
        color: '#666',
        backgroundColor: '#f5f5f5',
    },
    listContent: {
        padding: 12,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    currentUserCard: {
        borderWidth: 2,
        borderColor: MyColors.primary,
    },
    userAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: MyColors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    userAvatarText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    userInfo: {
        flex: 1,
    },
    userNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    currentUserBadge: {
        backgroundColor: MyColors.primary,
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginLeft: 8,
    },
    currentUserBadgeText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    userMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        flexWrap: 'wrap',
    },
    roleBadge: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 12,
        marginRight: 6,
    },
    roleBadgeText: {
        fontSize: 11,
        fontWeight: '600',
    },
    inactiveBadge: {
        backgroundColor: '#fee2e2',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 12,
    },
    inactiveBadgeText: {
        fontSize: 11,
        color: '#dc3545',
        fontWeight: '600',
    },
    userActions: {
        padding: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 12,
    },
});