// src/models/ProductModel.ts
// ====================================================
// MODELO: PRODUCTO
// ====================================================
import httpService from '../services/httpService'
import API_CONFIG from '../config/api'

class ProductModel {
    static async getAllProducts() {
        try {
            const response = await httpService.get(API_CONFIG.ENDPOINTS.PRODUCTS, false)

            let productsArray: any[] = []
            if (response && response.data && Array.isArray(response.data)) {
                productsArray = response.data
            } else if (Array.isArray(response)) {
                productsArray = response
            }

            return { success: true, data: productsArray }
        } catch (error: any) {
            console.error('Error al obtener productos:', error)
            return { success: false, error: error.message || 'Error al cargar productos' }
        }
    }

    static async createProduct(productData: any) {
        try {
            const response = await httpService.post(
                API_CONFIG.ENDPOINTS.PRODUCT_CREATE,
                productData,
                true
            )

            return { success: true, data: response.data || response }
        } catch (error: any) {
            return { success: false, error: error.message || 'Error al crear producto' }
        }
    }

    static async deleteProduct(id: number | string) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.PRODUCT_DELETE.replace(':id', String(id))
            const response = await httpService.delete(endpoint, true)
            return { success: true, data: response }
        } catch (error: any) {
            return { success: false, error: error.message || 'Error al eliminar producto' }
        }
    }
}

export default ProductModel