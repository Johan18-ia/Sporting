// src/views/ui/Card.tsx
import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'

interface CardProps {
    title?: string
    children: React.ReactNode
    style?: ViewStyle
}

const Card: React.FC<CardProps> = ({ title, children, style }) => {
    return (
        <View style={[styles.card, style]}>
            {title && <Text style={styles.title}>{title}</Text>}
            <View style={styles.body}>{children}</View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#eee',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#8B0000',
        marginBottom: 12,
    },
    body: {
        // Contenido interno
    },
})

export default Card