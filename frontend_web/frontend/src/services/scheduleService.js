import httpService from './httpService'
import API_CONFIG from '../config/api'

class ScheduleService {
  static async getAll() {
    try {
      const response = await httpService.get(API_CONFIG.ENDPOINTS.SCHEDULES, true)
      return { success: true, data: response?.data || response || [] }
    } catch (error) {
      return { success: false, error: error.message || 'Error al cargar horarios' }
    }
  }

  static async create(data) {
    try {
      const response = await httpService.post(API_CONFIG.ENDPOINTS.SCHEDULE_CREATE, data, true)
      return { success: true, data: response?.data || response || null }
    } catch (error) {
      return { success: false, error: error.message || 'Error al crear horario' }
    }
  }
}

export default ScheduleService
