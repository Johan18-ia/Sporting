// frontend_web/frontend/src/controllers/ProductController.js
import ProductModel from '../models/ProductModel'
import AuthController from './AuthController'

class ProductController {
  static async getAllProducts(onSuccess: (data: any) => void, onError: (message: string) => void) {
    try {
      const result = await ProductModel.getAllProducts()
      if (result.success) {
        onSuccess(result.data)
      } else {
        onError(result.error)
      }
    } catch (error) {
      onError('Error al cargar productos')
    }
  }

  static async createProduct(productData: Record<string, unknown>, onSuccess: (data: any) => void, onError: (message: string) => void) {
    try {
      if (!(await AuthController.hasAnyRole(['admin', 'seller']))) {
        onError('No tiene permisos para crear productos')
        return
      }

      if (!productData.nombre || !productData.precio) {
        onError('Nombre y precio son requeridos')
        return
      }

      const result = await ProductModel.createProduct(productData)
      if (result.success) {
        onSuccess(result.data)
      } else {
        onError(result.error)
      }
    } catch (error) {
      onError('Error al crear producto')
    }
  }

  static async deleteProduct(id: number | string, onSuccess: () => void, onError: (message: string) => void) {
    try {
      if (!(await AuthController.hasRole('admin'))) {
        onError('Solo administradores pueden eliminar productos')
        return
      }

      const result = await ProductModel.deleteProduct(id)
      if (result.success) {
        onSuccess()
      } else {
        onError(result.error)
      }
    } catch (error) {
      onError('Error al eliminar producto')
    }
  }
}

export default ProductController