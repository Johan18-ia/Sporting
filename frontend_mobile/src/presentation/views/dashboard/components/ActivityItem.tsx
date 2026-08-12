// src/presentation/views/dashboard/components/ActivityItem.tsx
// Encargado: Componente - ActivityItem
// Descripción: Item de actividad reciente mostrado en Dashboard
// Archivo: src/presentation/views/dashboard/components/ActivityItem.tsx
// ============================================
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActivityItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
    time: string;
    type?: 'success' | 'warning' | 'error' | 'info';
}

export const ActivityItem = ({
    icon,
    title,
    description,
    time,
    type = 'info',
}: ActivityItemProps) => {
    const getColor = () => {
        switch (type) {
            case 'success':
                return '#28a745';
            case 'warning':
                return '#f59e0b';
            case 'error':
                return '#dc3545';
            default:
                return '#2196F3';
        }
    };

    const color = getColor();

    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={20} color={color} />
            </View>
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>
                    {title}
                </Text>
                <Text style={styles.description} numberOfLines={1}>
                    {description}
                </Text>
            </View>
            <Text style={styles.time}>{time}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    description: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    time: {
        fontSize: 11,
        color: '#999',
        marginLeft: 8,
    },
});