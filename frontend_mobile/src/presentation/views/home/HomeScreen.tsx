// src/presentation/views/home/HomeScreen.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { MyColors } from '../../theme/AppTheme';
import { styles } from './styles';

export const HomeScreen = () => {
    // navigation del stack raiz (para poder "salir" de los tabs hacia
    // Login o SobreNosotros), y navigation del tab actual (para
    // cambiar al tab de Catálogo).
    const rootNavigation = useNavigation<any>();

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* ===== HEADER ===== */}
            <View style={styles.topHeader}>
                <View>
                    <Text style={styles.topHeaderEyebrow}>Sporting Club</Text>
                    <Text style={styles.topHeaderTitle}>Escuela de Microfútbol</Text>
                </View>
                <View style={styles.logoCircle}>
                    <Ionicons name="football" size={26} color="#fff" />
                </View>
            </View>

            {/* ===== HERO CARD ===== */}
            <View style={styles.heroCard}>
                <Text style={styles.heroTitle}>Formando Campeones, Dentro y Fuera de la Cancha</Text>
                <Text style={styles.heroSubtitle}>
                    Disciplina, trabajo en equipo y crecimiento para cada estudiante.
                </Text>
                <TouchableOpacity
                    style={styles.heroButton}
                    onPress={() => rootNavigation.navigate('Catálogo')}
                >
                    <Text style={styles.heroButtonText}>Ver Catálogo</Text>
                    <Ionicons name="arrow-forward" size={16} color={MyColors.primary} />
                </TouchableOpacity>
            </View>

            {/* ===== OPTION CARDS ===== */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Explora</Text>
            </View>

            <TouchableOpacity
                style={styles.optionCard}
                activeOpacity={0.7}
                onPress={() => rootNavigation.navigate('SobreNosotros')}
            >
                <View style={styles.optionIcon}>
                    <Ionicons name="people-outline" size={24} color={MyColors.primary} />
                </View>
                <View style={styles.optionTextGroup}>
                    <Text style={styles.optionTitle}>Sobre Nosotros</Text>
                    <Text style={styles.optionDescription}>Conoce nuestra escuela y nuestros valores</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.optionCard}
                activeOpacity={0.7}
                onPress={() => rootNavigation.navigate('Catálogo')}
            >
                <View style={styles.optionIcon}>
                    <Ionicons name="bag-outline" size={24} color={MyColors.primary} />
                </View>
                <View style={styles.optionTextGroup}>
                    <Text style={styles.optionTitle}>Catálogo</Text>
                    <Text style={styles.optionDescription}>Uniformes, balones y accesorios oficiales</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.optionCard}
                activeOpacity={0.7}
                onPress={() => rootNavigation.navigate('Login')}
            >
                <View style={styles.optionIcon}>
                    <Ionicons name="log-in-outline" size={24} color={MyColors.primary} />
                </View>
                <View style={styles.optionTextGroup}>
                    <Text style={styles.optionTitle}>Iniciar Sesión</Text>
                    <Text style={styles.optionDescription}>Accede al panel de administración</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            <View style={{ height: 24 }} />
        </ScrollView>
    );
};