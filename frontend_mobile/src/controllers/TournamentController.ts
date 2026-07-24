// src/controllers/TournamentController.js
import TournamentModel from '../models/TournamentModel';

class TournamentController {
  static async getTournaments(onSuccess: (data: any) => void, onError: (message: string) => void) {
    const res = await TournamentModel.getAllTournaments();
    if (res.success) {
      onSuccess(res.data);
    } else {
      onError((res as { error?: string; message?: string }).error || (res as { error?: string; message?: string }).message || 'Error al cargar torneos');
    }
  }

  static async create(formData: { name: string; category: string }, onSuccess: (data: any) => void, onError: (message: string) => void) {
    if (!formData.name || !formData.category) {
      return onError('Todos los campos son obligatorios');
    }
    const res = await TournamentModel.createTournament(formData);
    if (res.success) {
      onSuccess(res.data);
    } else {
      onError((res as { error?: string; message?: string }).error || (res as { error?: string; message?: string }).message || 'Error al crear torneo');
    }
  }

  static async registerStudent(tournamentId: string | number, student: any, onSuccess: (data: any) => void, onError: (message: string) => void) {
    if (!tournamentId || !student) {
      return onError('Informacion de inscripcion incompleta');
    }
    const res = await TournamentModel.addStudentToTournament(tournamentId, student);
    if (res.success) {
      onSuccess(res.data);
    } else {
      onError((res as { error?: string; message?: string }).error || (res as { error?: string; message?: string }).message || 'Error al inscribir estudiante');
    }
  }
}

export default TournamentController;