// Encargado JJ
// Importar modelo Product
const Product = require('../models/product');
// Exportar funciones
module.exports = {
    // ============================================
    // LISTAR PRODUCTOS
    // ============================================
    getAllProducts(req, res) {
        // Llamar modelo
        Product.findAll((err, data) => {
            // Validar errores
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error listando productos',
                    error: err
                });
            }
            // Respuesta exitosa
            return res.status(200).json({
                success: true,
                message: 'Lista de productos',
                data: data
            });
        });
    },
    // ============================================
    // OBTENER PRODUCTO POR ID
    // ============================================
    getProductById(req, res) {
        // Obtener id desde parámetros
        const id = req.params.id;
        // Llamar modelo
        Product.findById(id, (err, data) => {
            // Validar errores
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error consultando producto',
                    error: err
                });
            }
            // Validación si el usuario no existe
            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: "roducto no encontrado",
                });
            }
            // Respuesta exitosa
            return res.status(200).json({
                success: true,
                message: 'Producto encontrado',
                data: data
            });
        });
    },
    // ============================================
    // CREAR PRODUCTO
    // ============================================
    create(req, res) {
        // Obtener datos del body
        const product = req.body;
        // Llamar modelo
        Product.create(product, (err, data) => {
            // Validar errores
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error creando producto',
                    error: err
                });
            }
            // Respuesta exitosa
            return res.status(201).json({
                success: true,
                message: 'Producto creado',
                data: data
            });
        });
    },
    // ============================================
    // ACTUALIZAR PRODUCTO
    // ============================================
    update(req, res) {
        // Obtener datos del body
        const product = req.body;
        // Llamar modelo
        Product.update(product, (err, data) => {
            // Validar errores
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error actualizando producto',
                    error: err
                });
            }
            // Respuesta exitosa
            return res.status(200).json({
                success: true,
                message: 'Producto actualizado',
                data: data
            });
        });
    },
    // ============================================
    // ELIMINAR PRODUCTO
    // ============================================
    delete(req, res) {
        // Obtener id desde parámetros
        const id = req.params.id;
        // Llamar modelo
        Product.delete(id, (err, data) => {
            // Validar errores
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error eliminando producto',
                    error: err
                });
            }
            // Respuesta exitosa
            return res.status(200).json({
                success: true,
                message: 'Producto eliminado',
                data: data
            });
        });
    }
};