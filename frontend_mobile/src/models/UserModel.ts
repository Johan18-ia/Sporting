// src/models/UserModel.ts
// ====================================================
// MODELO: USER
// ====================================================
import httpService from '../services/httpService'
import API_CONFIG from '../config/api'

class UserModel {
    // ============================================
    // GET - OBTENER TODOS LOS USUARIOS
    // ============================================
    static async getAllUsers() {
        try {
            console.log('📋 Obteniendo todos los usuarios')

            const response = await httpService.get(API_CONFIG.ENDPOINTS.USERS, true)

            let usersArray: any[] = []

            if (response && response.data && Array.isArray(response.data)) {
                usersArray = response.data
            } else if (Array.isArray(response)) {
                usersArray = response
            }

            return {
                success: true,
                data: usersArray
            }
        } catch (error: any) {
            console.error('Error al obtener usuarios:', error)
            return {
                success: false,
                error: error.message || 'Error al cargar usuarios'
            }
        }
    }

    // ============================================
    // GET - OBTENER USUARIO POR ID
    // ============================================
    static async getUserById(id: number | string) {
        try {
            console.log(`🔍 Obteniendo usuario con ID: ${id}`)

            const endpoint = API_CONFIG.ENDPOINTS.USER_BY_ID.replace(':id', String(id))
            const response = await httpService.get(endpoint, true)

            let userData = null
            if (response && response.data) {
                userData = response.data
            } else if (response && response.id) {
                userData = response
            }

            return {
                success: true,
                data: userData
            }
        } catch (error: any) {
            console.error('Error al obtener usuario:', error)
            return {
                success: false,
                error: error.message || 'Usuario no encontrado'
            }
        }
    }

    // ============================================
    // POST - CREAR USUARIO
    // ============================================
    static async createUser(userData: any) {
        try {
            console.log('➕ Creando nuevo usuario:', userData.email)

            const newUser = {
                name: userData.name,
                lastname: userData.lastname || '',
                document: userData.document || null,
                birth_date: userData.birth_date || null,
                email: userData.email,
                password: userData.password,
                phone: userData.phone || '',
                emergency_contact: userData.emergency_contact || null,
                emergency_phone: userData.emergency_phone || null,
                address: userData.address || null,
                image: userData.image || '',
                role: userData.role || 'user',
                category_id: userData.category_id || null,
                student_id: userData.student_id || null,
                is_active: userData.is_active !== undefined ? userData.is_active : 1
            }

            const response = await httpService.post(
                API_CONFIG.ENDPOINTS.REGISTER,
                newUser,
                true
            )

            let createdUser = null
            if (response && response.data) {
                createdUser = response.data
            } else {
                createdUser = response
            }

            return {
                success: true,
                data: createdUser,
                message: 'Usuario creado exitosamente'
            }
        } catch (error: any) {
            console.error('Error al crear usuario:', error)
            return {
                success: false,
                error: error.message || 'Error al crear usuario'
            }
        }
    }

    // ============================================
    // PUT - ACTUALIZAR USUARIO
    // ============================================
    static async updateUser(id: number | string, userData: any) {
        try {
            console.log(`✏️ Actualizando usuario ID: ${id}`)

            const updateData: any = { id: Number(id) }

            if (userData.name !== undefined) updateData.name = userData.name
            if (userData.lastname !== undefined) updateData.lastname = userData.lastname
            if (userData.document !== undefined) updateData.document = userData.document
            if (userData.birth_date !== undefined) updateData.birth_date = userData.birth_date
            if (userData.email !== undefined) updateData.email = userData.email
            if (userData.password && userData.password !== '') updateData.password = userData.password
            if (userData.phone !== undefined) updateData.phone = userData.phone
            if (userData.emergency_contact !== undefined) updateData.emergency_contact = userData.emergency_contact
            if (userData.emergency_phone !== undefined) updateData.emergency_phone = userData.emergency_phone
            if (userData.address !== undefined) updateData.address = userData.address
            if (userData.image !== undefined) updateData.image = userData.image
            if (userData.role !== undefined) updateData.role = userData.role
            if (userData.category_id !== undefined) updateData.category_id = userData.category_id
            if (userData.is_active !== undefined) updateData.is_active = userData.is_active
            if (userData.student_id !== undefined) updateData.student_id = userData.student_id

            const response = await httpService.put(
                API_CONFIG.ENDPOINTS.USER_UPDATE,
                updateData,
                true
            )

            let updatedUser = null
            if (response && response.data) {
                updatedUser = response.data
            } else {
                updatedUser = response
            }

            return {
                success: true,
                data: updatedUser,
                message: 'Usuario actualizado exitosamente'
            }
        } catch (error: any) {
            console.error('Error al actualizar usuario:', error)
            return {
                success: false,
                error: error.message || 'Error al actualizar usuario'
            }
        }
    }

    // ============================================
    // DELETE - ELIMINAR USUARIO
    // ============================================
    static async deleteUser(id: number | string) {
        try {
            console.log(`🗑️ Eliminando usuario ID: ${id}`)

            const endpoint = API_CONFIG.ENDPOINTS.USER_DELETE.replace(':id', String(id))
            const response = await httpService.delete(endpoint, true)

            return {
                success: true,
                message: 'Usuario eliminado exitosamente',
                data: response
            }
        } catch (error: any) {
            console.error('Error al eliminar usuario:', error)
            return {
                success: false,
                error: error.message || 'Error al eliminar usuario'
            }
        }
    }

    static async patchUser(id: number | string, partialData: any) {
        try {
            return await this.updateUser(id, partialData)
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Error al actualizar campo'
            }
        }
    }

    // ============================================
    // PATCH - CAMBIAR ESTADO DEL USUARIO
    // ============================================
    static async toggleUserStatus(id: number | string, isActive: boolean) {
        try {
            console.log(`🔄 Cambiando estado del usuario ID: ${id}`)

            const endpoint = API_CONFIG.ENDPOINTS.USER_TOGGLE_STATUS.replace(':id', String(id))
            const response = await httpService.patch(
                endpoint,
                { is_active: isActive ? 1 : 0 },
                true
            )

            return {
                success: true,
                message: isActive ? 'Usuario activado' : 'Usuario desactivado',
                data: response
            }
        } catch (error: any) {
            console.error('Error al cambiar estado:', error)
            return {
                success: false,
                error: error.message || 'Error al cambiar estado del usuario'
            }
        }
    }
}

export default UserModel