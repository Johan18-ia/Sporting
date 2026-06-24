// ====================================================
// MODELO: CATEGORY
// ====================================================
// Importa la conexión a la base de datos
const db = require('../config/config');
// Objeto del modelo Category
const Category = {};
// ====================================================
// OBTENER TODAS LAS CATEGORÍAS
// ====================================================
Category.getAll = (result) => {
    // Consulta SQL para obtener todas las categorías
    const sql = 'SELECT * FROM categories ORDER BY category_year DESC';
    // Ejecuta la consulta
    db.query(sql, (err, res) => {
        // Manejo de error
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};
// ====================================================
// OBTENER CATEGORÍA POR ID
// ====================================================
Category.findById = (id, result) => {
    // Consulta SQL para obtener una categoría por ID
    const sql = 'SELECT * FROM categories WHERE id = ?';
    // Ejecuta la consulta
    db.query(sql, [id], (err, res) => {
        // Manejo de error
        if (err) {
            result(err, null);
        } else {
            result(null, res[0]);
        }
    });
};
// ====================================================
// CREAR CATEGORÍA
// ====================================================
Category.create = (category, result) => {
    // Consulta SQL para insertar una categoría
    const sql = `
        INSERT INTO categories (
            category_year,
            description,
            created_at,
            updated_at
        )
        VALUES (?, ?, NOW(), NOW())
    `;
    // Ejecuta la consulta
    db.query(sql, [
        category.name_year || category.category_year,
        category.description
    ], (err, res) => {
        // Manejo de error
        if (err) {
            result(err, null);
        } else {
            result(null, {
                id: res.insertId,
                ...category
            });
        }
    });
};
// ====================================================
// ACTUALIZAR CATEGORÍA
// ====================================================
Category.update = (category, result) => {
    // Consulta SQL para actualizar una categoría
    const sql = `
        UPDATE categories 
        SET category_year = ?,
            description = ?,
            updated_at = NOW()
        WHERE id = ?
    `;
    // Ejecuta la consulta
    db.query(sql, [
        category.name_year || category.category_year,
        category.description,
        category.id
    ], (err, res) => {
        // Manejo de error
        if (err) {
            result(err, null);
        } else {
            result(null, category);
        }
    });
};
// ====================================================
// ELIMINAR CATEGORÍA
// ====================================================
Category.delete = (id, result) => {
    // Consulta SQL para eliminar una categoría
    const sql = 'DELETE FROM categories WHERE id = ?';
    // Ejecuta la consulta
    db.query(sql, [id], (err, res) => {
        // Manejo de error
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};
// ====================================================
// EXPORTA EL MODELO
// ====================================================
module.exports = Category;