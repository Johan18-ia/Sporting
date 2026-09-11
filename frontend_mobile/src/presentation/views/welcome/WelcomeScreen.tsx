// src/presentation/views/welcome/WelcomeScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, useWindowDimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MyColors } from '../../theme/AppTheme';

const GRADIENT_TOP = '#3a0a0a';    
const GRADIENT_BOTTOM = '#8B0000'; 

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

const GRADIENT_BANDS = 90;

export const WelcomeScreen = () => {
    const navigation = useNavigation<any>();
    const { height } = useWindowDimensions();
    const bandHeight = height / GRADIENT_BANDS + 0.5;
    const [logoFailed, setLogoFailed] = useState(false);

    return (
        <View style={styles.root}>
            {/* Fondo degradado */}
            <View style={StyleSheet.absoluteFill}>
                {Array.from({ length: GRADIENT_BANDS }).map((_, i) => (
                    <View
                        key={i}
                        style={{
                            height: bandHeight,
                            marginTop: i === 0 ? 0 : -0.5,
                            backgroundColor: mixColor(GRADIENT_TOP, GRADIENT_BOTTOM, i / (GRADIENT_BANDS - 1)),
                        }}
                    />
                ))}
            </View>

            <SafeAreaView style={styles.safeArea}>
                {/* Texto superior + logo, minimalista */}
                <View style={styles.headerArea}>
                    <Text style={styles.title}>BIENVENIDO DE VUELTA</Text>
                    <Text style={styles.subtitle}>Sporting</Text>
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
    logo: {
        width: 96,
        height: 96,
        marginTop: 24,
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