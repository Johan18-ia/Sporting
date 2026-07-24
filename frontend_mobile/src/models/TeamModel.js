// src/models/TeamModel.js
const STORAGE_KEY = 'sporting_teams_local'

const readAll = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

const writeAll = (teams) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teams))
}

const TeamModel = {
    async getAllTeams() {
        return { success: true, data: readAll() }
    },

    async createTeam({ name, description, studentIds }) {
        if (!name || !studentIds || studentIds.length < 4) {
            return { success: false, message: 'El equipo necesita un nombre y mínimo 4 estudiantes' }
        }
        const teams = readAll()
        const newTeam = {
            id: Date.now(),
            name,
            description: description || '',
            studentIds,
            created_at: new Date().toISOString()
        }
        teams.push(newTeam)
        writeAll(teams)
        return { success: true, data: newTeam }
    },

    async updateTeam(id, { name, description, studentIds }) {
        if (!name || !studentIds || studentIds.length < 4) {
            return { success: false, message: 'El equipo necesita un nombre y mínimo 4 estudiantes' }
        }
        const teams = readAll()
        const index = teams.findIndex(t => t.id === id)
        if (index === -1) {
            return { success: false, message: 'Equipo no encontrado' }
        }
        teams[index] = { ...teams[index], name, description: description || '', studentIds }
        writeAll(teams)
        return { success: true, data: teams[index] }
    },

    async deleteTeam(id) {
        const teams = readAll().filter(t => t.id !== id)
        writeAll(teams)
        return { success: true }
    }
}

export default TeamModel