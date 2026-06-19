// frontend_web/frontend/src/controllers/CategoryController.js
import CategoryModel from '../models/CategoryModel'
import AuthController from './AuthController'

class CategoryController {
  static async getAllCategories(onSuccess, onError) {
    try {
      if (!AuthController.hasAnyRole(['admin', 'seller'])) {
        onError('No tiene permisos para ver categorías')
        return
      }
      
      const result = await CategoryModel.getAllCategories()
      if (result.success) {
        onSuccess(result.data)
      } else {
        onError(result.error)
      }
    } catch (error) {
      onError('Error al cargar categorías')
    }
  }

  static async createCategory(categoryData, onSuccess, onError) {
    try {
      if (!AuthController.hasAnyRole(['admin', 'seller'])) {
        onError('No tiene permisos para crear categorías')
        return
      }
      
      if (!categoryData.name_year) {
        onError('El año de la categoría es requerido')
        return
      }
      
      const result = await CategoryModel.createCategory(categoryData)
      if (result.success) {
        onSuccess(result.data)
      } else {
        onError(result.error)
      }
    } catch (error) {
      onError('Error al crear categoría')
    }
  }

  static async deleteCategory(id, onSuccess, onError) {
    try {
      if (!AuthController.hasRole('admin')) {
        onError('Solo administradores pueden eliminar categorías')
        return
      }
      
      const result = await CategoryModel.deleteCategory(id)
      if (result.success) {
        onSuccess()
      } else {
        onError(result.error)
      }
    } catch (error) {
      onError('Error al eliminar categoría')
    }
  }
}

export default CategoryController