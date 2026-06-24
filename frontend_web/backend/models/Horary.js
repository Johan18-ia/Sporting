import httpService from '../services/httpService'
import API_CONFIG from '../config/api'

class TrainingScheduleModel {
  // 1. Obtener todos los horarios
  static async getAllSchedules() {
    try {
      // Tu compañero probablemente agregará esta ruta en su API_CONFIG
      const response = await httpService.get(API_CONFIG.ENDPOINTS.SCHEDULES || '/api/schedules', true)
      return { success: true, data: Array.isArray(response.data) ? response.data : [] }
    } catch (error) {
      return { success: false, error: error.message || 'Error al cargar horarios' }
    }
  }

  // 2. Crear un nuevo horario asignado a una categoría
  static async createSchedule(scheduleData) {
    try {
      const response = await httpService.post(
        API_CONFIG.ENDPOINTS.SCHEDULE_CREATE || '/api/schedules/create',
        scheduleData,
        true
      )
      return { success: true, data: response.data || response }
    } catch (error) {
      return { success: false, error: error.message || 'Error al crear horario' }
    }
  }
}

export default TrainingScheduleModel