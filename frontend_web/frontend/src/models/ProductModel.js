// frontend_web/frontend/src/models/ProductModel.js
import httpService from '../services/httpService'
import API_CONFIG from '../config/api'

class ProductModel {
  static async getAllProducts() {
    try {
      const response = await httpService.get(API_CONFIG.ENDPOINTS.PRODUCTS, true)

      let productsArray = []
      if (response && response.data && Array.isArray(response.data)) {
        productsArray = response.data
      } else if (Array.isArray(response)) {
        productsArray = response
      }

      return { success: true, data: productsArray }
    } catch (error) {
      console.error('Error al obtener productos:', error)
      return { success: false, error: error.message || 'Error al cargar productos' }
    }
  }

  static async createProduct(productData) {
    try {
      const response = await httpService.post(
        API_CONFIG.ENDPOINTS.PRODUCT_CREATE,
        productData,
        true
      )

      return { success: true, data: response.data || response }
    } catch (error) {
      return { success: false, error: error.message || 'Error al crear producto' }
    }
  }

  static async deleteProduct(id) {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.PRODUCT_DELETE.replace(':id', id)
      const response = await httpService.delete(endpoint, true)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message || 'Error al eliminar producto' }
    }
  }
}

export default ProductModel