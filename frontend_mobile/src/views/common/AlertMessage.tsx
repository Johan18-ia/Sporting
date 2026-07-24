// src/views/common/AlertMessage.tsx
import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

interface AlertMessageProps {
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    onClose?: () => void
    duration?: number
}

const AlertMessage: React.FC<AlertMessageProps> = ({
    type,
    message,
    onClose,
    duration = 5000,
}) => {
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                setVisible(false)
                if (onClose) setTimeout(onClose, 300)
            }, duration)
            return () => clearTimeout(timer)
        }
    }, [duration, onClose])

    if (!visible) return null

    const getColors = () => {
        switch (type) {
            case 'success': return { bg: '#d4edda', text: '#155724', border: '#28a745' }
            case 'error': return { bg: '#f8d7da', text: '#721c24', border: '#dc3545' }
            case 'warning': return { bg: '#fff3cd', text: '#856404', border: '#ffc107' }
            case 'info': return { bg: '#d1ecf1', text: '#0c5460', border: '#17a2b8' }
            default: return { bg: '#f8f9fa', text: '#333', border: '#6c757d' }
        }
    }

    const colors = getColors()

    return (
        <View style={[styles.container, { backgroundColor: colors.bg, borderLeftColor: colors.border }]}>
            <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
            {onClose && (
                <TouchableOpacity onPress={() => { setVisible(false); setTimeout(onClose, 300) }} style={styles.closeButton}>
                    <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        borderLeftWidth: 4,
        justifyContent: 'space-between',
    },
    message: {
        fontSize: 14,
        flex: 1,
    },
    closeButton: {
        padding: 4,
        marginLeft: 10,
    },
    closeText: {
        fontSize: 18,
        color: '#666',
    },
})

export default AlertMessage