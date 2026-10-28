import httpService from './httpService'
import API_CONFIG from '../config/api'

class TournamentService {
  static async getAll() {
    try {
      const response = await httpService.get(API_CONFIG.ENDPOINTS.TOURNAMENTS, true)
      return { success: true, data: response?.data || response || [] }
    } catch (error) {
      return { success: false, error: error.message || 'Error al cargar torneos' }
    }
  }

  static async create(data) {
    try {
      const response = await httpService.post(API_CONFIG.ENDPOINTS.TOURNAMENT_CREATE, data, true)
      return { success: true, data: response?.data || response || null }
    } catch (error) {
      return { success: false, error: error.message || 'Error al crear torneo' }
    }
  }

  static async generateTeams(tournamentId) {
    try {
      const response = await httpService.post(`${API_CONFIG.ENDPOINTS.TOURNAMENT_GENERATE_TEAMS}/${tournamentId}`, {}, true)
      return { success: true, data: response?.data || response || null }
    } catch (error) {
      return { success: false, error: error.message || 'Error al generar equipos' }
    }
  }
}

export default TournamentService
