// Encargado: Estilos - Home
// Descripción: Estilos modulares para la pantalla pública Home
// Archivo: src/presentation/views/home/styles.ts
// ============================================
// src/presentation/views/home/styles.ts
import { StyleSheet } from 'react-native';
import { MyColors } from '../../theme/AppTheme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    // ===== HERO =====
    hero: {
        backgroundColor: MyColors.primary,
        paddingHorizontal: 24,
        paddingTop: 70,
        paddingBottom: 50,
    },
    heroEyebrow: {
        color: '#ffcdd2',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 10,
    },
    heroTitle: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '800',
        lineHeight: 34,
        marginBottom: 14,
    },
    heroSubtitle: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 24,
    },
    heroActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    heroBtnPrimary: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 22,
        borderRadius: 8,
    },
    heroBtnPrimaryText: {
        color: MyColors.primary,
        fontWeight: '700',
        fontSize: 14,
    },
    heroBtnSecondary: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        paddingVertical: 12,
        paddingHorizontal: 22,
        borderRadius: 8,
    },
    heroBtnSecondaryText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },

    // ===== SOBRE NOSOTROS =====
    about: {
        padding: 24,
        backgroundColor: '#fff',
    },
    sectionEyebrow: {
        color: MyColors.primary,
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 6,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#333',
        marginBottom: 14,
    },
    aboutText: {
        fontSize: 14,
        lineHeight: 21,
        color: '#555',
        marginBottom: 12,
    },

    // ===== CATALOGO =====
    catalog: {
        padding: 24,
        backgroundColor: MyColors.background,
    },
    catalogSubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    errorText: {
        color: MyColors.danger,
        textAlign: 'center',
        marginTop: 10,
    },
    emptyText: {
        color: '#999',
        textAlign: 'center',
        marginTop: 10,
        fontStyle: 'italic',
    },
    productCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 5,
        elevation: 2,
    },
    productImage: {
        width: '100%',
        height: 180,
        backgroundColor: MyColors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    productImageInner: {
        width: '100%',
        height: '100%',
    },
    productImageNoImage: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 18,
        textAlign: 'center',
        paddingHorizontal: 12,
    },
    productBody: {
        padding: 16,
    },
    productName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    productDescription: {
        fontSize: 13,
        color: '#666',
        marginBottom: 14,
    },
    productFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    productBtn: {
        backgroundColor: '#25d366',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    productBtnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});