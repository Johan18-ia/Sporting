// backend/models/Category.js
const db = require('../config/config');

const Category = {};

// OBTENER TODAS LAS CATEGORÍAS
Category.getAll = (result) => {
    const sql = 'SELECT * FROM categories ORDER BY category_year DESC';
    db.query(sql, (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// OBTENER CATEGORÍA POR ID
Category.findById = (id, result) => {
    const sql = 'SELECT * FROM categories WHERE id = ?';
    db.query(sql, [id], (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res[0]);
        }
    });
};

// CREAR CATEGORÍA
Category.create = (category, result) => {
    const sql = `
        INSERT INTO categories (category_year, description, created_at, updated_at)
        VALUES (?, ?, NOW(), NOW())
    `;
    db.query(sql, [
        category.name_year || category.category_year,
        category.description
    ], (err, res) => {
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

// ACTUALIZAR CATEGORÍA
Category.update = (category, result) => {
    const sql = `
        UPDATE categories 
        SET category_year = ?, description = ?, updated_at = NOW()
        WHERE id = ?
    `;
    db.query(sql, [
        category.name_year || category.category_year,
        category.description,
        category.id
    ], (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, category);
        }
    });
};

// ELIMINAR CATEGORÍA
Category.delete = (id, result) => {
    const sql = 'DELETE FROM categories WHERE id = ?';
    db.query(sql, [id], (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

module.exports = Category;