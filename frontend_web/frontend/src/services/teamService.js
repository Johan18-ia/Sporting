import httpService from './httpService'
import API_CONFIG from '../config/api'

class TeamService {
  static async getAll() {
    try {
      const response = await httpService.get('/teams', true)
      return { success: true, data: response?.data || response || [] }
    } catch (error) {
      return { success: false, error: error.message || 'Error al cargar equipos' }
    }
  }

  static async create(data) {
    try {
      const response = await httpService.post('/teams', data, true)
      return { success: true, data: response?.data || response || null }
    } catch (error) {
      return { success: false, error: error.message || 'Error al crear equipo' }
    }
  }

  static async update(id, data) {
    try {
      const response = await httpService.put(`/teams/${id}`, data, true)
      return { success: true, data: response?.data || response || null }
    } catch (error) {
      return { success: false, error: error.message || 'Error al actualizar equipo' }
    }
  }

  static async remove(id) {
    try {
      const response = await httpService.delete(`/teams/${id}`, true)
      return { success: true, data: response?.data || response || null }
    } catch (error) {
      return { success: false, error: error.message || 'Error al eliminar equipo' }
    }
  }
}

export default TeamService
