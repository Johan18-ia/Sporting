// src/views/ui/Button.tsx
import React from 'react'
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native'

interface ButtonProps {
    title: string
    onPress: () => void
    variant?: 'primary' | 'secondary' | 'danger' | 'success'
    size?: 'small' | 'medium' | 'large'
    loading?: boolean
    disabled?: boolean
    fullWidth?: boolean
    style?: ViewStyle
    textStyle?: TextStyle
}

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    fullWidth = false,
    style,
    textStyle,
}) => {
    const getBackgroundColor = () => {
        if (disabled || loading) return '#ccc'
        switch (variant) {
            case 'primary': return '#8B0000'
            case 'secondary': return '#6c757d'
            case 'danger': return '#dc3545'
            case 'success': return '#28a745'
            default: return '#8B0000'
        }
    }

    const getPadding = () => {
        switch (size) {
            case 'small': return { paddingVertical: 6, paddingHorizontal: 12 }
            case 'large': return { paddingVertical: 14, paddingHorizontal: 24 }
            default: return { paddingVertical: 10, paddingHorizontal: 20 }
        }
    }

    const getFontSize = () => {
        switch (size) {
            case 'small': return 12
            case 'large': return 18
            default: return 14
        }
    }

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: getBackgroundColor() },
                getPadding(),
                fullWidth && styles.fullWidth,
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color="#fff" size="small" />
            ) : (
                <Text
                    style={[
                        styles.text,
                        { fontSize: getFontSize() },
                        textStyle,
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    fullWidth: {
        width: '100%',
    },
    text: {
        color: '#fff',
        fontWeight: '600',
    },
})

export default Button