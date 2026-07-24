// src/views/common/Navbar.tsx
// Nota: En React Native, la navegación se maneja con React Navigation.
// Este componente es un header simple para pantallas que lo necesiten.
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'

interface NavbarProps {
    title?: string
    showBack?: boolean
    rightComponent?: React.ReactNode
}

const Navbar: React.FC<NavbarProps> = ({ title, showBack = false, rightComponent }) => {
    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            <View style={styles.left}>
                {showBack && (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backText}>←</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.center}>
                <Text style={styles.title}>{title || 'Sporting Club'}</Text>
            </View>

            <View style={styles.right}>
                {rightComponent}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#8B0000',
        minHeight: 56,
    },
    left: {
        width: 50,
        alignItems: 'flex-start',
    },
    center: {
        flex: 1,
        alignItems: 'center',
    },
    right: {
        width: 50,
        alignItems: 'flex-end',
    },
    backButton: {
        padding: 4,
    },
    backText: {
        color: '#fff',
        fontSize: 24,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
})

export default Navbar