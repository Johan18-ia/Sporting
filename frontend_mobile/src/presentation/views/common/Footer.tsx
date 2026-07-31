// src/presentation/views/common/Footer.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MyColors } from '../../theme/AppTheme';

interface FooterProps {
    showSocial?: boolean;
}

export const Footer = ({ showSocial = true }: FooterProps) => {
    const currentYear = new Date().getFullYear();

    const openLink = (url: string) => {
        Linking.openURL(url).catch(() => {});
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.logoSection}>
                    <Image
                        source={require('../../../../assets/logo.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.logoText}>SPORTING CLUB</Text>
                    <Text style={styles.slogan}>"Formando campeones para la vida"</Text>
                </View>

                {showSocial && (
                    <View style={styles.socialSection}>
                        <Text style={styles.socialTitle}>Síguenos</Text>
                        <View style={styles.socialIcons}>
                            <TouchableOpacity
                                style={styles.socialIcon}
                                onPress={() => openLink('https://facebook.com')}
                            >
                                <Ionicons name="logo-facebook" size={24} color="#ccc" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.socialIcon}
                                onPress={() => openLink('https://instagram.com')}
                            >
                                <Ionicons name="logo-instagram" size={24} color="#ccc" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.socialIcon}
                                onPress={() => openLink('https://youtube.com')}
                            >
                                <Ionicons name="logo-youtube" size={24} color="#ccc" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.socialIcon}
                                onPress={() => openLink('https://twitter.com')}
                            >
                                <Ionicons name="logo-twitter" size={24} color="#ccc" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <View style={styles.contactSection}>
                    <Text style={styles.contactTitle}>Contáctanos</Text>
                    <TouchableOpacity
                        style={styles.contactItem}
                        onPress={() => openLink('tel:+573001234567')}
                    >
                        <Ionicons name="call-outline" size={16} color="#aaa" />
                        <Text style={styles.contactText}>+57 300 123 4567</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.contactItem}
                        onPress={() => openLink('mailto:contacto@sporting.com')}
                    >
                        <Ionicons name="mail-outline" size={16} color="#aaa" />
                        <Text style={styles.contactText}>contacto@sporting.com</Text>
                    </TouchableOpacity>
                    <View style={styles.contactItem}>
                        <Ionicons name="location-outline" size={16} color="#aaa" />
                        <Text style={styles.contactText}>Calle 123 #45-67, Bogotá</Text>
                    </View>
                </View>
            </View>

            <View style={styles.bottomBar}>
                <Text style={styles.copyright}>
                    © {currentYear} Sporting Club. Todos los derechos reservados.
                </Text>
                <View style={styles.bottomLinks}>
                    <TouchableOpacity>
                        <Text style={styles.bottomLink}>Términos</Text>
                    </TouchableOpacity>
                    <Text style={styles.bottomSeparator}>•</Text>
                    <TouchableOpacity>
                        <Text style={styles.bottomLink}>Privacidad</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1a1a1a',
        paddingTop: 24,
        paddingBottom: 12,
    },
    content: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    logoSection: {
        alignItems: 'center',
        minWidth: 120,
        marginBottom: 16,
    },
    logoImage: {
        width: 50,
        height: 50,
        marginBottom: 6,
    },
    logoText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: MyColors.primary,
        letterSpacing: 1,
    },
    slogan: {
        fontSize: 11,
        color: '#888',
        fontStyle: 'italic',
        marginTop: 2,
    },
    socialSection: {
        alignItems: 'center',
        minWidth: 100,
        marginBottom: 16,
    },
    socialTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#888',
        marginBottom: 8,
    },
    socialIcons: {
        flexDirection: 'row',
        gap: 12,
    },
    socialIcon: {
        padding: 4,
    },
    contactSection: {
        minWidth: 120,
        marginBottom: 16,
    },
    contactTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#888',
        marginBottom: 8,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    contactText: {
        fontSize: 12,
        color: '#aaa',
    },
    bottomBar: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#333',
        paddingTop: 12,
        gap: 8,
    },
    copyright: {
        fontSize: 11,
        color: '#666',
    },
    bottomLinks: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    bottomLink: {
        fontSize: 11,
        color: '#888',
    },
    bottomSeparator: {
        fontSize: 11,
        color: '#555',
    },
});
