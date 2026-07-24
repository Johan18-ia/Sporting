// src/models/DashboardModel.ts
// ====================================================
// MODELO: DASHBOARD - ESTADÍSTICAS Y ACTIVIDADES
// ====================================================

// ============================================
// IMPORTACIÓN DE DEPENDENCIAS
// ============================================
// NOTA: Para React Native no necesitamos httpService aquí
// porque usamos datos simulados, pero mantenemos la misma estructura
// para futura integración con API real

// ============================================
// INTERFACES PARA TIPADO
// ============================================
export interface DashboardStats {
    activeUsers: number
    todayVisits: number
    activeSessions: number
    successRate: number
    lastUpdate: string
}

export interface RecentActivity {
    id: number
    action: string
    time: string
    type: 'login' | 'update' | 'register' | 'report' | string
}

// ============================================
// CLASE DASHBOARD MODEL
// ============================================
class DashboardModel {
    /**
     * Obtiene las estadísticas del dashboard
     * @returns {Promise<DashboardStats | null>}
     */
    static async getStats(): Promise<DashboardStats | null> {
        try {
            // Simular delay de red (500ms)
            await this._simulateNetworkDelay()

            // Datos simulados - Igual que en la versión web
            return {
                activeUsers: Math.floor(Math.random() * 1000) + 500,
                todayVisits: Math.floor(Math.random() * 200) + 50,
                activeSessions: Math.floor(Math.random() * 100) + 20,
                successRate: Math.floor(Math.random() * 30) + 70,
                lastUpdate: new Date().toISOString()
            }
        } catch (error) {
            console.error('Error al obtener estadísticas:', error)
            return null
        }
    }

    /**
     * Obtiene las actividades recientes
     * @returns {Promise<RecentActivity[]>}
     */
    static async getRecentActivities(): Promise<RecentActivity[]> {
        try {
            await this._simulateNetworkDelay()

            // Datos simulados - Igual que en la versión web
            return [
                { 
                    id: 1, 
                    action: 'Usuario inició sesión', 
                    time: 'Hace 5 minutos', 
                    type: 'login' 
                },
                { 
                    id: 2, 
                    action: 'Dashboard actualizado', 
                    time: 'Hace 10 minutos', 
                    type: 'update' 
                },
                { 
                    id: 3, 
                    action: 'Nuevo usuario registrado', 
                    time: 'Hace 30 minutos', 
                    type: 'register' 
                },
                { 
                    id: 4, 
                    action: 'Reporte generado', 
                    time: 'Hace 1 hora', 
                    type: 'report' 
                }
            ]
        } catch (error) {
            console.error('Error al obtener actividades:', error)
            return []
        }
    }

    /**
     * Obtiene estadísticas específicas para el panel de estudiante
     * @param {string} studentId - ID del estudiante
     * @returns {Promise<any>}
     */
    static async getStudentStats(studentId: string | number): Promise<any> {
        try {
            await this._simulateNetworkDelay()

            return {
                totalSchedules: Math.floor(Math.random() * 5) + 1,
                totalTournaments: Math.floor(Math.random() * 3),
                activeTournaments: Math.floor(Math.random() * 2),
                nextPractice: 'Mañana 4:00 PM',
                lastUpdate: new Date().toISOString()
            }
        } catch (error) {
            console.error('Error al obtener estadísticas del estudiante:', error)
            return null
        }
    }

    /**
     * Obtiene estadísticas para el panel de entrenador
     * @param {string} coachId - ID del entrenador
     * @returns {Promise<any>}
     */
    static async getCoachStats(coachId: string | number): Promise<any> {
        try {
            await this._simulateNetworkDelay()

            return {
                totalStudents: Math.floor(Math.random() * 50) + 10,
                totalCategories: Math.floor(Math.random() * 5) + 2,
                totalSchedules: Math.floor(Math.random() * 15) + 5,
                totalTournaments: Math.floor(Math.random() * 4) + 1,
                lastUpdate: new Date().toISOString()
            }
        } catch (error) {
            console.error('Error al obtener estadísticas del entrenador:', error)
            return null
        }
    }

    /**
     * Simula un delay de red (500ms)
     * @private
     */
    private static _simulateNetworkDelay(): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, 500))
    }

    /**
     * Método para refrescar estadísticas (útil para pull-to-refresh)
     * @returns {Promise<DashboardStats | null>}
     */
    static async refreshStats(): Promise<DashboardStats | null> {
        // Usar el mismo método que getStats pero con un pequeño retraso extra
        // para simular una recarga real
        await this._simulateNetworkDelay()
        return await this.getStats()
    }

    /**
     * Obtiene estadísticas en tiempo real (simulado)
     * @returns {Promise<DashboardStats | null>}
     */
    static async getLiveStats(): Promise<DashboardStats | null> {
        try {
            // Simular conexión en tiempo real (1.5s de delay)
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Datos que cambian más dinámicamente
            return {
                activeUsers: Math.floor(Math.random() * 1200) + 300,
                todayVisits: Math.floor(Math.random() * 300) + 20,
                activeSessions: Math.floor(Math.random() * 150) + 10,
                successRate: Math.floor(Math.random() * 20) + 75,
                lastUpdate: new Date().toISOString()
            }
        } catch (error) {
            console.error('Error al obtener estadísticas en tiempo real:', error)
            return null
        }
    }
}

export default DashboardModel