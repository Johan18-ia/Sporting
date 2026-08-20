// src/navigation/PublicTabNavigator.tsx
// ====================================================
// BARRA DE NAVEGACION INFERIOR — para visitantes SIN
// sesion iniciada. Reemplaza el scroll largo tipo pagina
// web por una experiencia de app nativa: tabs de Inicio
// y Catálogo, mas un boton de "Iniciar Sesión" que no es
// un tab de contenido, sino un atajo que abre el login.
// ====================================================
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../presentation/views/home/HomeScreen';
import { CatalogScreen } from '../presentation/views/catalog/CatalogScreen';
import { MyColors } from '../presentation/theme/AppTheme';

const Tab = createBottomTabNavigator();

// Pantalla "fantasma": nunca se llega a ver, porque el listener
// de abajo intercepta el toque y navega a Login en su lugar.
const LoginPlaceholder = () => null;

export const PublicTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: MyColors.primary,
                tabBarInactiveTintColor: '#999',
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#eee',
                    height: 60,
                    paddingBottom: 6,
                    paddingTop: 6,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
                    if (route.name === 'Inicio') iconName = focused ? 'home' : 'home-outline';
                    if (route.name === 'Catálogo') iconName = focused ? 'bag' : 'bag-outline';
                    if (route.name === 'Ingresar') iconName = 'log-in-outline';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Inicio" component={HomeScreen} />
            <Tab.Screen name="Catálogo" component={CatalogScreen} />
            <Tab.Screen
                name="Ingresar"
                component={LoginPlaceholder}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        // Evita que este tab cambie de contenido: en vez de
                        // eso, abre la pantalla de Login por encima de los tabs.
                        e.preventDefault();
                        navigation.navigate('Login');
                    },
                })}
            />
        </Tab.Navigator>
    );
};