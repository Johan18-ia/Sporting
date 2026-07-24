// src/hooks/useProducts.ts
// ====================================================
// HOOK: PRODUCTOS
// ====================================================
import { useState, useEffect, useCallback } from 'react'
import ProductModel from '../models/ProductModel'

interface Product {
    id: number
    nombre: string
    descripcion?: string
    precio: number
    stock: number
    imagen?: string
    categoria?: string
    created_at?: string
    updated_at?: string
}

interface UseProductsReturn {
    products: Product[]
    loading: boolean
    error: string | null
    fetchProducts: () => Promise<void>
    refetch: () => Promise<void>
}

export const useProducts = (): UseProductsReturn => {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const fetchProducts = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const resultado = await ProductModel.getAllProducts()
            if (resultado.success) {
                setProducts(resultado.data || [])
            } else {
                setError(resultado.error || 'Error al conectar con el servidor')
            }
        } catch (err: any) {
            setError(err.message || 'Error al cargar productos')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    return {
        products,
        loading,
        error,
        fetchProducts,
        refetch: fetchProducts
    }
}

export default useProducts