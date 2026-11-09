// src/models/TeamModel.js
const STORAGE_KEY = 'sporting_teams_local'
const MIN_MEMBERS = 4
const MAX_NAME_LENGTH = 100
const MAX_DESCRIPTION_LENGTH = 500

const normalizeText = (value, maxLength, allowEmpty = false) => {
    if (typeof value !== 'string') return null

    const normalized = value.trim()
    if (
        (!allowEmpty && !normalized) ||
        normalized.length > maxLength ||
        /[\u0000-\u001F\u007F<>]/.test(normalized)
    ) {
        return null
    }

    return normalized
}

const normalizeStudentIds = (value) => {
    if (!Array.isArray(value)) return null

    const ids = value.map((id) => typeof id === 'number' || typeof id === 'string' ? Number(id) : NaN)
    if (ids.some((id) => !Number.isSafeInteger(id) || id <= 0)) return null

    return [...new Set(ids)]
}

const normalizeTeamFields = ({ name, description = '', studentIds }) => {
    const normalizedName = normalizeText(name, MAX_NAME_LENGTH)
    const normalizedDescription = normalizeText(description, MAX_DESCRIPTION_LENGTH, true)
    const normalizedStudentIds = normalizeStudentIds(studentIds)

    if (normalizedName === null || normalizedDescription === null || !normalizedStudentIds ||
        normalizedStudentIds.length < MIN_MEMBERS) {
        return null
    }

    return {
        name: normalizedName,
        description: normalizedDescription,
        studentIds: normalizedStudentIds
    }
}

const normalizeStoredTeam = (team) => {
    if (!team || typeof team !== 'object' || Array.isArray(team)) return null

    const fields = normalizeTeamFields(team)
    if (
        !fields ||
        !Number.isSafeInteger(team.id) ||
        team.id <= 0 ||
        typeof team.created_at !== 'string' ||
        Number.isNaN(Date.parse(team.created_at))
    ) {
        return null
    }

    return {
        id: team.id,
        ...fields,
        created_at: team.created_at
    }
}

const readAll = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        const teams = raw ? JSON.parse(raw) : []
        return Array.isArray(teams)
            ? teams.map(normalizeStoredTeam).filter((team) => team !== null)
            : []
    } catch {
        return []
    }
}

const writeAll = (teams) => {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(teams.map(normalizeStoredTeam).filter((team) => team !== null))
    )
}

const TeamModel = {
    async getAllTeams() {
        return {
            success: true,
            data: readAll()
        }
    },

    async createTeam(input) {
        const fields = normalizeTeamFields(input || {})
        if (!fields) {
            return { success: false, message: 'Revisa el nombre, la descripción y que el equipo tenga mínimo 4 estudiantes' }
        }
        const teams = readAll()
        const newTeam = {
            id: Date.now(),
            ...fields,
            created_at: new Date().toISOString()
        }
        teams.push(newTeam)
        writeAll(teams)
        return { success: true, data: newTeam }
    },

    async updateTeam(id, input) {
        const fields = normalizeTeamFields(input || {})
        if (!fields) {
            return { success: false, message: 'Revisa el nombre, la descripción y que el equipo tenga mínimo 4 estudiantes' }
        }
        const teams = readAll()
        const index = teams.findIndex(t => t.id === id)
        if (index === -1) {
            return { success: false, message: 'Equipo no encontrado' }
        }
        teams[index] = { ...teams[index], ...fields }
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