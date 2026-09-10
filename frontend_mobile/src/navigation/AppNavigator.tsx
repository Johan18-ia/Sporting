// Encargado: Navegación de la aplicación móvil
// Descripción: Registra los stacks y tabs principales, incluyendo la autenticación, perfil y gestión de usuarios.
// Archivo: src/navigation/AppNavigator.tsx
// ============================================
// NOTAS: Mantener la consistencia con RootStackParamList para tipado.
// Se integran pantallas nuevas como Login, Register, ProfileDetail, Settings, UserForm y Users.
// ============================================
import React, { useRef, useState } from 'react';
import { Animated, Easing, Text, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { NavigationContainer, RouteProp, useNavigation } from '@react-navigation/native';
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
import { CatalogScreen } from '../presentation/views/catalog/CatalogScreen';
import { StudentsScreen } from '../presentation/views/students/StudentsScreen';
import { StudentFormScreen } from '../presentation/views/students/StudentFormScreen';
import { TournamentsScreen } from '../presentation/views/tournaments/TournamentsScreen';
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
    const navigation = useNavigation<any>();
    const [quickActionsOpen, setQuickActionsOpen] = useState(false);
    const [quickActionsVisible, setQuickActionsVisible] = useState(false);
    const radialProgress = useRef(new Animated.Value(0)).current;
    const canManageUsers = user?.role === 'admin' || user?.role === 'seller';
    const isStudent = user?.role === 'user';
    const initialRouteName = route?.params?.screen || 'Dashboard';
    const productsComponent = isStudent ? CatalogScreen : ProductsScreen;

    const quickActions = [
        { icon: 'person-add-outline' as const, label: 'Nuevo Usuario', action: () => navigation.navigate('UserForm', { mode: 'create' }) },
        { icon: 'school-outline' as const, label: 'Nuevo Estudiante', action: () => navigation.navigate('StudentForm', { mode: 'create' }) },
        { icon: 'trophy-outline' as const, label: 'Torneos', action: () => navigation.navigate('Tournaments') },
        { icon: 'calendar-outline' as const, label: 'Horarios', action: () => navigation.navigate('Schedules') },
        { icon: 'bar-chart-outline' as const, label: 'Reportes', action: () => navigation.navigate('Reports') },
    ];

    const animateMenu = (toValue: number, onComplete?: () => void) => {
        Animated.timing(radialProgress, {
            toValue,
            duration: 260,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start(({ finished }) => {
            if (finished) onComplete?.();
        });
    };

    const openQuickActions = () => {
        setQuickActionsVisible(true);
        setQuickActionsOpen(true);
        radialProgress.setValue(0);
        requestAnimationFrame(() => animateMenu(1));
    };

    const closeQuickActions = (afterClose?: () => void) => {
        setQuickActionsOpen(false);
        animateMenu(0, () => {
            setQuickActionsVisible(false);
            afterClose?.();
        });
    };

    const handleQuickAction = (action: () => void) => {
        closeQuickActions(action);
    };

    const radialActionStyles = [
        styles.radialAction0,
        styles.radialAction1,
        styles.radialAction2,
        styles.radialAction3,
        styles.radialAction4,
    ];
    const radialTranslations = [
        { x: 0, y: 132 },
        { x: 58, y: 108 },
        { x: -58, y: 108 },
        { x: 92, y: 56 },
        { x: -92, y: 56 },
    ];

    return (
        <View style={{ flex: 1 }}>
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
                    
                    return (
                        <View
                            style={{
                                width: focused ? 38 : 32,
                                height: focused ? 38 : 32,
                                borderRadius: 19,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: focused ? MyColors.primary : 'transparent',
                            }}
                        >
                            <Ionicons name={iconName} size={focused ? 21 : 22} color={focused ? MyColors.white : color} />
                        </View>
                    );
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
                    borderTopWidth: 0,
                    borderRadius: 24,
                    height: 72,
                    marginHorizontal: 16,
                    marginBottom: 12,
                    paddingTop: 7,
                    paddingBottom: 7,
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    overflow: 'visible',
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.14,
                    shadowRadius: 10,
                },
                tabBarItemStyle: {
                    borderRadius: 18,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600',
                    marginTop: 2,
                },
                })}
            >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{ title: 'Inicio', tabBarLabel: 'Inicio' }}
            />
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
            {!isStudent && (
                <Tab.Screen
                    name="Students"
                    component={StudentsScreen}
                    options={({ navigation }) => ({
                        title: 'Estudiantes',
                        tabBarShowLabel: false,
                        tabBarButton: ({ accessibilityLabel, accessibilityState, testID }) => (
                            quickActionsOpen ? (
                                <View style={{ width: 58, height: 58, marginTop: -14 }} />
                            ) : (
                                <TouchableOpacity
                                    onPress={openQuickActions}
                                    accessibilityLabel={accessibilityLabel}
                                    accessibilityState={accessibilityState}
                                    testID={testID}
                                    style={{
                                        width: 58,
                                        height: 58,
                                        borderRadius: 29,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: MyColors.primary,
                                        marginTop: -14,
                                        borderWidth: 4,
                                        borderColor: MyColors.white,
                                        elevation: 9,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 1,
                                        shadowRadius: 5,
                                    }}
                                >
                                    <Ionicons name="add" size={30} color={MyColors.white} />
                                </TouchableOpacity>
                            )
                        ),
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.navigate('Dashboard')} style={{ marginLeft: 10 }}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                        ),
                    })}
                />
            )}
            <Tab.Screen
                name="Products"
                component={productsComponent}
                options={{ title: 'Productos', tabBarLabel: 'Productos' }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Perfil', tabBarLabel: 'Perfil' }}
            />
            </Tab.Navigator>

            {quickActionsVisible && (
                <View style={styles.quickActionsOverlay}>
                    <TouchableOpacity
                        style={styles.dismissLayer}
                        activeOpacity={1}
                        onPress={() => closeQuickActions()}
                    >
                        <Animated.View style={[styles.blurLayer, { opacity: radialProgress }]}>
                            <BlurView
                                intensity={50}
                                tint="dark"
                                experimentalBlurMethod="dimezisBlurView"
                                style={styles.blurLayer}
                            />
                            <View style={styles.darkOverlay} />
                        </Animated.View>
                    </TouchableOpacity>

                    <Animated.View
                        style={[
                            styles.radialMenu,
                            {
                                opacity: radialProgress,
                                transform: [{ scale: radialProgress.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] }) }],
                            },
                        ]}
                        pointerEvents="box-none"
                    >
                        <View style={styles.wheelSurface} pointerEvents="none" />

                        {quickActions.map((quickAction, index) => (
                            <TouchableOpacity
                                key={quickAction.label}
                                style={[styles.wheelAction, radialActionStyles[index]]}
                                onPress={() => handleQuickAction(quickAction.action)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.radialIcon}>
                                    <Ionicons name={quickAction.icon} size={27} color={MyColors.primary} />
                                </View>
                                <Text style={styles.radialLabel}>{quickAction.label}</Text>
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity style={styles.radialClose} onPress={() => closeQuickActions()} activeOpacity={0.85}>
                            <Ionicons name="close" size={34} color={MyColors.white} />
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            )}
        </View>
    );
};

