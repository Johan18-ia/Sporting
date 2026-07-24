// src/hooks/useSchedules.ts
// ====================================================
// HOOK: HORARIOS
// ====================================================
import { useState, useEffect, useCallback } from 'react'
import ScheduleModel from '../models/ScheduleModel'
import CategoryModel from '../models/CategoryModel'

interface Schedule {
    id: number
    id_category: number
    day_of_week: string
    start_time: string
    end_time: string
    field_name?: string
    category_name?: string
}

interface Category {
    id: number
    category_year: number
    description: string
}

interface UseSchedulesReturn {
    schedules: Schedule[]
    categories: Category[]
    loading: boolean
    error: string | null
    loadData: () => Promise<void>
    createSchedule: (categoryId: number, dayOfWeek: string, startTime: string, endTime: string) => Promise<{ success: boolean; message?: string }>
}

export const useSchedules = (): UseSchedulesReturn => {
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const loadData = useCallback(async () => {
        setLoading(true)
        setError(null)
        
        try {
            const [schedulesRes, categoriesRes] = await Promise.all([
                ScheduleModel.getAllSchedules(),
                CategoryModel.getAllCategories()
            ])

            if (schedulesRes.success) setSchedules(schedulesRes.data || [])
            if (categoriesRes.success) setCategories(categoriesRes.data || [])
            
            if (!schedulesRes.success || !categoriesRes.success) {
                setError('Error al sincronizar los datos del servidor')
            }
        } catch (err: any) {
            setError(err.message || 'Error al cargar datos')
        } finally {
            setLoading(false)
        }
    }, [])

    const createSchedule = useCallback(async (categoryId: number, dayOfWeek: string, startTime: string, endTime: string) => {
        setLoading(true)
        try {
            const resultado = await ScheduleModel.createSchedule({
                id_category: categoryId,
                day_of_week: dayOfWeek,
                start_time: startTime,
                end_time: endTime
            })
            if (resultado.success) {
                await loadData()
                return { success: true }
            }
            return { success: false, message: resultado.error }
        } catch (err: any) {
            return { success: false, message: err.message }
        } finally {
            setLoading(false)
        }
    }, [loadData])

    useEffect(() => {
        loadData()
    }, [loadData])

    return {
        schedules,
        categories,
        loading,
        error,
        loadData,
        createSchedule
    }
}

export default useSchedules