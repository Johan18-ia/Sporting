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
    const sql = 'SELECT * FROM categories ORDER BY name_year DESC';
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
// CREAR CATEGORÍA
// ====================================================
Category.create = (category, result) => {
    // Consulta SQL para insertar una categoría
    const sql = `
        INSERT INTO categories (
            name_year,
            description
        )
        VALUES (?, ?)
    `;
    // Ejecuta la consulta
    db.query(sql, [
        category.name_year,
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
// EXPORTA EL MODELO
// ====================================================
module.exports = Category;