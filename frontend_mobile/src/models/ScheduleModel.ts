// src/models/ScheduleModel.ts
// ====================================================
// MODELO: HORARIO
// ====================================================
import httpService from '../services/httpService'
import API_CONFIG from '../config/api'

class ScheduleModel {
    static async getAllSchedules() {
        try {
            const response = await httpService.get(API_CONFIG.ENDPOINTS.SCHEDULES, true)

            let schedulesArray: any[] = []
            if (response && response.data && Array.isArray(response.data)) {
                schedulesArray = response.data
            }

            return { success: true, data: schedulesArray }
        } catch (error: any) {
            return { success: false, error: error.message || 'Error al cargar horarios' }
        }
    }

    static async createSchedule(scheduleData: any) {
        try {
            const response = await httpService.post(
                API_CONFIG.ENDPOINTS.SCHEDULE_CREATE,
                scheduleData,
                true
            )
            return { success: true, data: response.data || response }
        } catch (error: any) {
            return { success: false, error: error.message || 'Error al crear horario' }
        }
    }

    static async getSchedulesByCategory(categoryId: number | string) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.SCHEDULE_BY_CATEGORY.replace(':id_category', String(categoryId))
            const response = await httpService.get(endpoint, true)

            let schedulesArray: any[] = []
            if (response && response.data && Array.isArray(response.data)) {
                schedulesArray = response.data
            }

            return { success: true, data: schedulesArray }
        } catch (error: any) {
            return { success: false, error: error.message || 'Error al cargar horarios por categoría' }
        }
    }

    static async deleteSchedule(id: number | string) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.SCHEDULE_DELETE.replace(':id', String(id))
            const response = await httpService.delete(endpoint, true)
            return { success: true, data: response }
        } catch (error: any) {
            return { success: false, error: error.message || 'Error al eliminar horario' }
        }
    }
}

export default ScheduleModel