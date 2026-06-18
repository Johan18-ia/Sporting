// src/models/UserModel.js
import httpService from '../services/httpService'
import API_CONFIG from '../config/api'

class UserModel {
  // ============================================
  // LISTAR USUARIOS
  // ============================================
  static async getAllUsers() {
    try {
      console.log('📋 Consultando usuarios')
      const response = await httpService.get(
        API_CONFIG.ENDPOINTS.USERS
      )
      const users = response.data || []
      return {
        success: true,
        data: users
      }
    } catch (error) {
      console.error(
        '❌ Error obteniendo usuarios:',
        error
      )
      return {
        success: false,
        error:
          error.message ||
          'Error al obtener usuarios'
      }
    }
  }
  // ============================================
  // OBTENER USUARIO POR ID
  // ============================================
  static async getUserById(id) {
    try {
      console.log(
        `🔍 Consultando usuario ${id}`
      )
      const response = await httpService.get(
        `/users/${id}`
      )
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error(
        '❌ Error obteniendo usuario:',
        error
      )
      return {
        success: false,
        error:
          error.message ||
          'Usuario no encontrado'
      }
    }
  }
  // ============================================
  // CREAR USUARIO
  // ============================================
  static async createUser(userData) {
    try {
      console.log(
        '➕ Creando usuario:',
        userData.email
      )
      const response = await httpService.post(
        '/users/create',
        {
          name: userData.name,
          lastname: userData.lastname,
          email: userData.email,
          password: userData.password,
          phone: userData.phone,
          role: userData.role
        }
      )
      return {
        success: true,
        data: response.data,
        message:
          'Usuario creado correctamente'
      }
    } catch (error) {
      console.error(
        '❌ Error creando usuario:',
        error
      )
      return {
        success: false,
        error:
          error.message ||
          'Error al crear usuario'
      }
    }
  }
    // ==========================================
    // ACTUALIZAR USUARIO
    // ==========================================
    static async updateUser(id, userData) {
      try {
        console.log(`✏️ Actualizando usuario ${id}`)
        const response = await httpService.put(
          '/users',
          {
            id,
            name: userData.name,
            lastname: userData.lastname,
            email: userData.email,
            phone: userData.phone,
            role: userData.role,
            password: userData.password
          }
        )
        return {
          success: true,
          data: response.data
        }
      } catch (error) {
        console.error(
          '❌ Error actualizando usuario:',
          error
        )
        return {
          success: false,
          error:
            error.message ||
            'Error al actualizar usuario'
        }
      }
    }
  // ============================================
  // ELIMINAR USUARIO
  // ============================================
  static async deleteUser(id) {
    try {
      console.log(
        `🗑️ Eliminando usuario ${id}`
      )
      await httpService.delete(
        `/users/delete/${id}`
      )
      return {
        success: true,
        message:
          'Usuario eliminado correctamente'
      }
    } catch (error) {
      console.error(
        '❌ Error eliminando usuario:',
        error
      )
      return {
        success: false,
        error:
          error.message ||
          'Error al eliminar usuario'
      }
    }
  }
}
export default UserModel