const styles = {
    quickActionsOverlay: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
    },
    dismissLayer: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    blurLayer: {
        flex: 1,
        filter: [{ blur: 8 }],
    },
    darkOverlay: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    radialMenu: {
        position: 'absolute' as const,
        width: 310,
        height: 310,
        left: '50%' as const,
        marginLeft: -155,
        bottom: 76,
        borderRadius: 155,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    },
    wheelSurface: {
        position: 'absolute' as const,
        width: 310,
        height: 310,
        borderRadius: 155,
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        borderWidth: 5,
        borderColor: '#D8D8D8',
        overflow: 'hidden' as const,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    wheelAction: {
        position: 'absolute' as const,
        width: 112,
        alignItems: 'center' as const,
    },
    radialAction0: {
        top: 20,
        left: '50%' as const,
        marginLeft: -56,
    },
    radialAction1: {
        top: 72,
        left: 8,
    },
    radialAction2: {
        top: 72,
        right: 8,
    },
    radialAction3: {
        top: 178,
        left: 24,
    },
    radialAction4: {
        top: 178,
        right: 24,
    },
    radialClose: {
        position: 'absolute' as const,
        top: 126,
        left: '50%' as const,
        width: 58,
        height: 58,
        marginLeft: -29,
        borderRadius: 29,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        backgroundColor: MyColors.primary,
        borderWidth: 4,
        borderColor: MyColors.white,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
    },
    radialIcon: {
        width: 68,
        height: 68,
        borderRadius: 34,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        backgroundColor: '#F7E5E5',
    },
    radialLabel: {
        color: MyColors.primary,
        fontSize: 11,
        fontWeight: '700' as const,
        marginTop: 7,
        textAlign: 'center' as const,
        textShadowColor: 'transparent',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
};

// ============================================
// MAIN NAVIGATOR
// ============================================
export const AppNavigator = () => {
    const { isAuthenticated, initialized } = useAuth();

    if (!initialized) {
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