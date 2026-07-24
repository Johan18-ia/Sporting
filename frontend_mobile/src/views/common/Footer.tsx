// src/views/common/Footer.tsx
// ====================================================
// COMPONENTE: FOOTER - Adaptado para React Native
// ====================================================
import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    Linking,
    TouchableOpacity,
    ScrollView,
} from 'react-native'

// ============================================
// IMPORTAR LOGO
// ============================================
import logoSporting from '../../assets/logo.png'

interface FooterProps {
    showSocial?: boolean
}

const Footer: React.FC<FooterProps> = ({ showSocial = true }) => {
    // ============================================
    // MANEJADORES DE ENLACES
    // ============================================
    const handleLinkPress = (url: string) => {
        Linking.openURL(url).catch(() => {
            // Si no se puede abrir, mostrar mensaje o ignorar
        })
    }

    const handlePhonePress = (phone: string) => {
        Linking.openURL(`tel:${phone}`).catch(() => {})
    }

    const handleEmailPress = (email: string) => {
        Linking.openURL(`mailto:${email}`).catch(() => {})
    }

    return (
        <ScrollView style={styles.footer}>
            <View style={styles.container}>
                {/* ============================================
                FILA 1: Logo y Eslogan
                ============================================ */}
                <View style={styles.row}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={logoSporting}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.slogan}>
                            "Formando campeones para la vida."
                        </Text>
                    </View>
                </View>

                {/* ============================================
                FILA 2: Enlaces Rápidos
                ============================================ */}
                <View style={styles.row}>
                    <Text style={styles.title}>Enlaces Rápidos</Text>
                    <TouchableOpacity onPress={() => handleLinkPress('#')}>
                        <Text style={styles.link}>Sobre Nosotros</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleLinkPress('#')}>
                        <Text style={styles.link}>Categorías</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleLinkPress('#')}>
                        <Text style={styles.link}>Inscripciones</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleLinkPress('#')}>
                        <Text style={styles.link}>Contacto</Text>
                    </TouchableOpacity>
                </View>

                {/* ============================================
                FILA 3: Contacto
                ============================================ */}
                <View style={styles.row}>
                    <Text style={styles.title}>Contáctanos</Text>
                    <Text style={styles.contactText}>📍 Calle 129 B #95 6 #123, Bogotá</Text>
                    
                    <TouchableOpacity onPress={() => handlePhonePress('+573001234567')}>
                        <Text style={styles.contactLink}>📞 +57 300 123 4567</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => handleEmailPress('contacto@sporting.com')}>
                        <Text style={styles.contactLink}>✉️ contacto@sporting.com</Text>
                    </TouchableOpacity>
                </View>

                {/* ============================================
                FILA 4: Copyright
                ============================================ */}
                <View style={styles.bottomRow}>
                    <Text style={styles.copyright}>
                        &copy; 2024 Sporting Deportivo. Todos los derechos reservados.
                    </Text>
                    <TouchableOpacity onPress={() => handleLinkPress('#')}>
                        <Text style={styles.privacyLink}>Política de Privacidad</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

// ============================================
// ESTILOS
// ============================================
const styles = StyleSheet.create({
    footer: {
        backgroundColor: '#111111',
        paddingVertical: 30,
        paddingHorizontal: 20,
        marginTop: 'auto',
    },
    container: {
        maxWidth: 1200,
        width: '100%',
        alignSelf: 'center',
    },
    row: {
        marginBottom: 24,
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
    },
    logo: {
        width: 120,
        height: 70,
        marginBottom: 10,
    },
    slogan: {
        color: '#aaaaaa',
        fontStyle: 'italic',
        fontSize: 14,
        textAlign: 'center',
    },
    title: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        textAlign: 'center',
    },
    link: {
        color: '#cccccc',
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 4,
    },
    contactText: {
        color: '#cccccc',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 4,
    },
    contactLink: {
        color: '#cccccc',
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 4,
    },
    bottomRow: {
        borderTopWidth: 1,
        borderTopColor: '#333333',
        paddingTop: 20,
        marginTop: 10,
        alignItems: 'center',
    },
    copyright: {
        color: '#888888',
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 8,
    },
    privacyLink: {
        color: '#888888',
        fontSize: 12,
        textAlign: 'center',
    },
})

export default Footer