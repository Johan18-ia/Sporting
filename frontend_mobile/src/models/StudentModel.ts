// src/models/StudentModel.ts
// ====================================================
// MODELO: ESTUDIANTE
// ====================================================
import httpService from '../services/httpService'
import API_CONFIG from '../config/api'

class StudentModel {
    static async getAllStudents() {
        try {
            console.log('📋 Obteniendo todos los estudiantes')

            const response = await httpService.get(API_CONFIG.ENDPOINTS.STUDENTS, true)

            let studentsArray: any[] = []
            if (response && response.data && Array.isArray(response.data)) {
                studentsArray = response.data
            } else if (Array.isArray(response)) {
                studentsArray = response
            }

            return { success: true, data: studentsArray }
        } catch (error: any) {
            console.error('Error al obtener estudiantes:', error)
            return {
                success: false,
                error: error.message || 'Error al cargar estudiantes'
            }
        }
    }

    static async getStudentById(id: number | string) {
        try {
            console.log(`🔍 Obteniendo estudiante con ID: ${id}`)

            const endpoint = API_CONFIG.ENDPOINTS.STUDENT_BY_ID?.replace(':id', String(id)) || `/students/${id}`
            const response = await httpService.get(endpoint, true)

            let studentData = null
            if (response && response.data) {
                studentData = response.data
            } else if (response && response.id) {
                studentData = response
            }

            return { success: true, data: studentData }
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Estudiante no encontrado'
            }
        }
    }

    static async createStudent(studentData: any) {
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
        } catch (error: any) {
            console.error('Error al crear estudiante:', error)
            return {
                success: false,
                error: error.message || 'Error al crear estudiante'
            }
        }
    }

    static async updateStudent(id: number | string, studentData: any) {
        try {
            console.log(`✏️ Actualizando estudiante ID: ${id}`)

            const endpoint = API_CONFIG.ENDPOINTS.STUDENT_UPDATE?.replace(':id', String(id)) || `/students/${id}`
            const updateData = { id: Number(id), ...studentData }

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
        } catch (error: any) {
            console.error('Error al actualizar estudiante:', error)
            return {
                success: false,
                error: error.message || 'Error al actualizar estudiante'
            }
        }
    }

    static async deleteStudent(id: number | string) {
        try {
            console.log(`🗑️ Eliminando estudiante ID: ${id}`)

            const endpoint = API_CONFIG.ENDPOINTS.STUDENT_DELETE.replace(':id', String(id))
            const response = await httpService.delete(endpoint, true)

            return {
                success: true,
                message: 'Estudiante eliminado exitosamente',
                data: response
            }
        } catch (error: any) {
            console.error('Error al eliminar estudiante:', error)
            return {
                success: false,
                error: error.message || 'Error al eliminar estudiante'
            }
        }
    }
}

export default StudentModel