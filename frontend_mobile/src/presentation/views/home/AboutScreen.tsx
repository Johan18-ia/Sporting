// src/presentation/views/home/AboutScreen.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MyColors } from '../../theme/AppTheme';

export const AboutScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.iconWrap}>
                <Ionicons name="people" size={32} color="#fff" />
            </View>
            <Text style={styles.eyebrow}>Quiénes somos</Text>
            <Text style={styles.title}>Sobre Nosotros</Text>
            <Text style={styles.paragraph}>
                Sporting Club es una escuela de microfútbol enfocada en la formación técnica,
                física y en valores de niños y jóvenes. Contamos con categorías por año de
                nacimiento, horarios de entrenamiento organizados y torneos internos para que
                cada estudiante compita y crezca dentro del club.
            </Text>
            <Text style={styles.subtitle}>Nuestra metodología</Text>
            <Text style={styles.paragraph}>
                Cada categoría entrena con planes adaptados a su edad, acompañados por
                profesores con experiencia en formación deportiva infantil y juvenil.
            </Text>
            <Text style={styles.subtitle}>Nuestros valores</Text>
            <Text style={styles.paragraph}>
                Trabajo en equipo, disciplina y respeto son la base de cada sesión de
                entrenamiento, dentro y fuera de la cancha.
            </Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 24,
    },
    iconWrap: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: MyColors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    eyebrow: {
        fontSize: 12,
        fontWeight: '700',
        color: MyColors.primary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#222',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 15.5,
        fontWeight: '700',
        color: MyColors.primary,
        marginTop: 14,
        marginBottom: 6,
    },
    paragraph: {
        fontSize: 14,
        lineHeight: 21,
        color: '#555',
    },
});