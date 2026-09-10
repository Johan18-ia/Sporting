// src/presentation/views/welcome/WelcomeScreen.tsx
// ====================================================
// PANTALLA DE BIENVENIDA — primera pantalla que ve
// cualquier persona sin sesión iniciada. Fondo en
// degradado de rojos (sin usar ninguna libreria nueva,
// para no depender de una instalacion adicional), con
// dos botones funcionales hacia Login y Registro.
//
// Diseño responsive: usa flex y porcentajes en vez de
// medidas fijas, y SafeAreaView para respetar el notch
// y la barra inferior en cualquier tamaño de celular.
// ====================================================
import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MyColors } from '../../theme/AppTheme';

// ============================================
// Simula un degradado apilando franjas delgadas cuyo color
// se va interpolando entre un rojo oscuro y uno mas vivo.
// Evita instalar expo-linear-gradient (menos riesgo de que
// algo falle en la instalacion).
// ============================================
const GRADIENT_TOP = '#2b0505';    // granate muy oscuro
const GRADIENT_BOTTOM = '#a11d1d'; // rojo mas vivo

const hexToRgb = (hex: string) => {
    const value = hex.replace('#', '');
    return {
        r: parseInt(value.substring(0, 2), 16),
        g: parseInt(value.substring(2, 4), 16),
        b: parseInt(value.substring(4, 6), 16),
    };
};

const mixColor = (start: string, end: string, factor: number) => {
    const c1 = hexToRgb(start);
    const c2 = hexToRgb(end);
    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);
    return `rgb(${r}, ${g}, ${b})`;
};

const GRADIENT_BANDS = 24;

export const WelcomeScreen = () => {
    const navigation = useNavigation<any>();
    const { height } = useWindowDimensions();
    const bandHeight = height / GRADIENT_BANDS + 1; // +1 para evitar lineas visibles entre bandas

    return (
        <View style={styles.root}>
            {/* Fondo degradado */}
            <View style={StyleSheet.absoluteFill}>
                {Array.from({ length: GRADIENT_BANDS }).map((_, i) => (
                    <View
                        key={i}
                        style={{
                            height: bandHeight,
                            backgroundColor: mixColor(GRADIENT_TOP, GRADIENT_BOTTOM, i / (GRADIENT_BANDS - 1)),
                        }}
                    />
                ))}
            </View>

            <SafeAreaView style={styles.safeArea}>
                {/* Texto superior, minimalista */}
                <View style={styles.headerArea}>
                    <Text style={styles.title}>BIENVENIDO DE VUELTA</Text>
                    <Text style={styles.subtitle}>Sporting Club</Text>
                </View>

                {/* Botones inferiores */}
                <View style={styles.actionsArea}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={styles.secondaryButtonText}>Registrarse</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: '7%',
    },
    headerArea: {
        marginTop: '18%',
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: 0.5,
        textAlign: 'left',
    },
    subtitle: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 14,
        fontWeight: '500',
        marginTop: 6,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    actionsArea: {
        marginBottom: '6%',
        gap: 12,
    },
    primaryButton: {
        backgroundColor: '#fff',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: MyColors.primary,
        fontSize: 15.5,
        fontWeight: '700',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#fff',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#fff',
        fontSize: 15.5,
        fontWeight: '700',
    },
});