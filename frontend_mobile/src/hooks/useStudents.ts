// src/hooks/useStudents.ts
// ====================================================
// HOOK: ESTUDIANTES
// ====================================================
import { useState, useEffect, useCallback } from 'react'
import StudentModel from '../models/StudentModel'

export const useStudents = () => {
    const [students, setStudents] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const loadStudents = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const result = await StudentModel.getAllStudents()
            if (result.success) {
                setStudents(result.data || [])
            } else {
                setError(result.error || 'Error al cargar estudiantes')
            }
        } catch (err: any) {
            setError(err.message || 'Error al cargar estudiantes')
        } finally {
            setLoading(false)
        }
    }, [])

    const createStudent = useCallback(async (data: any) => {
        setLoading(true)
        try {
            const result = await StudentModel.createStudent(data)
            if (result.success) {
                await loadStudents()
                return { success: true, data: result.data }
            }
            return { success: false, error: result.error }
        } catch (err: any) {
            return { success: false, error: err.message }
        } finally {
            setLoading(false)
        }
    }, [loadStudents])

    const updateStudent = useCallback(async (id: number | string, data: any) => {
        setLoading(true)
        try {
            const result = await StudentModel.updateStudent(id, data)
            if (result.success) {
                await loadStudents()
                return { success: true, data: result.data }
            }
            return { success: false, error: result.error }
        } catch (err: any) {
            return { success: false, error: err.message }
        } finally {
            setLoading(false)
        }
    }, [loadStudents])

    const deleteStudent = useCallback(async (id: number | string) => {
        setLoading(true)
        try {
            const result = await StudentModel.deleteStudent(id)
            if (result.success) {
                await loadStudents()
                return { success: true }
            }
            return { success: false, error: result.error }
        } catch (err: any) {
            return { success: false, error: err.message }
        } finally {
            setLoading(false)
        }
    }, [loadStudents])

    useEffect(() => {
        loadStudents()
    }, [loadStudents])

    return {
        students,
        loading,
        error,
        loadStudents,
        createStudent,
        updateStudent,
        deleteStudent
    }
}