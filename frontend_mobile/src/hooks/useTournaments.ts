// src/hooks/useTournaments.ts
// ====================================================
// HOOK: TORNEOS
// ====================================================
import { useState, useEffect, useCallback } from 'react'
import TournamentModel from '../models/TournamentModel'
import type { Tournament } from '../types'

export const useTournaments = () => {
    const [tournaments, setTournaments] = useState<Tournament[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const loadTournaments = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const result = await TournamentModel.getAllTournaments()
            if (result.success) {
                setTournaments(result.data || [])
            } else {
                setError(result.error || 'Error al cargar torneos')
            }
        } catch (err: any) {
            setError(err.message || 'Error al cargar torneos')
        } finally {
            setLoading(false)
        }
    }, [])

    const createTournament = useCallback(async (data: { name: string; category: string | number }) => {
        try {
            const result = await TournamentModel.createTournament(data)
            if (result.success) {
                await loadTournaments()
                return { success: true, data: result.data }
            }
            return { success: false, error: result.error }
        } catch (err: any) {
            return { success: false, error: err.message }
        }
    }, [loadTournaments])

    const addStudent = useCallback(async (tournamentId: string | number, studentData: any) => {
        try {
            const result = await TournamentModel.addStudentToTournament(tournamentId, studentData)
            return result.success
                ? { success: true, data: result.data }
                : { success: false, error: result.error }
        } catch (err: any) {
            return { success: false, error: err.message }
        }
    }, [])

    useEffect(() => {
        loadTournaments()
    }, [loadTournaments])

    return {
        tournaments,
        loading,
        error,
        loadTournaments,
        createTournament,
        addStudent,
    }
}

export default useTournaments