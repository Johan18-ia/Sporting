// src/presentation/components/AlertMessage.tsx
// Encargado: Componente - AlertMessage
// Descripción: Mensaje de alerta estilizado para errores/éxito
// Archivo: src/presentation/components/AlertMessage.tsx
// ============================================
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    onClose?: () => void;
    duration?: number;
}

export const AlertMessage = ({ type, message, onClose, duration = 5000 }: Props) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                setVisible(false);
                if (onClose) setTimeout(onClose, 300);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    if (!visible) return null;

    const getColors = () => {
        switch (type) {
            case 'success':
                return { bg: '#d4edda', text: '#155724', border: '#c3e6cb' };
            case 'error':
                return { bg: '#f8d7da', text: '#721c24', border: '#f5c6cb' };
            case 'warning':
                return { bg: '#fff3cd', text: '#856404', border: '#ffeeba' };
            default:
                return { bg: '#d1ecf1', text: '#0c5460', border: '#bee5eb' };
        }
    };

    const colors = getColors();

    return (
        <View style={[styles.container, { backgroundColor: colors.bg, borderColor: colors.border }]}>
            <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
            {onClose && (
                <TouchableOpacity onPress={() => {
                    setVisible(false);
                    setTimeout(onClose, 300);
                }}>
                    <Ionicons name="close-circle" size={24} color={colors.text} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 10,
    },
    message: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        marginRight: 10,
    },
});