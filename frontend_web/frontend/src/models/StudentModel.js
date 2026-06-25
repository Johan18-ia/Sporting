// src/models/StudentModel.js
// ====================================================
// MODELO: ESTUDIANTE
// ====================================================
import httpService from '../services/httpService'
import API_CONFIG from '../config/api'

class StudentModel {
    // ============================================
    // GET - OBTENER TODOS LOS ESTUDIANTES
    // ============================================
    static async getAllStudents() {
        try {
            console.log('📋 Obteniendo todos los estudiantes')
            
            const response = await httpService.get(API_CONFIG.ENDPOINTS.STUDENTS, true)

            let studentsArray = []
            if (response && response.data && Array.isArray(response.data)) {
                studentsArray = response.data
            } else if (Array.isArray(response)) {
                studentsArray = response
            }

            return { success: true, data: studentsArray }
        } catch (error) {
            console.error('Error al obtener estudiantes:', error)
            return {
                success: false,
                error: error.message || 'Error al cargar estudiantes'
            }
        }
    }

    // ============================================
    // GET - OBTENER ESTUDIANTE POR ID
    // ============================================
    static async getStudentById(id) {
        try {
            console.log(`🔍 Obteniendo estudiante con ID: ${id}`)
            
            const endpoint = API_CONFIG.ENDPOINTS.STUDENT_BY_ID?.replace(':id', id) || `/students/${id}`
            const response = await httpService.get(endpoint, true)

            let studentData = null
            if (response && response.data) {
                studentData = response.data
            } else if (response && response.id) {
                studentData = response
            }

            return { success: true, data: studentData }
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Estudiante no encontrado'
            }
        }
    }

    // ============================================
    // POST - CREAR ESTUDIANTE
    // ============================================
    static async createStudent(studentData) {
        try {
            console.log('➕ Creando nuevo estudiante:', studentData.document)

            const response = await httpService.post(
                API_CONFIG.ENDPOINTS.STUDENT_CREATE,
                studentData,
                true
            )

            let createdStudent = null
            if (response && response.data) {
                createdStudent = response.data
            } else {
                createdStudent = response
            }

            return {
                success: true,
                data: createdStudent,
                message: 'Estudiante creado exitosamente'
            }
        } catch (error) {
            console.error('Error al crear estudiante:', error)
            return {
                success: false,
                error: error.message || 'Error al crear estudiante'
            }
        }
    }

    // ============================================
    // PUT - ACTUALIZAR ESTUDIANTE
    // ============================================
    static async updateStudent(id, studentData) {
        try {
            console.log(`✏️ Actualizando estudiante ID: ${id}`)

            const endpoint = API_CONFIG.ENDPOINTS.STUDENT_UPDATE?.replace(':id', id) || `/students/${id}`
            
            // Agregar ID al objeto
            const updateData = { id, ...studentData }

            const response = await httpService.put(endpoint, updateData, true)

            let updatedStudent = null
            if (response && response.data) {
                updatedStudent = response.data
            } else {
                updatedStudent = response
            }

            return {
                success: true,
                data: updatedStudent,
                message: 'Estudiante actualizado exitosamente'
            }
        } catch (error) {
            console.error('Error al actualizar estudiante:', error)
            return {
                success: false,
                error: error.message || 'Error al actualizar estudiante'
            }
        }
    }

    // ============================================
    // DELETE - ELIMINAR ESTUDIANTE
    // ============================================
    static async deleteStudent(id) {
        try {
            console.log(`🗑️ Eliminando estudiante ID: ${id}`)

            const endpoint = API_CONFIG.ENDPOINTS.STUDENT_DELETE.replace(':id', id)
            const response = await httpService.delete(endpoint, true)

            return {
                success: true,
                message: 'Estudiante eliminado exitosamente',
                data: response
            }
        } catch (error) {
            console.error('Error al eliminar estudiante:', error)
            return {
                success: false,
                error: error.message || 'Error al eliminar estudiante'
            }
        }
    }
}

export default StudentModel