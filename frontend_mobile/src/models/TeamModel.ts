// src/models/TeamModel.ts
// ====================================================
// MODELO: EQUIPO - Adaptado para React Native con AsyncStorage
// ====================================================
import AsyncStorage from '@react-native-async-storage/async-storage'

// ============================================
// INTERFACES
// ============================================
export interface Team {
    id: number
    name: string
    description: string
    studentIds: number[]
    created_at: string
}

export interface TeamResponse {
    success: boolean
    data?: Team | Team[] | null
    message?: string
}

// ============================================
// CONSTANTES
// ============================================
const STORAGE_KEY = 'sporting_teams_local'

// ============================================
// FUNCIONES DE LECTURA/ESCRITURA (AsyncStorage)
// ============================================

/**
 * Lee todos los equipos desde AsyncStorage
 * @returns {Promise<Team[]>}
 */
const readAll = async (): Promise<Team[]> => {
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
    } catch (error) {
        console.error('Error al leer equipos:', error)
        return []
    }
}

/**
 * Escribe todos los equipos en AsyncStorage
 * @param {Team[]} teams - Lista de equipos a guardar
 * @returns {Promise<void>}
 */
const writeAll = async (teams: Team[]): Promise<void> => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(teams))
    } catch (error) {
        console.error('Error al guardar equipos:', error)
        throw error
    }
}

