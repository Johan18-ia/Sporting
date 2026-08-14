// Encargado: Pantalla de Configuración
// Descripción: Muestra opciones de usuario como notificaciones y modo oscuro dentro del perfil del cliente móvil.
// Archivo: src/presentation/views/profile/SettingsScreen.tsx
// ============================================
// NOTAS: Es una pantalla demo con switches funcionales para preferencias del usuario.
// Puede ampliarse con configuración persistente y sincronización con backend.
// ============================================
import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { MyColors } from '../../theme/AppTheme';

export const SettingsScreen = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Configuración</Text>
            <View style={styles.option}>
                <Text style={styles.optionLabel}>Recibir notificaciones</Text>
                <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    trackColor={{ false: '#ccc', true: MyColors.primary }}
                    thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
                />
            </View>
            <View style={styles.option}>
                <Text style={styles.optionLabel}>Modo oscuro</Text>
                <Switch
                    value={darkModeEnabled}
                    onValueChange={setDarkModeEnabled}
                    trackColor={{ false: '#ccc', true: MyColors.primary }}
                    thumbColor={darkModeEnabled ? '#fff' : '#f4f3f4'}
                />
            </View>
            <Text style={styles.note}>Estas opciones son de demostración y pueden ajustarse según las preferencias del usuario.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: MyColors.primary,
        marginBottom: 20,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    optionLabel: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
    },
    note: {
        marginTop: 16,
        color: '#666',
        fontSize: 14,
        lineHeight: 20,
    },
});
