// src/hooks/useCategories.ts
// ====================================================
// HOOK: CATEGORÍAS
// ====================================================
import { useState, useEffect, useCallback } from 'react'
import CategoryModel from '../models/CategoryModel'

interface Category {
    id: number
    category_year: number
    description: string
    created_at?: string
    updated_at?: string
}

interface UseCategoriesReturn {
    categories: Category[]
    loading: boolean
    error: string | null
    fetchCategories: () => Promise<void>
    createCategory: (category_year: number, description: string) => Promise<{ success: boolean; message?: string }>
    deleteCategory: (id: number) => Promise<{ success: boolean; message?: string }>
    refetch: () => Promise<void>
}

export const useCategories = (): UseCategoriesReturn => {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const fetchCategories = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const resultado = await CategoryModel.getAllCategories()
            if (resultado.success) {
                setCategories(resultado.data || [])
            } else {
                setError(resultado.error || 'Error al cargar categorías')
            }
        } catch (err: any) {
            setError(err.message || 'Error al cargar categorías')
        } finally {
            setLoading(false)
        }
    }, [])

    const createCategory = useCallback(async (category_year: number, description: string) => {
        setLoading(true)
        try {
            const resultado = await CategoryModel.createCategory({ category_year, description })
            if (resultado.success) {
                await fetchCategories()
                return { success: true }
            }
            return { success: false, message: resultado.error }
        } catch (err: any) {
            return { success: false, message: err.message }
        } finally {
            setLoading(false)
        }
    }, [fetchCategories])

    const deleteCategory = useCallback(async (id: number) => {
        setLoading(true)
        try {
            const resultado = await CategoryModel.deleteCategory(id)
            if (resultado.success) {
                await fetchCategories()
                return { success: true }
            }
            return { success: false, message: resultado.error }
        } catch (err: any) {
            return { success: false, message: err.message }
        } finally {
            setLoading(false)
        }
    }, [fetchCategories])

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    return {
        categories,
        loading,
        error,
        fetchCategories,
        createCategory,
        deleteCategory,
        refetch: fetchCategories
    }
}

export default useCategories