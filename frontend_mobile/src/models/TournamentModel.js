
// src/models/TournamentModel.js
class TournamentModel {
  static initLocalStorage() {
    if (!localStorage.getItem('sporting_tournaments')) {
      localStorage.setItem('sporting_tournaments', JSON.stringify([
        { id: 1, name: 'Copa Infantil Sporting 2026', category: '2014', status: 'Inscripciones', students: [] },
        { id: 2, name: 'Torneo Interescuelas Microfútbol', category: '2012', status: 'En Progreso', students: [] }
      ]));
    }
  }

  static async getAllTournaments() {
    this.initLocalStorage();
    try {
      const data = JSON.parse(localStorage.getItem('sporting_tournaments'));
      return { success: true, data };
    } catch (error) {
      return { success: false, message: 'Error al recuperar los torneos' };
    }
  }

  static async createTournament(tournamentData) {
    this.initLocalStorage();
    try {
      const tournaments = JSON.parse(localStorage.getItem('sporting_tournaments'));
      const newTournament = {
        id: tournaments.length > 0 ? Math.max(...tournaments.map(t => t.id)) + 1 : 1,
        name: tournamentData.name,
        category: tournamentData.category,
        status: 'Inscripciones',
        students: []
      };
      tournaments.push(newTournament);
      localStorage.setItem('sporting_tournaments', JSON.stringify(tournaments));
      return { success: true, data: newTournament };
    } catch (error) {
      return { success: false, message: 'Error al guardar el torneo' };
    }
  }

  static async addStudentToTournament(tournamentId, student) {
    this.initLocalStorage();
    try {
      const tournaments = JSON.parse(localStorage.getItem('sporting_tournaments'));
      const index = tournaments.findIndex(t => t.id === parseInt(tournamentId));
      
      if (index === -1) return { success: false, message: 'Torneo no encontrado' };
      
      // Validar si el estudiante ya está inscrito
      const alreadyInscribed = tournaments[index].students.some(s => s.id === student.id);
      if (alreadyInscribed) {
        return { success: false, message: 'El estudiante ya se encuentra inscrito en este torneo' };
      }

      tournaments[index].students.push(student);
      localStorage.setItem('sporting_tournaments', JSON.stringify(tournaments));
      return { success: true, data: tournaments[index] };
    } catch (error) {
      return { success: false, message: 'Error al inscribir al estudiante' };
    }
  }
}

export default TournamentModel;