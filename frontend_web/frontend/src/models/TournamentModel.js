// frontend_web/frontend/src/models/TournamentModel.js
import httpService from '../services/httpService'
import API_CONFIG from '../config/api'

class TournamentModel {
  static async getAllTournaments() {
    try {
      const response = await httpService.get(API_CONFIG.ENDPOINTS.TOURNAMENTS, true)

      let tournamentsArray = []
      if (response && response.data && Array.isArray(response.data)) {
        tournamentsArray = response.data
      }

      return { success: true, data: tournamentsArray }
    } catch (error) {
      return { success: false, error: error.message || 'Error al cargar torneos' }
    }
  }

  static async createTournament(tournamentData) {
    try {
      const response = await httpService.post(
        API_CONFIG.ENDPOINTS.TOURNAMENT_CREATE,
        tournamentData,
        true
      )
      return { success: true, data: response.data || response }
    } catch (error) {
      return { success: false, error: error.message || 'Error al crear torneo' }
    }
  }

  static async generateTeams(studentsList) {
    try {
      const response = await httpService.post(
        API_CONFIG.ENDPOINTS.TOURNAMENT_GENERATE_TEAMS,
        { students: studentsList },
        true
      )
      return { success: true, data: response.data || response }
    } catch (error) {
      return { success: false, error: error.message || 'Error al generar equipos' }
    }
  }
}

export default TournamentModel