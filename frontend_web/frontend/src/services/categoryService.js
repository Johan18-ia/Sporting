import httpService from './httpService'
import API_CONFIG from '../config/api'

class CategoryService {
  static async getAll() {
    try {
      const response = await httpService.get(API_CONFIG.ENDPOINTS.CATEGORIES, true)
      return { success: true, data: response?.data || response || [] }
    } catch (error) {
      return { success: false, error: error.message || 'Error al cargar categorías' }
    }
  }

  static async create(data) {
    try {
      const response = await httpService.post(API_CONFIG.ENDPOINTS.CATEGORY_CREATE, data, true)
      return { success: true, data: response?.data || response || null }
    } catch (error) {
      return { success: false, error: error.message || 'Error al crear categoría' }
    }
  }
}

export default CategoryService
