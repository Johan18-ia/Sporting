// src/presentation/views/dashboard/components/StatsCard.tsx
// Encargado: Componente - StatsCard
// Descripción: Tarjeta de estadística usada en el Dashboard
// Archivo: src/presentation/views/dashboard/components/StatsCard.tsx
// ============================================
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MyColors } from '../../../theme/AppTheme';

interface StatsCardProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: number | string;
    color?: string;
    onPress?: () => void;
    loading?: boolean;
}

export const StatsCard = ({
    icon,
    label,
    value,
    color = MyColors.primary,
    onPress,
    loading = false,
}: StatsCardProps) => {
    return (
        <TouchableOpacity
            style={[styles.container, { borderLeftColor: color }]}
            onPress={onPress}
            activeOpacity={0.7}
            disabled={!onPress}
        >
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={28} color={color} />
            </View>
            <View style={styles.content}>
                <Text style={styles.value}>
                    {loading ? '...' : value}
                </Text>
                <Text style={styles.label}>{label}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 10,
        width: '48%',
    },
    iconContainer: {
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    value: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    label: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
});