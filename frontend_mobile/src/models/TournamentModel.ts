// src/models/TournamentModel.ts
// ====================================================
// MODELO: TORNEO
// ====================================================
import httpService from '../services/httpService'
import API_CONFIG from '../config/api'

class TournamentModel {
    static async getAllTournaments() {
        try {
            const response = await httpService.get(API_CONFIG.ENDPOINTS.TOURNAMENTS, true)

            let tournamentsArray: any[] = []
            if (response && response.data && Array.isArray(response.data)) {
                tournamentsArray = response.data
            } else if (Array.isArray(response)) {
                tournamentsArray = response
            }

            return { success: true, data: tournamentsArray }
        } catch (error: any) {
            return { success: false, error: error.message || 'Error al cargar torneos' }
        }
    }

    static async createTournament(tournamentData: any) {
        try {
            const response = await httpService.post(
                API_CONFIG.ENDPOINTS.TOURNAMENT_CREATE,
                tournamentData,
                true
            )

            return { success: true, data: response.data || response }
        } catch (error: any) {
            return { success: false, error: error.message || 'Error al crear torneo' }
        }
    }
}

export default TournamentModel