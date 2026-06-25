import httpService from '../services/httpService'
import API_CONFIG from '../config/api'

class ProductModel {
  // Obtener todos los productos del catálogo
  static async getAllProducts() {
    try {
      // Intentará usar la ruta oficial o una por defecto si tu amigo no la ha creado en API_CONFIG
      const response = await httpService.get(API_CONFIG.ENDPOINTS.PRODUCTS || '/api/products', true)
      return { success: true, data: Array.isArray(response.data) ? response.data : [] }
    } catch (error) {
      return { success: false, error: error.message || 'Error al cargar el catálogo de productos' }
    }
  }
}

export default ProductModel