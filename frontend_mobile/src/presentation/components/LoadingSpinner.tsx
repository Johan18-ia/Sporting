// src/presentation/components/LoadingSpinner.tsx
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { MyColors } from '../theme/AppTheme';

interface Props {
    message?: string;
}

export const LoadingSpinner = ({ message = 'Cargando...' }: Props) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={MyColors.primary} />
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    message: {
        marginTop: 15,
        fontSize: 16,
        color: '#666',
    },
});