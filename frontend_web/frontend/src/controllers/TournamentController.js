// src/controllers/TournamentController.js
import TournamentModel from '../models/TournamentModel';

class TournamentController {
  static async getTournaments(onSuccess, onError) {
    const res = await TournamentModel.getAllTournaments();
    if (res.success) {
      onSuccess(res.data);
    } else {
      onError(res.message);
    }
  }

  static async create(formData, onSuccess, onError) {
    if (!formData.name || !formData.category) {
      return onError('Todos los campos son obligatorios');
    }
    const res = await TournamentModel.createTournament(formData);
    if (res.success) {
      onSuccess(res.data);
    } else {
      onError(res.message);
    }
  }

  static async registerStudent(tournamentId, student, onSuccess, onError) {
    if (!tournamentId || !student) {
      return onError('Informacion de inscripcion incompleta');
    }
    const res = await TournamentModel.addStudentToTournament(tournamentId, student);
    if (res.success) {
      onSuccess(res.data);
    } else {
      onError(res.message);
    }
  }
}

export default TournamentController;