// ============================================
// MODELO DE EQUIPO
// ============================================
const TeamModel = {
    /**
     * Obtiene todos los equipos
     * @returns {Promise<TeamResponse>}
     */
    async getAllTeams(): Promise<TeamResponse> {
        try {
            const data = await readAll()
            return { success: true, data }
        } catch (error: any) {
            console.error('Error al obtener equipos:', error)
            return { 
                success: false, 
                message: error.message || 'Error al obtener equipos' 
            }
        }
    },

    /**
     * Crea un nuevo equipo
     * @param {Object} params - Datos del equipo
     * @param {string} params.name - Nombre del equipo
     * @param {string} params.description - Descripción del equipo
     * @param {number[]} params.studentIds - IDs de los estudiantes
     * @returns {Promise<TeamResponse>}
     */
    async createTeam({ 
        name, 
        description, 
        studentIds 
    }: { 
        name: string; 
        description?: string; 
        studentIds: number[] 
    }): Promise<TeamResponse> {
        // Validaciones
        if (!name || !studentIds || studentIds.length < 4) {
            return { 
                success: false, 
                message: 'El equipo necesita un nombre y mínimo 4 estudiantes' 
            }
        }

        try {
            const teams = await readAll()
            
            const newTeam: Team = {
                id: Date.now(),
                name: name.trim(),
                description: description?.trim() || '',
                studentIds: [...studentIds],
                created_at: new Date().toISOString()
            }

            teams.push(newTeam)
            await writeAll(teams)

            return { 
                success: true, 
                data: newTeam,
                message: 'Equipo creado exitosamente'
            }
        } catch (error: any) {
            console.error('Error al crear equipo:', error)
            return { 
                success: false, 
                message: error.message || 'Error al crear equipo' 
            }
        }
    },

    /**
     * Actualiza un equipo existente
     * @param {number} id - ID del equipo a actualizar
     * @param {Object} params - Datos a actualizar
     * @param {string} params.name - Nuevo nombre del equipo
     * @param {string} params.description - Nueva descripción
     * @param {number[]} params.studentIds - Nuevos IDs de estudiantes
     * @returns {Promise<TeamResponse>}
     */
    async updateTeam(
        id: number,
        { name, description, studentIds }: { 
            name: string; 
            description?: string; 
            studentIds: number[] 
        }
    ): Promise<TeamResponse> {
        // Validaciones
        if (!name || !studentIds || studentIds.length < 4) {
            return { 
                success: false, 
                message: 'El equipo necesita un nombre y mínimo 4 estudiantes' 
            }
        }

        try {
            const teams = await readAll()
            const index = teams.findIndex(t => t.id === id)

            if (index === -1) {
                return { 
                    success: false, 
                    message: 'Equipo no encontrado' 
                }
            }

            // Actualizar equipo
            const updatedTeam: Team = {
                ...teams[index],
                name: name.trim(),
                description: description?.trim() || '',
                studentIds: [...studentIds]
            }

            teams[index] = updatedTeam
            await writeAll(teams)

            return { 
                success: true, 
                data: updatedTeam,
                message: 'Equipo actualizado exitosamente'
            }
        } catch (error: any) {
            console.error('Error al actualizar equipo:', error)
            return { 
                success: false, 
                message: error.message || 'Error al actualizar equipo' 
            }
        }
    },

    /**
     * Elimina un equipo
     * @param {number} id - ID del equipo a eliminar
     * @returns {Promise<TeamResponse>}
     */
    async deleteTeam(id: number): Promise<TeamResponse> {
        try {
            const teams = await readAll()
            const filteredTeams = teams.filter(t => t.id !== id)

            if (filteredTeams.length === teams.length) {
                return { 
                    success: false, 
                    message: 'Equipo no encontrado' 
                }
            }

            await writeAll(filteredTeams)

            return { 
                success: true, 
                message: 'Equipo eliminado exitosamente' 
            }
        } catch (error: any) {
            console.error('Error al eliminar equipo:', error)
            return { 
                success: false, 
                message: error.message || 'Error al eliminar equipo' 
            }
        }
    },

    /**
     * Obtiene un equipo por su ID
     * @param {number} id - ID del equipo
     * @returns {Promise<TeamResponse>}
     */
    async getTeamById(id: number): Promise<TeamResponse> {
        try {
            const teams = await readAll()
            const team = teams.find(t => t.id === id)

            if (!team) {
                return { 
                    success: false, 
                    message: 'Equipo no encontrado' 
                }
            }

            return { 
                success: true, 
                data: team 
            }
        } catch (error: any) {
            console.error('Error al obtener equipo:', error)
            return { 
                success: false, 
                message: error.message || 'Error al obtener equipo' 
            }
        }
    },

    /**
     * Obtiene equipos por estudiante
     * @param {number} studentId - ID del estudiante
     * @returns {Promise<TeamResponse>}
     */
    async getTeamsByStudent(studentId: number): Promise<TeamResponse> {
        try {
            const teams = await readAll()
            const studentTeams = teams.filter(t => 
                t.studentIds.includes(studentId)
            )

            return { 
                success: true, 
                data: studentTeams 
            }
        } catch (error: any) {
            console.error('Error al obtener equipos del estudiante:', error)
            return { 
                success: false, 
                message: error.message || 'Error al obtener equipos del estudiante' 
            }
        }
    },

    /**
     * Agrega un estudiante a un equipo
     * @param {number} teamId - ID del equipo
     * @param {number} studentId - ID del estudiante
     * @returns {Promise<TeamResponse>}
     */
    async addStudentToTeam(teamId: number, studentId: number): Promise<TeamResponse> {
        try {
            const teams = await readAll()
            const index = teams.findIndex(t => t.id === teamId)

            if (index === -1) {
                return { 
                    success: false, 
                    message: 'Equipo no encontrado' 
                }
            }

            // Verificar si el estudiante ya está en el equipo
            if (teams[index].studentIds.includes(studentId)) {
                return { 
                    success: false, 
                    message: 'El estudiante ya está en este equipo' 
                }
            }

            // Agregar estudiante (máximo permitido: 8 jugadores)
            if (teams[index].studentIds.length >= 8) {
                return { 
                    success: false, 
                    message: 'El equipo ya tiene el máximo de 8 jugadores' 
                }
            }

            teams[index].studentIds.push(studentId)
            await writeAll(teams)

            return { 
                success: true, 
                data: teams[index],
                message: 'Estudiante agregado al equipo' 
            }
        } catch (error: any) {
            console.error('Error al agregar estudiante al equipo:', error)
            return { 
                success: false, 
                message: error.message || 'Error al agregar estudiante' 
            }
        }
    },

    /**
     * Elimina un estudiante de un equipo
     * @param {number} teamId - ID del equipo
     * @param {number} studentId - ID del estudiante
     * @returns {Promise<TeamResponse>}
     */
    async removeStudentFromTeam(teamId: number, studentId: number): Promise<TeamResponse> {
        try {
            const teams = await readAll()
            const index = teams.findIndex(t => t.id === teamId)

            if (index === -1) {
                return { 
                    success: false, 
                    message: 'Equipo no encontrado' 
                }
            }

            // Verificar si el estudiante está en el equipo
            if (!teams[index].studentIds.includes(studentId)) {
                return { 
                    success: false, 
                    message: 'El estudiante no está en este equipo' 
                }
            }

            // Eliminar estudiante (mínimo requerido: 4 jugadores)
            if (teams[index].studentIds.length <= 4) {
                return { 
                    success: false, 
                    message: 'El equipo debe tener mínimo 4 jugadores' 
                }
            }

            teams[index].studentIds = teams[index].studentIds.filter(id => id !== studentId)
            await writeAll(teams)

            return { 
                success: true, 
                data: teams[index],
                message: 'Estudiante removido del equipo' 
            }
        } catch (error: any) {
            console.error('Error al remover estudiante del equipo:', error)
            return { 
                success: false, 
                message: error.message || 'Error al remover estudiante' 
            }
        }
    },

    /**
     * Limpia todos los equipos (útil para pruebas)
     * @returns {Promise<TeamResponse>}
     */
    async clearAllTeams(): Promise<TeamResponse> {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY)
            return { 
                success: true, 
                message: 'Todos los equipos fueron eliminados' 
            }
        } catch (error: any) {
            console.error('Error al limpiar equipos:', error)
            return { 
                success: false, 
                message: error.message || 'Error al limpiar equipos' 
            }
        }
    }
}

export default TeamModel