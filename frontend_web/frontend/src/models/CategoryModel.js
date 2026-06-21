// frontend_web/frontend/src/models/CategoryModel.js
import httpService from '../services/httpService'
import API_CONFIG from '../config/api'

class CategoryModel {
  static async getAllCategories() {
    try {
      const response = await httpService.get(API_CONFIG.ENDPOINTS.CATEGORIES, true)

      let categoriesArray = []
      if (response && response.data && Array.isArray(response.data)) {
        categoriesArray = response.data
      }

      return { success: true, data: categoriesArray }
    } catch (error) {
      return { success: false, error: error.message || 'Error al cargar categorías' }
    }
  }

  static async createCategory(categoryData) {
    try {
      const response = await httpService.post(
        API_CONFIG.ENDPOINTS.CATEGORY_CREATE,
        categoryData,
        true
      )
      return { success: true, data: response.data || response }
    } catch (error) {
      return { success: false, error: error.message || 'Error al crear categoría' }
    }
  }

  static async deleteCategory(id) {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.CATEGORY_DELETE.replace(':id', id)
      const response = await httpService.delete(endpoint, true)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message || 'Error al eliminar categoría' }
    }
  }
}

export default CategoryModel