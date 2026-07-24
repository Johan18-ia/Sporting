// src/views/ui/PageHeader.tsx
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface PageHeaderProps {
    title: string
    description?: string
    actions?: React.ReactNode
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions }) => {
    return (
        <View style={styles.container}>
            <View style={styles.left}>
                <Text style={styles.title}>{title}</Text>
                {description && <Text style={styles.description}>{description}</Text>}
            </View>
            {actions && <View style={styles.actions}>{actions}</View>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
        flexWrap: 'wrap',
    },
    left: {
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    actions: {
        marginTop: 4,
    },
})

export default PageHeader