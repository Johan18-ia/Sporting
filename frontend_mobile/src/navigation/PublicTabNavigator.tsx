// src/navigation/PublicTabNavigator.tsx
// ====================================================
// BARRA DE NAVEGACION INFERIOR — para visitantes SIN
// sesion iniciada. Reemplaza el scroll largo tipo pagina
// web por una experiencia de app nativa: tabs de Inicio
// y Catálogo, mas un boton de "Iniciar Sesión" que no es
// un tab de contenido, sino un atajo que abre el login.
// ====================================================
import React from 'react';
import { View } from 'react-native';
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
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
                    if (route.name === 'Inicio') iconName = focused ? 'home' : 'home-outline';
                    if (route.name === 'Catálogo') iconName = focused ? 'bag' : 'bag-outline';
                    if (route.name === 'Ingresar') iconName = 'log-in-outline';
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