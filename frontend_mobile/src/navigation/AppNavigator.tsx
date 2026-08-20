// Encargado: Navegación de la aplicación móvil
// Descripción: Registra los stacks y tabs principales, incluyendo la autenticación, perfil y gestión de usuarios.
// Archivo: src/navigation/AppNavigator.tsx
// ============================================
// NOTAS: Mantener la consistencia con RootStackParamList para tipado.
// Se integran pantallas nuevas como Login, Register, ProfileDetail, Settings, UserForm y Users.
// ============================================
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importación de screens
import { HomeScreen } from '../presentation/views/home/HomeScreen';
import { AboutScreen } from '../presentation/views/home/AboutScreen';
import { PublicTabNavigator } from './PublicTabNavigator';
import { LoginScreen } from '../presentation/views/auth/LoginScreen';
import { RegisterScreen } from '../presentation/views/auth/RegisterScreen';
import { DashboardScreen } from '../presentation/views/dashboard/DashboardScreen';
import { UsersScreen } from '../presentation/views/users/UsersScreen';
import { UserDetailScreen } from '../presentation/views/users/UserDetailScreen';
import { UserFormScreen } from '../presentation/views/users/UserFormScreen';
import { CategoriesScreen } from '../presentation/views/categories/CategoriesScreen';
import { SchedulesScreen } from '../presentation/views/schedules/SchedulesScreen';
import { ProductsScreen } from '../presentation/views/products/ProductsScreen';
import { StudentsScreen } from '../presentation/views/students/StudentsScreen';
import { StudentFormScreen } from '../presentation/views/students/StudentFormScreen';
import { TournamentsScreen } from '../presentation/views/tournaments/TournamentsScreen';
import { TeamsScreen } from '../presentation/views/teams/TeamsScreen';
import { ReportsScreen } from '../presentation/views/reports/ReportsScreen';
import { ProfileScreen } from '../presentation/views/profile/ProfileScreen';
import { ProfileDetailScreen } from '../presentation/views/profile/ProfileDetailScreen';
import { SettingsScreen } from '../presentation/views/profile/SettingsScreen';

import { RootStackParamList } from './RootStackParamList';
import { useAuth } from '../hooks/useAuth';
import { MyColors } from '../presentation/theme/AppTheme';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// ============================================
// TAB NAVIGATOR
// ============================================
const MainTabs = ({ route }: { route: RouteProp<RootStackParamList, 'MainTabs'> }) => {
    const { user } = useAuth();
    const canManageUsers = user?.role === 'admin' || user?.role === 'seller';
    const initialRouteName = route?.params?.screen || (user?.role === 'user' ? 'Students' : 'Dashboard');

    return (
        <Tab.Navigator
            initialRouteName={initialRouteName}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home';
                    
                    switch (route.name) {
                        case 'Dashboard':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'Users':
                            iconName = focused ? 'people' : 'people-outline';
                            break;
                        case 'Students':
                            iconName = focused ? 'school' : 'school-outline';
                            break;
                        case 'Products':
                            iconName = focused ? 'bag' : 'bag-outline';
                            break;
                        case 'Profile':
                            iconName = focused ? 'person' : 'person-outline';
                            break;
                        default:
                            iconName = 'home-outline';
                    }
                    
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: MyColors.primary,
                tabBarInactiveTintColor: 'gray',
                headerStyle: {
                    backgroundColor: MyColors.primary,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#eee',
                    height: 60,
                    paddingBottom: 5,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '500',
                },
            })}
        >
            {user?.role !== 'user' && (
                <Tab.Screen
                    name="Dashboard"
                    component={DashboardScreen}
                    options={{ title: 'Inicio', tabBarLabel: 'Inicio' }}
                />
            )}
            {canManageUsers && (
                <Tab.Screen
                    name="Users"
                    component={UsersScreen}
                    options={({ navigation }) => ({
                        title: 'Usuarios',
                        tabBarLabel: 'Usuarios',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.navigate('Dashboard')} style={{ marginLeft: 10 }}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                        ),
                    })}
                />
            )}
            <Tab.Screen
                name="Students"
                component={StudentsScreen}
                options={({ navigation }) => ({
                    title: 'Estudiantes',
                    tabBarLabel: 'Estudiantes',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')} style={{ marginLeft: 10 }}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                    ),
                })}
            />
            <Tab.Screen
                name="Products"
                component={ProductsScreen}
                options={{ title: 'Productos', tabBarLabel: 'Productos' }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Perfil', tabBarLabel: 'Perfil' }}
            />
        </Tab.Navigator>
    );
};

// ============================================
// MAIN NAVIGATOR
// ============================================
export const AppNavigator = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return null; // O un LoadingSpinner
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: MyColors.primary,
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackTitle: 'Volver',
                }}
            >
                {!isAuthenticated ? (
                    // ============================================
                    // AUTH STACK (con Home como pantalla publica inicial)
                    // ============================================
                    <>
                        <Stack.Screen
                            name="PublicTabs"
                            component={PublicTabNavigator}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Home"
                            component={HomeScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="SobreNosotros"
                            component={AboutScreen}
                            options={{ title: 'Sobre Nosotros' }}
                        />
                        <Stack.Screen 
                            name="Login" 
                            component={LoginScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Register"
                            component={RegisterScreen}
                            options={{
                                headerShown: true,
                                title: 'Registro de Usuario'
                            }}
                        />
                    </>
                ) : (
                    // ============================================
                    // MAIN STACK
                    // ============================================
                    <>
                        <Stack.Screen
                            name="MainTabs"
                            component={MainTabs}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="UserDetail"
                            component={UserDetailScreen}
                            options={{ title: 'Detalles del Usuario' }}
                        />
                        <Stack.Screen
                            name="UserForm"
                            component={UserFormScreen}
                            options={{ title: 'Formulario de Usuario' }}
                        />
                        <Stack.Screen
                            name="StudentForm"
                            component={StudentFormScreen}
                            options={{ title: 'Formulario de Estudiante' }}
                        />
                        <Stack.Screen
                            name="Categories"
                            component={CategoriesScreen}
                            options={{ title: 'Categorías' }}
                        />
                        <Stack.Screen
                            name="Schedules"
                            component={SchedulesScreen}
                            options={{ title: 'Horarios' }}
                        />
                        <Stack.Screen
                            name="Tournaments"
                            component={TournamentsScreen}
                            options={{ title: 'Torneos' }}
                        />
                        <Stack.Screen
                            name="Teams"
                            component={TeamsScreen}
                            options={{ title: 'Equipos' }}
                        />
                        <Stack.Screen
                            name="Reports"
                            component={ReportsScreen}
                            options={{ title: 'Reportes' }}
                        />
                        <Stack.Screen 
                            name="ProfileDetail" 
                            component={ProfileDetailScreen}
                            options={{ title: 'Mi Perfil' }}
                        />
                        <Stack.Screen 
                            name="Settings" 
                            component={SettingsScreen}
                            options={{ title: 'Configuración' }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};