// src/presentation/views/catalog/styles.ts
import { StyleSheet } from 'react-native';
import { MyColors } from '../../theme/AppTheme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },
    grid: {
        padding: 16,
    },
    errorText: {
        color: MyColors.danger,
        textAlign: 'center',
        marginTop: 20,
    },
    emptyText: {
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic',
    },
    productCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
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
        height: 170,
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
        fontSize: 17,
        textAlign: 'center',
        paddingHorizontal: 12,
    },
    productBody: {
        padding: 14,
    },
    productName: {
        fontSize: 15.5,
        fontWeight: '700',
        color: '#333',
        marginBottom: 3,
    },
    productDescription: {
        fontSize: 12.5,
        color: '#666',
        marginBottom: 12,
    },
    productFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productPrice: {
        fontSize: 15,
        fontWeight: '700',
        color: '#333',
    },
    productBtn: {
        backgroundColor: '#25d366',
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    productBtnText: {
        color: '#fff',
        fontSize: 11.5,
        fontWeight: '600',
    },
});