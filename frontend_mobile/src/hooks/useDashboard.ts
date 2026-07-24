// src/hooks/useDashboard.ts
// ====================================================
// HOOK: DASHBOARD
// ====================================================
import { useState, useCallback } from 'react'
import DashboardController from '../controllers/DashboardController'

interface DashboardStats {
    activeUsers: number
    todayVisits: number
    activeSessions: number
    successRate: number
    lastUpdate: string
}

interface Activity {
    id: number
    action: string
    time: string
    type: string
}

interface UseDashboardReturn {
    stats: DashboardStats | null
    activities: Activity[]
    loading: boolean
    error: string | null
    loadStats: () => Promise<void>
    loadActivities: () => Promise<void>
    refreshStats: () => Promise<void>
}

export const useDashboard = (): UseDashboardReturn => {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [activities, setActivities] = useState<Activity[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const loadStats = useCallback(async () => {
        setLoading(true)
        setError(null)
        
        DashboardController.getDashboardStats(
            (data: DashboardStats) => {
                setStats(data)
                setLoading(false)
            },
            (err: string) => {
                setError(err)
                setLoading(false)
            }
        )
    }, [])

    const loadActivities = useCallback(async () => {
        DashboardController.getRecentActivities(
            (data: Activity[]) => {
                setActivities(data)
            },
            (err: string) => {
                console.error(err)
            }
        )
    }, [])

    const refreshStats = useCallback(async () => {
        DashboardController.refreshStats(
            (data: DashboardStats) => {
                setStats(data)
            },
            (err: string) => {
                setError(err)
            }
        )
    }, [])

    return {
        stats,
        activities,
        loading,
        error,
        loadStats,
        loadActivities,
        refreshStats
    }
}

export default useDashboard