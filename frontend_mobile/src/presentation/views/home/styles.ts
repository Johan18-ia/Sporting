// src/presentation/views/home/styles.ts
import { StyleSheet } from 'react-native';
import { MyColors } from '../../theme/AppTheme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },

    // ===== HEADER =====
    topHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 14,
    },
    topHeaderEyebrow: {
        fontSize: 12,
        fontWeight: '700',
        color: MyColors.primary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    topHeaderTitle: {
        fontSize: 19,
        fontWeight: '800',
        color: '#222',
        marginTop: 2,
    },
    logoCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: MyColors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // ===== HERO CARD =====
    heroCard: {
        marginHorizontal: 16,
        backgroundColor: MyColors.primary,
        borderRadius: 18,
        padding: 22,
        marginBottom: 10,
    },
    heroTitle: {
        color: '#fff',
        fontSize: 19,
        fontWeight: '800',
        lineHeight: 25,
        marginBottom: 8,
    },
    heroSubtitle: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 18,
    },
    heroButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 10,
        gap: 6,
    },
    heroButtonText: {
        color: MyColors.primary,
        fontWeight: '700',
        fontSize: 13.5,
    },

    // ===== SECTION =====
    sectionHeader: {
        paddingHorizontal: 20,
        marginTop: 18,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#333',
    },

    // ===== OPTION CARDS =====
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 14,
        padding: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    optionIcon: {
        width: 46,
        height: 46,
        borderRadius: 12,
        backgroundColor: 'rgba(139,0,0,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    optionTextGroup: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 14.5,
        fontWeight: '700',
        color: '#333',
    },
    optionDescription: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },
});