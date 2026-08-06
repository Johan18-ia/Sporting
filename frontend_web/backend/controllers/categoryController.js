// Encargado: Gestión de Categorías (Año de Nacimiento)
// Importar modelo Category
const Category = require('../models/Category');
module.exports = {
    // ============================================
    // LISTAR TODAS LAS CATEGORÍAS
    // ============================================
    getAllCategories(req, res) {
        Category.getAll((err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error listando las categorías',
                    error: err
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Lista de categorías (Años)',
                data: data
            });
        });
    },
    // ============================================
    // OBTENER CATEGORÍA POR ID
    // ============================================
    getCategoryById(req, res) {
        const id = req.params.id;
        Category.findById(id, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error consultando la categoría',
                    error: err
                });
            }
            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: "Categoría no encontrada",
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Categoría encontrada',
                data: data
            });
        });
    },
    // ============================================
    // CREAR NUEVA CATEGORÍA (Ejem: 2015, 2016)
    // ============================================
    create(req, res) {
        const category = req.body; // Se espera { name_year: 2015, description: '...' }
        Category.create(category, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error creando la categoría',
                    error: err
                });
            }
            return res.status(201).json({
                success: true,
                message: 'Categoría creada exitosamente',
                data: data
            });
        });
    },
    // ============================================
    // ACTUALIZAR CATEGORÍA
    // ============================================
    update(req, res) {
        const category = req.body;
        Category.update(category, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error actualizando la categoría',
                    error: err
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Categoría actualizada',
                data: data
            });
        });
    },
    // ============================================
    // ELIMINAR CATEGORÍA
    // ============================================
    delete(req, res) {
        const id = req.params.id;
        Category.delete(id, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error eliminando la categoría',
                    error: err
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Categoría eliminada',
                data: data
            });
        });
    }
};