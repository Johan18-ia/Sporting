// src/hooks/useCategories.js
import { useState, useEffect } from 'react';
import CategoryModel from '../models/CategoryModel';

const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. LEER CATEGORÍAS
    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        const resultado = await CategoryModel.getAllCategories();
        if (resultado.success) {
            setCategories(resultado.data);
        } else {
            setError(resultado.error || 'Error al cargar categorías');
        }
        setLoading(false);
    };

    // 2. CREAR CATEGORÍA
    const createCategory = async (name_year, description) => {
        const resultado = await CategoryModel.createCategory({ name_year, description });
        if (resultado.success) {
            fetchCategories(); 
            return { success: true };
        }
        return { success: false, message: resultado.error };
    };

    // 3. ELIMINAR CATEGORÍA
    const deleteCategory = async (id) => {
        const resultado = await CategoryModel.deleteCategory(id);
        if (resultado.success) {
            fetchCategories(); 
            return { success: true };
        }
        return { success: false, message: resultado.error };
    };

    useEffect(() => {
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { categories, loading, error, createCategory, deleteCategory, refetch: fetchCategories };
};

export default useCategories;