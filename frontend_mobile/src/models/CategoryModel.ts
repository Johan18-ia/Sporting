// src/models/CategoryModel.ts
// ====================================================
// MODELO: CATEGORÍA
// ====================================================
import httpService from '../services/httpService'
import API_CONFIG from '../config/api'

class CategoryModel {
    static async getAllCategories() {
        try {
            const response = await httpService.get(API_CONFIG.ENDPOINTS.CATEGORIES, true)

            let categoriesArray: any[] = []
            if (response && response.data && Array.isArray(response.data)) {
                categoriesArray = response.data
            } else if (Array.isArray(response)) {
                categoriesArray = response
            }

            return {
                success: true,
                data: categoriesArray
            }
        } catch (error: any) {
            console.error('Error al obtener categorías:', error)
            return {
                success: false,
                error: error.message || 'Error al cargar categorías'
            }
        }
    }

    static async createCategory(categoryData: any) {
        try {
            const payload = {
                category_year: categoryData.category_year || categoryData.name_year,
                description: categoryData.description || ''
            }

            const response = await httpService.post(
                API_CONFIG.ENDPOINTS.CATEGORY_CREATE,
                payload,
                true
            )

            return {
                success: true,
                data: response.data || response,
                message: 'Categoría creada exitosamente'
            }
        } catch (error: any) {
            console.error('Error al crear categoría:', error)
            return {
                success: false,
                error: error.message || 'Error al crear categoría'
            }
        }
    }

    static async deleteCategory(id: number | string) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.CATEGORY_DELETE.replace(':id', String(id))
            const response = await httpService.delete(endpoint, true)

            return {
                success: true,
                data: response,
                message: 'Categoría eliminada exitosamente'
            }
        } catch (error: any) {
            console.error('Error al eliminar categoría:', error)
            return {
                success: false,
                error: error.message || 'Error al eliminar categoría'
            }
        }
    }
}

export default CategoryModel