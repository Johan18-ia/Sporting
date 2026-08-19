// src/presentation/components/RoundedButton.tsx
// Encargado: Componente - RoundedButton
// Descripción: Botón con bordes redondeados reutilizable
// Archivo: src/presentation/components/RoundedButton.tsx
// ============================================
import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { MyColors } from '../theme/AppTheme';

interface Props {
    text: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    backgroundColor?: string;
    textColor?: string;
}

export const RoundedButton = ({
    text,
    onPress,
    loading = false,
    disabled = false,
    backgroundColor = MyColors.primary,
    textColor = '#fff',
}: Props) => {
    return (
        <TouchableOpacity
            style={[
                styles.roundedButton,
                { backgroundColor },
                (disabled || loading) && styles.disabled,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color="#fff" size="small" />
            ) : (
                <Text style={[styles.textButton, { color: textColor }]}>
                    {text}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    roundedButton: {
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    disabled: {
        opacity: 0.6,
    },
    textButton: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});